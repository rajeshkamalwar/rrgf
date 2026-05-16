<?php
/**
 * Check gallery image paths in database
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Checking Gallery Image Paths ===\n\n";

try {
    $galleryImages = $db->fetchAll("SELECT id, image_url, thumbnail_url, category, title FROM gallery_images LIMIT 10");
    
    echo "Found " . count($galleryImages) . " gallery images (showing first 10)\n\n";
    
    $pathTypes = [];
    
    foreach ($galleryImages as $img) {
        $imageUrl = $img['image_url'];
        $thumbnailUrl = $img['thumbnail_url'] ?? 'N/A';
        
        // Categorize path types
        if (strpos($imageUrl, '/uploads/') !== false || strpos($imageUrl, 'uploads') !== false) {
            $pathTypes['uploads'] = ($pathTypes['uploads'] ?? 0) + 1;
        } elseif (strpos($imageUrl, '/gallery/') !== false) {
            $pathTypes['gallery'] = ($pathTypes['gallery'] ?? 0) + 1;
        } elseif (strpos($imageUrl, 'onedrive') !== false || strpos($imageUrl, 'sharepoint') !== false || strpos($imageUrl, '1drv.ms') !== false) {
            $pathTypes['onedrive'] = ($pathTypes['onedrive'] ?? 0) + 1;
        } else {
            $pathTypes['other'] = ($pathTypes['other'] ?? 0) + 1;
        }
        
        echo "ID: {$img['id']}\n";
        echo "  Image URL: {$imageUrl}\n";
        echo "  Thumbnail: {$thumbnailUrl}\n";
        echo "  Category: {$img['category']}\n";
        echo "\n";
    }
    
    echo "=== Path Type Summary ===\n";
    foreach ($pathTypes as $type => $count) {
        echo "  {$type}: {$count} images\n";
    }
    
    // Check for problematic paths
    $problematic = $db->fetchAll(
        "SELECT id, image_url FROM gallery_images WHERE image_url LIKE '%/uploads/%' OR image_url LIKE '%uploads/%'"
    );
    
    if (count($problematic) > 0) {
        echo "\n⚠ Found " . count($problematic) . " images with /uploads/ paths (these may not exist):\n";
        foreach ($problematic as $img) {
            echo "  - ID {$img['id']}: {$img['image_url']}\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
