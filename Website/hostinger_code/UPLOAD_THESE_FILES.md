# Files to Upload to Hostinger

## Critical Files Fixed (MUST Upload)

Upload these 2 files to fix email sending:

### 1. EmailService.php (CRITICAL - Fixes email sending)
- **Source:** `php-backend/services/EmailService.php`
- **Upload to:** `public_html/php-backend/services/EmailService.php`
- **What it fixes:** Adds proper PHPMailer loading logic (SMTP.php, Exception.php)

### 2. debug-email-web.php (For testing)
- **Source:** `php-backend/test/debug-email-web.php`
- **Upload to:** `public_html/php-backend/test/debug-email-web.php`
- **What it fixes:** Adds SMTP.php and Exception.php loading for testing

## Optional Files

### 3. debug.php (Command line testing - optional)
- **Source:** `debug.php` (root level)
- **Upload to:** `public_html/debug.php`
- **What it fixes:** Fixed paths and PHPMailer loading for CLI testing

---

## How to Test if Emails are Working

### Step 1: Upload the Files
Upload files #1 and #2 above to your Hostinger server.

### Step 2: Test with Debug Script
1. Visit: `https://rrgreenfieldmadhepura.in/php-backend/test/debug-email-web.php?pass=debug123`
2. Check the page output:
   - Should show "✓ PHPMailer is installed"
   - Should show "✓ SMTP class loaded"
   - Should show "✓ Exception class loaded"
3. Click "Send Test Email" button
4. Check your inbox at: `rrgreenfielddigital@gmail.com` and `rrgreenfieldsch@gmail.com`

### Step 3: Test from Website Forms
Submit a form on your website (contact form, etc.) and check if emails are received.

---

## Expected Results After Upload

✅ **If working correctly:**
- Debug script shows all green checkmarks
- Test email sends successfully
- Website forms send emails properly

❌ **If still not working:**
- Check debug script output for specific error messages
- Verify PHPMailer files exist at: `php-backend/vendor/PHPMailer/PHPMailer/`
- Verify SMTP configuration in database is correct

---

## Security Note

⚠️ **IMPORTANT:** Delete `debug-email-web.php` after testing for security!
