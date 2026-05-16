# Build and Deploy Instructions

## Step 1: Build React Frontend

On your local machine:

```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website"
npm run build
```

This creates a `dist/` folder with production files.

## Step 2: Copy Frontend Build Files

1. Copy ALL contents from `Website/dist/` to `DEPLOYMENT_PACKAGE/public_html/`
2. Copy `Website/public/documents/` to `DEPLOYMENT_PACKAGE/public_html/documents/`
3. Copy `Website/public/gallery/` to `DEPLOYMENT_PACKAGE/public_html/gallery/`
4. Copy `Website/public/images/` to `DEPLOYMENT_PACKAGE/public_html/images/`

## Step 3: Update Database Configuration

Edit `DEPLOYMENT_PACKAGE/php-backend/config/database.php`:
- Replace `YOUR_DATABASE_USERNAME` with your Hostinger database username
- Replace `YOUR_DATABASE_PASSWORD` with your Hostinger database password
- Verify database name is correct (default: `rrgf`)

## Step 4: Upload to Hostinger

### Option A: Using File Manager
1. Log into Hostinger cPanel
2. Open File Manager
3. Navigate to `public_html/`
4. Upload contents of `DEPLOYMENT_PACKAGE/public_html/` to `public_html/`
5. Upload `DEPLOYMENT_PACKAGE/php-backend/` folder to hosting root

### Option B: Using FTP
1. Connect via FTP client (FileZilla, etc.)
2. Upload `public_html/` contents to `/public_html/`
3. Upload `php-backend/` folder to root directory

## Step 5: Verify File Structure

Your hosting should have:
```
/public_html/
  ├── index.html (React build)
  ├── assets/ (React build assets)
  ├── documents/ (PDF files)
  ├── gallery/ (Gallery images)
  ├── images/ (Hero images, etc.)
  └── .htaccess

/php-backend/
  ├── api/
  ├── config/
  ├── controllers/
  ├── services/
  └── ...
```

## Step 6: Set Permissions

Set folder permissions:
- `php-backend/uploads/` → 755 or 777
- All other folders → 755
- All files → 644

## Step 7: Test Deployment

1. Visit your domain
2. Test homepage loads
3. Test `/backend` admin login
4. Test forms submit correctly
5. Check emails are received
