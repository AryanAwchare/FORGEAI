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
