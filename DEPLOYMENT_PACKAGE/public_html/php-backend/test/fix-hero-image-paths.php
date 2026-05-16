<?php
/**
 * Fix hero image paths to match actual files in deployment package
 * Update paths from /uploads/hero/ to /images/hero/
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Fixing Hero Image Paths ===\n\n";

try {
    // Get current hero images
    $heroImages = $db->fetchAll("SELECT id, image_url, `order` FROM hero_images ORDER BY `order` ASC");
    
    echo "Found " . count($heroImages) . " hero images\n\n";
    
    // Update to use correct paths
    $correctPaths = [
        '/images/hero/1.jpg',
        '/images/hero/2.jpg',
        '/images/hero/3.jpg',
        '/images/hero/4.jpg',
    ];
    
    $updated = 0;
    foreach ($heroImages as $index => $img) {
        $newPath = $correctPaths[$index] ?? $correctPaths[0];
        $oldPath = $img['image_url'];
        
        if ($oldPath !== $newPath) {
            $db->execute(
                "UPDATE hero_images SET image_url = ? WHERE id = ?",
                [$newPath, $img['id']]
            );
            echo "✓ Updated ID {$img['id']}: {$oldPath} → {$newPath}\n";
            $updated++;
        } else {
            echo "- Already correct: {$oldPath}\n";
        }
    }
    
    // Verify
    echo "\n=== Verification ===\n";
    $updatedImages = $db->fetchAll("SELECT id, image_url, `order` FROM hero_images ORDER BY `order` ASC");
    foreach ($updatedImages as $img) {
        echo "Order {$img['order']}: {$img['image_url']}\n";
    }
    
    echo "\n✓ Updated {$updated} hero image paths\n";
    echo "✓ Hero images now point to /images/hero/ (matches deployment package)\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
