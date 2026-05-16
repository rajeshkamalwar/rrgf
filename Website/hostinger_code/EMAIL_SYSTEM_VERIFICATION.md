# Email System Verification Guide

## ✅ How to Check if Email is Working

### Step 1: Upload Test Script
Upload the complete test script:
- **File:** `php-backend/test/test-email-complete.php`
- **Upload to:** `public_html/php-backend/test/test-email-complete.php`

### Step 2: Run the Test
Visit: `https://rrgreenfieldmadhepura.in/php-backend/test/test-email-complete.php`

The script will:
1. ✅ Check SMTP configuration
2. ✅ Verify PHPMailer installation
3. ✅ Verify EmailService code (SMTPUTF8, AltBody, etc.)
4. ✅ Send a test email (click the button)

### Step 3: Verify Test Email
- Check inbox at: `rrgreenfielddigital@gmail.com`, `rrgreenfieldsch@gmail.com`
- Check spam folder if not in inbox
- If you receive the test email, emails are working! ✅

### Step 4: Test Forms
1. Submit a form on your website (contact, enquiry, admission, visit schedule)
2. Check inbox for the form submission email
3. If emails are received, everything is working! ✅

---

## 🔍 What the Test Checks

### Test 1: SMTP Configuration
- Verifies configuration exists in database
- Checks all required fields (host, port, user, password, from, to)
- Shows current configuration values

### Test 2: PHPMailer Installation
- Checks if PHPMailer files exist
- Verifies all required classes are loaded (PHPMailer, SMTP, Exception)
- Shows PHPMailer file path

### Test 3: EmailService Code Verification
- Checks if `SMTPUTF8 = false` is present (fix for SMTPUTF8 error)
- Checks if `AltBody` is set (plain text version)
- Checks if `ENCRYPTION_SMTPS` is configured for port 465
- Verifies `sendEmailPHPMailer` function exists

### Test 4: Send Test Email
- Actually sends an email using EmailService
- Shows success/failure
- Provides clear feedback

---

## ✅ Expected Results

### All Tests Pass
- ✅ SMTP Configuration: PASSED
- ✅ PHPMailer Installation: PASSED
- ✅ EmailService Code: PASSED
- ✅ Send Test Email: PASSED (and email received in inbox)

**If all pass:** Your email system is working correctly! 🎉

---

## ❌ If Tests Fail

### SMTP Configuration Failed
- Check database has `smtp_config` table
- Verify all fields are filled
- Update via admin panel if needed

### PHPMailer Installation Failed
- Verify PHPMailer files exist at: `php-backend/vendor/PHPMailer/PHPMailer/`
- Check file permissions (should be readable)

### EmailService Code Failed
- Upload the updated `EmailService.php` file
- Verify it has `SMTPUTF8 = false` and `AltBody` settings

### Send Test Email Failed
- Check error message for specific issue
- Verify SMTP credentials are correct
- Check error logs for more details

---

## 📧 Quick Verification Checklist

- [ ] Test script runs without errors
- [ ] All 4 tests show PASSED
- [ ] Test email is received in inbox
- [ ] Form submissions send emails
- [ ] Multiple recipients receive emails
- [ ] Emails not going to spam (or check spam folder)

---

## 🚀 After Verification

Once emails are confirmed working:
1. ✅ Test all forms (contact, enquiry, admission, visit schedule)
2. ✅ Verify all recipients receive emails
3. ✅ Check emails are formatted correctly
4. ✅ Delete test scripts for security (`test-email-complete.php`, `debug-email-web.php`)

---

## 📞 Summary

**To verify emails are working:**
1. Upload `test-email-complete.php`
2. Visit the URL and run all tests
3. Click "Send Test Email" button
4. Check inbox for test email
5. Submit a form and verify email is received

**If all tests pass and emails are received, your email system is working correctly!** ✅
