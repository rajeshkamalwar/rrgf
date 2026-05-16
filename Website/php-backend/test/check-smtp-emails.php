<?php
/**
 * Check SMTP 'to' field for multiple emails
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    echo "=== SMTP Configuration Details ===\n\n";
    
    $smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if (!$smtp) {
        echo "❌ No SMTP configuration found\n";
        exit(1);
    }
    
    echo "SMTP Configuration:\n";
    echo "- Host: {$smtp['host']}\n";
    echo "- Port: {$smtp['port']}\n";
    echo "- User: {$smtp['user']}\n";
    echo "- From: {$smtp['from']}\n";
    echo "- To: {$smtp['to']}\n";
    echo "- Has Password: " . (!empty($smtp['password']) ? 'YES' : 'NO') . "\n\n";
    
    echo "=== Recipient Emails Analysis ===\n";
    $toField = $smtp['to'] ?? '';
    
    if (empty($toField)) {
        echo "❌ 'to' field is empty or NULL\n";
    } else {
        echo "To field value: '$toField'\n\n";
        
        // Check for multiple emails
        if (strpos($toField, ',') !== false || strpos($toField, ';') !== false) {
            $emails = preg_split('/[,;]/', $toField);
            $emails = array_map('trim', $emails);
            $emails = array_filter($emails);
            
            echo "Multiple emails detected (" . count($emails) . "):\n";
            foreach ($emails as $i => $email) {
                echo "  " . ($i + 1) . ". $email\n";
            }
        } else {
            echo "Single email detected:\n";
            echo "  1. $toField\n";
            echo "\n⚠️  You mentioned 2 Gmail IDs. If you need multiple recipients,\n";
            echo "   separate them with commas (e.g., email1@gmail.com, email2@gmail.com)\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
