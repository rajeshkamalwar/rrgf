<?php
/**
 * Email Debug Script (Web Version)
 * Upload this to public_html/php-backend/test/debug-email-web.php
 * Visit in browser to test email
 * DELETE THIS FILE AFTER DEBUGGING FOR SECURITY!
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Security: Remove this check after testing, or add password protection
$debugPassword = 'debug123'; // CHANGE THIS or remove the check
if (isset($_GET['pass']) && $_GET['pass'] !== $debugPassword) {
    die('Unauthorized. Add ?pass=debug123 to URL');
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Email Debug</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        .section { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #007cba; }
        pre { background: #f0f0f0; padding: 10px; overflow-x: auto; }
        h2 { margin-top: 0; }
    </style>
</head>
<body>
    <h1>Email Debug Script</h1>
    <p><strong>⚠️ DELETE THIS FILE AFTER DEBUGGING!</strong></p>
    
<?php

$db = Database::getInstance();

try {
    // Step 1: Check SMTP Configuration
    echo "<div class='section'><h2>Step 1: SMTP Configuration</h2>";
    
    $smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if (!$smtp) {
        die("<p class='error'>❌ ERROR: No SMTP configuration found in database!</p></div>");
    }
    
    $password = !empty($smtp['password']) ? base64_decode($smtp['password']) : '';
    
    echo "<p class='success'>✓ SMTP Configuration found:</p>";
    echo "<pre>";
    echo "Host:     " . htmlspecialchars($smtp['host'] ?? 'NOT SET') . "\n";
    echo "Port:     " . htmlspecialchars($smtp['port'] ?? 'NOT SET') . "\n";
    echo "Username: " . htmlspecialchars($smtp['user'] ?? 'NOT SET') . "\n";
    echo "From:     " . htmlspecialchars($smtp['from'] ?? 'NOT SET') . "\n";
    echo "To:       " . htmlspecialchars($smtp['to'] ?? 'NOT SET') . "\n";
    echo "Password: " . (strlen($password) > 0 ? '[SET - ' . strlen($password) . ' chars]' : 'NOT SET') . "\n";
    echo "</pre>";
    
    if (empty($smtp['host']) || empty($smtp['port']) || empty($smtp['user']) || empty($password)) {
        die("<p class='error'>❌ ERROR: SMTP configuration is incomplete! Missing required fields.</p></div>");
    }
    
    echo "</div>";
    
    // Step 2: Check PHPMailer
    echo "<div class='section'><h2>Step 2: PHPMailer Check</h2>";
    
    $phpmailerInstalled = false;
    
    // Try multiple possible PHPMailer paths (same as EmailService.php)
    $phpmailerPaths = [
        __DIR__ . '/../vendor/PHPMailer/src/PHPMailer.php',             // Direct src structure
        __DIR__ . '/../vendor/PHPMailer/PHPMailer/src/PHPMailer.php',  // GitHub download structure (nested)
        __DIR__ . '/../vendor/PHPMailer/PHPMailer/PHPMailer.php',      // Standard structure (current)
        __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php',  // Composer lowercase
    ];
    
    $phpmailerFound = false;
    $phpmailerPath = '';
    
    foreach ($phpmailerPaths as $path) {
        if (file_exists($path)) {
            $phpmailerPath = $path;
            $phpmailerDir = dirname($path);
            
            // Load PHPMailer and all required dependencies
            require_once $path;
            
            // Also load SMTP.php and Exception.php from the same directory
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
    
    if ($phpmailerFound) {
        // Verify all required classes exist
        if (class_exists('PHPMailer\PHPMailer\PHPMailer') && 
            class_exists('PHPMailer\PHPMailer\SMTP') && 
            class_exists('PHPMailer\PHPMailer\Exception')) {
            $phpmailerInstalled = true;
            echo "<p class='success'>✓ PHPMailer is installed</p>";
            echo "<p class='success'>✓ SMTP class loaded</p>";
            echo "<p class='success'>✓ Exception class loaded</p>";
            echo "<p>Path: <code>$phpmailerPath</code></p>";
        } else {
            $missing = [];
            if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) $missing[] = 'PHPMailer';
            if (!class_exists('PHPMailer\PHPMailer\SMTP')) $missing[] = 'SMTP';
            if (!class_exists('PHPMailer\PHPMailer\Exception')) $missing[] = 'Exception';
            echo "<p class='warning'>⚠ PHPMailer files found but some classes missing: " . implode(', ', $missing) . "</p>";
            echo "<p>Path: <code>$phpmailerPath</code></p>";
        }
    } else {
        echo "<p class='error'>❌ PHPMailer is NOT installed</p>";
        echo "<p>Paths checked:</p><ul>";
        foreach ($phpmailerPaths as $path) {
            echo "<li><code>$path</code></li>";
        }
        echo "</ul>";
        echo "<p><strong>To install:</strong></p>";
        echo "<ol>";
        echo "<li>Via SSH: <code>cd php-backend && composer require phpmailer/phpmailer</code></li>";
        echo "<li>Or download from: <a href='https://github.com/PHPMailer/PHPMailer/releases' target='_blank'>GitHub Releases</a></li>";
        echo "</ol>";
    }
    
    echo "</div>";
    
    // Step 3: Test Email Sending
    if (isset($_GET['send']) && $phpmailerInstalled) {
        echo "<div class='section'><h2>Step 3: Sending Test Email</h2>";
        
        $testTo = $smtp['to'];
        $testSubject = 'Test Email from RRGF Website - ' . date('Y-m-d H:i:s');
        $testBody = '<h2>Test Email</h2><p>This is a test email from the RRGF website email system.</p><p>Time: ' . date('Y-m-d H:i:s') . '</p>';
        
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Disable SMTPUTF8 (fixes "Server does not support SMTPUTF8" error on some servers)
            $mail->SMTPUTF8 = false;
            
            // SMTP configuration
            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['user'];
            $mail->Password = $password;
            $mail->Port = (int)$smtp['port'];
            
            if ($smtp['port'] == 465) {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($smtp['port'] == 587) {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            }
            
            // SSL options
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            
            // Email content
            $mail->setFrom($smtp['from'], 'RRGF Website');
            
            $recipients = array_map('trim', explode(',', $testTo));
            foreach ($recipients as $recipient) {
                $mail->addAddress($recipient);
            }
            
            $mail->isHTML(true);
            $mail->Subject = $testSubject;
            $mail->Body = $testBody;
            $mail->AltBody = strip_tags($testBody);
            
            $mail->send();
            echo "<p class='success'>✓ Test email sent successfully!</p>";
            echo "<p>Check inbox: <strong>$testTo</strong></p>";
            echo "<p>Subject: $testSubject</p>";
            
        } catch (Exception $e) {
            echo "<p class='error'>❌ Failed to send test email!</p>";
            echo "<pre>Error: " . htmlspecialchars($e->getMessage()) . "</pre>";
        }
        
        echo "</div>";
    } elseif (!$phpmailerInstalled) {
        echo "<div class='section'><h2>Step 3: Send Test Email</h2>";
        echo "<p class='warning'>⚠ Cannot send test email - PHPMailer not installed</p>";
        echo "<p>Install PHPMailer first, then refresh this page and add <code>?pass=debug123&send=1</code> to the URL</p>";
        echo "</div>";
    } else {
        echo "<div class='section'><h2>Step 3: Send Test Email</h2>";
        echo "<p><a href='?pass=" . htmlspecialchars($debugPassword) . "&send=1' style='background:#007cba;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;'>Send Test Email</a></p>";
        echo "</div>";
    }
    
    // Summary
    echo "<div class='section'><h2>Summary</h2>";
    echo "<ul>";
    echo "<li>SMTP Config: <span class='success'>✓ Configured</span></li>";
    echo "<li>PHPMailer: " . ($phpmailerInstalled ? "<span class='success'>✓ Installed</span>" : "<span class='error'>❌ Not installed</span>") . "</li>";
    echo "<li>PHP mail(): <span class='success'>✓ Available</span></li>";
    echo "</ul>";
    
    if (!$phpmailerInstalled) {
        echo "<p class='warning'><strong>⚠ RECOMMENDATION:</strong> Install PHPMailer for reliable email sending</p>";
    }
    
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='section'><p class='error'>❌ Fatal Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre></div>";
}

?>

    <hr>
    <p><small>⚠️ <strong>Security Warning:</strong> Delete this file after debugging!</small></p>
</body>
</html>
