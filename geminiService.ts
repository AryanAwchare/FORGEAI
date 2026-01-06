

import type { UserProfile, HistoryEntry } from "./types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://forgeai-1.onrender.com';

const MASTER_SYSTEM_PROMPT = `
You are ForgeAI, an elite fitness intelligence agent. 
Your goal is to construct hyper-personalized, progressive, and scientifically optimal workout plans.
Structure your response as a JSON object with: 
- 'phase' (current training phase: Hypertrophy, Strength, Metabolic, etc)
- 'rationale' (why this workout today?)
- 'warmup' (list of exercises)
- 'mainBlock' (list of compound movements with sets/reps/RPE)
- 'accessoryBlock' (list of isolation movements)
- 'conditioning' (optional cardio/finishers)
- 'fatigueLevel' (estimated CNS fatigue rating: low, medium, high)
DO NOT use markdown formatting. Return raw JSON only.
`;



function buildHistoryContext(history: HistoryEntry[]) {
  const last = history.slice(-7);
  if (last.length === 0) return "None";

  // Avoid "[object Object]" by stringifying
  return last
    .map((h) =>
      JSON.stringify(
        {
          date: h.date,
          workout_title: h.workout?.title,
          status: h.status,
          difficulty_rating: h.difficulty,
        },
        null,
        0
      )
    )
    .join("\n");
}

// geminiService.ts

export async function generateForgeResponse(
  userInput: string,
  profile: UserProfile,
  history: HistoryEntry[],
  currentContext: { phase: string; consistency: number; fatigue: string }
): Promise<{ text: string }> {
  // REMOVED: const apiKey = import.meta.env.VITE_GEMINI_API_KEY...

  const historyContext = buildHistoryContext(history);

  const stateContext = `
User Profile:
- Goal: ${profile.goal}
- Level: ${profile.level}
- Equipment: ${profile.equipment.join(', ')}
- Injuries/Limitations: ${profile.limitations || 'None'}
- Availability: ${profile.availability}

Global Phase: ${currentContext.phase}
Consistency Score: ${currentContext.consistency}%
Fatigue Level: ${currentContext.fatigue}
Recent History:
${historyContext}
`.trim();

  const fullPrompt = `${MASTER_SYSTEM_PROMPT}\n\nCURRENT AGENT STATE:\n${stateContext}\n\nUSER INPUT:\n${userInput}`;

  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: fullPrompt
        // REMOVED: apiKey
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.details || err.error || 'Failed to communicate with AI agent');
    }

    const data = await response.json();
    return { text: data.text };
  } catch (error) {
    console.error("Agent Proxy Error:", error);
    throw error;
  }
}

// Helper function to normalize exercises (hoisted)
const normalizeExercises = (exercises: any[]): any[] => {
  if (!Array.isArray(exercises)) return [];

  return exercises.flatMap((ex: any) => {
    // If it's a string, convert to exercise object
    if (typeof ex === 'string') {
      return [{
        name: ex,
        duration: ex.includes('minute') ? ex.match(/\d+/)?.[0] + ' min' : undefined,
        notes: 'Complete as described'
      }];
    }

    // If it has a Block property (nested structure), flatten it
    if (ex.Block || ex.block) {
      const blockName = ex.Block || ex.block;
      const movements = ex.Movements || ex.movements || [];

      return movements.map((movement: any, idx: number) => {
        if (typeof movement === 'string') {
          return {
            name: movement,
            sets: ex.sets || '3',
            reps: ex.reps || '10',
            notes: ex.Details || ex.details || blockName
          };
        }
        return movement;
      });
    }

    // If it already has name property, use as-is
    if (ex.name || ex.movement) {
      return [{
        name: ex.name || ex.movement,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        notes: ex.notes || ex.RPE ? `RPE: ${ex.RPE}` : undefined
      }];
    }

    return [ex];
  });
};

export async function getStructuredWorkout(text: string): Promise<any> {
  // Try local parsing first to save API calls
  try {
    console.log('Attempting local parse of workout text...');

    // basic cleanup
    let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // try to find first { and last }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    const parsed = JSON.parse(cleaned);
    console.log('Local parse successful!');

    // Normalize structure immediately
    return {
      title: parsed.title || "Agent Workout",
      warmup: normalizeExercises(parsed.warmup || []),
      mainExercises: normalizeExercises(parsed.mainExercises || parsed.mainBlock || parsed.main || []),
      cooldown: normalizeExercises(parsed.cooldown || []),
      reasoning: parsed.reasoning || parsed.rationale || "Optimized session generated by ForgeAI.",
      alternatives: parsed.alternatives || "None provided.",
      metricsToTrack: parsed.metricsToTrack || "RPE and completion.",
      phase: parsed.phase || "General Physical Preparedness",
      fatigueLevel: parsed.fatigueLevel || "medium",
      consistencyScore: parsed.consistencyScore || 0,
      agentFocus: parsed.agentFocus || "Execution"
    };

  } catch (localError) {
    console.warn('Local parse failed, falling back to AI agent:', localError);
  }

  // Fallback to AI if local parse fails
  try {
    console.log('Parsing workout via AI agent...');

    const response = await fetch(`${API_BASE_URL}/api/ai/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Extract the workout details from this response into a valid JSON object with this exact structure:
{
  "title": "workout title",
  "warmup": [],
  "mainExercises": [],
  "cooldown": [],
  "reasoning": "why this workout",
  "alternatives": "alternative options",
  "metricsToTrack": "what to track",
  "phase": "current phase",
  "fatigueLevel": "low",
  "consistencyScore": 0,
  "agentFocus": "Planning"
}

Response to parse:
${text}

Return ONLY the raw JSON object, no markdown formatting.`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to parse workout structure: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Received parsing response:', data.text);

    // Clean markdown code blocks if present
    let cleanedText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Try to extract JSON if it's embedded in text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedText);

    // Ensure all required fields exist with defaults and normalize structure
    const safeParsed = {
      title: parsed.title || "Agent Workout",
      warmup: normalizeExercises(parsed.warmup || []),
      mainExercises: normalizeExercises(parsed.mainExercises || parsed.mainBlock || parsed.main || []),
      cooldown: normalizeExercises(parsed.cooldown || []),
      reasoning: parsed.reasoning || parsed.rationale || "Optimized session generated by ForgeAI.",
      alternatives: parsed.alternatives || "None provided.",
      metricsToTrack: parsed.metricsToTrack || "RPE and completion.",
      phase: parsed.phase || "General Physical Preparedness",
      fatigueLevel: parsed.fatigueLevel || "medium",
      consistencyScore: parsed.consistencyScore || 0,
      agentFocus: parsed.agentFocus || "Execution"
    };

    console.log('Successfully parsed workout via AI:', safeParsed);
    return safeParsed;
  } catch (error) {
    console.error("Parsing Error:", error);
    console.error("Original text:", text);
    throw new Error(`Failed to parse workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Remove the old normalizeExercises function since we hoisted it
// const normalizeExercises = ... (deleted)
