# Deploy Socket.IO Server to Render

Render supports WebSockets and is perfect for Socket.IO applications.

## Quick Deploy Steps:

### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub

### 2. Create New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub account
- Select your `wait-a-min` repository

### 3. Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `wait-time-api` (or any name you prefer)
- **Region**: Oregon (US West) or closest to you
- **Branch**: `main`
- **Root Directory**: `server` ⚠️ IMPORTANT
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

**Instance Type:**
- Select **Free** (supports WebSockets!)

### 4. Add Environment Variables
Click "Advanced" and add these environment variables:

```
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key_here
FRONTEND_URL = https://wait-a-min-2zdy.vercel.app
PORT = 5000
NODE_ENV = production
OPENAI_API_KEY = your_openai_key (optional, for AI features)
```

### 5. Deploy
- Click "Create Web Service"
- Render will start building and deploying
- Wait 2-5 minutes for first deployment

### 6. Get Your Render URL
After deployment completes, you'll get a URL like:
```
https://wait-time-api.onrender.com
```

### 7. Update Client Environment Variables

Update `client/.env.production`:
```env
VITE_API_URL=https://wait-time-api.onrender.com/api
VITE_SOCKET_URL=https://wait-time-api.onrender.com
```

Or create a new one if it doesn't exist:
```bash
cd client
echo "VITE_API_URL=https://wait-time-api.onrender.com/api" > .env.production
echo "VITE_SOCKET_URL=https://wait-time-api.onrender.com" >> .env.production
```

### 8. Update Render Environment Variables
Go back to Render dashboard → Environment → Add:
```
FRONTEND_URL = https://wait-a-min-2zdy.vercel.app
```

### 9. Redeploy Client to Vercel
```bash
cd client
npm run build
vercel --prod
```

## Testing Your Deployment

### Test API:
```bash
curl https://wait-time-api.onrender.com/api/health
```
Should return: `{"status":"ok","message":"API is running"}`

### Test Socket.IO:
Open your deployed frontend and check browser console:
- Should see: "✓ Real-time updates connected: [socket-id]"
- No more "transport error" messages

## Important Notes

⚠️ **Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month free (enough for one service 24/7)

💡 **To Keep Service Awake:**
You can use a service like UptimeRobot or Cron-job.org to ping your API every 10 minutes:
```
https://wait-time-api.onrender.com/api/health
```

## Auto-Deploy on Git Push

Render automatically deploys when you push to `main` branch:
```bash
git add .
git commit -m "update server"
git push origin main
```

## Monitoring

In Render Dashboard you can:
- View logs in real-time
- Monitor CPU/Memory usage
- See deployment history
- Check service health

## Upgrading (Optional)

If you need better performance:
- **Starter Plan**: $7/month - No spin down, better resources
- **Standard Plan**: $25/month - More CPU/RAM

## Why Render?

✅ **WebSocket Support** - Full Socket.IO support
✅ **Free Tier** - 750 hours/month free
✅ **Auto Deploy** - Deploys on git push
✅ **Easy Setup** - Simple configuration
✅ **SSL Included** - Free HTTPS certificates
✅ **No Credit Card** - Free tier doesn't require payment info

## Troubleshooting

**If Socket.IO still doesn't connect:**
1. Check Render logs for errors
2. Verify FRONTEND_URL matches your Vercel URL exactly
3. Check browser console for CORS errors
4. Make sure Root Directory is set to `server`

**If API returns 404:**
- Verify Root Directory is `server` in Render settings
- Check Start Command is `node index.js`
