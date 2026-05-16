<?php
/**
 * Setup Graph API Config Table
 * Run this once to create the graph_api_config table
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    // Read SQL file
    $sql = file_get_contents(__DIR__ . '/add_graph_api_config.sql');
    
    // Execute SQL (split by semicolon for multiple statements)
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $db->execute($statement);
        }
    }
    
    echo "✅ Graph API config table created successfully!\n";
    echo "You can now configure Graph API credentials in the admin panel.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
