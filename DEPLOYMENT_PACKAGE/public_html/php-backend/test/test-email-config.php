<?php
/**
 * Test Email Configuration
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/EmailService.php';

try {
    $db = Database::getInstance();
    
    echo "=== SMTP Configuration Check ===\n\n";
    
    // Get SMTP config
    $smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if (!$smtp) {
        echo "❌ No SMTP configuration found in database\n";
        exit(1);
    }
    
    echo "SMTP Settings:\n";
    echo "- Host: " . ($smtp['host'] ?? 'NOT SET') . "\n";
    echo "- Port: " . ($smtp['port'] ?? 'NOT SET') . "\n";
    echo "- User: " . ($smtp['user'] ?? 'NOT SET') . "\n";
    echo "- From Email: " . ($smtp['from_email'] ?? 'NOT SET') . "\n";
    echo "- To Email: " . ($smtp['to_email'] ?? 'NOT SET') . "\n";
    echo "- Has Password: " . (!empty($smtp['password']) ? 'YES' : 'NO') . "\n\n";
    
    // Check if 'to' field contains multiple emails
    $toEmail = $smtp['to_email'] ?? '';
    if (strpos($toEmail, ',') !== false || strpos($toEmail, ';') !== false) {
        $emails = preg_split('/[,;]/', $toEmail);
        $emails = array_map('trim', $emails);
        echo "Multiple recipient emails detected:\n";
        foreach ($emails as $i => $email) {
            echo "  " . ($i + 1) . ". $email\n";
        }
        echo "\n";
    }
    
    // Test EmailService
    echo "=== Testing EmailService ===\n\n";
    
    $emailService = new EmailService();
    $config = $emailService->getConfig();
    
    if ($config) {
        echo "✅ EmailService loaded configuration successfully\n";
        echo "From: {$config['from']}\n";
        echo "To: {$config['to']}\n\n";
        
        // Try to send a test email
        echo "Attempting to send test email...\n";
        try {
            $subject = "Test Email from RRGF System";
            $body = "This is a test email to verify SMTP configuration is working correctly.\n\nTimestamp: " . date('Y-m-d H:i:s');
            
            $result = $emailService->sendEmailPHPMailer($config['to'], $subject, $body);
            
            if ($result) {
                echo "✅ Test email sent successfully!\n";
                echo "Check your inbox(es) at: {$config['to']}\n";
            } else {
                echo "❌ Failed to send test email (returned false)\n";
            }
        } catch (Exception $e) {
            echo "❌ Error sending test email: " . $e->getMessage() . "\n";
        }
    } else {
        echo "❌ EmailService could not load configuration\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
