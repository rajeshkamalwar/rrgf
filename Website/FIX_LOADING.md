# Fix: Website Not Loading

## The Problem

The React app was configured to use the Express backend server, but we're now using PHP backend. We need to configure Vite to proxy API requests to the PHP server.

## Solution Applied

I've updated `vite.config.ts` to:
1. ✅ Proxy all `/api/*` requests to `http://localhost:8000` (PHP backend)
2. ✅ Removed the Express plugin (no longer needed)

## What to Do Now

### Step 1: Make sure PHP Backend is Running

Open Terminal/PowerShell:
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
php -S localhost:8000
```

Keep this running! ✅

### Step 2: Restart React Dev Server

**Stop the current React server** (if running):
- Press `Ctrl+C` in the terminal where it's running

**Start it again:**
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website"
pnpm dev
```

### Step 3: Access the Website

- **Website:** http://localhost:3000
- **Admin Backend:** http://localhost:3000/backend

## How It Works Now

1. React app runs on `http://localhost:3000`
2. When React makes requests to `/api/*`, Vite automatically proxies them to `http://localhost:8000/api/*`
3. PHP backend handles all API requests
4. React receives the responses and displays them

## Testing

1. ✅ Start PHP backend: `cd php-backend && php -S localhost:8000`
2. ✅ Start React: `cd Website && pnpm dev`
3. ✅ Visit: http://localhost:3000
4. ✅ Visit: http://localhost:3000/backend
5. ✅ Test API: http://localhost:3000/api/documents (should show JSON)

## Troubleshooting

### Still not loading?
- Check if PHP server is running on port 8000
- Check if React server is running on port 3000
- Look at browser console for errors
- Check terminal output for errors

### Port conflicts?
- PHP backend uses port 8000
- React uses port 3000
- Make sure nothing else is using these ports

---

**After restarting both servers, everything should work!** 🎉