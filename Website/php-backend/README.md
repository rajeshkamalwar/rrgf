# RRGF School PHP Backend

Production-ready PHP backend for RRGF School website, designed for Hostinger shared hosting.

## Overview

This is a complete PHP backend replacement for the Node.js/Express backend. It provides:
- ✅ All API endpoints matching the original backend
- ✅ MySQL database integration
- ✅ Session-based authentication
- ✅ File upload handling
- ✅ Email (SMTP) support
- ✅ Clean MVC architecture
- ✅ Shared hosting compatible

## Requirements

- PHP 7.4+ (PHP 8.x recommended)
- MySQL 5.7+ or MariaDB 10.3+
- Apache with mod_rewrite enabled
- PDO extension enabled

## Quick Start

1. **Install Database Schema:**
   ```bash
   # Import schema.sql into your MySQL database via phpMyAdmin
   mysql -u username -p database_name < database/schema.sql
   ```

2. **Configure Database:**
   - Edit `config/database.php` with your MySQL credentials
   - Or set environment variables (if supported by hosting)

3. **Configure Admin:**
   - Edit `config/app.php`
   - Change `admin_username` and generate `admin_password_hash`
   - Generate hash: `php -r "echo password_hash('your_password', PASSWORD_BCRYPT);"`

4. **Upload to Server:**
   - Upload all files to your `public_html/` directory
   - Ensure `.htaccess` is in root
   - Create `uploads/` directory with 755 permissions

5. **Test:**
   - Visit `/api/documents` - should return JSON
   - Test admin login at `/backend` page

## Project Structure

```
php-backend/
├── api/
│   └── index.php              # Main API router
├── config/
│   ├── database.php           # Database configuration
│   └── app.php                # Application configuration
├── controllers/
│   ├── PublicController.php   # Public API endpoints
│   └── AdminController.php    # Admin API endpoints
├── services/
│   ├── Database.php           # PDO database wrapper
│   └── EmailService.php       # Email/SMTP service
├── middleware/
│   └── Auth.php               # Authentication middleware
├── utils/
│   ├── Response.php           # Response utilities
│   └── FileUpload.php         # File upload handler
├── database/
│   └── schema.sql             # Database schema
├── uploads/                   # Upload directory (create this)
│   ├── documents/             # PDF uploads
│   └── hero/                  # Hero image uploads
├── .htaccess                  # Apache configuration
├── DEPLOYMENT.md              # Deployment guide
├── API_MAPPING.md             # API endpoint documentation
└── README.md                  # This file
```

## Configuration

### Database Configuration

Edit `config/database.php`:
```php
return [
    'host' => 'localhost',
    'dbname' => 'your_database',
    'username' => 'your_username',
    'password' => 'your_password',
    'charset' => 'utf8mb4',
];
```

### Application Configuration

Edit `config/app.php`:
```php
return [
    'admin_username' => 'admin',
    'admin_password_hash' => password_hash('your_password', PASSWORD_BCRYPT),
    'session_lifetime' => 86400, // 24 hours
    'upload_dir' => __DIR__ . '/../uploads/',
    'upload_url' => '/uploads/',
    'max_file_size' => 5 * 1024 * 1024, // 5MB
];
```

## API Endpoints

See [API_MAPPING.md](./API_MAPPING.md) for complete endpoint documentation.

### Public Endpoints
- `POST /api/enquiry` - Submit enquiry
- `POST /api/contact` - Submit contact form
- `POST /api/admissions` - Submit admission application
- `POST /api/visit-schedule` - Schedule visit
- `GET /api/documents` - Get documents
- `GET /api/hero-images` - Get hero images
- `GET /api/gallery` - Get gallery images

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/check-auth` - Check auth status
- `POST /api/admin/logout` - Logout
- `GET/PUT /api/admin/smtp` - SMTP configuration
- `PUT /api/admin/documents/:id` - Update document
- `GET/POST/DELETE /api/admin/hero-images` - Hero images management
- `GET/PUT /api/admin/gallery/*` - Gallery management

## Security Features

- ✅ Session-based authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (PDO prepared statements)
- ✅ File upload validation
- ✅ CORS headers
- ✅ Security headers in .htaccess
- ✅ Error logging (no sensitive data exposed)

## Email Configuration

The backend supports email via:
1. **PHP mail()** - Basic, works on most shared hosting
2. **PHPMailer** - Optional, for better SMTP support

Configure SMTP in admin panel (`/backend` → SMTP Settings):
- Host: `smtp.hostinger.com` or `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Username: Your email address
- Password: Email password or app-specific password
- From/To: Email addresses

## File Uploads

- **Documents:** PDF files → `/uploads/documents/`
- **Hero Images:** Images (JPEG, PNG, WebP) → `/uploads/hero/`
- **Max Size:** 5MB (configurable)
- **Validation:** MIME type checking

## Database Schema

See `database/schema.sql` for complete schema. Main tables:
- `enquiries` - Enquiry submissions
- `contacts` - Contact form submissions
- `admissions` - Admission applications
- `visit_schedules` - Visit requests
- `documents` - Mandatory disclosure documents
- `hero_images` - Hero slider images
- `gallery_images` - Gallery images
- `smtp_config` - Email configuration
- `admin_sessions` - Admin sessions

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick checklist:
1. ✅ Create MySQL database
2. ✅ Import schema.sql
3. ✅ Update config files
4. ✅ Upload files to server
5. ✅ Create uploads directory
6. ✅ Set proper permissions
7. ✅ Test API endpoints
8. ✅ Configure SMTP (optional)

## Troubleshooting

### API Returns 404
- Check `.htaccess` is in root
- Verify `mod_rewrite` is enabled
- Check file paths

### Database Connection Error
- Verify credentials in `config/database.php`
- Check database exists
- Verify MySQL user permissions

### File Upload Fails
- Check `uploads/` directory exists
- Verify directory permissions (755 or 777)
- Check PHP upload limits

### Email Not Sending
- Verify SMTP credentials
- Check PHP `mail()` is enabled
- Try PHPMailer for better support

## Development

For local development:

1. **Install PHP:**
   ```bash
   # macOS
   brew install php
   
   # Linux
   sudo apt install php php-mysql
   ```

2. **Start PHP built-in server:**
   ```bash
   cd php-backend
   php -S localhost:8000
   ```

3. **Test endpoints:**
   ```bash
   curl http://localhost:8000/api/documents
   ```

## Compatibility

✅ **Hostinger Shared Hosting** - Fully compatible
✅ **cPanel** - Compatible
✅ **Apache** - Required (mod_rewrite)
✅ **MySQL/MariaDB** - Compatible
✅ **PHP 7.4+** - Required

## Frontend Integration

**No frontend changes needed!** The React frontend will work as-is because:
- All API endpoints match exactly
- Response formats are identical
- Authentication uses same session token mechanism
- CORS is enabled

The frontend continues to make requests to `/api/*`, and `.htaccess` routes them to the PHP backend.

## License

This backend is part of the RRGF School website project.

## Support

For issues or questions:
1. Check deployment guide
2. Review API mapping documentation
3. Check PHP error logs
4. Verify configuration files

---

**Note:** This backend is production-ready and designed specifically for shared hosting environments where Node.js is not available.