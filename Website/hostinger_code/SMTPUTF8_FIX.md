# SMTPUTF8 Error Fix

## ❌ Error Message
```
Server does not support SMTPUTF8 needed to send to Unicode addresses
```

## ✅ Solution
Disabled SMTPUTF8 in PHPMailer configuration. This is safe for most email servers and won't affect email functionality unless you're sending to addresses with special Unicode characters.

---

## Files Fixed

### 1. EmailService.php
Added `$mail->SMTPUTF8 = false;` before SMTP configuration.

**Location:** `php-backend/services/EmailService.php`

### 2. debug-email-web.php
Added `$mail->SMTPUTF8 = false;` before SMTP configuration.

**Location:** `php-backend/test/debug-email-web.php`

---

## What Changed

In both files, added this line after creating the PHPMailer object:

```php
$mail = new PHPMailer\PHPMailer\PHPMailer(true);

// Disable SMTPUTF8 (fixes "Server does not support SMTPUTF8" error on some servers)
$mail->SMTPUTF8 = false;

// ... rest of SMTP configuration
```

---

## Upload to Hostinger

Upload these updated files:
1. ✅ `php-backend/services/EmailService.php`
2. ✅ `php-backend/test/debug-email-web.php`

---

## Testing

After uploading:
1. Visit: `https://rrgreenfieldmadhepura.in/php-backend/test/debug-email-web.php?pass=debug123`
2. Click "Send Test Email"
3. Should now send successfully without SMTPUTF8 error

---

## Note

SMTPUTF8 is only needed if you're sending emails to addresses with special Unicode characters (like Chinese, Arabic, etc.). For standard English email addresses (like Gmail), it's not needed and can be safely disabled.

This fix ensures emails work on servers that don't support SMTPUTF8 extension.
