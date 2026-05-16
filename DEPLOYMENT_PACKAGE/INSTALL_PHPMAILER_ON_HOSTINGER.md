# Install PHPMailer on Hostinger

## Current Status

**PHPMailer is NOT included in the deployment package** - you need to install it on Hostinger.

## Why PHPMailer is Needed

PHPMailer is required for reliable SMTP email sending. Without it, emails won't work properly (or at all).

## Installation Methods

### Method 1: Via Composer (Recommended - if available on Hostinger)

1. **Check if Composer is available:**
   - Log into Hostinger via SSH (if you have SSH access)
   - Or check in cPanel → Terminal/SSH
   
2. **Install via Composer:**
   ```bash
   cd public_html/php-backend
   composer require phpmailer/phpmailer
   ```

### Method 2: Manual Installation (Always works)

1. **Download PHPMailer:**
   - Go to: https://github.com/PHPMailer/PHPMailer/releases
   - Download the latest release (zip file)
   - Example: `PHPMailer-6.9.1.zip`

2. **Extract and Upload:**
   - Extract the downloaded zip file
   - Upload the `PHPMailer` folder to: `public_html/php-backend/vendor/`
   - Final structure should be:
     ```
     public_html/
       php-backend/
         vendor/
           PHPMailer/
             PHPMailer/
               PHPMailer.php
               SMTP.php
               Exception.php
               (other files)
   ```

3. **Verify Installation:**
   - Check that `PHPMailer.php` exists at:
     `public_html/php-backend/vendor/PHPMailer/PHPMailer/PHPMailer.php`

### Method 3: Via cPanel File Manager

1. Log into Hostinger cPanel
2. Open **File Manager**
3. Navigate to `public_html/php-backend/`
4. Create `vendor/` folder if it doesn't exist
5. Download PHPMailer zip file to your computer
6. Extract it locally
7. Upload the `PHPMailer` folder to `public_html/php-backend/vendor/`
8. Verify the files are uploaded correctly

## Quick Installation Steps (Manual)

1. **Download:**
   - Visit: https://github.com/PHPMailer/PHPMailer/archive/refs/heads/master.zip
   - Or: https://github.com/PHPMailer/PHPMailer/releases (latest release)

2. **Extract:**
   - Extract the zip file
   - You'll get a folder like `PHPMailer-master` or `PHPMailer-6.x.x`

3. **Upload:**
   - Upload the `src` folder contents to: `public_html/php-backend/vendor/PHPMailer/PHPMailer/`
   - The `src` folder contains:
     - `PHPMailer.php`
     - `SMTP.php`
     - `Exception.php`
     - `OAuth.php` (optional)
     - `OAuthTokenProvider.php` (optional)
     - `POP3.php` (optional)

4. **Rename if needed:**
   - If you uploaded the entire `src` folder, the structure should be:
     - `vendor/PHPMailer/PHPMailer/src/PHPMailer.php`
   - Then update the path in code OR rename `src` to the parent folder

## Correct Folder Structure

After installation, you should have:

```
public_html/
  php-backend/
    vendor/
      PHPMailer/
        PHPMailer/
          PHPMailer.php      ← Must exist
          SMTP.php           ← Must exist
          Exception.php      ← Must exist
```

## Verify Installation

After installation, you can verify by:

1. **Using the debug script:**
   - Upload `debug-email-web.php` to `public_html/php-backend/test/`
   - Visit: `https://yourdomain.com/php-backend/test/debug-email-web.php?pass=debug123`
   - It should show: "✓ PHPMailer is installed"

2. **Check via SSH/File Manager:**
   ```bash
   ls -la public_html/php-backend/vendor/PHPMailer/PHPMailer/PHPMailer.php
   ```

## Troubleshooting

### Issue: "PHPMailer class not found"
- **Check path:** Ensure files are in correct location
- **Check file permissions:** Files should be readable (644)
- **Check namespace:** Code uses `PHPMailer\PHPMailer\PHPMailer`

### Issue: "Cannot find vendor folder"
- Create the folder structure manually
- Path: `public_html/php-backend/vendor/PHPMailer/PHPMailer/`

### Issue: "Wrong folder structure"
- PHPMailer expects namespace `PHPMailer\PHPMailer\`
- Files must be in: `vendor/PHPMailer/PHPMailer/`
- Not: `vendor/phpmailer/phpmailer/src/`

## Alternative: Download Link

**Direct download from GitHub:**
- Latest release: https://github.com/PHPMailer/PHPMailer/releases/latest
- Download: `Source code (zip)`
- Extract and upload `src` folder contents to `vendor/PHPMailer/PHPMailer/`

## After Installation

Once PHPMailer is installed:
1. Test email sending using the debug script
2. Test forms on your website (Contact, Enquiry, Admission, Visit Schedule)
3. Emails should now be sent successfully to:
   - `rrgreenfielddigital@gmail.com`
   - `rrgreenfieldsch@gmail.com`

## Security Note

After testing, remove the debug script:
- Delete: `public_html/php-backend/test/debug-email-web.php`
