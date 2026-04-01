# Quick Fix Instructions

## Problem
Browser localStorage mein purana invalid token stored hai isliye buttons kaam nahi kar rahe.

## Solution

### Step 1: Browser Console Open Karo
1. Chrome/Firefox mein `Cmd + Option + J` (Mac) ya `F12` (Windows)
2. Console tab open karo

### Step 2: Ye Command Run Karo
```javascript
// Clear old data
localStorage.clear();

// Set fresh token
localStorage.setItem('studentos_user', JSON.stringify({
  id: "6a3e37a32639894522d98aa8",
  name: "Arnav kumar",
  email: "arnav.kumar@adypu.edu.in",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTNlMzdhMzI2Mzk4OTQ1MjJkOThhYTgiLCJlbWFpbCI6ImFybmF2Lmt1bWFyQGFkeXB1LmVkdS5pbiIsImlhdCI6MTc4MjQ5NzgyMCwiZXhwIjoxNzgzMTAyNjIwfQ.Y8Vj_O0_gr_YVyKKchiC9tFD7pBpkxjmokRMYr8xP0A"
}));

// Reload page
location.reload();
```

### Step 3: Page Refresh Hone Ke Baad
✅ Add Application button kaam karega
✅ GitHub username save hoga
✅ Profile save hoga
✅ Timeline add hoga
✅ Notes save honge
✅ Sab MongoDB mein store hoga

## Gemini AI Fix

`.env` file mein `GEMINI_API_KEY` check karo:
```
GEMINI_API_KEY="AIza..."
```

Agar API key sahi hai toh AI features automatically kaam karenge.
