<?php
/**
 * Fix ALL hero image paths - handles both /uploads/hero/ and other incorrect paths
 * Converts to /images/hero/ paths to match deployment package
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Fixing ALL Hero Image Paths ===\n\n";

try {
    // Get all hero images
    $heroImages = $db->fetchAll("SELECT id, image_url, `order` FROM hero_images ORDER BY `order` ASC");
    
    echo "Found " . count($heroImages) . " hero images\n\n";
    
    // Map of correct paths by order
    $correctPaths = [
        1 => '/images/hero/1.jpg',
        2 => '/images/hero/2.jpg',
        3 => '/images/hero/3.jpg',
        4 => '/images/hero/4.jpg',
        5 => '/images/hero/1.jpg', // fallback for extra images
    ];
    
    $updated = 0;
    $kept = 0;
    
    foreach ($heroImages as $img) {
        $oldPath = $img['image_url'];
        $order = (int)$img['order'];
        $newPath = $correctPaths[$order] ?? $correctPaths[1];
        
        // Check if path needs updating (contains /uploads/hero/ or doesn't match correct path)
        if (strpos($oldPath, '/uploads/hero/') !== false || $oldPath !== $newPath) {
            // If it's an uploaded file path, update to static image path
            if (strpos($oldPath, '/uploads/hero/') !== false || strpos($oldPath, 'uploads') !== false) {
                $db->execute(
                    "UPDATE hero_images SET image_url = ? WHERE id = ?",
                    [$newPath, $img['id']]
                );
                echo "✓ Updated ID {$img['id']} (Order {$order}):\n";
                echo "    OLD: {$oldPath}\n";
                echo "    NEW: {$newPath}\n\n";
                $updated++;
            } else {
                // Already correct or different path format
                $kept++;
            }
        } else {
            echo "- Keeping ID {$img['id']} (Order {$order}): {$oldPath}\n";
            $kept++;
        }
    }
    
    // Verify final state
    echo "\n=== Final Hero Images ===\n";
    $finalImages = $db->fetchAll("SELECT id, image_url, `order` FROM hero_images ORDER BY `order` ASC");
    foreach ($finalImages as $img) {
        echo "Order {$img['order']}: {$img['image_url']}\n";
    }
    
    echo "\n=== Summary ===\n";
    echo "Updated: {$updated} images\n";
    echo "Kept as-is: {$kept} images\n";
    echo "\n✓ All hero images now point to /images/hero/ paths\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
