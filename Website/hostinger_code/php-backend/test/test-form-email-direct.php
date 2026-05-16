<?php
/**
 * Direct Form Email Test
 * Simulates exactly what forms do when sending emails
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/EmailService.php';

echo "<!DOCTYPE html><html><head><title>Form Email Test</title>";
echo "<style>body{font-family:monospace;padding:20px;} .success{color:green;} .error{color:red;}</style>";
echo "</head><body>";
echo "<h1>Form Email Test</h1>";
echo "<p>This simulates exactly what forms do when sending emails.</p><hr>";

try {
    $emailService = new EmailService();
    
    // Get SMTP config (same as forms do)
    $config = $emailService->getConfig();
    
    if (!$config) {
        die("<p class='error'>❌ ERROR: No SMTP configuration found!</p></body></html>");
    }
    
    echo "<p class='success'>✓ SMTP Configuration found</p>";
    echo "<pre>To: " . htmlspecialchars($config['to'] ?? 'NOT SET') . "</pre>";
    
    // Simulate enquiry form data (like in PublicController)
    $testData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '1234567890',
        'studentName' => 'Test Student',
        'class' => 'Class I',
        'subject' => 'Test Subject',
        'message' => 'This is a test message'
    ];
    
    // Format email body (same as forms do)
    $subject = 'New Enquiry from ' . $testData['name'];
    $body = "
    <h2>New Enquiry</h2>
    <p><strong>Name:</strong> {$testData['name']}</p>
    <p><strong>Email:</strong> " . ($testData['email'] ?? 'N/A') . "</p>
    <p><strong>Phone:</strong> {$testData['phone']}</p>
    <p><strong>Student Name:</strong> " . ($testData['studentName'] ?? 'N/A') . "</p>
    <p><strong>Class:</strong> " . ($testData['class'] ?? 'N/A') . "</p>
    <p><strong>Subject:</strong> " . ($testData['subject'] ?? 'N/A') . "</p>
    <p><strong>Message:</strong> " . ($testData['message'] ?? 'N/A') . "</p>
    ";
    
    echo "<hr><h2>Attempting to Send Email...</h2>";
    echo "<pre>To: " . htmlspecialchars($config['to']) . "\n";
    echo "Subject: " . htmlspecialchars($subject) . "</pre>";
    
    // Try to send (same as forms do)
    try {
        $result = $emailService->sendEmailPHPMailer($config['to'], $subject, $body);
        
        if ($result) {
            echo "<p class='success'>✅ SUCCESS: Email sent successfully!</p>";
            echo "<p>Check inbox: <strong>" . htmlspecialchars($config['to']) . "</strong></p>";
        } else {
            echo "<p class='error'>❌ FAILED: sendEmailPHPMailer returned false</p>";
        }
        
    } catch (Exception $e) {
        echo "<p class='error'>❌ ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
        echo "<h3>Full Error Details:</h3>";
        echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ FATAL ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "</body></html>";
