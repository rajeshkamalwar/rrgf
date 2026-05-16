# 🚀 Hostinger Deployment Checklist

## ✅ Pre-Deployment Verification

### Files Ready
- [x] React frontend build (index.html + assets/)
- [x] PHP backend (php-backend/)
- [x] Documents folder (documents/)
- [x] Gallery folder (gallery/)
- [x] Images folder (images/)
- [x] .htaccess file (root directory)

### Recent Updates Included
- [x] Updated address: "New bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar"
- [x] Changed "CBSE Affiliated" to "International Standard School"
- [x] Updated grade range: "Balvatika to Class 8th"
- [x] Updated teacher count: 27 Teachers
- [x] Updated teacher-section ratio: 1.93
- [x] Updated Special Educator: 1
- [x] Updated Counsellor and Wellness Teacher: 1
- [x] Updated classrooms: 22 Classrooms (Each: 56 sq mtr, 600 sq ft)
- [x] Updated YouTube video link
- [x] Updated infrastructure document link (infradoc.jpeg)

---

## 📤 Step 1: Upload Files to Hostinger

1. **Access Hostinger File Manager or use FTP**
   - Login to Hostinger hPanel
   - Navigate to File Manager
   - Go to `public_html` directory

2. **Upload all files from `DEPLOYMENT_PACKAGE/public_html/`**
   - Upload all files and folders to `public_html/`
   - Ensure folder structure is maintained:
     ```
     public_html/
     ├── index.html
     ├── assets/
     ├── documents/
     ├── gallery/
     ├── images/
     ├── php-backend/
     └── .htaccess
     ```

3. **Set correct file permissions**
   - Folders: `755`
   - Files: `644`
   - `.htaccess`: `644`

---

## 🗄️ Step 2: Database Configuration

1. **Create Database in Hostinger**
   - Go to hPanel → MySQL Databases
   - Create a new database (e.g., `u123456789_school`)
   - Create a database user and assign it to the database
   - Note down: Database name, Username, Password, Host (usually `localhost`)

2. **Update Database Configuration**
   - Edit `public_html/php-backend/config/database.php`
   - Update with your Hostinger database credentials:
     ```php
     <?php
     return [
         'host' => 'localhost',  // Usually 'localhost' on Hostinger
         'dbname' => 'your_database_name',
         'username' => 'your_database_username',
         'password' => 'your_database_password',
         'charset' => 'utf8mb4'
     ];
     ```

3. **Import Database Schema**
   - Go to phpMyAdmin in Hostinger hPanel
   - Select your database
   - Click "Import" tab
   - Upload `DEPLOYMENT_PACKAGE/database/schema.sql`
   - Click "Go" to import

---

## 🔧 Step 3: Verify Configuration

1. **Check .htaccess is in place**
   - Verify `.htaccess` file exists in `public_html/` root
   - Ensure it's not blocked by Hostinger

2. **Test API Endpoints**
   - Visit: `https://yourdomain.com/api/documents`
   - Visit: `https://yourdomain.com/api/hero-images`
   - Should return JSON data (not 500 errors)

3. **Test Website Pages**
   - Homepage: `https://yourdomain.com/`
   - Mandatory Disclosure: `https://yourdomain.com/mandatory-disclosure`
   - Academics: `https://yourdomain.com/academics`
   - Contact: `https://yourdomain.com/contact`

---

## 🐛 Troubleshooting

### If API returns 500 errors:
1. Check `php-backend/config/database.php` credentials
2. Verify database schema is imported
3. Check Hostinger error logs in hPanel
4. Upload `php-backend/test/database-test.php` and visit it to diagnose

### If pages show 404:
1. Verify `.htaccess` file exists and is readable
2. Check that `mod_rewrite` is enabled on Hostinger
3. Ensure `index.html` exists in `public_html/`

### If images/documents don't load:
1. Verify folder permissions (755 for folders)
2. Check file paths are correct
3. Ensure files were uploaded completely

---

## 📝 Post-Deployment Verification

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Mandatory Disclosure page displays correctly
- [ ] API endpoints return data (not 500 errors)
- [ ] Documents can be viewed/downloaded
- [ ] Images and gallery load properly
- [ ] Contact form works (if configured)
- [ ] Admin panel accessible (if needed)

---

## 📞 Support

If you encounter issues:
1. Check Hostinger error logs in hPanel
2. Use `database-test.php` to diagnose database issues
3. Verify all file permissions are correct
4. Ensure database schema is fully imported

---

**Deployment Package Location:** `DEPLOYMENT_PACKAGE/public_html/`
**Last Updated:** All latest changes included ✅
