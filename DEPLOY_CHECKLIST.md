# Complete Deployment Checklist

## Step 1: Deploy Backend to Render (5 minutes)

### 1.1 Go to Render
- Open: https://dashboard.render.com/register
- Click "Sign up with GitHub"
- Authorize Render to access your repositories

### 1.2 Create New Web Service
- Click "New +" button (top right)
- Select "Web Service"
- Find and select: `cookieParser/wait-a-min`
- Click "Connect"

### 1.3 Configure Service
Fill in these EXACT values:

**Name**: `wait-time-api`

**Region**: `Oregon (US West)` (or closest to you)

**Branch**: `main`

**Root Directory**: `server` ⚠️ CRITICAL - Type exactly: server

**Runtime**: `Node`

**Build Command**: `npm install`

**Start Command**: `node index.js`

**Instance Type**: `Free`

### 1.4 Add Environment Variables
Click "Advanced" → Scroll to "Environment Variables" → Add these:

```
MONGO_URI
mongodb+srv://dasdivyadarshan_db_user:BcKktOKcX3o53Rzw@cluster0.a99djwz.mongodb.net/waitclarity?retryWrites=true&w=majority

JWT_SECRET
supersecretkey

GEMINI_API_KEY
AIzaSyAyX9tBQkqH3ytCrgDSbeRSMxAKxQpPUTw

FRONTEND_URL
https://wait-a-min-2zdy.vercel.app

PORT
5000

NODE_ENV
production
```

### 1.5 Deploy
- Click "Create Web Service"
- Wait 2-5 minutes for deployment
- You'll see logs scrolling - wait for "Server running on port 5000"

### 1.6 Copy Your Render URL
After deployment, you'll see a URL at the top like:
```
https://wait-time-api.onrender.com
```
**COPY THIS URL** - you'll need it in the next step!

---

## Step 2: Update Client for Render Backend

### 2.1 Create Production Environment File
Run this command (replace YOUR_RENDER_URL with the URL from Step 1.6):

```bash
cd client
echo VITE_API_URL=https://YOUR_RENDER_URL/api > .env.production
echo VITE_SOCKET_URL=https://YOUR_RENDER_URL >> .env.production
```

Example (if your Render URL is https://wait-time-api.onrender.com):
```bash
cd client
echo VITE_API_URL=https://wait-time-api.onrender.com/api > .env.production
echo VITE_SOCKET_URL=https://wait-time-api.onrender.com >> .env.production
```

### 2.2 Verify the File
```bash
cat .env.production
```

Should show:
```
VITE_API_URL=https://wait-time-api.onrender.com/api
VITE_SOCKET_URL=https://wait-time-api.onrender.com
```

---

## Step 3: Redeploy Client to Vercel

```bash
npm run build
vercel --prod
```

When prompted:
- "Set up and deploy?" → Yes
- "Which scope?" → Your account
- "Link to existing project?" → Yes
- "What's the name?" → wait-a-min (or your project name)

---

## Step 4: Update Render Environment Variable

Go back to Render dashboard:
1. Click on your `wait-time-api` service
2. Go to "Environment" tab
3. Find `FRONTEND_URL` variable
4. Make sure it's: `https://wait-a-min-2zdy.vercel.app`
5. If you changed it, click "Save Changes"

---

## Step 5: Test Everything

### Test Backend API:
Open in browser:
```
https://YOUR_RENDER_URL/api/health
```
Should see: `{"status":"ok","message":"API is running"}`

### Test Frontend:
1. Open: https://wait-a-min-2zdy.vercel.app
2. Open browser console (F12)
3. Look for: `✓ Real-time updates connected: [socket-id]`
4. Should NOT see "transport error" anymore

### Test Real-time Updates:
1. Login to business dashboard
2. Update wait time
3. Open the same place in another tab
4. Wait time should update instantly!

---

## Troubleshooting

**If Render deployment fails:**
- Check Root Directory is exactly: `server`
- Check Start Command is: `node index.js`
- View logs in Render dashboard

**If Socket.IO still doesn't connect:**
- Wait 30 seconds (Render free tier has cold starts)
- Check browser console for exact error
- Verify VITE_SOCKET_URL matches your Render URL

**If you see CORS errors:**
- Verify FRONTEND_URL in Render matches your Vercel URL exactly
- No trailing slash in URLs

---

## Important Notes

⚠️ **Render Free Tier:**
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for 24/7 operation)

💡 **Keep Service Awake (Optional):**
Use cron-job.org to ping every 10 minutes:
```
https://YOUR_RENDER_URL/api/health
```

---

## Quick Commands Reference

```bash
# Update client environment
cd client
echo VITE_API_URL=https://YOUR_RENDER_URL/api > .env.production
echo VITE_SOCKET_URL=https://YOUR_RENDER_URL >> .env.production

# Deploy to Vercel
npm run build
vercel --prod

# Check if everything is committed
git status

# Push changes
git add .
git commit -m "update deployment config"
git push
```

---

## Success Checklist

- [ ] Render service shows "Live" status
- [ ] API health endpoint returns OK
- [ ] Frontend loads without errors
- [ ] Browser console shows socket connected
- [ ] No "transport error" in console
- [ ] Real-time updates work
- [ ] Business dashboard can update wait times
- [ ] Changes reflect instantly on frontend

---

## Need Help?

If you get stuck:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all URLs match (no typos)
4. Make sure Root Directory is set to `server` in Render
