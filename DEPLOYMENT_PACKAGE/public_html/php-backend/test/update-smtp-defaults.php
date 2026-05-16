<?php
/**
 * Update SMTP configuration with default emails and password
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    echo "=== Updating SMTP Configuration ===\n\n";
    
    // Get current config
    $current = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if ($current) {
        echo "Current Configuration:\n";
        echo "- Host: {$current['host']}\n";
        echo "- Port: {$current['port']}\n";
        echo "- User: {$current['user']}\n";
        echo "- From: {$current['from']}\n";
        echo "- To: {$current['to']}\n\n";
    }
    
    // New values
    $defaultToEmails = 'rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com';
    $newPassword = 'Welcome@2050@##';
    
    echo "Updating to:\n";
    echo "- To: $defaultToEmails\n";
    echo "- Password: (updating...)\n\n";
    
    // Encode password (base64)
    $encodedPassword = base64_encode($newPassword);
    
    if ($current) {
        // Update existing
        $db->execute(
            "UPDATE smtp_config SET `to` = ?, password = ? WHERE id = ?",
            [$defaultToEmails, $encodedPassword, $current['id']]
        );
        echo "✅ SMTP configuration updated successfully!\n\n";
    } else {
        // Create new if doesn't exist
        echo "❌ No existing SMTP config found. Creating new...\n";
        echo "Please configure SMTP settings in Admin Panel first.\n";
        exit(1);
    }
    
    // Verify
    $updated = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    echo "Updated Configuration:\n";
    echo "- Host: {$updated['host']}\n";
    echo "- Port: {$updated['port']}\n";
    echo "- User: {$updated['user']}\n";
    echo "- From: {$updated['from']}\n";
    echo "- To: {$updated['to']}\n";
    echo "- Password: " . (base64_decode($updated['password']) === $newPassword ? '✅ Verified' : '❌ Mismatch') . "\n";
    
    // Show recipients
    $recipients = preg_split('/[,;]/', $updated['to']);
    $recipients = array_map('trim', $recipients);
    echo "\nRecipients (" . count($recipients) . "):\n";
    foreach ($recipients as $i => $email) {
        echo "  " . ($i + 1) . ". $email\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
