<?php
/**
 * Enable Graph API Configuration
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    $result = $db->execute("UPDATE graph_api_config SET is_active = 1 WHERE id = (SELECT id FROM (SELECT id FROM graph_api_config ORDER BY id DESC LIMIT 1) AS temp)");
    echo "✅ Graph API configuration enabled!\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
