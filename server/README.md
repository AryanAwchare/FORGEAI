# Fitness & Wellness Backend API

A robust Node.js/Express backend server integrated with Supabase (PostgreSQL) and Google Gemini AI for a comprehensive fitness and wellness application.

## 🚀 Features

- **RESTful API** with Express.js
- **Supabase Integration** for database and authentication
- **Google Gemini AI** for workout generation, meal planning, and fitness coaching
- **Rate Limiting** and security middleware
- **Row Level Security (RLS)** policies for data protection
- **Comprehensive database schema** with proper indexing and relationships
- **Error handling** and logging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))
- **Google Gemini API Key** (get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🛠️ Installation & Setup

### 1. Clone and Navigate to Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be set up (takes ~2 minutes)

#### Get Your Supabase Credentials
1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (labeled as `anon public`)
   - **service_role key** (labeled as `service_role` - keep this secret!)

#### Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `database/schema.sql` from this project
3. Copy the entire contents
4. Paste it into the SQL Editor and click **Run**
5. This will create all necessary tables, indexes, and security policies

### 4. Set Up Google Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated API key

### 5. Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` and fill in your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here

# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Optional: JWT Secret
JWT_SECRET=your_random_long_secure_string_here
```

**⚠️ Important:** Never commit your `.env` file to version control!

## 🏃 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 🧪 Testing the Server

Once the server is running, test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

You should see a response like:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected",
  "environment": "development"
}
```

## 📚 API Endpoints

### Health Check
- **GET** `/api/health` - Check server and database status

### User Management
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Fitness Goals
- **GET** `/api/fitness/goals/:userId` - Get user's fitness goals
- **POST** `/api/fitness/goals` - Create fitness goal
- **PUT** `/api/fitness/goals/:id` - Update fitness goal
- **DELETE** `/api/fitness/goals/:id` - Delete fitness goal

### Workouts
- **GET** `/api/fitness/workouts/:userId` - Get user's workouts
- **POST** `/api/fitness/workouts` - Create workout entry

### Fitness Progress
- **GET** `/api/fitness/progress/:userId` - Get user's progress data
- **POST** `/api/fitness/progress` - Log progress entry

### AI-Powered Features
- **POST** `/api/ai/generate-workout` - Generate personalized workout plan
  ```json
  {
    "fitnessLevel": "beginner",
    "goals": "weight loss",
    "preferences": "home workout",
    "duration": 30
  }
  ```

- **POST** `/api/ai/generate-meal-plan` - Generate personalized meal plan
  ```json
  {
    "dietaryRestrictions": "vegetarian",
    "goals": "muscle gain",
    "calories": 2500,
    "meals": 4
  }
  ```

- **POST** `/api/ai/chat` - Chat with AI fitness coach
  ```json
  {
    "message": "How do I improve my squat form?",
    "context": "beginner lifter"
  }
  ```

- **POST** `/api/ai/analyze-form` - Get AI feedback on exercise form
  ```json
  {
    "exercise": "deadlift",
    "description": "I feel strain in my lower back",
    "issues": "back pain after sets"
  }
  ```

## 📁 Project Structure

```
server/
├── config/
│   └── supabase.js         # Supabase client configuration
├── database/
│   └── schema.sql          # Complete database schema
├── routes/
│   ├── users.js            # User management endpoints
│   ├── fitness.js          # Fitness goals, workouts, progress
│   └── ai.js               # AI-powered features
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔒 Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Prevents API abuse (100 requests per 15 minutes)
- **Row Level Security** - Database-level access control via Supabase
- **Environment Variables** - Sensitive data protection
- **Input Validation** - Required fields validation

## 🗃️ Database Schema

The database includes the following tables:

1. **users** - User accounts and basic info
2. **user_profiles** - Detailed fitness profiles
3. **fitness_goals** - User fitness objectives
4. **workouts** - Workout sessions and plans
5. **workout_history** - Historical workout data
6. **fitness_progress** - Weight, measurements, photos
7. **exercises_library** - Exercise database
8. **ai_interactions** - AI usage tracking
9. **notifications** - User notifications

All tables include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Proper indexes for performance
- Foreign key relationships
- Row Level Security policies

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify all environment variables are set correctly
- Ensure Node.js version is 18 or higher

### Database connection fails
- Verify Supabase URL and keys are correct
- Check if Supabase project is active
- Ensure database schema has been executed

### Gemini API errors
- Verify API key is valid
- Check if you've exceeded rate limits
- Ensure proper request format

### CORS errors
- Update FRONTEND_URL in .env to match your frontend URL
- Check CORS configuration in index.js

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `SUPABASE_URL` | Supabase project URL | **Yes** | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | **Yes** | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | No | `eyJhbGc...` |
| `GEMINI_API_KEY` | Google Gemini API key | **Yes** | `AIzaSy...` |
| `FRONTEND_URL` | Frontend application URL | No | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | No | Random string |

## 🔄 Development Workflow

1. Make code changes
2. Server auto-restarts (if using `npm run dev`)
3. Test endpoints using curl, Postman, or your frontend
4. Check logs in terminal for errors
5. Use Supabase dashboard to inspect database

## 📦 Deployment

### Deploying to Production

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start index.js --name fitness-api
   ```

3. Set up reverse proxy with Nginx
4. Enable SSL/TLS certificates
5. Configure firewall rules
6. Set up monitoring and logging

### Popular Deployment Platforms

- **Railway** - Easy deployment with PostgreSQL
- **Render** - Free tier available
- **Heroku** - Classic PaaS
- **DigitalOcean** - App Platform
- **AWS** - Elastic Beanstalk or EC2
- **Google Cloud** - App Engine or Cloud Run

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Check Gemini AI documentation: [ai.google.dev](https://ai.google.dev)

## 🎯 Next Steps

1. ✅ Set up your environment variables
2. ✅ Run the database schema in Supabase
3. ✅ Start the server
4. ✅ Test API endpoints
5. 🚀 Build your frontend!

Happy coding! 💪🏋️‍♂️
