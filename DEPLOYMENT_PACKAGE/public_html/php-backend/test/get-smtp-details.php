<?php
/**
 * Get SMTP Configuration Details
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== SMTP Configuration Details ===\n\n";

try {
    $smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if ($smtp) {
        echo "Current SMTP Configuration:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        echo "SMTP Host:      " . ($smtp['host'] ?? 'NOT SET') . "\n";
        echo "SMTP Port:      " . ($smtp['port'] ?? 'NOT SET') . "\n";
        echo "Username:       " . ($smtp['user'] ?? 'NOT SET') . "\n";
        echo "From Email:     " . ($smtp['from'] ?? 'NOT SET') . "\n";
        echo "To Email(s):    " . ($smtp['to'] ?? 'NOT SET') . "\n";
        
        if (isset($smtp['password']) && !empty($smtp['password'])) {
            $password = base64_decode($smtp['password']);
            echo "Password:       " . (strlen($password) > 0 ? '[SET] ' . $password : 'NOT SET') . "\n";
        } else {
            echo "Password:       NOT SET\n";
        }
        
        echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        
        // Parse multiple recipients
        $recipients = explode(',', $smtp['to'] ?? '');
        $recipients = array_map('trim', $recipients);
        $recipients = array_filter($recipients);
        
        echo "\nEmail Recipients (" . count($recipients) . "):\n";
        foreach ($recipients as $index => $email) {
            echo "  " . ($index + 1) . ". $email\n";
        }
        
    } else {
        echo "❌ No SMTP configuration found in database!\n\n";
        echo "Default Configuration (to set):\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        echo "SMTP Host:      smtp.gmail.com\n";
        echo "SMTP Port:      587 (or 465 for SSL)\n";
        echo "Username:       [Your Gmail address]\n";
        echo "Password:       Welcome@2050@##\n";
        echo "From Email:     info@rrgreenfieldmadhepura.in\n";
        echo "To Email(s):    rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com\n";
        echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    }
    
    echo "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
