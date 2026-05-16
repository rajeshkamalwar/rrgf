<?php
/**
 * Standardize all document statuses to "✓ Available" for documents with links
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Standardizing Document Statuses ===\n\n";

try {
    // Update all documents with valid links to have "✓ Available" status
    $updated = $db->execute(
        "UPDATE documents SET status = '✓ Available' WHERE link != '' AND link != '#' AND status != '✓ Available'"
    );
    
    $documents = $db->fetchAll("SELECT id, sno, information, link, status FROM documents WHERE link != '' AND link != '#'");
    
    echo "Updated {$updated} documents to '✓ Available'\n";
    echo "Total documents with links: " . count($documents) . "\n\n";
    
    // Verify
    $statusCounts = [];
    foreach ($documents as $doc) {
        $status = $doc['status'];
        $statusCounts[$status] = ($statusCounts[$status] ?? 0) + 1;
    }
    
    echo "Status distribution for documents with links:\n";
    foreach ($statusCounts as $status => $count) {
        echo "  - '{$status}': {$count} documents\n";
    }
    
    if (isset($statusCounts['✓ Available']) && $statusCounts['✓ Available'] == count($documents)) {
        echo "\n✓ All documents with links now have status '✓ Available'\n";
    } else {
        echo "\n⚠ Some documents still have different statuses\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
