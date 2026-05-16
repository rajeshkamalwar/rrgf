<?php
/**
 * Quick fix: Add OneDrive columns to gallery_config table
 */

require_once __DIR__ . '/../config/database.php';

$dbConfig = require __DIR__ . '/../config/database.php';

try {
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset={$dbConfig['charset']}",
        $dbConfig['username'],
        $dbConfig['password'],
        $dbConfig['options']
    );
    
    echo "=== Fixing Database Migration ===\n\n";
    
    // Check if OneDrive columns exist
    $checkLink = $pdo->query("SHOW COLUMNS FROM gallery_config LIKE 'onedrive_folder_link'");
    $checkId = $pdo->query("SHOW COLUMNS FROM gallery_config LIKE 'onedrive_folder_id'");
    
    if ($checkLink->rowCount() > 0 && $checkId->rowCount() > 0) {
        echo "✓ OneDrive columns already exist. No migration needed.\n";
        exit(0);
    }
    
    echo "Adding OneDrive columns...\n";
    
    // Add onedrive_folder_link if it doesn't exist
    if ($checkLink->rowCount() === 0) {
        echo "  - Adding onedrive_folder_link...\n";
        $pdo->exec("ALTER TABLE `gallery_config` ADD COLUMN `onedrive_folder_link` varchar(500) DEFAULT NULL");
        echo "    ✓ Added onedrive_folder_link\n";
    } else {
        echo "  ✓ onedrive_folder_link already exists\n";
    }
    
    // Add onedrive_folder_id if it doesn't exist
    if ($checkId->rowCount() === 0) {
        echo "  - Adding onedrive_folder_id...\n";
        $pdo->exec("ALTER TABLE `gallery_config` ADD COLUMN `onedrive_folder_id` varchar(100) DEFAULT NULL");
        echo "    ✓ Added onedrive_folder_id\n";
    } else {
        echo "  ✓ onedrive_folder_id already exists\n";
    }
    
    echo "\n✅ Migration complete! OneDrive columns added.\n";
    echo "\nNote: Old Google Drive columns are still present (safe).\n";
    echo "You can remove them later if desired.\n";
    
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
    echo "\nMake sure:\n";
    echo "- Database exists: {$dbConfig['dbname']}\n";
    echo "- Table 'gallery_config' exists\n";
    echo "- You have ALTER TABLE permissions\n";
    exit(1);
}