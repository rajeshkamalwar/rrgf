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
    
    echo "All SMTP fields:\n";
    foreach ($smtp as $key => $value) {
        if ($key === 'password') {
            echo "- $key: " . (!empty($value) ? '(set - ' . strlen($value) . ' chars)' : 'NOT SET') . "\n";
        } else {
            echo "- $key: " . ($value ?? 'NULL') . "\n";
        }
    }
    
    echo "\n=== Recipient Emails Analysis ===\n";
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
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
