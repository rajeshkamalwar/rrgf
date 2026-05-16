<?php
/**
 * Test Gallery Configuration
 * Checks if Google Drive config is properly set up
 */

require_once __DIR__ . '/../services/Database.php';

echo "=== Gallery Configuration Test ===\n\n";

$db = Database::getInstance();

// Get gallery config from database
$config = $db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");

if (!$config) {
    echo "❌ No gallery configuration found in database\n";
    exit(1);
}

echo "Database Configuration:\n";
echo "  Google Drive Folder Link: " . ($config['google_drive_folder_link'] ?? 'NULL') . "\n";
echo "  Google Drive Folder ID: " . ($config['google_drive_folder_id'] ?? 'NULL') . "\n";
echo "  Last Sync: " . ($config['last_sync'] ?? 'NULL') . "\n\n";

// Check if folder ID was extracted correctly
$folderLink = $config['google_drive_folder_link'] ?? '';
$folderId = $config['google_drive_folder_id'] ?? '';

echo "Validation:\n";

// Test folder ID extraction
if (!empty($folderLink)) {
    preg_match('/folders\/([a-zA-Z0-9_-]+)/', $folderLink, $matches);
    $extractedId = $matches[1] ?? null;
    
    if ($extractedId) {
        echo "  ✅ Folder ID can be extracted from link: $extractedId\n";
        
        if ($folderId === $extractedId) {
            echo "  ✅ Stored folder ID matches extracted ID\n";
        } else {
            echo "  ⚠️  Stored folder ID ($folderId) doesn't match extracted ID ($extractedId)\n";
            echo "     This might need to be fixed.\n";
        }
    } else {
        echo "  ❌ Cannot extract folder ID from link\n";
        echo "     Link format might be incorrect\n";
    }
} else {
    echo "  ⚠️  No Google Drive folder link configured\n";
}

// Check folder ID format
if (!empty($folderId)) {
    if (preg_match('/^[a-zA-Z0-9_-]+$/', $folderId)) {
        echo "  ✅ Folder ID format is valid\n";
    } else {
        echo "  ❌ Folder ID format is invalid\n";
    }
} else {
    echo "  ⚠️  No folder ID stored\n";
}

// Test API endpoint format
echo "\nAPI Response Test:\n";
$apiConfig = [
    'googleDriveFolderLink' => $config['google_drive_folder_link'],
    'googleDriveFolderId' => $config['google_drive_folder_id'],
    'lastSync' => $config['last_sync']
];

echo "  Expected API format:\n";
echo "  " . json_encode($apiConfig, JSON_PRETTY_PRINT) . "\n";

// Check if the config matches what the API should return
echo "\n✅ Configuration check complete!\n";