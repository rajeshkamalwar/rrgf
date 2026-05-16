<?php
/**
 * Test Graph API Connection
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/SharePointService.php';

try {
    echo "=== Testing Graph API Configuration ===\n\n";
    
    // Check database config
    $db = Database::getInstance();
    $config = $db->fetchOne("SELECT * FROM graph_api_config ORDER BY id DESC LIMIT 1");
    
    if (!$config) {
        echo "❌ No Graph API config found in database\n";
        exit(1);
    }
    
    echo "Database Config:\n";
    echo "- Client ID: " . ($config['client_id'] ?: '(empty)') . "\n";
    echo "- Tenant ID: " . ($config['tenant_id'] ?: '(empty)') . "\n";
    echo "- Client Secret: " . ($config['client_secret'] ? '(set - ' . strlen($config['client_secret']) . ' chars)' : '(empty)') . "\n";
    echo "- Is Active: " . ($config['is_active'] ? 'Yes' : 'No') . "\n\n";
    
    // Check SharePointService
    $service = new SharePointService();
    
    echo "SharePointService Check:\n";
    if ($service->isConfigured()) {
        echo "✅ Service reports as configured\n";
        
        // Try to get access token
        try {
            $reflection = new ReflectionClass($service);
            $method = $reflection->getMethod('getAccessToken');
            $method->setAccessible(true);
            
            echo "\nAttempting to get access token...\n";
            $token = $method->invoke($service);
            
            if (!empty($token)) {
                echo "✅ Successfully got access token! (Length: " . strlen($token) . ")\n";
                echo "Token preview: " . substr($token, 0, 20) . "...\n";
            } else {
                echo "❌ Got empty token\n";
            }
        } catch (Exception $e) {
            echo "❌ Failed to get access token: " . $e->getMessage() . "\n";
        }
    } else {
        echo "❌ Service reports as NOT configured\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
