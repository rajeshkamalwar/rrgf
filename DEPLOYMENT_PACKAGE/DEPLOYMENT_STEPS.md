# Hostinger Deployment Steps

Follow these steps to deploy the RRGF website to Hostinger shared hosting.

**IMPORTANT**: Hostinger shared hosting only has `public_html/` directory. Everything must go inside it!

## Prerequisites

1. Hostinger hosting account with cPanel access
2. FTP/File Manager access
3. phpMyAdmin access for database setup
4. Domain name configured

---

## Step 1: Database Setup

### 1.1 Create Database
1. Log into Hostinger cPanel
2. Go to **MySQL Databases**
3. Create a new database (name format: `u123456789_rrgf`)
4. Create a new MySQL user (format: `u123456789_dbuser`)
5. Add the user to the database with ALL PRIVILEGES
6. Note down: database name, username, password, and host (usually `localhost`)

### 1.2 Import Database Schema
1. Go to **phpMyAdmin** in cPanel
2. Select your database
3. Click **Import** tab
4. Choose file: `database/schema.sql`
5. Click **Go**

✅ Database is now set up with all required tables.

---

## Step 2: Update Database Configuration

1. **Before uploading**, edit: `public_html/php-backend/config/database.php`
2. Update with your Hostinger database credentials:
   ```php
   return [
       'host' => 'localhost',
       'dbname' => 'u123456789_rrgf',  // Your Hostinger database name
       'username' => 'u123456789_dbuser',  // Your Hostinger username
       'password' => 'your_password_here',  // Your password
       // ...
   ];
   ```
3. Save the file

---

## Step 3: Upload Files to Hostinger

**IMPORTANT**: Everything goes inside `public_html/`!

### 3.1 Via File Manager (Recommended)
1. Log into Hostinger cPanel
2. Open **File Manager**
3. Navigate to `public_html/`
4. **Delete existing files** (backup first if needed)
5. Upload **ALL contents** from `DEPLOYMENT_PACKAGE/public_html/` folder to `public_html/`

### 3.2 Via FTP
1. Connect via FTP using Hostinger FTP credentials
2. Navigate to `/public_html/`
3. Upload all files and folders from `DEPLOYMENT_PACKAGE/public_html/`

**Upload structure should be:**
```
public_html/
├── index.html
├── assets/
├── documents/
├── gallery/
├── images/
├── php-backend/        ← PHP backend goes here!
└── .htaccess
```

---

## Step 4: Set File Permissions

