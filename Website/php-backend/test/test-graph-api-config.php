<?php
/**
 * Test Graph API Config Save
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    echo "=== Checking Table Structure ===\n";
    $columns = $db->fetchAll("DESCRIBE graph_api_config");
    foreach ($columns as $col) {
        echo "- {$col['Field']} ({$col['Type']}) " . ($col['Null'] === 'NO' ? 'NOT NULL' : 'NULL') . "\n";
    }
    
    echo "\n=== Current Data ===\n";
    $current = $db->fetchOne("SELECT * FROM graph_api_config ORDER BY id DESC LIMIT 1");
    if ($current) {
        echo "ID: {$current['id']}\n";
        echo "Client ID: " . ($current['client_id'] ?: '(empty)') . "\n";
        echo "Tenant ID: " . ($current['tenant_id'] ?: '(empty)') . "\n";
        echo "Client Secret: " . ($current['client_secret'] ? '(set)' : '(empty)') . "\n";
        echo "Is Active: " . ($current['is_active'] ? 'Yes' : 'No') . "\n";
    } else {
        echo "No data found\n";
    }
    
    echo "\n=== Testing Update ===\n";
    $testClientId = 'test-client-id-12345';
    $testTenantId = 'test-tenant-id-67890';
    
    $existing = $db->fetchOne("SELECT id FROM graph_api_config ORDER BY id DESC LIMIT 1");
    
    if ($existing) {
        echo "Found existing record with ID: {$existing['id']}\n";
        $db->execute(
            "UPDATE graph_api_config SET client_id = ?, tenant_id = ?, is_active = ? WHERE id = ?",
            [$testClientId, $testTenantId, 1, $existing['id']]
        );
        echo "✓ Update executed\n";
    } else {
        echo "No existing record, inserting...\n";
        $db->execute(
            "INSERT INTO graph_api_config (client_id, client_secret, tenant_id, is_active) VALUES (?, ?, ?, ?)",
            [$testClientId, '', $testTenantId, 1]
        );
        echo "✓ Insert executed\n";
    }
    
    echo "\n=== Verifying Update ===\n";
    $updated = $db->fetchOne("SELECT * FROM graph_api_config ORDER BY id DESC LIMIT 1");
    if ($updated) {
        echo "ID: {$updated['id']}\n";
        echo "Client ID: " . ($updated['client_id'] ?: '(empty)') . "\n";
        echo "Tenant ID: " . ($updated['tenant_id'] ?: '(empty)') . "\n";
        if ($updated['client_id'] === $testClientId) {
            echo "✅ Client ID saved correctly!\n";
        } else {
            echo "❌ Client ID NOT saved correctly!\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
