<?php
/**
 * Check hero images, gallery images, and document statuses
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Checking Images and Documents ===\n\n";

try {
    // Check hero images
    $heroImages = $db->fetchAll("SELECT id, image_url, `order` FROM hero_images ORDER BY `order` ASC");
    echo "Hero Images: " . count($heroImages) . " found\n";
    if (count($heroImages) > 0) {
        foreach ($heroImages as $img) {
            echo "  - ID: {$img['id']}, URL: {$img['image_url']}, Order: {$img['order']}\n";
        }
    } else {
        echo "  ⚠ WARNING: No hero images in database!\n";
    }
    
    echo "\n";
    
    // Check gallery images
    $galleryImages = $db->fetchAll("SELECT COUNT(*) as count FROM gallery_images");
    $galleryCount = $galleryImages[0]['count'] ?? 0;
    echo "Gallery Images: " . $galleryCount . " found\n";
    if ($galleryCount == 0) {
        echo "  ⚠ WARNING: No gallery images in database!\n";
    }
    
    echo "\n";
    
    // Check documents
    $documents = $db->fetchAll("SELECT id, sno, category, information, link, status FROM documents ORDER BY category, CAST(sno AS UNSIGNED)");
    echo "Documents: " . count($documents) . " found\n";
    
    $docStatusCounts = [];
    foreach ($documents as $doc) {
        $status = $doc['status'] ?? 'Not Available';
        $docStatusCounts[$status] = ($docStatusCounts[$status] ?? 0) + 1;
        
        if ($status !== '✓ Available' && $status !== 'Available' && !empty($doc['link']) && $doc['link'] !== '#') {
            echo "  ⚠ Document ID {$doc['id']} (S.No: {$doc['sno']}) has link but status is '{$status}'\n";
        }
    }
    
    echo "\nDocument Status Summary:\n";
    foreach ($docStatusCounts as $status => $count) {
        echo "  - '{$status}': {$count} documents\n";
    }
    
    // Check if documents with links have correct status
    $docsWithLinks = $db->fetchAll(
        "SELECT id, sno, information, link, status FROM documents WHERE link != '' AND link != '#'"
    );
    
    $needUpdate = [];
    foreach ($docsWithLinks as $doc) {
        if ($doc['status'] !== '✓ Available' && $doc['status'] !== 'Available') {
            $needUpdate[] = $doc;
        }
    }
    
    if (count($needUpdate) > 0) {
        echo "\n⚠ Documents that need status update:\n";
        foreach ($needUpdate as $doc) {
            echo "  - ID {$doc['id']} (S.No: {$doc['sno']}): status '{$doc['status']}' should be '✓ Available'\n";
        }
    } else {
        echo "\n✓ All documents with links have correct status (✓ Available or Available)\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
