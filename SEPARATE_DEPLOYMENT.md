# Separate Frontend & Backend Deployment Guide

## Architecture
- **Backend (API + Socket.IO)**: Render.com
- **Frontend (React)**: Vercel

## Step 1: Update Render Backend (Already Deployed)

Your backend is already on Render. Just update the settings:

1. Go to https://dashboard.render.com
2. Click on your service
3. Go to "Settings"
4. Update these settings:

**Root Directory**: `server`

**Build Command**: `npm install`

**Start Command**: `node index.js`

5. Go to "Environment" tab
6. Make sure `FRONTEND_URL` is set to: `https://wait-a-min-2zdy.vercel.app`

7. Click "Manual Deploy" → "Deploy latest commit"

Your backend will be at: `https://wait-a-min.onrender.com`

## Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Navigate to client folder
cd client

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

When prompted:
- "Set up and deploy?" → **Yes**
- "Which scope?" → Select your account
- "Link to existing project?" → **Yes** (if you have one) or **No** (for new)
- "What's your project's name?" → `wait-a-min` or any name
- "In which directory is your code located?" → `./` (current directory)
- "Want to override settings?" → **No**

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository: `cookieParser/wait-a-min`
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - `VITE_API_URL` = `https://wait-a-min.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://wait-a-min.onrender.com`

5. Click "Deploy"

## Step 3: Update Render Environment Variables

After Vercel deployment, get your Vercel URL (e.g., `https://wait-a-min-2zdy.vercel.app`)

1. Go back to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Save changes (will auto-redeploy)

## Step 4: Test Everything

### Test Backend:
```
https://wait-a-min.onrender.com/api/health
```
Should return: `{"status":"ok","message":"API is running"}`

### Test Frontend:
```
https://wait-a-min-2zdy.vercel.app
```
Should load your app

### Test Real-time Updates:
1. Open frontend
2. Check browser console (F12)
3. Should see: "✓ Real-time updates connected: [socket-id]"

## Benefits of Separate Deployment

✅ **Better Performance**: Vercel's edge network for fast frontend delivery
✅ **Independent Scaling**: Scale frontend and backend separately
✅ **Easier Updates**: Update frontend without touching backend
✅ **Better Caching**: Vercel optimizes static assets
✅ **Free Tiers**: Both Render and Vercel have generous free tiers

## URLs Summary

- **Frontend**: https://wait-a-min-2zdy.vercel.app
- **Backend API**: https://wait-a-min.onrender.com/api
- **Socket.IO**: https://wait-a-min.onrender.com

## Auto-Deploy Setup

### Backend (Render):
- Already configured
- Deploys automatically on git push to `main` branch

### Frontend (Vercel):
- After first deployment, Vercel auto-deploys on git push
- Only rebuilds when client folder changes
- Preview deployments for pull requests

## Troubleshooting

**CORS Errors:**
- Check `FRONTEND_URL` in Render matches your Vercel URL exactly
- No trailing slashes

**Socket.IO Not Connecting:**
- Check `VITE_SOCKET_URL` in Vercel environment variables
- Should be: `https://wait-a-min.onrender.com` (no /api)

**API Calls Failing:**
- Check `VITE_API_URL` in Vercel environment variables
- Should be: `https://wait-a-min.onrender.com/api` (with /api)

**Render Cold Start:**
- First request after 15 min inactivity takes 30-60 seconds
- Use UptimeRobot to keep it awake (ping every 10 minutes)

## Cost Estimate

**Render (Backend):**
- Free tier: 750 hours/month
- Enough for 24/7 operation
- Upgrade to $7/month for no cold starts

**Vercel (Frontend):**
- Free tier: 100GB bandwidth/month
- Unlimited deployments
- More than enough for small-medium apps

**Total Cost**: $0/month (free tiers) or $7/month (Render paid)
