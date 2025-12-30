# ForgeAI Deployment Guide

This guide will help you deploy your **ForgeAI Fitness Agent** to the web.

## Architecture
- **Frontend**: React (Vite) -> Deployed on **Vercel**
- **Backend**: Express (Node.js) -> Deployed on **Render** (Free Tier)
- **Database**: Supabase -> Already hosting your data (Cloud)

---

## Phase 1: Push to GitHub

1. Create a new repository on GitHub (e.g., `forge-fitness-ai`).
2. Push your current code to this repository:
   ```bash
   git init
   git add .
   git commit -m "Ready for deploy"
   git branch -M main
   # Replace with your URL
   git remote add origin https://github.com/YOUR_USERNAME/forge-fitness-ai.git
   git push -u origin main
   ```

---

## Phase 2: Deploy Backend (Render)

Since Vercel is for frontends and "serverless" functions, it isn't the best fit for a persistent Express server. We'll use **Render** (which has a generous free tier for Node.js).

1. Go to [dashboard.render.com](https://dashboard.render.com/) and create an account.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. **Configuration**:
   - **Root Directory**: `server` (Important! Your backend is in this subfolder).
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables**:
   Scroll down to "Environment Variables" and add these keys from your `server/.env`:
   - `GEMINI_API_KEY`: (Your Google Gemini Key)
   - `SUPABASE_URL`: (Your Supabase URL)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Your Secret Service Role Key)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-vercel-app-name.vercel.app` (You will update this later after Phase 3).
6. Click **Create Web Service**.
7. **Copy URL**: Once deployed, Render will give you a URL like `https://forge-backend.onrender.com`. Copy this.

---

## Phase 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and login.
2. Click **Add New...** -> **Project**.
3. Import your `forge-fitness-ai` repository.
4. **Project Configuration**:
   - **Framework Preset**: Vite (should detect automatically)
   - **Root Directory**: `./` (default is fine)
5. **Environment Variables**:
   Add the following variables (copy them from your local `.env`):
   - `VITE_SUPABASE_URL`: (Same as local)
   - `VITE_SUPABASE_ANON_KEY`: (Same as local)
   - `VITE_BACKEND_URL`: **PASTE THE RENDER URL HERE** (e.g., `https://forge-backend.onrender.com`) - NOT `localhost:5000`!
6. Click **Deploy**.

---

## Phase 4: Final Connection

1. Once Vercel finishes, you will get your live frontend URL (e.g., `https://forge-fitness-ai.vercel.app`).
2. Go back to your **Render Dashboard** (Backend).
3. Update the `FRONTEND_URL` variable to match your new Vercel URL.
4. Render will restart the server.

**Success!** Your AI Agent is now live.
