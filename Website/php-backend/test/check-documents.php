<?php
/**
 * Check documents in database and list all available PDF files
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Checking Documents ===\n\n";

try {
    $documents = $db->fetchAll("SELECT id, sno, category, document, information, link, status FROM documents ORDER BY category, CAST(sno AS UNSIGNED)");
    
    echo "Documents in database: " . count($documents) . "\n\n";
    
    $byCategory = ['documents' => [], 'academic' => [], 'infrastructure' => []];
    foreach ($documents as $doc) {
        $byCategory[$doc['category']][] = $doc;
    }
    
    foreach ($byCategory as $category => $docs) {
        if (count($docs) > 0) {
            echo "=== {$category} ===" . PHP_EOL;
            foreach ($docs as $doc) {
                echo "ID: {$doc['id']}, S.No: {$doc['sno']}" . PHP_EOL;
                echo "  Info: " . ($doc['information'] ?? $doc['document'] ?? 'N/A') . PHP_EOL;
                echo "  Link: {$doc['link']}" . PHP_EOL;
                echo "  Status: {$doc['status']}" . PHP_EOL . PHP_EOL;
            }
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
