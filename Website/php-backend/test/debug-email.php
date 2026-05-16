<?php
/**
 * Email Debug Script
 * Tests SMTP configuration and email sending
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

echo "=== Email Debug Script ===\n\n";

$db = Database::getInstance();

try {
    // Step 1: Check SMTP Configuration
    echo "Step 1: Checking SMTP Configuration...\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    $smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if (!$smtp) {
        die("❌ ERROR: No SMTP configuration found in database!\n");
    }
    
    $password = !empty($smtp['password']) ? base64_decode($smtp['password']) : '';
    
    echo "✓ SMTP Configuration found:\n";
    echo "  Host:     " . ($smtp['host'] ?? 'NOT SET') . "\n";
    echo "  Port:     " . ($smtp['port'] ?? 'NOT SET') . "\n";
    echo "  Username: " . ($smtp['user'] ?? 'NOT SET') . "\n";
    echo "  From:     " . ($smtp['from'] ?? 'NOT SET') . "\n";
    echo "  To:       " . ($smtp['to'] ?? 'NOT SET') . "\n";
    echo "  Password: " . (strlen($password) > 0 ? '[SET - ' . strlen($password) . ' chars]' : 'NOT SET') . "\n";
    
    if (empty($smtp['host']) || empty($smtp['port']) || empty($smtp['user']) || empty($password)) {
        die("\n❌ ERROR: SMTP configuration is incomplete! Missing required fields.\n");
    }
    
    echo "\n";
    
    // Step 2: Check PHPMailer
    echo "Step 2: Checking PHPMailer...\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    $phpmailerInstalled = false;
    $phpmailerPath = __DIR__ . '/../vendor/PHPMailer/PHPMailer/PHPMailer.php';
    
    if (file_exists($phpmailerPath)) {
        require_once $phpmailerPath;
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            $phpmailerInstalled = true;
            echo "✓ PHPMailer is installed\n";
        } else {
            echo "⚠ PHPMailer file exists but class not found\n";
        }
    } else {
        echo "❌ PHPMailer is NOT installed\n";
        echo "   Path checked: $phpmailerPath\n";
        echo "   To install: composer require phpmailer/phpmailer\n";
    }
    
    echo "\n";
    
    // Step 3: Test SMTP Connection (if PHPMailer available)
    if ($phpmailerInstalled) {
        echo "Step 3: Testing SMTP Connection...\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Enable verbose debug output
            $mail->SMTPDebug = 2; // Enable verbose debug output
            $mail->Debugoutput = function($str, $level) {
                echo "  [SMTP] $str";
            };
            
            // SMTP configuration
            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['user'];
            $mail->Password = $password;
            $mail->Port = (int)$smtp['port'];
            
            // Set encryption based on port
            if ($smtp['port'] == 465) {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
                echo "  Using SSL encryption (port 465)\n";
            } elseif ($smtp['port'] == 587) {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                echo "  Using STARTTLS encryption (port 587)\n";
            } else {
                $mail->SMTPSecure = '';
                echo "  No encryption specified (port {$smtp['port']})\n";
            }
            
            // SSL options for local development (if needed)
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            
            echo "\n  Connecting to {$smtp['host']}:{$smtp['port']}...\n";
            
            // Test connection only (don't send email yet)
            $mail->smtpConnect();
            echo "\n✓ SMTP connection successful!\n";
            $mail->smtpClose();
            
        } catch (Exception $e) {
            echo "\n❌ SMTP Connection failed!\n";
            echo "  Error: " . $e->getMessage() . "\n";
            echo "\n  Common issues:\n";
            echo "  - Wrong host/port\n";
            echo "  - Incorrect username/password\n";
            echo "  - Firewall blocking port\n";
            echo "  - SSL/TLS certificate issues\n";
        }
        
        echo "\n";
    } else {
        echo "Step 3: Skipping SMTP connection test (PHPMailer not installed)\n\n";
    }
    
    // Step 4: Test Email Sending
    echo "Step 4: Testing Email Sending...\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    $testTo = $smtp['to'];
    $testSubject = 'Test Email from RRGF Website - ' . date('Y-m-d H:i:s');
    $testBody = '<h2>Test Email</h2><p>This is a test email from the RRGF website email system.</p><p>Time: ' . date('Y-m-d H:i:s') . '</p>';
    
    echo "Sending test email to: $testTo\n";
    echo "Subject: $testSubject\n\n";
    
    if ($phpmailerInstalled) {
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
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
            
            // SSL options for development
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            
            // Email content
            $mail->setFrom($smtp['from'], 'RRGF Website');
            
            // Handle multiple recipients
            $recipients = array_map('trim', explode(',', $testTo));
            foreach ($recipients as $recipient) {
                $mail->addAddress($recipient);
            }
            
            $mail->isHTML(true);
            $mail->Subject = $testSubject;
            $mail->Body = $testBody;
            $mail->AltBody = strip_tags($testBody);
            
            $mail->send();
            echo "✓ Test email sent successfully!\n";
            echo "  Check inbox: $testTo\n";
            
        } catch (Exception $e) {
            echo "❌ Failed to send test email!\n";
            echo "  Error: " . $e->getMessage() . "\n";
            echo "\n  Debug Info:\n";
            echo "  - Host: {$smtp['host']}\n";
            echo "  - Port: {$smtp['port']}\n";
            echo "  - Username: {$smtp['user']}\n";
            echo "  - From: {$smtp['from']}\n";
            echo "  - To: $testTo\n";
        }
    } else {
        echo "⚠ Cannot send test email - PHPMailer not installed\n";
        echo "  Installing PHPMailer will enable proper SMTP email sending\n";
        echo "  Run: composer require phpmailer/phpmailer\n";
    }
    
    echo "\n";
    
    // Step 5: Check PHP mail() function
    echo "Step 5: Checking PHP mail() function...\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    if (function_exists('mail')) {
        echo "✓ PHP mail() function is available\n";
    } else {
        echo "❌ PHP mail() function is NOT available\n";
    }
    
    echo "\n";
    
    // Summary
    echo "=== Summary ===\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "SMTP Config:     " . (($smtp && !empty($smtp['host'])) ? "✓ Configured" : "❌ Not configured") . "\n";
    echo "PHPMailer:       " . ($phpmailerInstalled ? "✓ Installed" : "❌ Not installed") . "\n";
    echo "PHP mail():      " . (function_exists('mail') ? "✓ Available" : "❌ Not available") . "\n";
    echo "\n";
    
    if (!$phpmailerInstalled) {
        echo "⚠ RECOMMENDATION: Install PHPMailer for reliable email sending\n";
        echo "  Run: composer require phpmailer/phpmailer\n";
        echo "  Or download manually and place in: vendor/PHPMailer/PHPMailer/\n";
    }
    
} catch (Exception $e) {
    echo "❌ Fatal Error: " . $e->getMessage() . "\n";
    echo "  Stack trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
