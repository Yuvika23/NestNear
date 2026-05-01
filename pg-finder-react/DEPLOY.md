# 🚀 Deployment Guide — NestNear PG Finder

Deploy backend FREE on Render, frontend FREE on Vercel.
Total time: ~20 minutes.

---

## STEP 1 — Set up MongoDB Atlas (Free Database)

1. Go to https://mongodb.com/atlas and create a free account
2. Create a FREE cluster (M0 — always free)
3. Click "Connect" → "Drivers" → copy the connection string
   It looks like: `mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/`
4. Replace `<password>` with your actual password
5. Add `/pg-finder` at the end: `mongodb+srv://...mongodb.net/pg-finder`
6. In "Network Access" → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

## STEP 2 — Push Code to GitHub

```bash
# Create two repos on github.com:
# 1. pg-finder-backend
# 2. pg-finder-frontend

# Backend
cd pg-finder-backend
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/YOUR_USERNAME/pg-finder-backend.git
git push -u origin main

# Frontend
cd pg-finder-frontend  
git init
git add .
git commit -m "Initial frontend"
git remote add origin https://github.com/YOUR_USERNAME/pg-finder-frontend.git
git push -u origin main
```

---

## STEP 3 — Deploy Backend on Render (Free)

1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your `pg-finder-backend` GitHub repo
4. Fill in settings:
   - **Name**: pg-finder-api
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables (click "Environment"):
   ```
   MONGO_URI    = your MongoDB Atlas connection string
   JWT_SECRET   = any_long_random_string_like_abc123xyz789
   PORT         = 5000
   ```
6. Click "Create Web Service"
7. Wait ~3 mins for it to deploy
8. Copy your URL: `https://pg-finder-api.onrender.com`

### Seed the live database:
```bash
# In your backend folder, update seed.js MONGO_URI with Atlas URI, then:
node seed.js
```

---

## STEP 4 — Deploy Frontend on Vercel (Free)

1. Go to https://vercel.com and sign up with GitHub
2. Click "New Project" → Import `pg-finder-frontend`
3. Framework: **Vite** (auto-detected)
4. Add Environment Variable:
   ```
   VITE_API_URL = https://pg-finder-api.onrender.com/api
   ```
5. Click "Deploy"
6. Your site is live at: `https://pg-finder-frontend.vercel.app` 🎉

---

## STEP 5 — Update Backend CORS for Production

In your `server.js`, update CORS to allow your Vercel URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://pg-finder-frontend.vercel.app',  // your Vercel URL
    'https://nestnear.vercel.app'              // if you rename it
  ],
  credentials: true
}));
```

Commit and push — Render will auto-redeploy.

---

## ✅ Final Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend live on Render
- [ ] Database seeded with `node seed.js`
- [ ] Frontend live on Vercel
- [ ] CORS updated with Vercel URL
- [ ] Test: open your Vercel URL, listings should load from backend

---

## 📝 Resume Line (once deployed)

> **NestNear — PG Finder for College Students** | React, Node.js, Express, MongoDB
> Full-stack web app for students to discover verified PG accommodations near campus.
> Features real-time search & filters, student-verified listings, JWT auth, and a RESTful API.
> Deployed live on Vercel + Render with MongoDB Atlas. [your-url.vercel.app]
