<?php
/**
 * Test Form Email Sending
 * This script simulates form submission to test email sending
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/EmailService.php';

echo "=== Form Email Test ===\n\n";

try {
    $emailService = new EmailService();
    
    // Get SMTP config
    $config = $emailService->getConfig();
    
    if (!$config) {
        die("❌ ERROR: No SMTP configuration found!\n");
    }
    
    echo "✓ SMTP Configuration found\n";
    echo "  To: " . ($config['to'] ?? 'NOT SET') . "\n\n";
    
    // Test email data (simulating a contact form)
    $testTo = $config['to'];
    $testSubject = 'Test Form Email - ' . date('Y-m-d H:i:s');
    $testBody = '<h2>Test Form Submission</h2><p>This is a test email simulating a form submission.</p><p>Time: ' . date('Y-m-d H:i:s') . '</p>';
    
    echo "Attempting to send email...\n";
    echo "To: $testTo\n";
    echo "Subject: $testSubject\n\n";
    
    try {
        $result = $emailService->sendEmailPHPMailer($testTo, $testSubject, $testBody);
        
        if ($result) {
            echo "✅ SUCCESS: Email sent successfully!\n";
            echo "Check inbox: $testTo\n";
        } else {
            echo "❌ FAILED: sendEmailPHPMailer returned false\n";
        }
        
    } catch (Exception $e) {
        echo "❌ ERROR: " . $e->getMessage() . "\n";
        echo "\nStack trace:\n";
        echo $e->getTraceAsString() . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ FATAL ERROR: " . $e->getMessage() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
}
