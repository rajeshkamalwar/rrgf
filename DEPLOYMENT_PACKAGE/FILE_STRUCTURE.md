# Expected File Structure on Hostinger

After deployment, your Hostinger hosting should have this structure:

```
/                          (Hosting root)
├── php-backend/           # PHP backend folder
│   ├── api/
│   │   ├── index.php      # Main API router
│   │   └── image-proxy.php
│   ├── config/
│   │   ├── app.php
│   │   └── database.php   # ⚠️ Update credentials here
│   ├── controllers/
│   │   ├── AdminController.php
│   │   ├── FolderController.php
│   │   └── PublicController.php
│   ├── services/
│   │   ├── Database.php
│   │   ├── EmailService.php
│   │   └── SharePointService.php
│   ├── middleware/
│   │   └── Auth.php
│   ├── utils/
│   │   ├── FileUpload.php
│   │   ├── OneDriveHelper.php
│   │   └── Response.php
│   ├── uploads/           # Set permissions to 755/777
│   │   ├── documents/
│   │   └── hero/
│   └── .htaccess
│
└── public_html/           # Website root (domain points here)
    ├── index.html         # React build entry point
    ├── assets/            # React build assets (JS, CSS)
    ├── documents/         # PDF documents (15 files)
    ├── gallery/           # Gallery images
    ├── images/            # Hero images
    │   └── hero/
    ├── favicon.ico
    ├── robots.txt
    └── .htaccess          # Apache configuration

```

## Important Paths

- **API Base URL**: `/api/` → Routes to `/php-backend/api/index.php`
- **Uploads URL**: `/php-backend/uploads/` (or configure in FileUpload service)
- **Documents URL**: `/documents/filename.pdf`
- **Gallery Images**: `/gallery/filename.jpg`

## Notes

1. PHP backend can be in root or moved to `api/` folder (update `.htaccess` if moved)
2. All React build files go directly in `public_html/`
3. Static assets (documents, images, gallery) go in `public_html/`
4. `.htaccess` files handle routing and security
