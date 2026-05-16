<?php
/**
 * Test database columns to see what's in the gallery_config table
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    echo "=== Checking gallery_config table structure ===\n\n";
    
    // Check what columns exist
    $columns = $db->fetchAll("SHOW COLUMNS FROM gallery_config");
    
    echo "Current columns:\n";
    foreach ($columns as $column) {
        echo "  - {$column['Field']} ({$column['Type']})\n";
    }
    
    echo "\n=== Checking for OneDrive columns ===\n";
    $onedriveLinkExists = false;
    $onedriveIdExists = false;
    $googleLinkExists = false;
    $googleIdExists = false;
    
    foreach ($columns as $column) {
        if ($column['Field'] === 'onedrive_folder_link') {
            $onedriveLinkExists = true;
            echo "✓ onedrive_folder_link exists\n";
        }
        if ($column['Field'] === 'onedrive_folder_id') {
            $onedriveIdExists = true;
            echo "✓ onedrive_folder_id exists\n";
        }
        if ($column['Field'] === 'google_drive_folder_link') {
            $googleLinkExists = true;
            echo "⚠ google_drive_folder_link still exists\n";
        }
        if ($column['Field'] === 'google_drive_folder_id') {
            $googleIdExists = true;
            echo "⚠ google_drive_folder_id still exists\n";
        }
    }
    
    echo "\n=== Migration Status ===\n";
    if ($onedriveLinkExists && $onedriveIdExists) {
        echo "✓ Database is migrated to OneDrive columns\n";
        if ($googleLinkExists || $googleIdExists) {
            echo "⚠ Old Google Drive columns still exist (can be removed)\n";
        }
    } else {
        echo "❌ Database needs migration!\n";
        echo "   Run the migration script or SQL to add OneDrive columns\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nPossible issues:\n";
    echo "1. Table doesn't exist - run schema.sql\n";
    echo "2. Database connection issue - check config/database.php\n";
}