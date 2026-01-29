# 🚀 START HERE - Deployment Guide

## Your Project is Ready to Deploy!

You have everything needed to deploy WaitClarity to production. Follow these simple steps.

---

## ⏱️ Time Required: ~15 minutes

---

## 📝 Step-by-Step Instructions

### STEP 1: Prepare Your Code (2 minutes)

Open terminal and run:

```bash
# Make sure you're in the project root directory
cd /path/to/wait-time

# Add all files
git add .

# Commit with a message
git commit -m "Deployment: Ready for production"

# Push to GitHub
git push origin main
```

**What this does:** Uploads your code to GitHub so Vercel can access it.

---

### STEP 2: Deploy Backend (5 minutes)

1. **Open Vercel:** https://vercel.com/new

2. **Import Repository:**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - **Root Directory:** Select `server`
   - Click "Continue"

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add these variables:

   | Key | Value |
   |-----|-------|
   | PORT | 5000 |
   | MONGO_URI | mongodb+srv://dasdivyadarshan_db_user:BcKktOKcX3o53Rzw@cluster0.a99djwz.mongodb.net/waitclarity?retryWrites=true&w=majority |
   | JWT_SECRET | supersecretkey |
   | GEMINI_API_KEY | AIzaSyAyX9tBQkqH3ytCrgDSbeRSMxAKxQpPUTw |
   | NODE_ENV | production |

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - **Copy the URL** (e.g., `https://wait-time-server.vercel.app`)

✅ **Backend is now live!**

---

### STEP 3: Update Client Configuration (2 minutes)

1. **Open file:** `client/.env.production`

2. **Replace the backend URL:**
   ```
   VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
   VITE_SOCKET_URL=https://YOUR-BACKEND-URL.vercel.app
   ```
   
   Replace `YOUR-BACKEND-URL` with the URL you copied in Step 2.

3. **Save the file**

4. **Commit and push:**
   ```bash
   git add client/.env.production
   git commit -m "Update backend URL for production"
   git push origin main
   ```

---

### STEP 4: Deploy Frontend (5 minutes)

1. **Open Vercel:** https://vercel.com/new

2. **Import Repository:**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - **Root Directory:** Select `client`
   - Click "Continue"

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - **Copy the URL** (e.g., `https://wait-time-client.vercel.app`)

✅ **Frontend is now live!**

---

### STEP 5: Update Backend CORS (2 minutes)

1. **Open file:** `server/index.js`

2. **Find this line** (around line 28):
   ```javascript
   origin: ["http://localhost:5173"],
   ```

3. **Replace with your frontend URL:**
   ```javascript
   origin: ["https://YOUR-FRONTEND-URL.vercel.app"],
   ```
   
   Replace `YOUR-FRONTEND-URL` with the URL you copied in Step 4.

4. **Also update Socket.io CORS** (around line 18):
   ```javascript
   origin: ["https://YOUR-FRONTEND-URL.vercel.app"],
   ```

5. **Save and push:**
   ```bash
   git add server/index.js
   git commit -m "Update CORS for production"
   git push origin main
   ```

6. **Vercel will auto-redeploy** (wait 1-2 minutes)

✅ **Everything is now connected!**

---

## ✅ Verify Your Deployment

Visit your frontend URL and test:

1. **Load the page** - Should see WaitClarity homepage
2. **Register** - Create a business account
3. **Login** - Sign in with your credentials
4. **View Places** - See list of places
5. **Submit Report** - Add a wait time report
6. **Real-time Updates** - Check if updates appear instantly

**Check for errors:**
- Open browser console (F12)
- Check for any red error messages
- If errors, check Vercel logs

---

## 🔗 Your Live URLs

After deployment, you'll have:

- **Frontend:** `https://your-frontend.vercel.app`
- **Backend:** `https://your-backend.vercel.app`
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 🆘 Troubleshooting

### Issue: CORS Error
**Error:** "Access to XMLHttpRequest blocked by CORS"
**Fix:** 
1. Check `server/index.js` has correct frontend URL
2. Redeploy backend

### Issue: Socket.io Not Connecting
**Error:** Real-time updates not working
**Fix:**
1. Check `client/.env.production` has correct backend URL
2. Redeploy frontend

### Issue: MongoDB Connection Error
**Error:** "Cannot connect to MongoDB"
**Fix:**
1. Go to MongoDB Atlas
2. Check IP whitelist includes your Vercel IP
3. Verify connection string in environment variables

### Issue: Build Failed
**Error:** Deployment fails
**Fix:**
1. Check Vercel logs for specific error
2. Ensure all dependencies in package.json
3. Verify environment variables are set

---

## 📚 More Documentation

- **README_DEPLOYMENT.md** - Overview
- **QUICK_DEPLOY.md** - Quick reference
- **DEPLOYMENT.md** - Detailed guide
- **PRODUCTION_SETUP.md** - Advanced configuration

---

## 🎉 You're Done!

Your WaitClarity project is now live in production!

**Next steps:**
- Monitor your application
- Gather user feedback
- Plan new features
- Scale as needed

---

## 💡 Tips

- **Monitor Logs:** Check Vercel dashboard regularly
- **Test Features:** Verify everything works in production
- **Backup Data:** MongoDB Atlas has automatic backups
- **Update Code:** Push changes to GitHub, Vercel auto-deploys

---

**Questions?** Check the documentation files or review the guides.

**Happy Deploying! 🚀**
