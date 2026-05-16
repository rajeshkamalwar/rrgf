<?php
/**
 * Verify and update Registration Certificate link
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    // Check current registration certificate
    $doc = $db->fetchOne("SELECT * FROM documents WHERE category = 'documents' AND sno = '1'");
    
    if ($doc) {
        echo "Current Registration Certificate entry:\n";
        echo "- ID: {$doc['id']}\n";
        echo "- Link: {$doc['link']}\n";
        echo "- Document: " . ($doc['document'] ?? 'NULL') . "\n";
        echo "- Information: " . ($doc['information'] ?? 'NULL') . "\n";
        echo "- Status: {$doc['status']}\n\n";
        
        // Update link to correct path
        $correctLink = '/documents/Registration Certificate.pdf';
        
        if ($doc['link'] !== $correctLink) {
            echo "Updating link to: $correctLink\n";
            $db->execute(
                "UPDATE documents SET link = ?, status = 'Available' WHERE id = ?",
                [$correctLink, $doc['id']]
            );
            echo "✅ Link updated successfully!\n";
        } else {
            echo "✅ Link is already correct!\n";
        }
        
        // Verify file exists
        $filePath = __DIR__ . '/../../public/documents/Registration Certificate.pdf';
        if (file_exists($filePath)) {
            echo "✅ File exists at: $filePath\n";
        } else {
            echo "⚠️  File not found at: $filePath\n";
            echo "   Please ensure the file is in Website/public/documents/\n";
        }
    } else {
        echo "❌ Registration Certificate not found in database (category='documents', sno='1')\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
