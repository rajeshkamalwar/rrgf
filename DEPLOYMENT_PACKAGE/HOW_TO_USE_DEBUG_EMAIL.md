# How to Use Email Debug Script

## Quick Access

1. **Upload the debug script** (if not already uploaded):
   - File: `php-backend/test/debug-email-web.php`
   - Upload to: `public_html/php-backend/test/debug-email-web.php` on Hostinger

2. **Access in browser:**
   ```
   https://yourdomain.com/php-backend/test/debug-email-web.php?pass=debug123
   ```

## What the Script Does

The debug script will:
1. ✅ Check SMTP configuration in database
2. ✅ Verify PHPMailer installation
3. ✅ Test SMTP connection (if PHPMailer available)
4. ✅ Send a test email (when you click the button)

## Steps to Debug

### Step 1: Access the Script
Visit: `https://yourdomain.com/php-backend/test/debug-email-web.php?pass=debug123`

**Note:** The password `debug123` is a simple security measure. You can change it in the file if needed (line 12).

### Step 2: Review the Results
The page will show:
- SMTP Configuration details
- PHPMailer installation status
- Any errors or warnings

### Step 3: Send Test Email
- If PHPMailer is installed, you'll see a "Send Test Email" button
- Click it to send a test email to your configured recipients
- Check the results on the page

### Step 4: Check Results
- ✅ Green checkmarks = Everything working
- ❌ Red X marks = Issues found
- ⚠️ Yellow warnings = Recommendations

## Expected Output

**If everything works:**
```
✓ SMTP Configuration found
✓ PHPMailer is installed
✓ Test email sent successfully!
Check inbox: rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com
```

**If PHPMailer not found:**
```
❌ PHPMailer is NOT installed
⚠ Cannot send test email - PHPMailer not installed
```

**If connection fails:**
```
❌ SMTP Connection failed!
Error: [detailed error message]
```

## Security Warning

⚠️ **IMPORTANT:** Delete the debug script after testing!

After you've verified emails are working:
1. Delete: `public_html/php-backend/test/debug-email-web.php`
2. This prevents unauthorized access to your email configuration

## Troubleshooting

### Issue: "Page not found"
- Check the file path is correct
- Ensure file is uploaded to: `public_html/php-backend/test/`

### Issue: "Password incorrect"
- Make sure URL includes: `?pass=debug123`
- Or check line 12 of the file for the correct password

### Issue: "PHPMailer not found"
- Verify PHPMailer files are at: `vendor/PHPMailer/PHPMailer/PHPMailer.php`
- Check file permissions (should be readable)

### Issue: "SMTP Connection failed"
- Verify SMTP credentials in database
- Check host, port, username, password
- For Hostinger: `smtp.hostinger.com` port `465`

## Alternative: Command Line Debug

If you have SSH access, you can also run:
```bash
cd public_html/php-backend
php test/debug-email.php
```

This shows output in the terminal instead of browser.

## Quick URL

Replace `yourdomain.com` with your actual domain:
```
https://yourdomain.com/php-backend/test/debug-email-web.php?pass=debug123
```
