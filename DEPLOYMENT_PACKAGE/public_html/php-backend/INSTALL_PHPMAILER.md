# Installing PHPMailer for Email Functionality

The email system requires PHPMailer for proper SMTP authentication. Currently, emails may fail because PHPMailer is not installed.

## Installation Steps

### Option 1: Using Composer (Recommended)

1. **Install Composer** (if not already installed):
   - Download from: https://getcomposer.org/download/
   - Follow installation instructions for Windows

2. **Install PHPMailer**:
   ```bash
   cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website\php-backend"
   composer require phpmailer/phpmailer
   ```

3. **Update autoloader** (if needed):
   The EmailService will automatically use PHPMailer if it's available via Composer's autoloader.

### Option 2: Manual Installation

1. **Download PHPMailer**:
   - Go to: https://github.com/PHPMailer/PHPMailer/releases
   - Download the latest release
   - Extract to: `php-backend/vendor/PHPMailer/PHPMailer/`

2. **Add autoloader**:
   Create `php-backend/vendor/autoload.php` or add this to your EmailService:
   ```php
   require_once __DIR__ . '/vendor/PHPMailer/PHPMailer/src/Exception.php';
   require_once __DIR__ . '/vendor/PHPMailer/PHPMailer/src/PHPMailer.php';
   require_once __DIR__ . '/vendor/PHPMailer/PHPMailer/src/SMTP.php';
   ```

## Current Configuration

- **SMTP Host**: smtp.hostinger.com
- **Port**: 465 (requires SSL/TLS encryption)
- **Current 'To' field**: Only 1 email configured

## Setting Up Multiple Recipients

To send emails to 2 Gmail IDs:

1. Go to **Admin Panel → SMTP Settings**
2. In the **"To Email Address"** field, enter:
   ```
   email1@gmail.com, email2@gmail.com
   ```
3. Separate multiple emails with commas
4. Click **"Save Configuration"**
5. Click **"Test Connection"** to verify

## Testing

After installing PHPMailer:

1. Use the **"Test Connection"** button in Admin Panel
2. Use the **"Send Test Email"** button to send a test email
3. Check all recipient inboxes to verify delivery

## Troubleshooting

### Emails not sending:
- ✅ Check PHPMailer is installed
- ✅ Verify SMTP credentials are correct
- ✅ Check port matches encryption (465 = SSL/TLS, 587 = STARTTLS)
- ✅ Verify firewall allows SMTP connections
- ✅ Check email is not in spam folder

### Multiple recipients not working:
- ✅ Ensure emails are separated by commas
- ✅ No spaces after commas (or trim them)
- ✅ Each email address is valid
