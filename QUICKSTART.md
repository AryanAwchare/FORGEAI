# 🚀 Quick Start Guide - Fitness & Wellness Backend

Get your backend up and running in under 10 minutes!

## ⚡ Fast Setup (Step-by-Step)

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Get Your Supabase Credentials

1. **Create Account**: Go to [supabase.com](https://supabase.com) and sign up
2. **New Project**: Click "New Project" 
   - Choose a name
   - Set a database password (save it!)
   - Select a region close to you
   - Wait ~2 minutes for setup
3. **Get API Keys**: 
   - Go to Settings (⚙️) → API
   - Copy these 3 things:
     - `Project URL`
     - `anon public key`
     - `service_role key` (secret!)

### Step 3: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### Step 4: Set Up Database

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Open `server/database/schema.sql` file in a text editor
3. Copy ALL the contents
4. Paste into Supabase SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. ✅ You should see "Success. No rows returned"

### Step 5: Configure Environment

1. In the `server` folder, copy `.env.example` to `.env`:
   ```bash
   # Windows PowerShell
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

2. Open `.env` file and paste your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   
   GEMINI_API_KEY=AIzaSy...
   
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=any_random_long_string_here
   ```

### Step 6: Start the Server!

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
🔗 Health check: http://localhost:5000/api/health
```

### Step 7: Test It!

Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-xx-xx...",
  "database": "connected",
  "environment": "development"
}
```

## 🎉 Success! Your Backend is Running

## 🧪 Test API Endpoints

### Test AI Workout Generation
```bash
curl -X POST http://localhost:5000/api/ai/generate-workout \
  -H "Content-Type: application/json" \
  -d "{\"fitnessLevel\":\"beginner\",\"goals\":\"weight loss\",\"duration\":30}"
```

### Test AI Chat
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"How do I get started with fitness?\"}"
```

## 📁 What You Have Now

```
✅ Express.js server running on port 5000
✅ Supabase PostgreSQL database connected
✅ Google Gemini AI integrated
✅ 9 database tables with security policies
✅ RESTful API endpoints ready
✅ Rate limiting and security middleware active
```

## 🎯 Available API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check server status |
| `/api/users` | GET, POST | User management |
| `/api/fitness/goals/:userId` | GET | Get fitness goals |
| `/api/fitness/workouts/:userId` | GET | Get workouts |
| `/api/fitness/progress/:userId` | GET | Get progress data |
| `/api/ai/generate-workout` | POST | Generate AI workout plan |
| `/api/ai/generate-meal-plan` | POST | Generate AI meal plan |
| `/api/ai/chat` | POST | Chat with AI coach |
| `/api/ai/analyze-form` | POST | Get form feedback |

## 🔧 Common Issues & Solutions

### Issue: Port 5000 already in use
**Solution**: Change PORT in `.env` to `5001` or another available port

### Issue: "Missing Supabase environment variables"
**Solution**: Double-check your `.env` file has all 3 Supabase values set correctly

### Issue: Gemini API errors
**Solution**: Verify your API key is correct and doesn't have extra spaces

### Issue: CORS errors from frontend
**Solution**: Update `FRONTEND_URL` in `.env` to match your frontend's URL

## 📚 Next Steps

1. **Read Full Documentation**: Check `server/README.md` for detailed info
2. **Explore Database**: Use Supabase dashboard → Table Editor to see your tables
3. **Connect Frontend**: Use the API endpoints in your React/Next.js app
4. **Test with Postman**: Import endpoints for easier testing
5. **Add Authentication**: Implement Supabase Auth for user login/signup

## 💡 Pro Tips

- Use `npm run dev` for development (auto-restarts on changes)
- Use `npm start` for production
- Check server logs in terminal for debugging
- Use Supabase logs dashboard to see database queries
- Monitor Gemini API usage in Google AI Studio

## 🆘 Need Help?

- **Database Issues**: Check Supabase docs at [supabase.com/docs](https://supabase.com/docs)
- **AI Issues**: Check Gemini docs at [ai.google.dev](https://ai.google.dev)
- **Backend Questions**: Open an issue or check `server/README.md`

---

**🎊 Congratulations! Your backend is live and ready!** 🎊

Now go build something amazing! 💪🏋️‍♂️
