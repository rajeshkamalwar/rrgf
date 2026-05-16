<?php
/**
 * Update Registration Certificate information field
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    // Update information field for Registration Certificate
    $db->execute(
        "UPDATE documents SET information = ? WHERE category = 'documents' AND sno = '1'",
        ['Registration Certificate']
    );
    
    echo "✅ Registration Certificate information field updated!\n";
    
    // Verify
    $doc = $db->fetchOne("SELECT * FROM documents WHERE category = 'documents' AND sno = '1'");
    echo "\nUpdated entry:\n";
    echo "- Information: {$doc['information']}\n";
    echo "- Link: {$doc['link']}\n";
    echo "- Status: {$doc['status']}\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
