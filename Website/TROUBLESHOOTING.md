# Troubleshooting: Connection Refused

## Quick Fix

### Step 1: Make Sure Both Servers Are Running

**Open TWO terminal windows:**

**Terminal 1 - PHP Backend:**
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
php -S localhost:8000
```
You should see: `Listening on http://localhost:8000`

**Terminal 2 - React Frontend:**
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website"
pnpm dev
```
You should see: `Local: http://localhost:3000/`

### Step 2: Wait 10-20 Seconds

The React server takes time to start. Wait until you see:
- ✅ `Local: http://localhost:3000/`
- ✅ `ready in X ms`

### Step 3: Open Browser

- **Website:** http://localhost:3000
- **Admin:** http://localhost:3000/backend

---

## Common Issues

### Issue 1: "Connection Refused" on Port 3000

**Solution:**
- React server isn't started yet - wait longer
- Or React server failed to start - check terminal for errors
- Or wrong port - check terminal output for actual port

### Issue 2: "Connection Refused" on Port 8000

**Solution:**
- PHP backend isn't running
- Start it: `cd php-backend && php -S localhost:8000`

### Issue 3: "Site can't be reached"

**Solutions:**
1. Check if servers are actually running
2. Check the correct port numbers
3. Try `http://127.0.0.1:3000` instead of `localhost:3000`
4. Check Windows Firewall isn't blocking

### Issue 4: API requests failing (404, 500 errors)

**Solution:**
- PHP backend must be running on port 8000
- Vite proxy is configured to forward `/api/*` to `localhost:8000`

---

## Easy Way: Use the Batch File

**Double-click:** `START_SERVERS.bat`

This will:
- ✅ Start PHP backend automatically
- ✅ Start React frontend automatically
- ✅ Show you the correct URLs

---

## Verify Servers Are Running

### Check PHP Backend:
Open browser: http://localhost:8000/api/documents
- Should show JSON data ✅
- If connection refused, PHP backend isn't running ❌

### Check React Frontend:
Open browser: http://localhost:3000
- Should show the website ✅
- If connection refused, React server isn't running ❌

---

## Ports Used

- **8000** - PHP Backend API
- **3000** - React Frontend (Vite dev server)

Make sure these ports aren't used by other programs!

---

## Still Not Working?

1. Check terminal windows for error messages
2. Try restarting both servers
3. Check Windows Firewall settings
4. Try `127.0.0.1` instead of `localhost`
5. Check if antivirus is blocking ports

---

**Remember:** Both servers must be running at the same time!