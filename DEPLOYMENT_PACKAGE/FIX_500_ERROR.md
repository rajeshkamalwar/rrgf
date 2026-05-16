# Fix 500 Error on API Endpoints

## Problem
The API endpoints `/api/documents` and `/api/hero-images` are returning 500 errors on the deployed website.

## Most Likely Causes

### 1. Database Connection Failure (Most Common)
The database credentials in `public_html/php-backend/config/database.php` are not set correctly for Hostinger.

**Solution:**
1. Log into Hostinger cPanel
2. Go to **MySQL Databases**
3. Note your database credentials:
   - Database name (usually starts with `u` like `u123456789_rrgf`)
   - Database username (usually starts with `u` like `u123456789_dbuser`)
   - Database password
   - Host (usually `localhost`)

4. Edit `public_html/php-backend/config/database.php`:
```php
return [
    'host' => 'localhost',  // Usually 'localhost' on Hostinger
    'dbname' => 'u123456789_rrgf',  // Your actual database name
    'username' => 'u123456789_dbuser',  // Your actual username
    'password' => 'your_actual_password_here',  // Your actual password
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];
```

### 2. Database Tables Don't Exist
The database might not have the required tables.

**Solution:**
1. Go to phpMyAdmin in Hostinger cPanel
2. Select your database
3. Import the schema: `DEPLOYMENT_PACKAGE/database/schema.sql`
4. Verify tables exist:
   - `documents`
   - `hero_images`
   - `gallery_images`
   - `contacts`
   - `enquiries`
   - `admissions`
   - `visit_schedules`
   - `admin_sessions`
   - `smtp_config`

### 3. PHP Error Logging
Check Hostinger error logs to see the actual error.

**Solution:**
1. In Hostinger cPanel, go to **Error Log**
2. Look for recent errors related to `/api/documents` or `/api/hero-images`
3. The error message will tell you exactly what's wrong

## Diagnostic Steps

### Step 1: Test Database Connection
Visit: `https://rrgreenfieldmadhepura.in/php-backend/test/database-test.php`

This will show:
- ✅ If database connection works
- ✅ Which tables exist
- ✅ What the error is (if any)

### Step 2: Check PHP Error Logs
1. In Hostinger cPanel → **Error Log**
2. Look for errors around the time you accessed the API
3. Common errors:
   - "Access denied for user" → Wrong username/password
   - "Unknown database" → Wrong database name
   - "Table doesn't exist" → Need to import schema.sql

### Step 3: Verify File Permissions
1. Check that `php-backend/config/database.php` is readable (644)
2. Check that `php-backend/api/index.php` is executable (644)

### Step 4: Test API Directly
Try accessing:
- `https://rrgreenfieldmadhepura.in/api/documents`
- `https://rrgreenfieldmadhepura.in/api/hero-images`

If you see JSON error response, that's good - it means PHP is working, just database issue.
If you see 500 error page, check error logs.

## Quick Fix Checklist

- [ ] Database credentials updated in `php-backend/config/database.php`
- [ ] Database schema imported via phpMyAdmin
- [ ] Database user has ALL PRIVILEGES
- [ ] File permissions correct (644 for files, 755 for folders)
- [ ] PHP version is 7.4+ (check in Hostinger cPanel)
- [ ] Error logs checked for specific error message

## Common Hostinger Database Format

On Hostinger, database names and usernames usually follow this format:
- Database: `u123456789_rrgf` (where `u123456789` is your account prefix)
- Username: `u123456789_dbuser`
- Host: `localhost`
- Password: (your chosen password)

## After Fixing

1. Test the diagnostic page: `https://rrgreenfieldmadhepura.in/php-backend/test/database-test.php`
2. Test API endpoints:
   - `https://rrgreenfieldmadhepura.in/api/documents`
   - `https://rrgreenfieldmadhepura.in/api/hero-images`
3. Test the Mandatory Disclosure page: `https://rrgreenfieldmadhepura.in/mandatory-disclosure`

## Security Note

After fixing, **DELETE** the test file:
- `public_html/php-backend/test/database-test.php`

This file exposes database configuration and should not be accessible publicly.

