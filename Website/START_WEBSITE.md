# How to View the Website and Backend

## Quick Start Guide

You need to run **TWO servers**:
1. **PHP Backend API** (handles `/api/*` requests)
2. **React Frontend** (the actual website)

---

## Method 1: Development Mode (Recommended)

### Step 1: Start PHP Backend API Server

Open Terminal/PowerShell and run:
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
php -S localhost:8000
```

Keep this running. ✅ You should see: `Listening on http://localhost:8000`

### Step 2: Start React Frontend

Open **another** Terminal/PowerShell and run:
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website"
pnpm dev
# or if pnpm is not available:
npm run dev
```

✅ You should see something like: `Local: http://localhost:5173/`

### Step 3: Access Your Website

1. **Main Website:** 
   - Visit: `http://localhost:5173/` (or whatever port Vite shows)
   - This shows your React website (homepage, about, contact, etc.)

2. **Admin Backend Panel:**
   - Visit: `http://localhost:5173/backend`
   - This shows the admin panel (login page)

The React app will automatically connect to the PHP backend API at `http://localhost:8000/api`

---

## Method 2: Test Backend API Only

If you just want to test the backend APIs without the React frontend:

1. **Start PHP Server:**
   ```bash
   cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
   php -S localhost:8000
   ```

2. **Test Admin APIs:**
   - Visit: `http://localhost:8000/test/admin-test.html`
   - This gives you a simple HTML page to test all admin endpoints

3. **Test Public APIs:**
   - Visit: `http://localhost:8000/api/documents`
   - Visit: `http://localhost:8000/api/hero-images`
   - Visit: `http://localhost:8000/api/gallery`

---

## Method 3: Production Build (All-in-One)

To serve everything from one server:

### Step 1: Build React App
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website"
pnpm build
# or
npm run build
```

### Step 2: Copy Build Files
Copy the contents of `dist/` or `build/` folder to `php-backend/` directory:
- Copy `index.html` to `php-backend/`
- Copy `assets/` folder to `php-backend/`
- Copy any other files from the build

### Step 3: Start PHP Server
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
php -S localhost:8000
```

### Step 4: Access Everything
- **Website:** `http://localhost:8000/`
- **Admin Backend:** `http://localhost:8000/backend`
- **API Endpoints:** `http://localhost:8000/api/*`

---

## Summary

### For Development (Easy):
- **Terminal 1:** `cd php-backend && php -S localhost:8000`
- **Terminal 2:** `cd Website && pnpm dev`
- **Website:** `http://localhost:5173/`
- **Backend:** `http://localhost:5173/backend`

### For Testing Backend Only:
- **Terminal:** `cd php-backend && php -S localhost:8000`
- **Admin Test:** `http://localhost:8000/test/admin-test.html`

### For Production Build:
- Build React app
- Copy to php-backend/
- Start PHP server
- Everything at `http://localhost:8000/`

---

## Quick Commands Reference

```bash
# Start PHP Backend
cd php-backend
php -S localhost:8000

# Start React Frontend (in another terminal)
cd Website
pnpm dev

# Build React for Production
cd Website
pnpm build
```

---

**Note:** Make sure XAMPP MySQL is running for database access!