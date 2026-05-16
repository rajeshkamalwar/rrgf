<?php
/**
 * Test Folder Fetch
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/SharePointService.php';
require_once __DIR__ . '/../utils/OneDriveHelper.php';

try {
    echo "=== Testing Folder Fetch ===\n\n";
    
    $db = Database::getInstance();
    
    // Get folder ID 6
    $folder = $db->fetchOne(
        "SELECT id, name, folder_link, folder_id FROM onedrive_folders WHERE id = ?",
        [6]
    );
    
    if (!$folder) {
        echo "❌ Folder not found\n";
        exit(1);
    }
    
    echo "Folder Details:\n";
    echo "- ID: {$folder['id']}\n";
    echo "- Name: {$folder['name']}\n";
    echo "- Folder Link: {$folder['folder_link']}\n";
    echo "- Folder ID: " . ($folder['folder_id'] ?: 'NULL') . "\n\n";
    
    // Check Graph API config
    $config = $db->fetchOne("SELECT * FROM graph_api_config WHERE is_active = 1 ORDER BY id DESC LIMIT 1");
    if ($config) {
        echo "Graph API Config:\n";
        echo "- Client ID: " . ($config['client_id'] ?: 'empty') . "\n";
        echo "- Tenant ID: " . ($config['tenant_id'] ?: 'empty') . "\n";
        echo "- Client Secret: " . ($config['client_secret'] ? 'set' : 'empty') . "\n";
        echo "- Is Active: " . ($config['is_active'] ? 'Yes' : 'No') . "\n\n";
    } else {
        echo "❌ No active Graph API config found\n\n";
    }
    
    // Try to parse folder link
    echo "Parsing folder link...\n";
    $spDetails = OneDriveHelper::extractSharePointDetails($folder['folder_link']);
    if ($spDetails) {
        echo "✅ Parsed successfully:\n";
        echo "- Tenant: {$spDetails['tenant']}\n";
        echo "- User: {$spDetails['user']}\n";
        echo "- Folder ID: {$spDetails['folderId']}\n";
        echo "- Base URL: {$spDetails['baseUrl']}\n\n";
    } else {
        echo "❌ Failed to parse folder link\n\n";
        exit(1);
    }
    
    // Try SharePointService
    echo "Initializing SharePointService...\n";
    $service = new SharePointService();
    
    if ($service->isConfigured()) {
        echo "✅ Service is configured\n\n";
        
        echo "Attempting to fetch images...\n";
        try {
            $images = $service->fetchImagesFromFolder($folder['folder_link']);
            echo "✅ Successfully fetched " . count($images) . " images\n";
            
            if (count($images) > 0) {
                echo "\nFirst image:\n";
                print_r($images[0]);
            }
        } catch (Exception $e) {
            echo "❌ Error fetching images: " . $e->getMessage() . "\n";
            echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
        }
    } else {
        echo "❌ Service is NOT configured\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
