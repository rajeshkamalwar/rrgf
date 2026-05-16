# RRGF Website - Hostinger Deployment Package

This package contains all files needed to deploy the website to Hostinger shared hosting.

## 📁 Folder Structure

**IMPORTANT**: Hostinger shared hosting only has `public_html/` directory. Everything goes inside it!

```
DEPLOYMENT_PACKAGE/
├── public_html/          # ✅ Upload ALL contents to Hostinger public_html/
│   ├── index.html        # React build entry point
│   ├── assets/           # React JS & CSS
│   ├── documents/        # PDF documents
│   ├── gallery/          # Gallery images
│   ├── images/           # Hero images
│   ├── php-backend/      # PHP backend (inside public_html!)
│   └── .htaccess         # Apache routing configuration
└── database/             # SQL schema files (import via phpMyAdmin)
```

## 🚀 Quick Deployment Steps

### 1. Upload Files
- Upload `php-backend/` folder to your hosting root (or a subdirectory like `api/`)
- Upload contents of `public_html/` to `public_html/` on Hostinger
- Ensure `.htaccess` files are uploaded

### 2. Database Setup
- Go to phpMyAdmin in Hostinger cPanel
- Create database: `rrgf`
- Import: `database/schema.sql`
- Configure database credentials in `php-backend/config/database.php`

### 3. Configure Environment
- Update `php-backend/config/database.php` with your Hostinger database credentials
- Update `php-backend/config/app.php` if needed
- Configure SMTP settings via Admin Panel after deployment

### 4. Test
- Visit your domain
- Test admin login: `/backend`
- Test API endpoints
- Test email sending

## ⚠️ Important Notes

- **PHP Version**: Requires PHP 7.4+ (check in Hostinger cPanel)
- **MySQL**: Ensure MySQL/MariaDB is available
- **File Permissions**: Set uploads folder to 755 or 777
- **.htaccess**: Ensure mod_rewrite is enabled

For detailed instructions, see `DEPLOYMENT_STEPS.md`
