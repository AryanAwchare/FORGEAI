# API Documentation

Complete API reference for the Fitness & Wellness Backend

## Base URL
```
http://localhost:5000/api
```

## Response Format
All responses are in JSON format.

### Success Response
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## Authentication
Currently, the API uses Supabase Row Level Security (RLS). In production, you should implement proper authentication using Supabase Auth or JWT tokens.

---

## Endpoints

### 1. Health Check

#### Check Server Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected",
  "environment": "development"
}
```

---

## 2. User Management

### Get All Users
```http
GET /api/users
```

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {},
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
]
```

### Get User by ID
```http
GET /api/users/:id
```

**Parameters:**
- `id` (path) - User UUID

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "preferences": {
    "notifications": true,
    "theme": "dark"
  },
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

### Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "preferences": {
    "notifications": true,
    "theme": "dark"
  }
}
```

**Response:** Returns the created user object

### Update User
```http
PUT /api/users/:id
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "preferences": {
    "notifications": false
  }
}
```

### Delete User
```http
DELETE /api/users/:id
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 3. Fitness Goals

### Get User's Goals
```http
GET /api/fitness/goals/:userId
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "goal_type": "weight_loss",
    "target": "Lose 10kg",
    "deadline": "2024-12-31",
    "description": "Lose weight through exercise and diet",
    "status": "active",
    "progress": 25.5,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
]
```

### Create Goal
```http
POST /api/fitness/goals
```

**Request Body:**
```json
{
  "userId": "uuid",
  "goalType": "weight_loss",
  "target": "Lose 10kg",
  "deadline": "2024-12-31",
  "description": "Lose weight through consistent exercise and diet"
}
```

### Update Goal
```http
PUT /api/fitness/goals/:id
```

**Request Body:**
```json
{
  "status": "completed",
  "progress": 100
}
```

### Delete Goal
```http
DELETE /api/fitness/goals/:id
```

---

## 4. Workouts

### Get User's Workouts
```http
GET /api/fitness/workouts/:userId
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Morning Workout",
    "workout_type": "strength",
    "duration": 45,
    "calories_burned": 300,
    "exercises": [
      {
        "name": "Squats",
        "sets": 3,
        "reps": 12
      }
    ],
    "notes": "Great session",
    "status": "completed",
    "difficulty": 7,
    "created_at": "2024-01-01T12:00:00.000Z"
  }
]
```

### Create Workout
```http
POST /api/fitness/workouts
```

**Request Body:**
```json
{
  "userId": "uuid",
  "workoutType": "strength",
  "duration": 45,
  "caloriesBurned": 300,
  "exercises": [
    {
      "name": "Squats",
      "sets": 3,
      "reps": 12
    },
    {
      "name": "Push-ups",
      "sets": 3,
      "reps": 15
    }
  ],
  "notes": "Great workout session"
}
```

---

## 5. Fitness Progress

### Get User's Progress
```http
GET /api/fitness/progress/:userId
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "date": "2024-01-01",
    "weight": 75.5,
    "body_fat": 18.5,
    "measurements": {
      "chest": 95,
      "waist": 80,
      "hips": 90,
      "arms": 35,
      "legs": 55
    },
    "notes": "Feeling stronger!",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
]
```

### Log Progress
```http
POST /api/fitness/progress
```

**Request Body:**
```json
{
  "userId": "uuid",
  "weight": 75.5,
  "bodyFat": 18.5,
  "measurements": {
    "chest": 95,
    "waist": 80,
    "hips": 90,
    "arms": 35,
    "legs": 55
  },
  "notes": "Feeling stronger!"
}
```

---

## 6. AI-Powered Features

### Generate Workout Plan
```http
POST /api/ai/generate-workout
```

**Request Body:**
```json
{
  "fitnessLevel": "beginner",
  "goals": "weight loss and muscle toning",
  "preferences": "home workout, no equipment",
  "duration": 30
}
```

**Required Fields:**
- `fitnessLevel` - beginner, intermediate, or advanced
- `goals` - fitness objectives
- `duration` - workout duration in minutes

**Response:**
```json
{
  "warmup": [
    {
      "exercise": "Jumping Jacks",
      "duration": "2 minutes",
      "instructions": "Full body warmup exercise"
    }
  ],
  "main": [
    {
      "exercise": "Bodyweight Squats",
      "sets": "3",
      "reps": "12-15",
      "instructions": "Keep back straight and core engaged"
    }
  ],
  "cooldown": [
    {
      "exercise": "Static Stretching",
      "duration": "5 minutes",
      "instructions": "Hold each stretch for 30 seconds"
    }
  ],
  "estimatedCalories": "250",
  "tips": [
    "Stay hydrated",
    "Focus on form over speed"
  ]
}
```

