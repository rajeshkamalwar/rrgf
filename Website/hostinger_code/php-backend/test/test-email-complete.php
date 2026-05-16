<?php
/**
 * Complete Email System Test
 * Tests all aspects of email sending to verify everything works
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/EmailService.php';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Complete Email System Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .warning { color: orange; }
        .info { color: blue; }
        .section { background: white; padding: 20px; margin: 15px 0; border-left: 5px solid #007cba; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        pre { background: #f0f0f0; padding: 15px; border-radius: 3px; overflow-x: auto; }
        h1 { color: #333; }
        h2 { color: #007cba; margin-top: 0; }
        .btn { background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
        .btn:hover { background: #005a8b; }
        .test-result { padding: 10px; margin: 10px 0; border-radius: 3px; }
        .test-pass { background: #d4edda; border: 1px solid #c3e6cb; }
        .test-fail { background: #f8d7da; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <h1>📧 Complete Email System Test</h1>
    <p class="info">This script tests all aspects of your email system.</p>
    
<?php

$allTestsPassed = true;
$testResults = [];

try {
    $emailService = new EmailService();
    
    // Test 1: SMTP Configuration
    echo "<div class='section'><h2>Test 1: SMTP Configuration</h2>";
    
    $config = $emailService->getConfig();
    
    if (!$config) {
        echo "<div class='test-result test-fail'><span class='error'>❌ FAILED:</span> No SMTP configuration found in database!</div>";
        $allTestsPassed = false;
        $testResults[] = ['name' => 'SMTP Configuration', 'status' => 'FAILED', 'message' => 'No configuration found'];
    } else {
        $db = Database::getInstance();
        $fullConfig = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
        $password = base64_decode($fullConfig['password']);
        
        echo "<div class='test-result test-pass'><span class='success'>✅ PASSED:</span> SMTP configuration found</div>";
        echo "<pre>";
        echo "Host:     " . htmlspecialchars($config['host'] ?? 'NOT SET') . "\n";
        echo "Port:     " . htmlspecialchars($config['port'] ?? 'NOT SET') . "\n";
        echo "Username: " . htmlspecialchars($config['user'] ?? 'NOT SET') . "\n";
        echo "From:     " . htmlspecialchars($config['from'] ?? 'NOT SET') . "\n";
        echo "To:       " . htmlspecialchars($config['to'] ?? 'NOT SET') . "\n";
        echo "Password: " . (strlen($password) > 0 ? '[SET - ' . strlen($password) . ' chars]' : 'NOT SET') . "\n";
        echo "</pre>";
        
        // Verify all required fields
        $requiredFields = ['host', 'port', 'user', 'from', 'to'];
        $missingFields = [];
        foreach ($requiredFields as $field) {
            if (empty($config[$field])) {
                $missingFields[] = $field;
            }
        }
        if (empty($password)) {
            $missingFields[] = 'password';
        }
        
        if (!empty($missingFields)) {
            echo "<div class='test-result test-fail'><span class='error'>❌ MISSING FIELDS:</span> " . implode(', ', $missingFields) . "</div>";
            $allTestsPassed = false;
        }
        
        $testResults[] = ['name' => 'SMTP Configuration', 'status' => 'PASSED', 'message' => 'All fields present'];
    }
    
    echo "</div>";
    
    // Test 2: PHPMailer Installation
    echo "<div class='section'><h2>Test 2: PHPMailer Installation</h2>";
    
    $phpmailerPaths = [
        __DIR__ . '/../vendor/PHPMailer/src/PHPMailer.php',
        __DIR__ . '/../vendor/PHPMailer/PHPMailer/src/PHPMailer.php',
        __DIR__ . '/../vendor/PHPMailer/PHPMailer/PHPMailer.php',
        __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php',
    ];
    
    $phpmailerFound = false;
    $phpmailerPath = '';
    
    foreach ($phpmailerPaths as $path) {
        if (file_exists($path)) {
            $phpmailerPath = $path;
            $phpmailerDir = dirname($path);
            
            require_once $path;
            if (file_exists($phpmailerDir . '/SMTP.php')) {
                require_once $phpmailerDir . '/SMTP.php';
            }
            if (file_exists($phpmailerDir . '/Exception.php')) {
                require_once $phpmailerDir . '/Exception.php';
            }
            $phpmailerFound = true;
            break;
        }
    }
    
    if ($phpmailerFound && class_exists('PHPMailer\PHPMailer\PHPMailer') && 
        class_exists('PHPMailer\PHPMailer\SMTP') && 
        class_exists('PHPMailer\PHPMailer\Exception')) {
        echo "<div class='test-result test-pass'><span class='success'>✅ PASSED:</span> PHPMailer is installed and all classes are loaded</div>";
        echo "<pre>Path: " . htmlspecialchars($phpmailerPath) . "</pre>";
        $testResults[] = ['name' => 'PHPMailer Installation', 'status' => 'PASSED', 'message' => 'All classes loaded'];
    } else {
        echo "<div class='test-result test-fail'><span class='error'>❌ FAILED:</span> PHPMailer not found or classes not loaded</div>";
        $allTestsPassed = false;
        $testResults[] = ['name' => 'PHPMailer Installation', 'status' => 'FAILED', 'message' => 'PHPMailer not found'];
    }
    
    echo "</div>";
    
    // Test 3: EmailService Code Verification
    echo "<div class='section'><h2>Test 3: EmailService Code Verification</h2>";
    
    $emailServiceFile = __DIR__ . '/../services/EmailService.php';
    $emailServiceContent = file_get_contents($emailServiceFile);
    
    $codeChecks = [
        'SMTPUTF8' => strpos($emailServiceContent, 'SMTPUTF8 = false') !== false,
        'AltBody' => strpos($emailServiceContent, 'AltBody') !== false,
        'ENCRYPTION_SMTPS' => strpos($emailServiceContent, 'ENCRYPTION_SMTPS') !== false,
        'sendEmailPHPMailer' => strpos($emailServiceContent, 'function sendEmailPHPMailer') !== false,
    ];
    
    $allCodeChecksPassed = true;
    foreach ($codeChecks as $check => $passed) {
        if ($passed) {
            echo "<div class='test-result test-pass'><span class='success'>✅</span> $check: Found</div>";
        } else {
            echo "<div class='test-result test-fail'><span class='error'>❌</span> $check: NOT Found</div>";
            $allCodeChecksPassed = false;
            $allTestsPassed = false;
        }
    }
    
    $testResults[] = ['name' => 'EmailService Code', 'status' => $allCodeChecksPassed ? 'PASSED' : 'FAILED', 'message' => $allCodeChecksPassed ? 'All required code found' : 'Some code missing'];
    
    echo "</div>";
    
    // Test 4: Send Test Email (if button clicked)
    if (isset($_GET['sendtest']) && $config && $phpmailerFound) {
        echo "<div class='section'><h2>Test 4: Send Test Email</h2>";
        
        $testTo = $config['to'];
        $testSubject = '✅ Email System Test - ' . date('Y-m-d H:i:s');
        $testBody = '<h2>Email System Test</h2><p>This is a test email to verify your email system is working correctly.</p><p><strong>Test Time:</strong> ' . date('Y-m-d H:i:s') . '</p><p>If you received this email, your email system is working! ✅</p>';
        
        try {
            $result = $emailService->sendEmailPHPMailer($testTo, $testSubject, $testBody);
            
            if ($result === true) {
                echo "<div class='test-result test-pass'><span class='success'>✅ SUCCESS:</span> Test email sent successfully!</div>";
                echo "<p><strong>To:</strong> " . htmlspecialchars($testTo) . "</p>";
                echo "<p><strong>Subject:</strong> " . htmlspecialchars($testSubject) . "</p>";
                echo "<p class='info'>📧 <strong>Check your inbox (and spam folder) for the test email.</strong></p>";
                $testResults[] = ['name' => 'Send Test Email', 'status' => 'PASSED', 'message' => 'Email sent successfully'];
            } else {
                echo "<div class='test-result test-fail'><span class='error'>❌ FAILED:</span> sendEmailPHPMailer returned false</div>";
                $allTestsPassed = false;
                $testResults[] = ['name' => 'Send Test Email', 'status' => 'FAILED', 'message' => 'Returned false'];
            }
            
        } catch (Exception $e) {
            echo "<div class='test-result test-fail'><span class='error'>❌ ERROR:</span> " . htmlspecialchars($e->getMessage()) . "</div>";
            echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
            $allTestsPassed = false;
            $testResults[] = ['name' => 'Send Test Email', 'status' => 'FAILED', 'message' => $e->getMessage()];
        }
        
        echo "</div>";
    } else {
        echo "<div class='section'><h2>Test 4: Send Test Email</h2>";
        if ($config && $phpmailerFound) {
            echo "<p><a href='?sendtest=1' class='btn'>🚀 Send Test Email</a></p>";
            echo "<p class='info'>Click the button above to send a test email to verify everything works.</p>";
        } else {
            echo "<p class='warning'>⚠ Cannot send test email - fix previous tests first.</p>";
        }
        echo "</div>";
    }
    
    // Summary
    echo "<div class='section'><h2>📊 Test Summary</h2>";
    
    $passedCount = 0;
    $failedCount = 0;
    foreach ($testResults as $result) {
        if ($result['status'] === 'PASSED') {
            $passedCount++;
        } else {
            $failedCount++;
        }
    }
    
    echo "<p><strong>Tests Passed:</strong> <span class='success'>$passedCount</span></p>";
    echo "<p><strong>Tests Failed:</strong> <span class='error'>$failedCount</span></p>";
    
    if ($allTestsPassed && (!isset($_GET['sendtest']) || (isset($_GET['sendtest']) && $testResults[count($testResults)-1]['status'] === 'PASSED'))) {
        echo "<div class='test-result test-pass' style='padding:20px; font-size:18px;'><span class='success'>✅ ALL TESTS PASSED! Your email system is working correctly!</span></div>";
    } else {
        echo "<div class='test-result test-fail' style='padding:20px; font-size:18px;'><span class='error'>❌ SOME TESTS FAILED. Please fix the issues above.</span></div>";
    }
    
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='section'><h2>❌ Fatal Error</h2>";
    echo "<div class='test-result test-fail'><span class='error'>Error:</span> " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
    echo "</div>";
}

?>

    <hr>
    <p><small>💡 <strong>Tip:</strong> After verifying emails work, submit a form on your website and check if emails are received.</small></p>
</body>
</html>
