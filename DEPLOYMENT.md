# 🚀 StudentOS Deployment Checklist

## ✅ Pre-Deployment

- [ ] Browser localStorage fix kar liya (token valid hai)
- [ ] Server local pe chal raha hai: `http://localhost:5001`
- [ ] Client local pe chal raha hai: `http://localhost:5173`
- [ ] Sab buttons kaam kar rahe hain
- [ ] MongoDB connection working hai
- [ ] Gemini API key valid hai

---

## 🎯 Recommended: Vercel + Render (Free)

### Backend (Render)

1. **Render.com** → Sign up with GitHub
2. **New → Web Service**
3. **Connect GitHub repo** (push code to GitHub first)
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `node dist/index.js`
   - **Environment:** Node
   - **Plan:** Free

5. **Environment Variables:**
   ```
   DATABASE_URL=mongodb+srv://arnavaru62_db_user:Pass_word7@cluster0.2rlawbq.mongodb.net/studentos?retryWrites=true&w=majority
   ACCESS_TOKEN_SECRET=studentos-jwt-access-token-secret-key-indigo-violet-2026
   REFRESH_TOKEN_SECRET=studentos-jwt-refresh-token-secret-key-emerald-rose-2026
   GEMINI_API_KEY=AIzaSyAQ4oAhsj8V3m4meT4JuGvq3Q91h-7JQgI
   PORT=5001
   NODE_ENV=production
   ```

6. **Deploy** → Wait 5-10 minutes
7. **Copy Backend URL:** `https://studentos-api-xxxx.onrender.com`

### Frontend (Vercel)

1. **Vercel.com** → Sign up with GitHub
2. **Import Project** → Select StudentOS repo
3. Settings:
   - **Framework:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://studentos-api-xxxx.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

5. **Deploy** → 2-3 minutes
6. **Your Site:** `https://studentos-username.vercel.app`

### Backend Update (CORS fix)

Backend `server/src/index.ts` mein CORS update karo:

```typescript
app.use(cors({ 
  origin: ['https://studentos-username.vercel.app', 'http://localhost:5173'], 
  credentials: true 
}));
```

Render pe re-deploy karo.

---

## 📋 Post-Deployment

- [ ] Frontend URL kholo browser mein
- [ ] Login karo (demo ya real account)
- [ ] Test karo:
  - [ ] Add Job Application
  - [ ] Save Profile
  - [ ] Add Timeline Item
  - [ ] Create Note
  - [ ] AI Roadmap generate karo
  - [ ] GitHub stats load ho rahe hain
- [ ] MongoDB Compass mein data dikhe
- [ ] Refresh karne pe data rahe

---

## 🔧 Common Issues

**Issue:** Frontend backend se connect nahi ho raha
**Fix:** Backend URL check karo environment variable mein

**Issue:** CORS error
**Fix:** Backend CORS settings mein frontend URL add karo

**Issue:** MongoDB connection failed
**Fix:** MongoDB Atlas mein IP whitelist check karo (0.0.0.0/0 add karo)

**Issue:** Build fail
**Fix:** `package.json` mein scripts check karo

---

## 💰 Costs

- **Render Free:** Backend (goes to sleep after 15 min inactivity)
- **Vercel Free:** Frontend (unlimited bandwidth for personal)
- **MongoDB Atlas Free:** 512MB storage
- **Gemini API:** Free tier (60 requests/minute)

**Total Cost:** ₹0 (FREE) ✅

---

## 🎓 For Internship Demo

1. **Professional URL:** 
   - Frontend: `studentos-arnav.vercel.app`
   - Backend: `studentos-api.onrender.com`

2. **Portfolio mein add karo:**
   - Live Link ✅
   - GitHub Repo ✅
   - Tech Stack: React, TypeScript, Node.js, MongoDB, Prisma, Gemini AI ✅

3. **Demo credentials:**
   - Email: `demo@studentos.app`
   - Password: Use Demo button

---

## ⚡ Quick Deploy Commands

### Push to GitHub first:
```bash
cd /Users/arnavkumar/Desktop/Studentos
git init
git add .
git commit -m "Initial commit - StudentOS"
git branch -M main
git remote add origin https://github.com/username/studentos.git
git push -u origin main
```

Then follow Render + Vercel steps above!