### Generate Meal Plan
```http
POST /api/ai/generate-meal-plan
```

**Request Body:**
```json
{
  "dietaryRestrictions": "vegetarian, no dairy",
  "goals": "muscle gain",
  "calories": 2500,
  "meals": 4
}
```

**Required Fields:**
- `goals` - nutrition goals
- `calories` - target daily calories
- `meals` - number of meals per day

**Response:**
```json
{
  "breakfast": {
    "food": "Oatmeal with banana and almonds",
    "calories": "450",
    "prepNotes": "Cook oats with almond milk, top with sliced banana"
  },
  "lunch": {
    "food": "Quinoa bowl with chickpeas and vegetables",
    "calories": "650",
    "prepNotes": "Mix cooked quinoa with roasted veggies and chickpeas"
  },
  "dinner": {
    "food": "Tofu stir-fry with brown rice",
    "calories": "700",
    "prepNotes": "Sauté tofu with mixed vegetables and serve over rice"
  },
  "snacks": [
    {
      "food": "Protein smoothie",
      "calories": "300",
      "prepNotes": "Blend plant protein powder with fruits"
    }
  ],
  "totalCalories": "2500",
  "tips": [
    "Eat protein with every meal",
    "Stay hydrated throughout the day"
  ]
}
```

### AI Chat
```http
POST /api/ai/chat
```

**Request Body:**
```json
{
  "message": "How do I improve my squat form?",
  "context": "beginner weightlifter with lower back issues"
}
```

**Required Fields:**
- `message` - User's question or message

**Response:**
```json
{
  "response": "To improve your squat form with lower back issues, focus on these key points:\n\n1. Start with bodyweight squats to master the movement pattern\n2. Keep your chest up and core braced throughout\n3. Ensure knees track over toes\n4. Start with a wider stance for better stability\n5. Consider box squats to build confidence\n\nIf back pain persists, consult a physical therapist to address underlying issues."
}
```

### Analyze Exercise Form
```http
POST /api/ai/analyze-form
```

**Request Body:**
```json
{
  "exercise": "deadlift",
  "description": "I'm lifting 100kg but feel strain in my lower back after 3 reps",
  "issues": "lower back pain, difficulty maintaining neutral spine"
}
```

**Required Fields:**
- `exercise` - Exercise name
- `description` - User's description of their form or issues

**Response:**
```json
{
  "analysis": "Based on your description, you may be experiencing lower back strain due to form breakdown under load.",
  "mistakes": [
    "Rounding the back during the lift",
    "Not engaging core properly",
    "Starting with hips too low or too high"
  ],
  "corrections": [
    "Reset your starting position with a neutral spine",
    "Engage your core before each rep",
    "Keep the bar close to your body throughout",
    "Consider reducing weight to 80kg while focusing on form"
  ],
  "tips": [
    "Film yourself to check form",
    "Perform Romanian deadlifts to strengthen posterior chain",
    "Add core strengthening exercises to your routine"
  ],
  "safety": "If pain persists or worsens, stop immediately and consult a healthcare professional. Never compromise form for weight."
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit:** 100 requests per 15 minutes per IP address
- **Headers:** Response includes `X-RateLimit-*` headers

When rate limit is exceeded:
```json
{
  "error": "Too many requests, please try again later."
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Database connection issues |

---

## Best Practices

1. **Always validate input** on the client side before sending requests
2. **Handle errors gracefully** in your frontend application
3. **Use pagination** for large datasets (implement with `limit` and `offset`)
4. **Cache responses** when appropriate to reduce API calls
5. **Respect rate limits** - implement exponential backoff for retries
6. **Use environment variables** for API URLs (dev, staging, production)

---

## Testing with cURL

### Example: Create a user and log progress
```bash
# 1. Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# 2. Generate a workout (replace user_id)
curl -X POST http://localhost:5000/api/ai/generate-workout \
  -H "Content-Type: application/json" \
  -d '{"fitnessLevel":"beginner","goals":"weight loss","duration":30}'

# 3. Log progress
curl -X POST http://localhost:5000/api/fitness/progress \
  -H "Content-Type: application/json" \
  -d '{"userId":"your-user-id","weight":75,"notes":"First weigh-in"}'
```

---

## Webhooks (Future Feature)

In future versions, you can subscribe to events:
- User registration
- Goal completion
- Workout logged
- Progress milestone reached

---

## Support

For API issues or questions:
- Check the main README.md
- Review error logs in your terminal
- Check Supabase dashboard for database issues
- Verify environment variables are set correctly

---

**Version:** 1.0.0  
**Last Updated:** 2024
