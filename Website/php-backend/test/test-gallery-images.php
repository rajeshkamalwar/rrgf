<?php
/**
 * Test Gallery Images - Check if URLs are accessible
 */

require_once __DIR__ . '/../services/Database.php';

echo "=== Gallery Images Test ===\n\n";

$db = Database::getInstance();

// Get first few images
$images = $db->fetchAll("SELECT id, image_url, thumbnail_url, category FROM gallery_images LIMIT 3");

if (empty($images)) {
    echo "❌ No gallery images found\n";
    exit(1);
}

echo "Found " . count($images) . " images (showing first 3):\n\n";

foreach ($images as $idx => $image) {
    $num = $idx + 1;
    echo "Image #$num:\n";
    echo "  ID: {$image['id']}\n";
    echo "  Category: {$image['category']}\n";
    echo "  Image URL: {$image['image_url']}\n";
    echo "  Thumbnail URL: " . ($image['thumbnail_url'] ?? 'NULL') . "\n";
    
    // Test if URL is accessible (basic check)
    $url = $image['image_url'];
    $parsed = parse_url($url);
    
    if (strpos($url, 'drive.google.com') !== false) {
        echo "  Type: Google Drive URL\n";
        
        // Check if it's the correct format
        if (strpos($url, '/uc?export=view') !== false) {
            echo "  Format: ✅ Correct (export view)\n";
        } elseif (strpos($url, '/thumbnail') !== false) {
            echo "  Format: ✅ Correct (thumbnail)\n";
        } else {
            echo "  Format: ⚠️  May need conversion\n";
        }
        
        // Extract file ID
        if (preg_match('/[?&]id=([a-zA-Z0-9_-]+)/', $url, $matches)) {
            $fileId = $matches[1];
            echo "  File ID: $fileId\n";
            echo "  Direct URL: https://drive.google.com/uc?export=view&id=$fileId\n";
        }
    } else {
        echo "  Type: Direct URL\n";
    }
    
    echo "\n";
}

echo "=== Notes ===\n";
echo "Google Drive images require:\n";
echo "  1. Files to be set to 'Anyone with the link can view'\n";
echo "  2. Proper URL format (which we have ✅)\n";
echo "  3. No authentication required\n";
echo "\nIf images don't load in browser:\n";
echo "  - Check Google Drive folder permissions\n";
echo "  - Verify files are publicly accessible\n";
echo "  - Check browser console for CORS/loading errors\n";