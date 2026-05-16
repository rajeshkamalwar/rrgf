<?php
/**
 * Add images from Website/public/gallery directory to the database
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    // Path to gallery images
    $galleryPath = __DIR__ . '/../../public/gallery';
    
    if (!is_dir($galleryPath)) {
        echo "❌ Gallery directory not found: $galleryPath\n";
        exit(1);
    }
    
    echo "=== Adding Images from Local Gallery ===\n\n";
    echo "Gallery path: $galleryPath\n\n";
    
    // Get all image files
    $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $files = [];
    
    $dir = opendir($galleryPath);
    while (($file = readdir($dir)) !== false) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $imageExtensions)) {
            $files[] = $file;
        }
    }
    closedir($dir);
    
    if (empty($files)) {
        echo "❌ No image files found in gallery directory\n";
        exit(1);
    }
    
    echo "Found " . count($files) . " image files\n\n";
    
    // Get existing image URLs to avoid duplicates
    $existingImages = $db->fetchAll("SELECT image_url FROM gallery_images");
    $existingUrls = array_column($existingImages, 'image_url');
    
    // Get max order
    $maxOrderResult = $db->fetchOne("SELECT MAX(`order`) as max_order FROM gallery_images");
    $currentOrder = (int)($maxOrderResult['max_order'] ?? 0);
    
    $added = 0;
    $skipped = 0;
    
    foreach ($files as $file) {
        // Construct image URL (relative to public folder)
        $imageUrl = '/gallery/' . $file;
        $thumbnailUrl = $imageUrl; // Use same URL for thumbnail
        
        // Check if already exists
        if (in_array($imageUrl, $existingUrls)) {
            echo "⏭️  Skipped (already exists): $file\n";
            $skipped++;
            continue;
        }
        
        // Generate unique ID
        $imageId = uniqid('gallery_');
        $currentOrder++;
        
        // Extract filename without extension for title
        $title = pathinfo($file, PATHINFO_FILENAME);
        $title = str_replace(['_', '-'], ' ', $title);
        $title = ucwords($title);
        
        // Insert into database
        try {
            $db->insert(
                "INSERT INTO gallery_images (id, image_url, thumbnail_url, category, title, description, `order`) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    $imageId,
                    $imageUrl,
                    $thumbnailUrl,
                    'events', // Default category
                    $title,
                    null,
                    $currentOrder
                ]
            );
            
            echo "✅ Added: $file\n";
            $added++;
        } catch (Exception $e) {
            echo "❌ Error adding $file: " . $e->getMessage() . "\n";
        }
    }
    
    echo "\n=== Summary ===\n";
    echo "Added: $added images\n";
    echo "Skipped: $skipped images (already in database)\n";
    echo "Total processed: " . count($files) . " images\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
