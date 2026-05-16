# 🚀 Quick Start - View Website and Backend

## Easiest Way (Double-Click)

1. **Double-click:** `START_BOTH_SERVERS.bat`
   - This starts both servers automatically
   - Opens two windows (one for each server)

2. **Wait 10-20 seconds** for servers to start

3. **Open your browser:**
   - **Website:** http://localhost:5173
   - **Admin Backend:** http://localhost:5173/backend

---

## Manual Way (Step by Step)

### Option 1: Run Both Servers (Recommended)

**Terminal Window 1 - PHP Backend:**
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
php -S localhost:8000
```
✅ Keep this running - it handles all API requests

**Terminal Window 2 - React Frontend:**
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website"
pnpm dev
```
✅ Keep this running - it serves your React website

**Then visit:**
- 🌐 **Website:** http://localhost:5173 (homepage, about, contact, etc.)
- 🔐 **Admin Backend:** http://localhost:5173/backend (admin panel)

---

### Option 2: Test Backend API Only

**Terminal Window - PHP Backend:**
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
php -S localhost:8000
```

**Then visit:**
- 📋 **Admin API Test Page:** http://localhost:8000/test/admin-test.html
- 🔌 **API Endpoints:**
  - http://localhost:8000/api/documents
  - http://localhost:8000/api/hero-images
  - http://localhost:8000/api/gallery

---

## What You'll See

### Website (React Frontend)
- ✅ Homepage with hero images
- ✅ About page
- ✅ Contact page with forms
- ✅ Admissions page
- ✅ Gallery page
- ✅ Mandatory Disclosure page

### Admin Backend (React Frontend)
- ✅ Login page (username: `admin`, password: `admin123`)
- ✅ SMTP configuration
- ✅ Document management
- ✅ Hero images management
- ✅ Gallery management

---

## URLs Reference

| What | URL |
|------|-----|
| **Main Website** | http://localhost:5173/ |
| **Admin Backend** | http://localhost:5173/backend |
| **Backend API Test** | http://localhost:8000/test/admin-test.html |
| **API: Documents** | http://localhost:8000/api/documents |
| **API: Hero Images** | http://localhost:8000/api/hero-images |
| **API: Gallery** | http://localhost:8000/api/gallery |

---

## Troubleshooting

### "pnpm not found"
```bash
npm install -g pnpm
# or use npm instead:
npm run dev
```

### "Port already in use"
- Close the terminal windows and try again
- Or change ports in the commands

### "Cannot connect to API"
- Make sure PHP backend server is running on port 8000
- Check that XAMPP MySQL is running

### "Database connection failed"
- Make sure XAMPP MySQL is running
- Check database credentials in `php-backend/config/database.php`

---

## Need Help?

1. Check if both servers are running (should see two terminal windows)
2. Check the URLs above
3. Look at the terminal output for any error messages

---

**🎉 You're all set! Start the servers and visit the URLs above.**