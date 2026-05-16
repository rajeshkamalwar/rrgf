# Form Email Debug Guide

## Issue: Test Email Works, But Forms Don't Send Emails

### ✅ What's Working
- Test email from debug script works
- PHPMailer is properly configured
- SMTP connection is working

### ❌ What's Not Working
- Form submissions don't send emails
- Forms return success but no email is received

---

## Possible Causes

### 1. Silent Error Handling
Forms catch email errors and log them silently:
```php
try {
    $this->emailService->sendEmailPHPMailer($config['to'], $subject, $body);
} catch (Exception $e) {
    error_log('Email send failed: ' . $e->getMessage()); // Silent - only logs
}
```

**Solution:** Check error logs to see what's failing.

### 2. Form Validation Issues
Forms might be failing validation before reaching email code.

**Solution:** Verify form data is reaching the controller.

### 3. Missing Exception Class
PHPMailer Exception class might not be loaded when forms run.

---

## Debugging Steps

### Step 1: Test Form Email Directly

Upload `test-form-email.php` to server and run:
```
https://yourdomain.com/php-backend/test/test-form-email.php
```

This simulates a form submission and shows any errors.

### Step 2: Check Error Logs

Check Hostinger error logs:
1. Login to cPanel
2. Go to Error Logs or Error Log Viewer
3. Look for entries with "Email send failed"
4. Note the exact error message

### Step 3: Enable Error Display (Temporary)

To see errors in form responses, temporarily modify `PublicController.php`:

**Find this code (in all form methods):**
```php
} catch (Exception $e) {
    error_log('Email send failed: ' . $e->getMessage());
}
```

**Temporarily change to:**
```php
} catch (Exception $e) {
    error_log('Email send failed: ' . $e->getMessage());
    Response::error('Email send failed: ' . $e->getMessage(), 500);
    return; // Add this to stop execution
}
```

**⚠️ WARNING:** This will expose errors to users. Revert after debugging!

### Step 4: Check Form Submission

Verify forms are actually reaching the email code:
1. Add logging before email code
2. Check if `$config` is not null
3. Verify `sendEmailPHPMailer()` is being called

---

## Quick Test

Run this SQL query to check if forms are submitting to database:
```sql
SELECT * FROM enquiries ORDER BY id DESC LIMIT 5;
SELECT * FROM contacts ORDER BY id DESC LIMIT 5;
SELECT * FROM admissions ORDER BY id DESC LIMIT 5;
SELECT * FROM visit_schedules ORDER BY id DESC LIMIT 5;
```

If records exist but emails aren't sent, it's an email sending issue.
If records don't exist, it's a form submission issue.

---

## Common Errors and Solutions

### Error: "PHPMailer class not found"
**Solution:** Verify PHPMailer files exist at `php-backend/vendor/PHPMailer/PHPMailer/`

### Error: "SMTP configuration not found"
**Solution:** Check SMTP config exists in database table `smtp_config`

### Error: "Server does not support SMTPUTF8"
**Solution:** Already fixed - verify EmailService.php is uploaded with `$mail->SMTPUTF8 = false;`

### Error: "SMTP connection failed"
**Solution:** Check SMTP credentials (host, port, username, password)

### Error: "Authentication failed"
**Solution:** Verify SMTP username and password are correct

---

## Files to Upload for Debugging

1. **test-form-email.php** - Direct form email test
   - Upload to: `public_html/php-backend/test/test-form-email.php`
   - Run via browser to test email sending

2. **check-form-errors.php** - Error checking guide
   - Upload to: `public_html/php-backend/test/check-form-errors.php`
   - Provides debugging instructions

---

## Next Steps

1. **Upload test scripts** to Hostinger
2. **Run test-form-email.php** to see if email sending works
3. **Check error logs** for any email-related errors
4. **Submit a form** and immediately check error logs
5. **Report the exact error message** for further help

---

## If Test Script Works But Forms Don't

If `test-form-email.php` works but forms still don't:
- The issue is likely in form data handling
- Check if form data is properly formatted
- Verify email body/content is valid
- Check for special characters causing issues
