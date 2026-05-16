# PHP Backend Deployment Guide for Hostinger Shared Hosting

This guide will help you deploy the PHP backend to replace your Node.js backend on Hostinger shared hosting.

## Prerequisites

1. Hostinger shared hosting account with PHP 7.4+ and MySQL
2. Access to cPanel (or similar hosting control panel)
3. MySQL database credentials from Hostinger
4. FTP/File Manager access to upload files

## Step 1: Database Setup

1. **Create MySQL Database:**
   - Log in to Hostinger cPanel
   - Go to "MySQL Databases"
   - Create a new database (e.g., `u123456789_rrgf_school`)
   - Create a new MySQL user and assign it to the database
   - Note down: database name, username, password, and host (usually `localhost`)

2. **Import Database Schema:**
   - Go to phpMyAdmin in cPanel
   - Select your database
   - Click "Import" tab
   - Choose `database/schema.sql` file
   - Click "Go" to import

## Step 2: Configure Backend

1. **Update Database Configuration:**
   - Edit `config/database.php` or create `.env` file (if supported)
   - Update with your Hostinger MySQL credentials:
   ```php
   'host' => 'localhost', // Usually localhost on Hostinger
   'dbname' => 'u123456789_rrgf_school', // Your database name
   'username' => 'u123456789_dbuser', // Your MySQL username
   'password' => 'your_password_here', // Your MySQL password
   ```

2. **Update Admin Credentials:**
   - Edit `config/app.php`
   - Change `admin_username` if needed
   - Generate a new password hash:
   ```php
   // Generate hash: echo password_hash('your_new_password', PASSWORD_BCRYPT);
   'admin_password_hash' => '$2y$10$...your_hash_here...',
   ```

## Step 3: Upload Files to Hostinger

1. **Upload Backend Files:**
   - Use FTP client (FileZilla, etc.) or cPanel File Manager
   - Upload all files from `php-backend/` to your `public_html/` directory
   - Structure should be:
   ```
   public_html/
   ├── api/
   │   └── index.php
   ├── config/
   ├── controllers/
   ├── services/
   ├── middleware/
   ├── utils/
   ├── uploads/
   │   ├── documents/
   │   └── hero/
   ├── .htaccess
   └── (other files)
   ```

2. **Create Uploads Directory:**
   - Create `uploads/` directory in `public_html/`
   - Create subdirectories: `uploads/documents/` and `uploads/hero/`
   - Set permissions to 755 (or 777 if 755 doesn't work)

3. **Upload React Frontend:**
   - Build your React app: `pnpm build` or `npm run build`
   - Upload contents of `dist/` or `build/` to `public_html/`
   - Ensure `index.html` is in `public_html/`

4. **Upload Documents:**
   - Copy PDF documents from `Website/documents/` to `public_html/uploads/documents/` (if you want them accessible)

## Step 4: Configure .htaccess

The `.htaccess` file is already configured, but verify:
- It's in your `public_html/` root directory
- RewriteEngine is enabled (check with hosting support if routes don't work)
- API routes point to `api/index.php`

## Step 5: Verify Installation

1. **Test Database Connection:**
   - Visit: `https://yourdomain.com/api/documents` (should return JSON)
   - If you see JSON data, database is connected

2. **Test Frontend:**
   - Visit: `https://yourdomain.com`
   - React app should load

3. **Test Admin Login:**
   - Visit: `https://yourdomain.com/backend` (or your admin route)
   - Login with credentials set in `config/app.php`

## Step 6: API Endpoint Mapping

Your React frontend will automatically use the PHP backend because:

- Frontend makes requests to `/api/*`
- `.htaccess` routes `/api/*` to `api/index.php`
- PHP backend handles all routes

**No frontend changes needed!** The API responses match the original Node.js backend format.

## Step 7: Email Configuration (Optional but Recommended)

For better email delivery on shared hosting, consider:

1. **Use Hostinger's SMTP:**
   - Go to cPanel → Email Accounts
   - Create or use existing email account
   - Use these SMTP settings:
     - Host: `smtp.hostinger.com`
     - Port: `587`
     - Username: `your-email@yourdomain.com`
     - Password: Your email password
     - Encryption: TLS

2. **Or Use Gmail SMTP:**
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: Your Gmail address
   - Password: App-specific password (not regular password)
   - Encryption: TLS

3. **Configure in Admin Panel:**
   - Login to `/backend` admin panel
   - Go to SMTP Settings
   - Enter your SMTP configuration
   - Test connection

## Troubleshooting

### API Returns 404
- Check `.htaccess` is in root directory
- Verify `mod_rewrite` is enabled (contact Hostinger support)
- Check file paths are correct

### Database Connection Error
- Verify database credentials in `config/database.php`
- Check database exists in phpMyAdmin
- Ensure MySQL user has proper permissions

### File Upload Errors
- Check `uploads/` directory exists and is writable (755 or 777)
- Verify `upload_max_filesize` in PHP settings (via cPanel)
- Check file size limits in `config/app.php`

### Email Not Sending
- Verify SMTP credentials in admin panel
- Check PHP `mail()` function is enabled (contact support)
- For better results, install PHPMailer (optional - see below)

## Optional: Install PHPMailer for Better Email

1. Download PHPMailer:
   - Download from: https://github.com/PHPMailer/PHPMailer
   - Extract to `php-backend/vendor/PHPMailer/`

2. Update `EmailService.php`:
   - Uncomment PHPMailer code (already included)
   - Ensure autoload path is correct

## Security Checklist

- [ ] Change default admin password
- [ ] Set proper file permissions (755 for directories, 644 for files)
- [ ] Remove or protect `.env` file if used
- [ ] Enable HTTPS/SSL certificate
- [ ] Regularly backup database via cPanel
- [ ] Keep PHP version updated
- [ ] Review error logs regularly

## File Structure Reference

```
public_html/ (or your root directory)
├── .htaccess                          # Apache configuration
├── index.html                          # React app entry
├── assets/                             # React build assets
├── api/
│   └── index.php                      # API router
├── config/
│   ├── database.php                   # Database config
│   └── app.php                        # App config
├── controllers/
│   ├── PublicController.php           # Public API endpoints
│   └── AdminController.php            # Admin API endpoints
├── services/
│   ├── Database.php                   # Database service
│   └── EmailService.php               # Email service
├── middleware/
│   └── Auth.php                       # Authentication
├── utils/
│   ├── Response.php                   # Response utilities
│   └── FileUpload.php                 # File upload handler
└── uploads/
    ├── documents/                     # PDF uploads
    └── hero/                          # Hero image uploads
```

## Support

If you encounter issues:
1. Check PHP error logs in cPanel
2. Enable error display temporarily in `api/index.php`
3. Verify all file paths are correct
4. Contact Hostinger support for server-related issues

## Migration Checklist

- [ ] Database schema imported
- [ ] Database credentials configured
- [ ] Admin password changed
- [ ] Files uploaded to server
- [ ] Uploads directory created with proper permissions
- [ ] `.htaccess` configured
- [ ] Frontend build uploaded
- [ ] API endpoints tested
- [ ] Admin login tested
- [ ] File uploads tested
- [ ] Email configuration tested
- [ ] SSL/HTTPS enabled (recommended)

---

**Important Notes:**
- This backend is a drop-in replacement - no frontend changes needed
- All API responses match the original Node.js backend format
- Session-based authentication is used (compatible with React frontend)
- File uploads are stored in `uploads/` directory
- Database stores all form submissions, configurations, and media references