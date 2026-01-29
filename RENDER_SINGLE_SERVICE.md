# Deploy to Render (Single Service - Free Tier)

This setup deploys both frontend and backend as ONE service on Render's free tier.

## Quick Deploy Steps:

### 1. Go to Render Dashboard
- Open: https://dashboard.render.com
- Sign in with GitHub

### 2. Create New Web Service
- Click "New +" → "Web Service"
- Select your repository: `cookieParser/wait-a-min`

### 3. Configure Service

**Name**: `wait-time-app`

**Region**: `Oregon (US West)`

**Branch**: `main`

**Root Directory**: Leave EMPTY (deploy from root)

**Runtime**: `Node`

**Build Command**:
```
cd client && npm install && npm run build && cd ../server && npm install
```

**Start Command**:
```
cd server && node index.js
```

**Instance Type**: `Free`

### 4. Add Environment Variables

Click "Advanced" → Add these environment variables:

```
NODE_ENV = production
PORT = 10000
MONGO_URI = mongodb+srv://dasdivyadarshan_db_user:BcKktOKcX3o53Rzw@cluster0.a99djwz.mongodb.net/waitclarity?retryWrites=true&w=majority
JWT_SECRET = supersecretkey
GEMINI_API_KEY = AIzaSyAyX9tBQkqH3ytCrgDSbeRSMxAKxQpPUTw
```

### 5. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for first build
- Watch the logs - should see "Server running on port 10000"

### 6. Test Your App
After deployment, you'll get a URL like:
```
https://wait-time-app.onrender.com
```

Open it in your browser - you should see your full app!

## What This Does

✅ Builds React frontend
✅ Serves frontend from Express backend
✅ API available at `/api/*`
✅ Socket.IO works on same domain
✅ Single service = Free tier compatible
✅ No CORS issues (same origin)

## Testing

1. **Test Frontend**: Open `https://your-app.onrender.com`
2. **Test API**: Open `https://your-app.onrender.com/api/health`
3. **Test Socket**: Check browser console for "✓ Real-time updates connected"

## Important Notes

⚠️ **First Load**: Takes 30-60 seconds (cold start)
⚠️ **Inactivity**: Service sleeps after 15 minutes
💡 **Keep Awake**: Use cron-job.org to ping `/api/health` every 10 minutes

## Troubleshooting

**Build fails?**
- Check logs in Render dashboard
- Make sure both client and server have package.json

**App doesn't load?**
- Wait 60 seconds for cold start
- Check if build completed successfully
- View logs for errors

**Socket.IO not connecting?**
- Wait 30 seconds after page load
- Check browser console for errors
- Verify service is "Live" in Render dashboard

## Auto-Deploy

Every time you push to GitHub, Render will automatically rebuild and redeploy!

```bash
git add .
git commit -m "update app"
git push
```

## Success!

Your app is now live with:
- ✅ Frontend and backend on one URL
- ✅ Real-time Socket.IO updates
- ✅ No CORS issues
- ✅ Free hosting
- ✅ Auto-deploy on git push
