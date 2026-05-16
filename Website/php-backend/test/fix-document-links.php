<?php
/**
 * Fix document links - remove URL encoding
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    // Get all documents
    $docs = $db->fetchAll("SELECT * FROM documents");
    
    echo "=== Fixing Document Links ===\n\n";
    
    $fixed = 0;
    foreach ($docs as $doc) {
        $originalLink = $doc['link'];
        // Replace URL-encoded spaces (+) with normal spaces
        $fixedLink = str_replace('+', ' ', $originalLink);
        
        // Also fix any other URL encoding issues
        $fixedLink = urldecode($fixedLink);
        
        // Only update if different
        if ($fixedLink !== $originalLink) {
            echo "Fixing: {$doc['information']} ({$doc['category']}, SNO: {$doc['sno']})\n";
            echo "  Old: $originalLink\n";
            echo "  New: $fixedLink\n";
            
            $db->execute(
                "UPDATE documents SET link = ? WHERE id = ?",
                [$fixedLink, $doc['id']]
            );
            
            $fixed++;
            echo "  ✅ Updated\n\n";
        }
    }
    
    if ($fixed === 0) {
        echo "✅ All links are already correct!\n";
    } else {
        echo "=== Summary ===\n";
        echo "Fixed $fixed document link(s)\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
