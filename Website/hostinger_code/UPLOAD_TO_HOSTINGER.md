# Files to Upload to Hostinger

## 🚨 CRITICAL FILES (Must Upload)

These files fix the email system and are **REQUIRED** for emails to work:

### 1. ✅ EmailService.php (MOST IMPORTANT)
- **Source:** `php-backend/services/EmailService.php`
- **Upload to:** `public_html/php-backend/services/EmailService.php`
- **Why:** Fixes PHPMailer loading (SMTP.php, Exception.php) - **CRITICAL FOR EMAILS TO WORK**
- **Status:** ✅ Fixed and ready

### 2. ✅ debug-email-web.php (For Testing)
- **Source:** `php-backend/test/debug-email-web.php`
- **Upload to:** `public_html/php-backend/test/debug-email-web.php`
- **Why:** Allows you to test emails from browser (with password protection)
- **Status:** ✅ Fixed and ready
- **⚠️ IMPORTANT:** Delete this file after testing for security!

---

## 📋 OPTIONAL FILES

### 3. debug.php (Command Line Testing - Optional)
- **Source:** `debug.php` (root level of hostinger_code)
- **Upload to:** `public_html/debug.php`
- **Why:** For command-line email testing via SSH (if you have SSH access)
- **Status:** ✅ Fixed and ready

### 4. test-multiple-emails.php (For Verification - Optional)
- **Source:** `php-backend/test/test-multiple-emails.php`
- **Upload to:** `public_html/php-backend/test/test-multiple-emails.php`
- **Why:** Helps verify multiple email addresses are formatted correctly
- **Status:** ✅ Ready to use

---

## 📦 Complete Upload Checklist

### Required (Email System):
- [ ] `php-backend/services/EmailService.php` → `public_html/php-backend/services/EmailService.php`
- [ ] `php-backend/test/debug-email-web.php` → `public_html/php-backend/test/debug-email-web.php`

### Optional (Testing/Verification):
- [ ] `debug.php` → `public_html/debug.php`
- [ ] `php-backend/test/test-multiple-emails.php` → `public_html/php-backend/test/test-multiple-emails.php`

---

## 🎯 Minimum Required Upload

**For emails to work, you MUST upload at least:**
1. `php-backend/services/EmailService.php`

**To test emails, also upload:**
2. `php-backend/test/debug-email-web.php`

---

## 📍 File Locations on Your Computer

All files are in: `Website/hostinger_code/`

```
hostinger_code/
├── php-backend/
│   ├── services/
│   │   └── EmailService.php          ← UPLOAD THIS (CRITICAL)
│   └── test/
│       ├── debug-email-web.php       ← UPLOAD THIS (for testing)
│       └── test-multiple-emails.php  ← Optional (for verification)
└── debug.php                          ← Optional (CLI testing)
```

---

## 📍 Upload Locations on Hostinger

Upload to your `public_html` directory:

```
public_html/
├── php-backend/
│   ├── services/
│   │   └── EmailService.php          ← Upload here (OVERWRITE existing)
│   └── test/
│       ├── debug-email-web.php       ← Upload here
│       └── test-multiple-emails.php  ← Optional
└── debug.php                          ← Optional
```

---

## ✅ After Uploading

### Step 1: Test Email System
Visit: `https://rrgreenfieldmadhepura.in/php-backend/test/debug-email-web.php?pass=debug123`

Expected results:
- ✓ PHPMailer is installed
- ✓ SMTP class loaded
- ✓ Exception class loaded
- Button to "Send Test Email"

### Step 2: Send Test Email
Click "Send Test Email" button and check:
- `rrgreenfielddigital@gmail.com`
- `rrgreenfieldsch@gmail.com`

### Step 3: Test Website Forms
Submit forms on your website and verify emails are received.

### Step 4: Security Cleanup
⚠️ **IMPORTANT:** After testing, DELETE `debug-email-web.php` for security!

---

## 🔍 Verification

After uploading, verify the files are correct:

1. Check file exists: `public_html/php-backend/services/EmailService.php`
2. Check file size (should be ~8-9 KB for EmailService.php)
3. Visit debug script URL (should load without errors)
4. Check that PHPMailer classes are detected

---

## ❌ Files NOT to Upload

You do NOT need to upload:
- Frontend files (React build files)
- Other PHP files that haven't changed
- Database files
- Configuration files (unless you modified them)
- Documentation files (.md files)

---

## 🆘 If Emails Still Don't Work

1. **Check PHPMailer installation:**
   - Verify files exist at: `php-backend/vendor/PHPMailer/PHPMailer/`
   - Should have: `PHPMailer.php`, `SMTP.php`, `Exception.php`

2. **Check SMTP configuration:**
   - Use debug script to verify SMTP settings
   - Verify "To Email" field has correct format

3. **Check file permissions:**
   - PHP files should be readable (644 or 755)

4. **Check error logs:**
   - Check Hostinger error logs for PHP errors
   - Check email sending logs if available

---

## 📞 Summary

**Minimum Upload (For Emails to Work):**
1. `php-backend/services/EmailService.php` ✅

**Recommended (For Testing):**
2. `php-backend/test/debug-email-web.php` ✅

**Total:** 2 files minimum, 4 files if you want all testing tools.
