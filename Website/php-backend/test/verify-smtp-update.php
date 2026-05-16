<?php
/**
 * Verify SMTP update
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/EmailService.php';

try {
    $db = Database::getInstance();
    $emailService = new EmailService();
    
    echo "=== Verifying SMTP Configuration ===\n\n";
    
    $config = $emailService->getConfig();
    
    if ($config) {
        echo "✅ SMTP Configuration:\n";
        echo "- Host: {$config['host']}\n";
        echo "- Port: {$config['port']}\n";
        echo "- User: {$config['user']}\n";
        echo "- From: {$config['from']}\n";
        echo "- To: {$config['to']}\n";
        echo "- Has Password: " . ($config['hasPassword'] ? 'YES' : 'NO') . "\n\n";
        
        // Check recipients
        $recipients = preg_split('/[,;]/', $config['to']);
        $recipients = array_map('trim', $recipients);
        $recipients = array_filter($recipients);
        
        echo "Email Recipients (" . count($recipients) . "):\n";
        foreach ($recipients as $i => $email) {
            echo "  " . ($i + 1) . ". $email\n";
        }
        
        // Expected emails
        $expected = ['rrgreenfielddigital@gmail.com', 'rrgreenfieldsch@gmail.com'];
        $allPresent = true;
        
        echo "\nExpected recipients check:\n";
        foreach ($expected as $expectedEmail) {
            $found = in_array($expectedEmail, $recipients);
            echo "  " . ($found ? '✅' : '❌') . " $expectedEmail\n";
            if (!$found) $allPresent = false;
        }
        
        if ($allPresent) {
            echo "\n✅ All expected recipients are configured!\n";
        } else {
            echo "\n⚠️  Some expected recipients are missing.\n";
        }
        
    } else {
        echo "❌ No SMTP configuration found\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
