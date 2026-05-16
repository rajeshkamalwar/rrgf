# Quick Deployment Guide for Hostinger

**IMPORTANT**: Hostinger shared hosting only has `public_html/` directory. Everything goes inside it!

## 📦 Pre-Deployment Checklist

- [ ] ✅ All files are already prepared in `DEPLOYMENT_PACKAGE/public_html/`
- [ ] Update `public_html/php-backend/config/database.php` with Hostinger credentials
- [ ] Have Hostinger database credentials ready

---

## 🚀 Deployment Steps (Quick Version)

### Step 1: Update Database Config
Edit `public_html/php-backend/config/database.php`:

```php
return [
    'host' => 'localhost',
    'dbname' => 'u123456789_rrgf',  // Your Hostinger database name (usually starts with 'u')
    'username' => 'u123456789_dbuser',  // Your Hostinger database username
    'password' => 'your_password_here',  // Your Hostinger database password
    // ...
];
```

### Step 2: Upload to Hostinger

**IMPORTANT**: Upload ALL contents of `DEPLOYMENT_PACKAGE/public_html/` to Hostinger's `public_html/`

**Via File Manager:**
1. Log into Hostinger cPanel
2. Open File Manager
3. Navigate to `public_html/`
4. Delete existing files (backup first if needed)
5. Upload ALL contents from `DEPLOYMENT_PACKAGE/public_html/` to `public_html/`

**Via FTP:**
1. Connect via FTP
2. Navigate to `/public_html/`
3. Upload ALL contents from `DEPLOYMENT_PACKAGE/public_html/` folder

### Step 3: Setup Database
1. Go to phpMyAdmin in Hostinger cPanel
2. Create database (usually named like `u123456789_rrgf`)
3. Import `DEPLOYMENT_PACKAGE/database/schema.sql`
4. Verify all tables are created

### Step 4: Set Permissions
1. Set `public_html/php-backend/uploads/` to **755** or **777**
2. Verify `.htaccess` file exists in `public_html/` root

### Step 5: Test
1. Visit: `https://yourdomain.com`
2. Test API: `https://yourdomain.com/api/documents` (should return JSON)
3. Test Admin: `https://yourdomain.com/backend`
4. Login: admin / admin123 (change immediately!)
5. Test forms and email sending

---

## 📁 Final File Structure on Hostinger

**Everything is inside `public_html/`:**

```
public_html/              # Website root (only directory on Hostinger)
├── index.html            # React build
├── assets/               # React build assets
├── documents/            # PDF documents
├── gallery/              # Gallery images
├── images/               # Hero images, etc.
├── php-backend/          # PHP backend (inside public_html!)
│   ├── api/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   └── uploads/          # Set permissions to 755/777
└── .htaccess             # Apache config
```

---

## ⚠️ Important Notes

1. **Database Credentials**: Must be updated before testing
2. **Admin Password**: Change from default immediately after first login
3. **PHPMailer**: Install for email functionality (see `INSTALL_PHPMAILER.md`)
4. **SSL**: Enable free SSL certificate in Hostinger cPanel
5. **File Permissions**: Ensure uploads folder is writable (755/777)

---

## 🔧 Troubleshooting

**API returns 404:**
- Check `.htaccess` exists and mod_rewrite is enabled
- Verify PHP backend path in `.htaccess` matches actual location

**Database connection fails:**
- Verify credentials in `database.php`
- Check database name, username, password
- Ensure user has proper permissions

**Emails not sending:**
- Install PHPMailer (required)
- Check SMTP settings in Admin Panel
- Verify credentials are correct

---

For detailed instructions, see `DEPLOYMENT_STEPS.md`
