# Adding Multiple Email Recipients

## ✅ Code Supports Multiple Recipients

The EmailService **DOES support multiple email addresses**. You can add as many recipients as needed.

---

## Format for Multiple Emails

### Recommended Format (Comma Separated)
```
rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com,doprudra@gmail.com
```

### Alternative Formats (Also Work)
```
rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com, doprudra@gmail.com
```

Or with semicolons:
```
rrgreenfielddigital@gmail.com;rrgreenfieldsch@gmail.com;doprudra@gmail.com
```

---

## How to Add a Third Email

### Via Admin Panel (Recommended)
1. Go to your admin panel
2. Navigate to SMTP Configuration
3. In the "To Email" field, enter:
   ```
   rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com,doprudra@gmail.com
   ```
4. Save the configuration

### Via Database (Direct)
If you have database access, update the `smtp_config` table:
```sql
UPDATE smtp_config 
SET `to` = 'rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com,doprudra@gmail.com' 
ORDER BY id DESC LIMIT 1;
```

---

## Why It Might Not Have Worked

If you added `doprudra@gmail.com` but emails aren't reaching it, check:

### 1. ✅ Format Issues
- **Spaces around commas:** Should be fine, but avoid extra spaces
- **Invalid email format:** Check for typos (e.g., `doprudra@gmail.com` not `doprudra@.gmail.com`)
- **Special characters:** Should be fine in email addresses

### 2. ✅ Email Validation
The code trims whitespace and validates each email. Check:
- Is `doprudra@gmail.com` spelled correctly?
- Does the email address exist?
- Is it a valid email format?

### 3. ✅ SMTP Server Limits
Some SMTP servers have limits on:
- Number of recipients per email
- Rate limiting (too many emails too quickly)
- Daily sending limits

### 4. ✅ Email Delivery Issues
- Check spam/junk folder
- Check if the email address is blocking emails
- Verify the email address is active

### 5. ✅ Database Storage
- The email addresses are stored as-is in the database
- Make sure they're saved correctly (no encoding issues)
- Check the database directly to see what's stored

---

## Testing Multiple Recipients

### Step 1: Verify Current Configuration
Run the test script (if uploaded to server):
```
https://yourdomain.com/php-backend/test/test-multiple-emails.php
```

Or check database directly:
```sql
SELECT `to` FROM smtp_config ORDER BY id DESC LIMIT 1;
```

### Step 2: Test Email Sending
Use the debug email script:
```
https://yourdomain.com/php-backend/test/debug-email-web.php?pass=debug123
```

Click "Send Test Email" and check all recipient inboxes.

### Step 3: Test from Website Forms
Submit a form on your website and check all email addresses.

---

## Code Verification

The EmailService code properly handles multiple recipients:

```php
// Handle multiple recipients (comma or semicolon separated)
$recipients = preg_split('/[,;]/', $to);
foreach ($recipients as $recipient) {
    $recipient = trim($recipient);
    if (!empty($recipient)) {
        $mail->addAddress($recipient);
    }
}
```

This code:
- ✅ Splits by comma (`,`) or semicolon (`;`)
- ✅ Trims whitespace from each address
- ✅ Adds each recipient to the PHPMailer object
- ✅ Sends to all recipients in one email

---

## Troubleshooting

### Issue: Third email not receiving emails

**Checklist:**
1. ✅ Verify email format in database: `SELECT to FROM smtp_config;`
2. ✅ Check for typos in the email address
3. ✅ Test with just the third email alone to verify it works
4. ✅ Check spam/junk folders
5. ✅ Verify SMTP server doesn't have recipient limits
6. ✅ Check email server logs for delivery failures
7. ✅ Test with a different email address to isolate the issue

### Issue: Some emails work, others don't

**Possible causes:**
- Email provider blocking (Gmail, Outlook, etc.)
- Spam filters
- Invalid email address
- Email provider rate limiting

**Solution:**
- Try sending to just the problematic email first
- Check if the email address accepts emails from your SMTP server
- Verify the email address is correct

---

## Best Practices

1. **Use comma separation** (most common)
2. **Avoid extra spaces** (trimmed automatically, but cleaner without)
3. **Verify email addresses** before adding
4. **Test incrementally** - add one email at a time to identify issues
5. **Monitor delivery** - check all inboxes after form submissions

---

## Example: Adding doprudra@gmail.com

Correct format in "To Email" field:
```
rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com,doprudra@gmail.com
```

After saving, all 3 emails should receive:
- Enquiry form submissions
- Contact form submissions
- Admission applications
- Visit schedule requests
