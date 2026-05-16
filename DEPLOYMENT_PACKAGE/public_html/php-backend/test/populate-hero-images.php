<?php
/**
 * Populate Hero Images from Public Folder
 * This script adds the existing hero images from public/images/hero/ to the database
 */

require_once __DIR__ . '/../services/Database.php';

echo "=== Populate Hero Images ===\n\n";

$db = Database::getInstance();

// Path to hero images in public folder (relative to this script)
$publicHeroPath = __DIR__ . '/../../public/images/hero';
$uploadPath = '/images/hero/'; // Public URL path

// Check if directory exists
if (!is_dir($publicHeroPath)) {
    echo "❌ Hero images directory not found: $publicHeroPath\n";
    exit(1);
}

// Get all image files
$imageFiles = glob($publicHeroPath . '/*.{jpg,jpeg,png,webp}', GLOB_BRACE);

if (empty($imageFiles)) {
    echo "❌ No image files found in $publicHeroPath\n";
    exit(1);
}

echo "Found " . count($imageFiles) . " image files:\n";

// Clear existing hero images (optional - comment out if you want to keep existing)
echo "\nClearing existing hero images...\n";
$db->execute("DELETE FROM hero_images");

// Insert each image
$order = 1;
foreach ($imageFiles as $imageFile) {
    $filename = basename($imageFile);
    $imageUrl = $uploadPath . $filename;
    
    // Generate unique ID
    $id = uniqid('hero_');
    
    try {
        $db->insert(
            "INSERT INTO hero_images (id, image_url, `order`) VALUES (?, ?, ?)",
            [$id, $imageUrl, $order]
        );
        
        echo "✅ Added: $filename (order: $order, URL: $imageUrl)\n";
        $order++;
    } catch (Exception $e) {
        echo "❌ Failed to add $filename: " . $e->getMessage() . "\n";
    }
}

// Verify
echo "\n=== Verification ===\n";
$images = $db->fetchAll("SELECT * FROM hero_images ORDER BY `order` ASC");
echo "Total hero images in database: " . count($images) . "\n\n";

foreach ($images as $image) {
    echo "  - {$image['image_url']} (order: {$image['order']})\n";
}

echo "\n✅ Done! Hero images populated.\n";
echo "\nYou can now:\n";
echo "  1. Visit http://localhost:3000/backend and go to Hero Images section\n";
echo "  2. Or test API: http://localhost:8000/api/hero-images\n";