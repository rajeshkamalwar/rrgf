<?php
/**
 * Test Folder API endpoints
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$dbConfig = require __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance();
    
    echo "=== Testing Folder API Setup ===\n\n";
    
    // Check if table exists
    $tableExists = false;
    try {
        $db->fetchAll("SELECT 1 FROM onedrive_folders LIMIT 1");
        $tableExists = true;
        echo "✓ onedrive_folders table exists\n";
    } catch (Exception $e) {
        echo "✗ onedrive_folders table does NOT exist\n";
        echo "  Error: " . $e->getMessage() . "\n";
        echo "\nPlease run: php test/setup-multiple-folders.php\n";
        exit(1);
    }
    
    // Check columns
    echo "\nChecking columns:\n";
    $columns = $db->fetchAll("SHOW COLUMNS FROM onedrive_folders");
    $requiredColumns = ['id', 'name', 'folder_link', 'folder_id', 'description', 'is_active', 'sort_order'];
    foreach ($requiredColumns as $col) {
        $found = false;
        foreach ($columns as $column) {
            if ($column['Field'] === $col) {
                $found = true;
                echo "  ✓ $col\n";
                break;
            }
        }
        if (!$found) {
            echo "  ✗ $col (MISSING)\n";
        }
    }
    
    // Check if folder_id exists in gallery_images
    echo "\nChecking gallery_images table:\n";
    try {
        $imgColumns = $db->fetchAll("SHOW COLUMNS FROM gallery_images");
        $hasFolderId = false;
        foreach ($imgColumns as $col) {
            if ($col['Field'] === 'folder_id') {
                $hasFolderId = true;
                echo "  ✓ folder_id column exists\n";
                break;
            }
        }
        if (!$hasFolderId) {
            echo "  ✗ folder_id column MISSING\n";
        }
    } catch (Exception $e) {
        echo "  ✗ Error checking gallery_images: " . $e->getMessage() . "\n";
    }
    
    echo "\n=== Test Complete ===\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}