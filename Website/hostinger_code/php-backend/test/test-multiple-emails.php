<?php
/**
 * Test Multiple Email Recipients
 * This script helps verify multiple email addresses are properly formatted
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Multiple Email Recipients Test ===\n\n";

try {
    // Get current SMTP config
    $smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if (!$smtp) {
        die("❌ No SMTP configuration found!\n");
    }
    
    echo "Current 'To' field in database:\n";
    echo "  Raw value: " . var_export($smtp['to'], true) . "\n";
    echo "  Length: " . strlen($smtp['to']) . " characters\n\n";
    
    // Test parsing
    $toAddresses = preg_split('/[,;]/', $smtp['to']);
    $toAddresses = array_map('trim', $toAddresses);
    $toAddresses = array_filter($toAddresses, function($email) {
        return !empty($email);
    });
    
    echo "Parsed email addresses (" . count($toAddresses) . " total):\n";
    foreach ($toAddresses as $index => $email) {
        // Basic email validation
        $isValid = filter_var($email, FILTER_VALIDATE_EMAIL);
        $status = $isValid ? "✓ Valid" : "✗ Invalid format";
        echo "  " . ($index + 1) . ". $email - $status\n";
    }
    
    echo "\n";
    echo "=== Recommended Format ===\n";
    echo "For 3 emails, use one of these formats:\n";
    echo "  1. Comma separated:\n";
    echo "     rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com,doprudra@gmail.com\n";
    echo "\n";
    echo "  2. Comma with spaces:\n";
    echo "     rrgreenfielddigital@gmail.com, rrgreenfieldsch@gmail.com, doprudra@gmail.com\n";
    echo "\n";
    echo "  3. Semicolon separated:\n";
    echo "     rrgreenfielddigital@gmail.com;rrgreenfieldsch@gmail.com;doprudra@gmail.com\n";
    
    echo "\n";
    echo "=== Common Issues ===\n";
    echo "1. Extra spaces: Make sure no extra spaces before/after commas\n";
    echo "2. Invalid email format: Check for typos in email addresses\n";
    echo "3. Database encoding: Ensure UTF-8 encoding\n";
    echo "4. SMTP server limits: Some servers limit recipients per email\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
