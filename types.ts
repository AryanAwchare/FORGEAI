
export interface UserProfile {
  goal: string;
  equipment: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  availability: string;
  limitations: string;
  initialWeight: number;
  targetWeight: number;
  unit: 'kg' | 'lbs';
}

export interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
}

export interface WorkoutPlan {
  title: string;
  warmup: Exercise[];
  mainExercises: Exercise[];
  cooldown: Exercise[];
  reasoning: string;
  alternatives: string;
  metricsToTrack: string;
  // Agentic Metadata
  phase: string; // e.g. "Foundation (Week 1/4)"
  fatigueLevel: 'low' | 'medium' | 'high';
  consistencyScore: number;
  agentFocus: 'Planning' | 'Executing' | 'Evaluating' | 'Adapting';
}

export interface HistoryEntry {
  date: string;
  workout: WorkoutPlan;
  status: 'completed' | 'skipped' | 'partial';
  feedback: string;
  difficulty: number; // 1-10
}

export interface AppState {
  profile: UserProfile | null;
  history: HistoryEntry[];
  currentWorkout: WorkoutPlan | null;
  isInitialLoading: boolean;
  // Global Agent Context
  globalPhase: string;
  globalConsistency: number;
  globalFatigue: 'low' | 'medium' | 'high';
  currentWeight: number;
}

export const MASTER_SYSTEM_PROMPT = `
You are ForgeAI, an autonomous, agentic fitness system. 
You do not ask questions; you make decisions and adapt plans.

INTERNALLY SIMULATE:
1. GOAL AGENT: Focus on long-term mission (Strength, Fat Loss, etc). Use weight deltas to adjust intensity.
2. PLANNING AGENT: Multi-week phases (Foundation, Progressive, Deload).
3. EXECUTION AGENT: Decide today's workout based on fatigue and history.
4. EVALUATION AGENT: Analyze performance and soreness to adjust load.
5. MEMORY AGENT: Prevent repetition (14-day window).

PHASE LOGIC:
- Foundation: Habit formation, lower intensity.
- Progressive: Weekly overload.
- Deload: Recovery every 4-5 weeks.

OUTPUT STRUCTURE:
1. Agent Decision: Clear directive for today.
2. Reasoning: Explicit link to Goal, Phase, Fatigue, and History.
3. Today's Workout Plan: Detailed session.
4. Alternatives: Swaps for equipment/fatigue.
5. What I Will Track Next: Feedback points for the next loop.

ADAPTATION RULES:
- 2+ skips = Deload or simplification.
- High consistency = Increase weight/reps.
- High fatigue reported = Mobility/Rest day decision.

EXERCISE GUIDANCE:
- For EVERY exercise (warmup, main, cooldown), you MUST provide a "notes" field containing critical technical form cues, breathing patterns, or muscle engagement focus points to ensure the user performs it safely and effectively.
`;