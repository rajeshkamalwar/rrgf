<?php
/**
 * Test folder creation directly
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../utils/OneDriveHelper.php';

$dbConfig = require __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance();
    
    echo "=== Testing Folder Creation ===\n\n";
    
    $testFolderLink = "https://neksoftconsultancyservice-my.sharepoint.com/:f:/g/personal/info_neksoftconsultancy_com/IgC32uBo_r1HRqVsroirjJLCAQZB5bklp3cnB9GwhjMtdAs?e=mTVtIs";
    
    echo "Test folder link: $testFolderLink\n\n";
    
    // Extract folder ID
    $folderId = OneDriveHelper::extractFolderId($testFolderLink);
    echo "Extracted folder ID: " . ($folderId ?? 'NULL') . "\n\n";
    
    if (!$folderId) {
        echo "❌ Failed to extract folder ID\n";
        exit(1);
    }
    
    // Try to insert
    try {
        $maxOrder = $db->fetchOne("SELECT MAX(sort_order) as max_order FROM onedrive_folders");
        $newOrder = ($maxOrder['max_order'] ?? 0) + 1;
        
        echo "Attempting to insert folder...\n";
        $db->insert(
            "INSERT INTO onedrive_folders (name, folder_link, folder_id, description, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)",
            [
                'Test Folder',
                $testFolderLink,
                $folderId,
                'Test description',
                1,
                $newOrder
            ]
        );
        
        echo "✓ Folder created successfully!\n";
        
        // Get the created folder
        $folder = $db->fetchOne(
            "SELECT id, name, folder_link, folder_id FROM onedrive_folders WHERE folder_link = ? ORDER BY id DESC LIMIT 1",
            [$testFolderLink]
        );
        
        echo "\nCreated folder:\n";
        echo "  ID: {$folder['id']}\n";
        echo "  Name: {$folder['name']}\n";
        echo "  Folder ID: {$folder['folder_id']}\n";
        
    } catch (Exception $e) {
        echo "❌ Error creating folder: " . $e->getMessage() . "\n";
        exit(1);
    }
    
    echo "\n=== Test Complete ===\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}