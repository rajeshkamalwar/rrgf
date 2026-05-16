<?php
/**
 * Fix document status to ensure View buttons appear on mandatory disclosure page
 * This script sets status to "✓ Available" for all documents that have a valid link
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Fixing Document Status for View Buttons ===\n\n";

try {
    // Get all documents
    $documents = $db->fetchAll("SELECT id, sno, document, information, link, status FROM documents");
    
    echo "Found " . count($documents) . " documents\n\n";
    
    $updated = 0;
    $skipped = 0;
    
    foreach ($documents as $doc) {
        $id = $doc['id'];
        $link = $doc['link'] ?? '';
        $currentStatus = $doc['status'] ?? 'Not Available';
        
        // If document has a valid link (not empty, not '#'), set status to "✓ Available"
        if (!empty($link) && $link !== '#' && $link !== 'Not Available') {
            if ($currentStatus !== '✓ Available' && $currentStatus !== 'Available') {
                $db->execute(
                    "UPDATE documents SET status = '✓ Available' WHERE id = ?",
                    [$id]
                );
                echo "✓ Updated document ID {$id} (S.No: {$doc['sno']}) - Status: {$currentStatus} → ✓ Available\n";
                $updated++;
            } else {
                echo "- Skipped document ID {$id} (S.No: {$doc['sno']}) - Already has status: {$currentStatus}\n";
                $skipped++;
            }
        } else {
            echo "✗ Skipped document ID {$id} (S.No: {$doc['sno']}) - No valid link (link: '{$link}')\n";
            $skipped++;
        }
    }
    
    echo "\n=== Summary ===\n";
    echo "Updated: {$updated} documents\n";
    echo "Skipped: {$skipped} documents\n";
    echo "\n✓ All documents with valid links now have status '✓ Available'\n";
    echo "✓ View buttons will now appear on the mandatory disclosure page\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
