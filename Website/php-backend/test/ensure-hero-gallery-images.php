<?php
/**
 * Ensure hero and gallery images are set up correctly
 * This script adds default images from /public/images/hero if database is empty
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

$db = Database::getInstance();

echo "=== Ensuring Hero and Gallery Images ===\n\n";

try {
    // Check hero images
    $heroImages = $db->fetchAll("SELECT COUNT(*) as count FROM hero_images");
    $heroCount = $heroImages[0]['count'] ?? 0;
    
    echo "Hero Images in database: {$heroCount}\n";
    
    if ($heroCount == 0) {
        echo "⚠ No hero images found. Adding default images from /images/hero/\n";
        
        // Add default hero images
        $defaultHeroImages = [
            ['/images/hero/1.jpg', 1],
            ['/images/hero/2.jpg', 2],
            ['/images/hero/3.jpg', 3],
            ['/images/hero/4.jpg', 4],
        ];
        
        foreach ($defaultHeroImages as $img) {
            try {
                $db->insert(
                    "INSERT INTO hero_images (image_url, `order`) VALUES (?, ?)",
                    [$img[0], $img[1]]
                );
                echo "  ✓ Added: {$img[0]}\n";
            } catch (Exception $e) {
                echo "  ✗ Failed to add {$img[0]}: " . $e->getMessage() . "\n";
            }
        }
    } else {
        echo "✓ Hero images already exist\n";
    }
    
    echo "\n";
    
    // Check gallery images
    $galleryImages = $db->fetchAll("SELECT COUNT(*) as count FROM gallery_images");
    $galleryCount = $galleryImages[0]['count'] ?? 0;
    
    echo "Gallery Images in database: {$galleryCount}\n";
    
    if ($galleryCount == 0) {
        echo "⚠ No gallery images found.\n";
        echo "  → You can add gallery images via Admin Panel → Gallery\n";
        echo "  → Or use the local gallery images from /public/gallery/\n";
    } else {
        echo "✓ Gallery images exist\n";
    }
    
    echo "\n=== Summary ===\n";
    echo "Hero images: " . ($heroCount == 0 ? "Added default images" : "Already have images") . "\n";
    echo "Gallery images: " . ($galleryCount == 0 ? "None (add via admin panel)" : "Exist") . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
