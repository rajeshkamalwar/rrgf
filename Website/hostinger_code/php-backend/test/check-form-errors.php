<?php
/**
 * Check Form Email Errors
 * Shows if there are any error logs related to email sending from forms
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== Form Email Error Check ===\n\n";
echo "This script checks error logs for email sending failures.\n\n";

echo "To check errors on Hostinger:\n";
echo "1. Check PHP error log: usually in public_html/logs/ or error_log file\n";
echo "2. Look for entries containing: 'Email send failed'\n";
echo "3. Check Hostinger error log viewer in cPanel\n\n";

echo "Common errors to look for:\n";
echo "- SMTP connection failures\n";
echo "- Authentication errors\n";
echo "- PHPMailer class not found\n";
echo "- SMTPUTF8 errors\n";
echo "- Timeout errors\n\n";

echo "=== Test Form Email Directly ===\n";
echo "Run: php test-form-email.php\n";
echo "Or visit via browser: test-form-email.php\n\n";

echo "=== Enable Error Display (Temporary) ===\n";
echo "If you want to see errors in form responses, temporarily modify PublicController.php:\n";
echo "Change: error_log('Email send failed: ' . \$e->getMessage());\n";
echo "To:     Response::error('Email send failed: ' . \$e->getMessage(), 500);\n";
echo "(Remember to revert after debugging!)\n";
