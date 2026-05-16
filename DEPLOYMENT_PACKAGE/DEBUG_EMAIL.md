# Email Debug Guide

## Debug Script

A comprehensive email debug script is available to test SMTP configuration and email sending.

### Location
- Local: `php-backend/test/debug-email.php`
- Deployment: `DEPLOYMENT_PACKAGE/php-backend/test/debug-email.php`

### How to Run

#### On Local Machine (XAMPP):
```bash
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
php test/debug-email.php
```

#### On Hostinger (via SSH or cPanel):
```bash
cd /home/username/public_html/php-backend/test
php debug-email.php
```

#### Via Browser (if web server allows):
1. Upload `debug-email.php` to `public_html/php-backend/test/`
2. Visit: `https://yourdomain.com/php-backend/test/debug-email.php`
3. Remove the file after debugging for security

### What the Script Does

The debug script performs these checks:

1. **SMTP Configuration Check**
   - Verifies configuration exists in database
   - Shows all SMTP settings
   - Checks for missing required fields

2. **PHPMailer Check**
   - Checks if PHPMailer is installed
   - Shows installation path

3. **SMTP Connection Test**
   - Tests connection to SMTP server
   - Verifies authentication
   - Shows detailed connection logs

4. **Email Sending Test**
   - Attempts to send a test email
   - Shows success or detailed error messages
   - Sends to configured recipients

5. **PHP mail() Function Check**
   - Verifies if PHP's built-in mail() is available

### Expected Output

**Success:**
```
✓ SMTP Configuration found
✓ PHPMailer is installed
✓ SMTP connection successful!
✓ Test email sent successfully!
```

**Common Errors:**

1. **PHPMailer Not Installed:**
   ```
   ❌ PHPMailer is NOT installed
   ```
   **Fix:** Install PHPMailer (see below)

2. **SMTP Connection Failed:**
   ```
   ❌ SMTP Connection failed!
   Error: Connection refused / Authentication failed
   ```
   **Fix:** Check host, port, username, password

3. **Authentication Failed:**
   ```
   Error: Invalid credentials
   ```
   **Fix:** Verify username and password are correct

4. **SSL/TLS Certificate Error:**
   ```
   Error: SSL certificate problem
   ```
   **Fix:** Usually okay on shared hosting, script handles this

### Installing PHPMailer (If Needed)

PHPMailer is required for proper SMTP email sending.

#### Via Composer (if available):
```bash
cd php-backend
composer require phpmailer/phpmailer
```

#### Manual Installation:
1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer/releases
2. Extract to: `php-backend/vendor/PHPMailer/PHPMailer/`
3. Structure should be:
   ```
   php-backend/
     vendor/
       PHPMailer/
         PHPMailer/
           PHPMailer.php
           SMTP.php
           Exception.php
   ```

### Common Issues & Solutions

#### Issue: "PHPMailer not installed"
**Solution:** Install PHPMailer (see above)

#### Issue: "Authentication failed"
**Possible causes:**
- Wrong password
- Wrong username
- Gmail requires App Password (if 2FA enabled)
- Account locked/disabled

**Fix:**
- Verify credentials in Admin Panel → SMTP Settings
- For Gmail: Use App Password if 2FA is enabled
- Test credentials manually

#### Issue: "Connection refused"
**Possible causes:**
- Wrong SMTP host
- Wrong port
- Firewall blocking
- Server blocking outbound connections

**Fix:**
- Verify SMTP host: `smtp.hostinger.com` or `smtp.gmail.com`
- Verify port: `465` (SSL) or `587` (TLS)
- Contact hosting support if firewall issue

#### Issue: "Emails go to spam"
**Possible causes:**
- Missing SPF/DKIM records
- From email doesn't match domain
- Poor email content

**Fix:**
- Use domain email as "From" address
- Configure SPF/DKIM records in DNS
- Avoid spam trigger words in content

### Quick Fix Checklist

- [ ] PHPMailer installed
- [ ] SMTP configuration correct (host, port, username, password)
- [ ] "From" email matches domain or SMTP account
- [ ] "To" emails are valid addresses
- [ ] SMTP port matches encryption (465 = SSL, 587 = TLS)
- [ ] Test email sending via debug script
- [ ] Check spam folder if email not received

### Current Configuration

Based on your setup:
- **Host:** smtp.hostinger.com
- **Port:** 465 (SSL)
- **Username:** info@rrgreenfieldmadhepura.in
- **Password:** Welcome@2050@##
- **From:** info@rrgreenfieldmadhepura.in
- **To:** rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com

### Support

If issues persist after running the debug script:
1. Check the detailed error messages
2. Verify all configuration is correct
3. Test with a simple email client (e.g., Outlook, Thunderbird) using same credentials
4. Contact hosting support if server-side issues
