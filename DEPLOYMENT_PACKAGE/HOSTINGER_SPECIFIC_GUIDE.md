# Hostinger Shared Hosting Deployment Guide

## Important: Hostinger Structure

Hostinger shared hosting **only has `public_html/` directory**. Everything must go inside it!

## 📁 Correct File Structure for Hostinger

```
public_html/                    (Everything goes here!)
├── index.html                  (React build - entry point)
├── assets/                     (React JS & CSS)
├── documents/                  (PDF documents)
├── gallery/                    (Gallery images)
├── images/                     (Hero images, etc.)
├── php-backend/                (PHP backend - inside public_html!)
│   ├── api/
│   │   └── index.php
│   ├── config/
│   │   └── database.php       (⚠️ Update credentials here)
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── uploads/                (Set permissions to 755/777)
├── .htaccess                   (Routes /api/* to php-backend/)
└── robots.txt
```

---

## 🚀 Deployment Steps for Hostinger

### Step 1: Prepare Files Locally

1. ✅ All files are already prepared in `DEPLOYMENT_PACKAGE/public_html/`
2. ✅ PHP backend is already copied inside `public_html/php-backend/`
3. ✅ React build files are in `public_html/`
4. ✅ All assets (documents, gallery, images) are in `public_html/`

### Step 2: Update Database Configuration

Edit `public_html/php-backend/config/database.php`:

```php
return [
    'host' => 'localhost',  // Usually 'localhost' on Hostinger
    'dbname' => 'u123456789_rrgf',  // Your Hostinger database name (usually starts with 'u')
    'username' => 'u123456789_dbuser',  // Your Hostinger database username
    'password' => 'your_password_here',  // Your Hostinger database password
    // ...
];
```

**Note**: Hostinger database names and usernames usually start with `u` followed by numbers.

### Step 3: Upload Everything to public_html/

**Via File Manager:**
1. Log into Hostinger cPanel
2. Open **File Manager**
3. Navigate to `public_html/`
4. **Delete any existing files** (or backup first)
5. Upload **ALL contents** from `DEPLOYMENT_PACKAGE/public_html/` to `public_html/`

**Via FTP:**
1. Connect via FTP (use Hostinger FTP credentials)
2. Navigate to `/public_html/`
3. Upload all files and folders from `DEPLOYMENT_PACKAGE/public_html/`

### Step 4: Set File Permissions

1. Set `php-backend/uploads/` to **755** or **777**
2. Verify `.htaccess` file exists and is readable

### Step 5: Database Setup

1. Go to **phpMyAdmin** in Hostinger cPanel
2. Create database (if not exists): Usually named like `u123456789_rrgf`
3. Import `database/schema.sql`:
   - Select your database
   - Click **Import** tab
   - Choose `schema.sql` file
   - Click **Go**

### Step 6: Test

1. Visit: `https://yourdomain.com`
2. Test API: `https://yourdomain.com/api/documents` (should return JSON)
3. Test Admin: `https://yourdomain.com/backend`
4. Login: admin / admin123 (change immediately!)

---

## ⚙️ How It Works

The `.htaccess` file routes requests:

- `/api/*` → `/php-backend/api/index.php`
- All other requests → `/index.html` (React Router handles)

Example:
- `https://yourdomain.com/api/documents` → `public_html/php-backend/api/index.php`
- `https://yourdomain.com/gallery` → `public_html/index.html` (React shows Gallery page)

---

## ⚠️ Important Notes

1. **All files must be inside `public_html/`** - This is the only directory Hostinger serves
2. **PHP backend is inside `public_html/php-backend/`** - Not in root directory
3. **Database credentials** - Usually start with `u` prefix on Hostinger
4. **File permissions** - Set `uploads/` folder to 755 or 777
5. **.htaccess** - Already configured correctly in the package

---

## 🔧 Troubleshooting

### API returns 404
- Check `.htaccess` exists in `public_html/`
- Verify mod_rewrite is enabled (contact Hostinger support if needed)
- Check PHP backend path in `.htaccess` is correct

### Database connection fails
- Verify credentials in `public_html/php-backend/config/database.php`
- Check database name format (usually `u123456789_databasename`)
- Ensure database user has ALL PRIVILEGES

### Files not accessible
- Check file paths are correct
- Verify files are actually uploaded
- Check file permissions (should be 644 for files, 755 for folders)

---

## ✅ Quick Checklist

- [ ] Updated `public_html/php-backend/config/database.php` with Hostinger credentials
- [ ] Uploaded all contents of `DEPLOYMENT_PACKAGE/public_html/` to Hostinger `public_html/`
- [ ] Set `php-backend/uploads/` permissions to 755/777
- [ ] Imported `database/schema.sql` via phpMyAdmin
- [ ] Tested homepage loads
- [ ] Tested API endpoints work
- [ ] Tested admin panel login
- [ ] Changed admin password from default

---

✅ **Your website is now deployed on Hostinger!**
