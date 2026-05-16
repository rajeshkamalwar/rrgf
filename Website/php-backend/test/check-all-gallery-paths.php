<?php
/**
 * Check ALL gallery image paths for issues
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Checking ALL Gallery Image Paths ===\n\n";

try {
    $galleryImages = $db->fetchAll("SELECT id, image_url, thumbnail_url FROM gallery_images");
    
    echo "Total gallery images: " . count($galleryImages) . "\n\n";
    
    $issues = [];
    $correct = [];
    
    foreach ($galleryImages as $img) {
        $imageUrl = $img['image_url'];
        $hasIssue = false;
        
        // Check for problematic paths
        if (strpos($imageUrl, '/uploads/') !== false || strpos($imageUrl, 'uploads/') !== false) {
            $issues[] = [
                'id' => $img['id'],
                'url' => $imageUrl,
                'issue' => 'Contains /uploads/ path (files should be in /gallery/)'
            ];
            $hasIssue = true;
        } elseif (empty($imageUrl) || $imageUrl === '#' || $imageUrl === null) {
            $issues[] = [
                'id' => $img['id'],
                'url' => $imageUrl,
                'issue' => 'Empty or invalid URL'
            ];
            $hasIssue = true;
        } else {
            $correct[] = $img['id'];
        }
    }
    
    echo "=== Results ===\n";
    echo "Correct paths: " . count($correct) . "\n";
    echo "Issues found: " . count($issues) . "\n\n";
    
    if (count($issues) > 0) {
        echo "⚠ Images with issues:\n";
        foreach ($issues as $issue) {
            echo "  - ID: {$issue['id']}\n";
            echo "    URL: {$issue['url']}\n";
            echo "    Issue: {$issue['issue']}\n\n";
        }
    } else {
        echo "✓ All gallery images have correct paths (/gallery/...)\n";
    }
    
    // Show sample of correct paths
    if (count($correct) > 0) {
        echo "\n=== Sample Correct Paths ===\n";
        $sample = array_slice($galleryImages, 0, min(3, count($galleryImages)));
        foreach ($sample as $img) {
            if (in_array($img['id'], $correct)) {
                echo "  ✓ {$img['image_url']}\n";
            }
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
