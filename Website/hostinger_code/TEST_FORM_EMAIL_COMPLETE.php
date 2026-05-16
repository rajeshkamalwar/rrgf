<?php
/**
 * Complete Form Email Test
 * Tests email sending exactly like forms do, with error display enabled
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Simulate what forms do - include all necessary files
require_once __DIR__ . '/php-backend/config/database.php';
require_once __DIR__ . '/php-backend/services/Database.php';
require_once __DIR__ . '/php-backend/services/EmailService.php';

echo "<!DOCTYPE html><html><head><title>Form Email Complete Test</title>";
echo "<style>body{font-family:monospace;padding:20px;} .success{color:green;} .error{color:red;} pre{background:#f0f0f0;padding:10px;}</style>";
echo "</head><body>";
echo "<h1>Complete Form Email Test</h1>";
echo "<p>This test uses EXACTLY the same code path as forms use.</p><hr>";

try {
    $emailService = new EmailService();
    
    // Get config (same as forms)
    $config = $emailService->getConfig();
    
    if (!$config) {
        die("<p class='error'>❌ No SMTP config found</p></body></html>");
    }
    
    echo "<p class='success'>✓ SMTP Config loaded</p>";
    echo "<pre>To: " . htmlspecialchars($config['to']) . "</pre>";
    
    // Simulate enquiry form submission
    $subject = 'Test Form Email - ' . date('Y-m-d H:i:s');
    $body = '<h2>Test Form Submission</h2><p>This email simulates a form submission.</p><p>Time: ' . date('Y-m-d H:i:s') . '</p>';
    
    echo "<hr><h2>Sending Email...</h2>";
    echo "<pre>To: " . htmlspecialchars($config['to']) . "\n";
    echo "Subject: " . htmlspecialchars($subject) . "</pre>";
    
    // Call EXACTLY what forms call - but show errors
    try {
        $result = $emailService->sendEmailPHPMailer($config['to'], $subject, $body);
        
        if ($result === true) {
            echo "<p class='success'><strong>✅ SUCCESS!</strong> Email sent successfully.</p>";
            echo "<p>Check inbox: <strong>" . htmlspecialchars($config['to']) . "</strong></p>";
        } else {
            echo "<p class='error'><strong>❌ FAILED:</strong> sendEmailPHPMailer returned: " . var_export($result, true) . "</p>";
        }
        
    } catch (Exception $e) {
        echo "<p class='error'><strong>❌ EXCEPTION:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
        echo "<h3>Full Error Details:</h3>";
        echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'><strong>❌ FATAL:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "</body></html>";
