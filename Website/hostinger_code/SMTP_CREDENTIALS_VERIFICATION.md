# SMTP Credentials Verification

## Your SMTP Credentials

Based on your information:
- **Host:** `smtp.hostinger.com` ✅
- **Port:** `465` ✅
- **Username:** `info@rrgreenfieldmadhepura.in` ✅
- **Password:** `Welcome@2026@#` ✅
- **From Email:** `info@rrgreenfieldmadhepura.in` (usually same as username)
- **To Email:** `rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com`

---

## ✅ Credentials Are Correct for Hostinger

Your credentials match Hostinger's SMTP requirements:
- ✅ Host `smtp.hostinger.com` is correct
- ✅ Port `465` uses SSL/TLS encryption (ENCRYPTION_SMTPS)
- ✅ Username format (email address) is correct
- ✅ Password format looks valid

---

## 🔍 Verify Configuration in Database

### Option 1: Use Verification Script
Upload and run: `php-backend/test/verify-smtp-config.php`
- Visit: `https://rrgreenfieldmadhepura.in/php-backend/test/verify-smtp-config.php`
- This will compare your database settings with the expected values

### Option 2: Check via Admin Panel
1. Login to your admin panel
2. Go to SMTP Configuration
3. Verify these settings match:
   - Host: `smtp.hostinger.com`
   - Port: `465`
   - Username: `info@rrgreenfieldmadhepura.in`
   - Password: `Welcome@2026@#`
   - From: `info@rrgreenfieldmadhepura.in`
   - To: `rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com`

### Option 3: Check Database Directly
Run this SQL in phpMyAdmin:
```sql
SELECT 
    host,
    port,
    user,
    `from`,
    `to`,
    CASE 
        WHEN password IS NOT NULL AND password != '' THEN '[SET]'
        ELSE 'NOT SET'
    END as password_status
FROM smtp_config 
ORDER BY id DESC 
LIMIT 1;
```

---

## ⚙️ EmailService Configuration

The EmailService.php is correctly configured for port 465:
```php
if ($config['port'] == 465) {
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
}
```

This is correct! Port 465 requires SSL/TLS encryption (ENCRYPTION_SMTPS).

---

## 🔐 Password Storage

The password is stored as base64-encoded in the database:
- Database stores: Base64 encoded version of `Welcome@2026@#`
- Code decodes it: `base64_decode($fullConfig['password'])`

This is handled automatically by the EmailService.

---

## ✅ Configuration Checklist

Make sure these are set in your database:

- [ ] Host = `smtp.hostinger.com`
- [ ] Port = `465`
- [ ] Username = `info@rrgreenfieldmadhepura.in`
- [ ] Password = `Welcome@2026@#` (stored as base64)
- [ ] From = `info@rrgreenfieldmadhepura.in`
- [ ] To = `rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com`

---

## 🚨 If Credentials Don't Match

If the verification script shows mismatches:

### Update via Admin Panel (Recommended)
1. Login to admin panel
2. Go to SMTP Configuration
3. Update any incorrect fields
4. Save

### Update via SQL (Alternative)
Run the SQL file: `database/update-smtp-credentials.sql`
- Note: Password needs to be base64 encoded
- Easier to update via admin panel which handles this automatically

---

## ✅ Expected Behavior

With these credentials:
- Port 465 = SSL/TLS encryption (ENCRYPTION_SMTPS) ✅
- SMTPUTF8 = disabled (for compatibility) ✅
- Multiple recipients supported ✅

Everything should work correctly!

---

## 🧪 Test After Verification

1. Run verification script to confirm settings
2. Run test email: `debug-email-web.php?pass=debug123&send=1`
3. Submit a form and check if email is received
4. Check spam folders if emails don't arrive
