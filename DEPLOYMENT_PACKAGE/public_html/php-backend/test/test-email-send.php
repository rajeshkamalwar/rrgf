<?php
/**
 * Test Email Sending with Multiple Recipients
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/EmailService.php';

try {
    $emailService = new EmailService();
    
    echo "=== Testing Email Configuration ===\n\n";
    
    // Check if PHPMailer is available
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        echo "✅ PHPMailer is available\n";
    } else {
        echo "⚠️  PHPMailer is NOT available - will use basic mail() function\n";
        echo "   For proper SMTP support, install PHPMailer:\n";
        echo "   composer require phpmailer/phpmailer\n\n";
    }
    
    $config = $emailService->getConfig();
    
    if (!$config) {
        echo "❌ SMTP configuration not found\n";
        exit(1);
    }
    
    echo "Current Configuration:\n";
    echo "- From: {$config['from']}\n";
    echo "- To: {$config['to']}\n";
    echo "- Host: {$config['host']}\n";
    echo "- Port: {$config['port']}\n\n";
    
    // Check for multiple recipients
    $toField = $config['to'];
    $recipients = preg_split('/[,;]/', $toField);
    $recipients = array_map('trim', $recipients);
    $recipients = array_filter($recipients);
    
    echo "Recipients (" . count($recipients) . "):\n";
    foreach ($recipients as $i => $email) {
        echo "  " . ($i + 1) . ". $email\n";
    }
    echo "\n";
    
    // Ask if user wants to send test email
    echo "Would you like to send a test email? (This will send to all recipients above)\n";
    echo "Note: This requires PHPMailer for SMTP authentication to work properly.\n\n";
    
    // For automated testing, we'll try to send
    try {
        $subject = "Test Email from RRGF System - " . date('Y-m-d H:i:s');
        $body = "<h2>Test Email</h2><p>This is a test email to verify SMTP configuration.</p><p>Timestamp: " . date('Y-m-d H:i:s') . "</p><p>If you receive this, your email configuration is working correctly!</p>";
        
        echo "Attempting to send test email...\n";
        $result = $emailService->sendEmailPHPMailer($config['to'], $subject, $body);
        
        if ($result) {
            echo "✅ Test email sent successfully!\n";
            echo "Check your inbox(es) at: {$config['to']}\n";
        } else {
            echo "❌ Email send returned false (check error logs)\n";
        }
    } catch (Exception $e) {
        echo "❌ Error sending email: " . $e->getMessage() . "\n";
        echo "\nCommon issues:\n";
        echo "1. PHPMailer not installed - run: composer require phpmailer/phpmailer\n";
        echo "2. SMTP credentials incorrect\n";
        echo "3. Port/encryption mismatch (465 = SMTPS, 587 = STARTTLS)\n";
        echo "4. Firewall blocking SMTP connection\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
