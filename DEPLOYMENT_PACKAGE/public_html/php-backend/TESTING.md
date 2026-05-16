# Testing Guide - PHP Backend

This guide helps you test the PHP backend locally before deploying to Hostinger.

## Prerequisites

1. **PHP 7.4+ installed** on your local machine
   - Check: `php -v`
   - Download: https://www.php.net/downloads.php

2. **MySQL/MariaDB** (optional for basic tests)
   - Or use the database on Hostinger for testing

3. **cURL extension** (usually included with PHP)

## Quick Test (No Database)

### 1. Start PHP Built-in Server

**Windows:**
```bash
cd php-backend
php -S localhost:8000
```

**Or use the batch file:**
```bash
cd php-backend/test
start-server.bat
```

**Linux/Mac:**
```bash
cd php-backend
php -S localhost:8000
```

**Or use the shell script:**
```bash
cd php-backend/test
chmod +x start-server.sh
./start-server.sh
```

### 2. Test in Browser

Open your browser and visit:
- `http://localhost:8000/api/documents` - Should return JSON
- `http://localhost:8000/api/hero-images` - Should return JSON
- `http://localhost:8000/api/gallery` - Should return JSON

**Expected Response:**
```json
{
  "success": true,
  "documents": [...]
}
```

If you see JSON (even if empty), the API router is working! ✅

## Full Test (With Database)

### 1. Setup Database

1. Create a local MySQL database
2. Import `database/schema.sql`:
   ```bash
   mysql -u root -p your_database < database/schema.sql
   ```

3. Configure `config/database.php`:
   ```php
   'host' => 'localhost',
   'dbname' => 'your_database',
   'username' => 'root',
   'password' => 'your_password',
   ```

### 2. Run Setup Test

```bash
cd php-backend/test
php test-setup.php
```

This will check:
- ✅ PHP version
- ✅ Required extensions
- ✅ Database connection
- ✅ Database tables
- ✅ File permissions
- ✅ Configuration files

### 3. Start Server

```bash
cd php-backend
php -S localhost:8000
```

### 4. Run API Tests

```bash
cd php-backend/test
php test-api.php
```

This will test:
- Public API endpoints
- Admin authentication
- Admin endpoints

**Note:** Update admin credentials in `test-api.php` before running:
```php
$loginData = [
    'username' => 'admin', // Your admin username
    'password' => 'admin123' // Your admin password
];
```

## Manual Testing with cURL

### Test Public Endpoints

**Get Documents:**
```bash
curl http://localhost:8000/api/documents
```

**Submit Enquiry:**
```bash
curl -X POST http://localhost:8000/api/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "1234567890",
    "email": "test@example.com",
    "subject": "Test"
  }'
```

### Test Admin Endpoints

**Login:**
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Save the sessionId from response, then:**

**Check Auth:**
```bash
curl http://localhost:8000/api/admin/check-auth \
  -H "x-session-id: YOUR_SESSION_ID_HERE"
```

**Get SMTP Config:**
```bash
curl http://localhost:8000/api/admin/smtp \
  -H "x-session-id: YOUR_SESSION_ID_HERE"
```

## Testing with Postman

1. **Import Collection:**
   - Create a new collection in Postman
   - Add requests for each endpoint

2. **Test Public Endpoints:**
   - Method: GET
   - URL: `http://localhost:8000/api/documents`
   - Should return 200 with JSON

3. **Test Admin Login:**
   - Method: POST
   - URL: `http://localhost:8000/api/admin/login`
   - Body (JSON):
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - Save `sessionId` from response

4. **Test Admin Endpoints:**
   - Add header: `x-session-id: YOUR_SESSION_ID`
   - Test various admin endpoints

## Testing with Browser DevTools

### Test from React Frontend

1. **Start PHP Backend:**
   ```bash
   php -S localhost:8000
   ```

2. **Start React Frontend** (if running locally):
   ```bash
   # In another terminal
   cd Website
   pnpm dev
   # Or configure vite to proxy API calls to localhost:8000
   ```

3. **Open Browser DevTools:**
   - Open Network tab
   - Use your React app
   - Check API calls go to `localhost:8000/api/*`

### Test API Directly in Browser

Open these URLs directly:
- `http://localhost:8000/api/documents`
- `http://localhost:8000/api/hero-images`
- `http://localhost:8000/api/gallery`

Should see JSON responses.

## Common Issues & Solutions

### Issue: "Route not found" (404)

**Solution:**
- Ensure you're accessing `http://localhost:8000/api/...` (with `/api/` prefix)
- Check `.htaccess` routing (not needed for PHP built-in server)
- Verify `api/index.php` exists

### Issue: Database Connection Error

**Solution:**
- Check `config/database.php` credentials
- Verify database exists
- Ensure MySQL is running
- Check user permissions

### Issue: "Class not found"

**Solution:**
- Check all files are in correct directories
- Verify `require_once` paths in `api/index.php`
- Ensure PHP can access all files

### Issue: File Upload Not Working

**Solution:**
- Create `uploads/` directory
- Set permissions: `chmod 755 uploads` (Linux/Mac)
- Check PHP `upload_max_filesize` in `php.ini`

## Testing Checklist

Before deploying to production:

- [ ] Setup test passes (`test-setup.php`)
- [ ] All public endpoints return valid JSON
- [ ] Admin login works
- [ ] Admin endpoints require authentication
- [ ] File uploads work (documents, images)
- [ ] Database queries work correctly
- [ ] Error handling works (try invalid requests)
- [ ] CORS headers are present
- [ ] Responses match expected format

## Next Steps

Once local testing passes:

1. Review `DEPLOYMENT.md` for production deployment
2. Test on Hostinger staging (if available)
3. Deploy to production
4. Test production endpoints
5. Configure SMTP for email

---

**Tip:** Use browser DevTools Network tab to see all API requests and responses in real-time!