1. In File Manager, navigate to `public_html/php-backend/uploads/`
2. Right-click → **Change Permissions**
3. Set to **755** (or **777** if 755 doesn't work)
4. Ensure `.htaccess` file exists in `public_html/` root

---

## Step 5: Configure PHP Settings (if needed)

### 5.1 Check PHP Version
1. In Hostinger cPanel, go to **PHP Version**
2. Ensure PHP 7.4 or higher is selected (recommended: PHP 8.0 or 8.1)

### 5.2 Enable Required Extensions
Ensure these PHP extensions are enabled:
- `pdo_mysql`
- `curl`
- `openssl`
- `mbstring`
- `json`

---

## Step 6: Install PHPMailer (for email functionality)

PHPMailer is required for email sending. Install via one of these methods:

### Option A: Via Composer (if available on Hostinger)
```bash
cd public_html/php-backend
composer require phpmailer/phpmailer
```

### Option B: Manual Installation
1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer/releases
2. Extract to: `public_html/php-backend/vendor/PHPMailer/PHPMailer/`
3. Update autoloader in `EmailService.php` if needed

**Note**: Without PHPMailer, emails won't work. See `php-backend/INSTALL_PHPMAILER.md` for details.

---

## Step 7: Initial Configuration

### 7.1 Access Admin Panel
1. Visit: `https://yourdomain.com/backend`
2. Login with default credentials (change immediately after first login)
   - Username: `admin`
   - Password: `admin123`

### 7.2 Configure SMTP Settings
1. Go to **Admin Panel → SMTP Settings**
2. Current defaults:
   - **To emails**: `rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com`
   - **Password**: `Welcome@2050@##`
3. Verify and update if needed
4. Test email sending

### 7.3 Configure Graph API (optional, for gallery auto-fetch)
1. Go to **Admin Panel → Graph API**
2. Enter Azure credentials if you want automatic image fetching
3. See `php-backend/GRAPH_API_SETUP.md` for instructions

---

## Step 8: Test Everything

### 8.1 Test Public Pages
- [ ] Homepage loads: `https://yourdomain.com`
- [ ] Gallery page works: `https://yourdomain.com/gallery`
- [ ] Mandatory Disclosure page works: `https://yourdomain.com/mandatory-disclosure`
- [ ] Contact page works
- [ ] Admissions page works

### 8.2 Test API
- [ ] API returns JSON: `https://yourdomain.com/api/documents`
- [ ] API routes work correctly

### 8.3 Test Forms
- [ ] Enquiry form submits
- [ ] Contact form submits
- [ ] Admission form submits
- [ ] Visit schedule form submits
- [ ] Check emails arrive at both Gmail addresses

### 8.4 Test Admin Panel
- [ ] Can login
- [ ] Can view/edit documents
- [ ] Can manage gallery images
- [ ] Can upload hero images
- [ ] SMTP test works
- [ ] Email sending works

---

## Step 9: Security Checklist

- [ ] Change admin password from default
- [ ] Ensure `.htaccess` is working (prevents direct file access)
- [ ] Check file permissions (755 for folders, 644 for files)
- [ ] Verify database credentials are secure
- [ ] Remove test files if any
- [ ] Enable HTTPS/SSL certificate (free via Hostinger)
- [ ] Set proper error reporting (disable display_errors in production)

---

## Troubleshooting

### API endpoints return 404
- Check `.htaccess` file exists in `public_html/` root
- Verify mod_rewrite is enabled (check with hosting support if routes don't work)
- Check PHP backend path in `.htaccess` matches actual location (`/php-backend/api/index.php`)

### Database connection errors
- Verify database credentials in `public_html/php-backend/config/database.php`
- Check database name format (usually starts with `u` on Hostinger)
- Ensure database user has proper permissions
- Verify database name, username, and password are correct

### Images/Documents not loading
- Check file paths are correct
- Verify files are uploaded to correct locations
- Check file permissions (should be readable: 644)

### Emails not sending
- Install PHPMailer (see Step 6)
- Verify SMTP credentials in Admin Panel
- Check email logs in Hostinger cPanel
- Test SMTP connection via Admin Panel

### React Router not working (404 on page refresh)
- Ensure `.htaccess` rewrite rules are correct
- Check that `index.html` is served for all routes
- Verify mod_rewrite is enabled on server

---

## Post-Deployment

1. **Change Admin Password**: Immediately change from default
2. **Set up SSL**: Enable free SSL certificate in Hostinger
3. **Test Email**: Send test emails to verify delivery
4. **Monitor Logs**: Check error logs regularly
5. **Backup**: Set up regular backups (Hostinger usually provides this)

---

## Support Files

- `HOSTINGER_SPECIFIC_GUIDE.md` - This guide optimized for Hostinger
- `QUICK_DEPLOYMENT_GUIDE.md` - Quick reference
- `DEPLOYMENT_CHECKLIST.md` - Checklist for deployment
- `php-backend/INSTALL_PHPMAILER.md` - PHPMailer installation guide
- `php-backend/GRAPH_API_SETUP.md` - Graph API setup (optional)
- `database/schema.sql` - Database schema

---

## Important Notes

⚠️ **Before going live:**
- Change default admin password
- Remove or secure test files
- Enable SSL/HTTPS
- Set proper error reporting (hide errors from users)
- Test all forms and functionality
- Backup database regularly

✅ **Your website is now deployed on Hostinger!**
