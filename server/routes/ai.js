import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Forge Agent Proxy Route
router.post('/agent', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log("Agent Proxy Request. Key provided:", !!apiKey);
    if (apiKey) console.log("Key prefix:", apiKey.substring(0, 8));

    // Use key from request if provided (allows frontend to manage key), else fallback to server env
    const activeKey = apiKey || process.env.GEMINI_API_KEY;

    if (!activeKey) {
      return res.status(500).json({ error: 'API Key not configured on server or client' });
    }

    const client = new GoogleGenerativeAI(activeKey);
    // Use 'gemini-flash-latest' for better stability on free tier
    const model = client.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });

  } catch (error) {
    console.error('Agent Proxy Error:', error);

    // Handle "API key not valid" specifically
    if (error.message?.includes('API key not valid')) {
      return res.status(400).json({ error: 'Invalid API Key. Please check your configuration.' });
    }

    // Handle Rate Limits (429)
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({
        error: 'Gemini Usage Limit Exceeded',
        details: 'The AI service is currently busy (Rate Limit). Please wait a moment and try again.'
      });
    }

    if (error.response?.promptFeedback?.blockReason) {
      return res.status(400).json({ error: `Request blocked: ${error.response.promptFeedback.blockReason}` });
    }

    // Generic Gemini/Fetch error
    res.status(500).json({
      error: 'Gemini Agent Request Failed',
      details: error.message,
      model: "gemini-flash"
    });
  }
});

router.post('/generate-workout', async (req, res) => {
  try {
    const { fitnessLevel, goals, preferences, duration } = req.body;

    if (!fitnessLevel || !goals || !duration) {
      return res.status(400).json({ error: 'Missing required fields: fitnessLevel, goals, duration' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash" });

    const prompt = `Generate a personalized workout plan based on the following:
    - Fitness Level: ${fitnessLevel}
    - Goals: ${goals}
    - Preferences: ${preferences || 'No specific preferences'}
    - Duration: ${duration} minutes
    
    Please provide a structured workout plan with:
    1. Warm-up exercises (5-10 minutes)
    2. Main workout exercises with sets and reps
    3. Cool-down exercises (5 minutes)
    4. Estimated calories burned
    
    Format the response as JSON with the structure:
    {
      "warmup": [{"exercise": "name", "duration": "seconds", "instructions": "brief instructions"}],
      "main": [{"exercise": "name", "sets": "number", "reps": "number", "instructions": "brief instructions"}],
      "cooldown": [{"exercise": "name", "duration": "seconds", "instructions": "brief instructions"}],
      "estimatedCalories": "number",
      "tips": ["tip1", "tip2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const workoutPlan = JSON.parse(text);
      res.json(workoutPlan);
    } catch (parseError) {
      res.json({ rawResponse: text, error: 'Failed to parse JSON response' });
    }
  } catch (error) {
    console.error('Workout generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-meal-plan', async (req, res) => {
  try {
    const { dietaryRestrictions, goals, calories, meals } = req.body;

    if (!goals || !calories || !meals) {
      return res.status(400).json({ error: 'Missing required fields: goals, calories, meals' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Generate a personalized meal plan based on the following:
    - Dietary Restrictions: ${dietaryRestrictions || 'None'}
    - Goals: ${goals}
    - Target Calories: ${calories}
    - Number of Meals: ${meals}
    
    Please provide a structured meal plan with:
    1. Breakfast
    2. Lunch
    3. Dinner
    4. Snacks (if applicable)
    
    For each meal include: food items, approximate calories, and brief preparation notes.
    
    Format the response as JSON with the structure:
    {
      "breakfast": {"food": "item1, item2", "calories": "number", "prepNotes": "brief notes"},
      "lunch": {"food": "item1, item2", "calories": "number", "prepNotes": "brief notes"},
      "dinner": {"food": "item1, item2", "calories": "number", "prepNotes": "brief notes"},
      "snacks": [{"food": "item", "calories": "number", "prepNotes": "brief notes"}],
      "totalCalories": "number",
      "tips": ["nutrition tip1", "nutrition tip2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const mealPlan = JSON.parse(text);
      res.json(mealPlan);
    } catch (parseError) {
      res.json({ rawResponse: text, error: 'Failed to parse JSON response' });
    }
  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `You are a certified fitness and wellness AI assistant. You provide helpful, evidence-based advice on:
    - Exercise and workout routines
    - Nutrition and meal planning
    - Recovery and injury prevention
    - Mental health and motivation
    - General wellness tips
    
    Context: ${context || 'General fitness inquiry'}
    
    User message: ${message}
    
    Provide a helpful, encouraging, and informative response. Be specific and actionable when possible. Include relevant safety considerations. If the question is medical in nature, advise consulting a healthcare professional.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze-form', async (req, res) => {
  try {
    const { exercise, description, issues } = req.body;

    if (!exercise || !description) {
      return res.status(400).json({ error: 'Exercise and description are required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `As a fitness expert, analyze exercise form for: ${exercise}
    
    User's description: ${description}
    Issues reported: ${issues || 'None reported'}
    
    Provide feedback on:
    1. Common form mistakes for this exercise
    2. Specific corrections based on the description
    3. Tips for improvement
    4. Safety considerations
    
    Format the response as JSON:
    {
      "analysis": "overall assessment",
      "mistakes": ["mistake1", "mistake2"],
      "corrections": ["correction1", "correction2"],
      "tips": ["tip1", "tip2"],
      "safety": "safety considerations"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const analysis = JSON.parse(text);
      res.json(analysis);
    } catch (parseError) {
      res.json({ rawResponse: text, error: 'Failed to parse JSON response' });
    }
  } catch (error) {
    console.error('Form analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
