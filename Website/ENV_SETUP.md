# Environment Variables Setup

## SMTP Email Configuration

To enable email sending for enquiry forms, create a `.env` file in the root directory with the following variables:

```env
# SMTP Server Host (e.g., smtp.gmail.com, smtp.outlook.com, smtp.mailtrap.io)
SMTP_HOST=smtp.gmail.com

# SMTP Port (usually 587 for TLS, 465 for SSL, 25 for unencrypted)
SMTP_PORT=587

# SMTP Username (your email address)
SMTP_USER=your-email@gmail.com

# SMTP Password (for Gmail, use an App Password instead of your regular password)
# For Gmail: Go to Google Account > Security > 2-Step Verification > App Passwords
SMTP_PASSWORD=your-app-password

# Email address to send from (usually same as SMTP_USER)
SMTP_FROM=your-email@gmail.com

# Email address to receive enquiries (where enquiries will be sent)
SMTP_TO=admin@rrgreenfieldsch.com
```

## Gmail Setup Instructions

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Enable 2-Step Verification if not already enabled
4. Go to App Passwords
5. Generate a new App Password for "Mail"
6. Use this App Password as your `SMTP_PASSWORD`

## Other Email Providers

### Outlook/Hotmail
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo Mail
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
Use your email provider's SMTP settings. Common ports:
- 587 (TLS/STARTTLS)
- 465 (SSL)
- 25 (Unencrypted - not recommended)

## Testing

After setting up your `.env` file, restart the development server for changes to take effect.

