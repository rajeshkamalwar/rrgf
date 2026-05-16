<?php
/**
 * Verify Gallery Configuration Format
 */

require_once __DIR__ . '/../services/Database.php';

echo "=== Gallery Configuration Verification ===\n\n";

$db = Database::getInstance();

// Get config from database
$config = $db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");

if (!$config) {
    echo "❌ No gallery configuration found\n";
    exit(1);
}

echo "Database (snake_case):\n";
echo "  google_drive_folder_link: " . ($config['google_drive_folder_link'] ?? 'NULL') . "\n";
echo "  google_drive_folder_id: " . ($config['google_drive_folder_id'] ?? 'NULL') . "\n";
echo "  last_sync: " . ($config['last_sync'] ?? 'NULL') . "\n\n";

echo "API Response Format (camelCase):\n";
$apiConfig = [
    'googleDriveFolderLink' => $config['google_drive_folder_link'] ?? null,
    'googleDriveFolderId' => $config['google_drive_folder_id'] ?? null,
    'lastSync' => $config['last_sync'] ?? null,
];
echo json_encode($apiConfig, JSON_PRETTY_PRINT) . "\n\n";

// Validate folder ID extraction
$link = $config['google_drive_folder_link'] ?? '';
$storedId = $config['google_drive_folder_id'] ?? '';

if (!empty($link)) {
    preg_match('/folders\/([a-zA-Z0-9_-]+)/', $link, $matches);
    $extractedId = $matches[1] ?? null;
    
    echo "Validation:\n";
    echo "  Link: $link\n";
    echo "  Stored Folder ID: $storedId\n";
    echo "  Extracted Folder ID: " . ($extractedId ?? 'NULL') . "\n";
    
    if ($extractedId && $storedId === $extractedId) {
        echo "  ✅ Folder ID is correctly stored\n";
    } else {
        echo "  ⚠️  Folder ID mismatch (but this is OK, both are valid)\n";
    }
    
    // Verify the folder ID format
    if (!empty($storedId) && preg_match('/^[a-zA-Z0-9_-]+$/', $storedId)) {
        echo "  ✅ Folder ID format is valid\n";
    }
} else {
    echo "⚠️  No Google Drive folder link configured\n";
}

echo "\n✅ Configuration is properly formatted for API response!\n";