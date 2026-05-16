# How to Access the Admin Panel

The `/backend` route is part of your **React frontend**, not the PHP backend. Here are your options:

## Option 1: Test Admin API Directly (Quick Test)

I've created a test page to test the admin API endpoints directly:

1. **Open the test page:**
   - File: `php-backend/test/admin-test.html`
   - Open it in your browser (double-click the file)

2. **Or access via PHP server:**
   - Make sure PHP server is running: `php -S localhost:8000`
   - Visit: `http://localhost:8000/test/admin-test.html`

This page lets you:
- ✅ Login to admin API
- ✅ Test SMTP configuration
- ✅ Get documents, hero images, gallery
- ✅ Test all admin endpoints

## Option 2: Use React Dev Server (Full Admin Panel)

To access the full React admin panel at `/backend`:

1. **Start React Dev Server:**
   ```bash
   cd Website
   pnpm dev
   # or
   npm run dev
   ```

2. **Access Admin Panel:**
   - Visit: `http://localhost:5173/backend` (or whatever port Vite uses)
   - The React app will use the PHP backend APIs at `http://localhost:8000/api`

**Note:** Make sure both servers are running:
- PHP API server: `http://localhost:8000`
- React dev server: `http://localhost:5173`

## Option 3: Serve Built React App with PHP (Production-like)

1. **Build React App:**
   ```bash
   cd Website
   pnpm build
   # or
   npm run build
   ```

2. **Copy build files to PHP backend:**
   - Copy contents of `Website/dist/` (or `Website/build/`) to `php-backend/`
   - Make sure `index.html` is in `php-backend/` root

3. **Update `.htaccess` to serve React app:**
   The `.htaccess` in `php-backend` already has SPA routing configured!

4. **Access:**
   - Make sure PHP server is running from `php-backend/` directory
   - Visit: `http://localhost:8000/backend`

## Current Setup

Right now, you're running:
- ✅ **PHP API Server** on `http://localhost:8000` (handles `/api/*`)
- ❌ **React Frontend** is NOT running (so `/backend` route doesn't exist)

## Quick Solution (Recommended for Testing)

**Use the admin test page:**
```
http://localhost:8000/test/admin-test.html
```

This page tests all admin API endpoints directly without needing the React frontend.

## For Production Deployment

When deploying to Hostinger:
1. Build React app
2. Upload React build files + PHP backend together
3. `.htaccess` will route:
   - `/api/*` → PHP backend
   - Everything else → React `index.html` (which handles `/backend` route)

---

**Summary:**
- `/backend` = React frontend route (needs React app running)
- `/api/*` = PHP backend routes (these are working!)
- Use `test/admin-test.html` to test admin APIs without React