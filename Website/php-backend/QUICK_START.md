# Quick Start Guide - PHP Backend

## 5-Minute Setup

### 1. Database Setup (2 minutes)

**Via phpMyAdmin:**
1. Login to Hostinger cPanel
2. Open phpMyAdmin
3. Select/create your database
4. Click "Import"
5. Upload `database/schema.sql`
6. Click "Go"

### 2. Configuration (1 minute)

Edit `config/database.php`:
```php
'dbname' => 'your_database_name',
'username' => 'your_mysql_username',
'password' => 'your_mysql_password',
```

Edit `config/app.php`:
```php
'admin_username' => 'admin',
'admin_password_hash' => password_hash('your_secure_password', PASSWORD_BCRYPT),
```

**Generate password hash:**
```bash
php -r "echo password_hash('your_password', PASSWORD_BCRYPT);"
```

### 3. Upload Files (1 minute)

Upload entire `php-backend/` folder contents to `public_html/`:
- All PHP files
- `.htaccess` file
- Create `uploads/` directory with subdirectories:
  - `uploads/documents/`
  - `uploads/hero/`
- Set permissions: 755 for directories

### 4. Test (1 minute)

**Test API:**
```
https://yourdomain.com/api/documents
```
Should return JSON with documents array.

**Test Admin:**
1. Visit: `https://yourdomain.com/backend`
2. Login with credentials from step 2

## That's It! 🎉

Your PHP backend is now running. The React frontend will automatically use it because:
- All endpoints match (`/api/*`)
- `.htaccess` routes to PHP backend
- Response formats are identical

## Next Steps

1. **Configure Email (Optional):**
   - Login to admin panel
   - Go to SMTP Settings
   - Enter your email configuration
   - Test connection

2. **Upload Documents:**
   - Login to admin panel
   - Go to Documents
   - Upload PDF files or set links

3. **Upload Hero Images:**
   - Go to Hero Images section
   - Upload images for homepage slider

## Troubleshooting

**404 Errors:**
- Check `.htaccess` is in root
- Verify `mod_rewrite` is enabled (contact Hostinger)

**Database Errors:**
- Verify credentials in `config/database.php`
- Check database exists in phpMyAdmin

**File Upload Errors:**
- Check `uploads/` directory exists
- Verify permissions (755 or 777)
- Check PHP upload limits in cPanel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.