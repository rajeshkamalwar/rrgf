# SMTP Configuration Details

## Current Configuration

Based on the setup, here are the SMTP details:

### Default Configuration

**SMTP Host:** `smtp.gmail.com`  
**SMTP Port:** `587` (or `465` for SSL)  
**Encryption:** TLS (for port 587) or SSL (for port 465)  
**Username:** Your Gmail address (usually the same as "From Email")  
**Password:** `Welcome@2050@##`  
**From Email:** `info@rrgreenfieldmadhepura.in`  
**To Email(s):** 
- `rrgreenfielddigital@gmail.com`
- `rrgreenfieldsch@gmail.com`

(Comma-separated for multiple recipients)

---

## Alternative: Hostinger SMTP

If using Hostinger's SMTP server instead of Gmail:

**SMTP Host:** `smtp.hostinger.com`  
**SMTP Port:** `587` (TLS) or `465` (SSL)  
**Encryption:** TLS or SSL  
**Username:** Your Hostinger email address (e.g., `info@rrgreenfieldmadhepura.in`)  
**Password:** Your Hostinger email password  
**From Email:** `info@rrgreenfieldmadhepura.in`  
**To Email(s):** `rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com`

---

## Gmail SMTP Settings (Current Setup)

### Port 587 (Recommended - TLS)
- **Host:** smtp.gmail.com
- **Port:** 587
- **Security:** STARTTLS (TLS)
- **Authentication:** Required
- **Username:** Full Gmail address
- **Password:** App password (if 2FA enabled) OR account password

### Port 465 (SSL)
- **Host:** smtp.gmail.com
- **Port:** 465
- **Security:** SSL
- **Authentication:** Required

---

## Important Notes

1. **Gmail App Passwords:**
   - If 2-Factor Authentication is enabled on Gmail, you need to use an "App Password" instead of your regular password
   - Generate app password: https://myaccount.google.com/apppasswords
   - Use the 16-character app password in the SMTP configuration

2. **Gmail "Less Secure Apps":**
   - Gmail may block login attempts from "less secure apps"
   - Enable it in Gmail settings OR use App Passwords (recommended)

3. **Multiple Recipients:**
   - To send to multiple emails, separate with commas or semicolons
   - Example: `email1@gmail.com, email2@gmail.com`

4. **PHPMailer:**
   - For reliable SMTP, PHPMailer library is recommended
   - Installation: `composer require phpmailer/phpmailer`
   - See `INSTALL_PHPMAILER.md` for details

---

## Check Current Configuration

To check the current SMTP configuration in the database:

```sql
SELECT host, port, user, `from`, `to` FROM smtp_config ORDER BY id DESC LIMIT 1;
```

(Password is stored as base64 encoded, so it won't show in plain text)

---

## Update Configuration

Update via Admin Panel:
1. Go to: `https://yourdomain.com/backend`
2. Navigate to: **SMTP Settings**
3. Update the fields and save
4. Test email sending

Or update directly in database:
```sql
UPDATE smtp_config 
SET 
    host = 'smtp.gmail.com',
    port = 587,
    user = 'your-email@gmail.com',
    `from` = 'info@rrgreenfieldmadhepura.in',
    `to` = 'rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com',
    password = 'base64_encoded_password'
WHERE id = (SELECT id FROM (SELECT id FROM smtp_config ORDER BY id DESC LIMIT 1) AS tmp);
```

---

## Default Values Summary

```
Host: smtp.gmail.com
Port: 587
Username: [Gmail address]
Password: Welcome@2050@##
From: info@rrgreenfieldmadhepura.in
To: rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com
```
