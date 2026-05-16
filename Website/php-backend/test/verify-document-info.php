<?php
/**
 * Verify and update document information fields
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    // Updates to make
    $updates = [
        // Fees structure
        ['category' => 'documents', 'sno' => '5', 'information' => 'Fees Structure', 'document' => 'Fees structure.pdf'],
        // Self Certification proforma
        ['category' => 'documents', 'sno' => '6', 'information' => 'Self Certification Proforma', 'document' => 'Self Certification proforma.pdf'],
        // Infrastructure Details Document
        ['category' => 'infrastructure', 'sno' => '1', 'information' => 'Infrastructure Details Document', 'document' => 'INFRASTRUCTURE.pdf'],
    ];
    
    echo "=== Verifying Document Information ===\n\n";
    
    foreach ($updates as $update) {
        $doc = $db->fetchOne(
            "SELECT * FROM documents WHERE category = ? AND sno = ?",
            [$update['category'], $update['sno']]
        );
        
        if ($doc) {
            echo "Document: {$update['information']}\n";
            echo "  Current information: " . ($doc['information'] ?? 'NULL') . "\n";
            echo "  Current document: " . ($doc['document'] ?? 'NULL') . "\n";
            echo "  Current link: {$doc['link']}\n";
            
            // Update information field
            $db->execute(
                "UPDATE documents SET information = ?, document = ? WHERE category = ? AND sno = ?",
                [$update['information'], $update['document'], $update['category'], $update['sno']]
            );
            
            echo "  ✅ Updated to: {$update['information']}\n\n";
        } else {
            echo "❌ Document not found: {$update['category']}, SNO: {$update['sno']}\n\n";
        }
    }
    
    echo "=== Verification Complete ===\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
