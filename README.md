# ForgeAI – Agentic Fitness & Wellness

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Overview
ForgeAI is an AI‑powered fitness and wellness platform that generates personalized workout plans, tracks progress, and provides real‑time guidance using Google Gemini and Supabase.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, vanilla CSS (no Tailwind unless requested)
- **Backend**: Node.js, Express, Supabase, Google Gemini AI
- **Deployment**: Vercel (frontend) & Render (backend)

## Project Structure
```
HACK/
├── components/          # React components
├── server/              # Express backend API
│   ├── index.js
│   └── routes/
├── supabaseClient.ts   # Supabase connection
├── geminiService.ts    # Gemini integration
├── vite.config.ts
├── package.json
└── README.md            # This file
```

## Setup Instructions
### Prerequisites
- Node.js (>=18)
- npm
- Supabase account & project
- Gemini API key

### Frontend
```bash
npm install            # install dependencies
npm run dev            # start Vite dev server
```
Add your Gemini key to `.env.local`:
```text
GEMINI_API_KEY=your_key_here
```

### Backend
```bash
cd server
npm install            # install backend deps
npm run dev            # start Express server
```
Create a `.env` file in `server/` with:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_key
```

## Usage
- Open the app at `http://localhost:5173`.
- Sign in with Google (or Supabase auth).
- Generate a workout plan and follow the guided sessions.

## Contributing
1. Fork the repo
2. Create a feature branch
3. Open a pull request

## License
MIT

---

## Backend API Documentation

# Fitness & Wellness Backend API

A robust Node.js/Express backend server integrated with Supabase (PostgreSQL) and Google Gemini AI for a comprehensive fitness and wellness application.

### 🚀 Features
- **RESTful API** with Express.js
- **Supabase Integration** for database and authentication
- **Google Gemini AI** for workout generation, meal planning, and fitness coaching
- **Rate Limiting** and security middleware
- **Row Level Security (RLS)** policies for data protection
- **Comprehensive database schema** with proper indexing and relationships
- **Error handling** and logging

### 📋 Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Supabase Account** (free tier available at supabase.com)
- **Google Gemini API Key** (get it from Google AI Studio)

### 🛠️ Installation & Setup
#### 1. Clone and Navigate to Server Directory
```bash
cd server
```
#### 2. Install Dependencies
```bash
npm install
```
#### 3. Set Up Supabase
- Create a Supabase Project
- Get your Supabase Credentials (Project URL, anon/public key, service_role key)
- Set Up Database Schema using `database/schema.sql`
#### 4. Set Up Google Gemini API
- Visit Google AI Studio and generate an API key
#### 5. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env`:
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

### 🏃 Running the Server
#### Development Mode (with auto-restart)
```bash
npm run dev
```
#### Production Mode
```bash
npm start
```
The server will start on `http://localhost:5000` (or your configured PORT).

### 🧪 Testing the Server
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected",
  "environment": "development"
}
```

### 📚 API Endpoints
#### Health Check
- **GET** `/api/health` - Check server and database status

#### User Management
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

#### Fitness Goals
- **GET** `/api/fitness/goals/:userId` - Get user's fitness goals
- **POST** `/api/fitness/goals` - Create fitness goal
- **PUT** `/api/fitness/goals/:id` - Update fitness goal
- **DELETE** `/api/fitness/goals/:id` - Delete fitness goal

#### Workouts
- **GET** `/api/fitness/workouts/:userId` - Get user's workouts
- **POST** `/api/fitness/workouts` - Create workout entry

#### Fitness Progress
- **GET** `/api/fitness/progress/:userId` - Get user's progress data
- **POST** `/api/fitness/progress` - Log progress entry

#### AI-Powered Features
- **POST** `/api/ai/generate-workout` - Generate personalized workout plan
- **POST** `/api/ai/generate-meal-plan` - Generate personalized meal plan
- **POST** `/api/ai/chat` - Chat with AI fitness coach
- **POST** `/api/ai/analyze-form` - Get AI feedback on exercise form

### 📁 Project Structure
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

### 🔒 Security Features
- **Helmet.js** - Sets security HTTP headers
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Prevents API abuse (100 requests per 15 minutes)
- **Row Level Security** - Database-level access control via Supabase
- **Environment Variables** - Sensitive data protection
- **Input Validation** - Required fields validation

### 🗃️ Database Schema
The database includes tables: users, user_profiles, fitness_goals, workouts, workout_history, fitness_progress, exercises_library, ai_interactions, notifications. All tables have UUID primary keys, timestamps, indexes, foreign keys, and RLS policies.

### 🐛 Troubleshooting
#### Server won't start
- Check if port 5000 is already in use
- Verify all environment variables are set correctly
- Ensure Node.js version is 18 or higher

#### Database connection fails
- Verify Supabase URL and keys are correct
- Check if Supabase project is active
- Ensure database schema has been executed

#### Gemini API errors
- Verify API key is valid
- Check if you've exceeded rate limits
- Ensure proper request format

#### CORS errors
- Update FRONTEND_URL in .env to match your frontend URL
- Check CORS configuration in index.js

### 📦 Deployment
#### Deploying to Production
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

#### Popular Deployment Platforms
- **Railway** - Easy deployment with PostgreSQL
- **Render** - Free tier available
- **Heroku** - Classic PaaS
- **DigitalOcean** - App Platform
- **AWS** - Elastic Beanstalk or EC2
- **Google Cloud** - App Engine or Cloud Run

### 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### 📄 License
MIT License - feel free to use this project for personal or commercial purposes.

### 🆘 Support
For issues, questions, or contributions:
- Open an issue on GitHub
- Check Supabase documentation: supabase.com/docs
- Check Gemini AI documentation: ai.google.dev

### 🎯 Next Steps
1. ✅ Set up your environment variables
2. ✅ Run the database schema in Supabase
3. ✅ Start the server
4. ✅ Test API endpoints
5. 🚀 Build your frontend!

Happy coding! 💪🏋️‍♂️

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Overview
ForgeAI is an AI‑powered fitness and wellness platform that generates personalized workout plans, tracks progress, and provides real‑time guidance using Google Gemini and Supabase.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, vanilla CSS (no Tailwind unless requested)
- **Backend**: Node.js, Express, Supabase, Google Gemini AI
- **Deployment**: Vercel (frontend) & Render (backend)

## Project Structure
```
HACK/
├── components/          # React components
├── server/              # Express backend API
│   ├── index.js
│   └── routes/
├── supabaseClient.ts   # Supabase connection
├── geminiService.ts    # Gemini integration
├── vite.config.ts
├── package.json
└── README.md            # This file
```

## Setup Instructions
### Prerequisites
- Node.js (>=18)
- npm
- Supabase account & project
- Gemini API key

### Frontend
```bash
npm install            # install dependencies
npm run dev            # start Vite dev server
```
Add your Gemini key to `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

### Backend
```bash
cd server
npm install            # install backend deps
npm run dev            # start Express server
```
Create a `.env` file in `server/` with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_key
```

## Usage
- Open the app at `http://localhost:5173`.
- Sign in with Google (or Supabase auth).
- Generate a workout plan and follow the guided sessions.

## Contributing
1. Fork the repo
2. Create a feature branch
3. Open a pull request

## License
MIT

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1onIG50KmnWHsse7tFz4BhBGdLNtYiM4p

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
