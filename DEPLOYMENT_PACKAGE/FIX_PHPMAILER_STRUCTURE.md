# Fix PHPMailer Structure Issue

## Issue

PHPMailer is installed but files are in `src` subfolder:
- Current: `vendor/PHPMailer/PHPMailer/src/PHPMailer.php`
- Expected: `vendor/PHPMailer/PHPMailer/PHPMailer.php`

## Solution

The code has been updated to automatically find PHPMailer in both locations. However, if you still have issues, you can fix the structure.

### Option 1: Move Files (Recommended)

Move files from `src/` to parent directory:

1. In File Manager, navigate to: `public_html/php-backend/vendor/PHPMailer/PHPMailer/`
2. Open the `src/` folder
3. Move these files to the parent folder (`PHPMailer/`):
   - `PHPMailer.php`
   - `SMTP.php`
   - `Exception.php`
   - `OAuth.php` (if exists)
   - `POP3.php` (if exists)
4. Delete the now-empty `src/` folder

**Final structure should be:**
```
vendor/PHPMailer/PHPMailer/
  ├── PHPMailer.php
  ├── SMTP.php
  ├── Exception.php
  └── (other files)
```

### Option 2: Code Auto-Detection (Already Updated)

The code has been updated to automatically check for PHPMailer in the `src` folder. So the current structure should work without changes.

## Verify Fix

After fixing, test with the debug script:
1. Upload `debug-email-web.php` to `public_html/php-backend/test/`
2. Visit: `https://yourdomain.com/php-backend/test/debug-email-web.php?pass=debug123`
3. Should show: "✓ PHPMailer is installed"
4. Test sending an email

## Current Status

Based on your screenshot:
- ✅ PHPMailer is installed
- ⚠️ Files are in `src/` subfolder
- ✅ Code updated to handle this automatically

You should be able to send emails now without moving files, but Option 1 (moving files) is cleaner for long-term maintenance.
