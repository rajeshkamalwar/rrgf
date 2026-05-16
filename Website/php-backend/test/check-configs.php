<?php
/**
 * Check Existing SMTP and Gallery Configurations
 */

require_once __DIR__ . '/../services/Database.php';

echo "=== Checking Existing Configurations ===\n\n";

$db = Database::getInstance();

// Check SMTP Config
echo "1. SMTP Configuration:\n";
$smtpConfig = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
if ($smtpConfig) {
    echo "   ✅ SMTP config exists:\n";
    echo "      Host: {$smtpConfig['host']}\n";
    echo "      Port: {$smtpConfig['port']}\n";
    echo "      User: {$smtpConfig['user']}\n";
    echo "      From: {$smtpConfig['from']}\n";
    echo "      To: {$smtpConfig['to']}\n";
    echo "      Password: " . (!empty($smtpConfig['password']) ? '*** (set)' : '(not set)') . "\n";
} else {
    echo "   ⚠️  No SMTP configuration found\n";
}

echo "\n";

// Check Gallery Config
echo "2. Gallery Configuration:\n";
$galleryConfig = $db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");
if ($galleryConfig) {
    echo "   ✅ Gallery config exists:\n";
    echo "      Google Drive Folder Link: " . ($galleryConfig['google_drive_folder_link'] ?? 'N/A') . "\n";
    echo "      Google Drive Folder ID: " . ($galleryConfig['google_drive_folder_id'] ?? 'N/A') . "\n";
    echo "      Last Sync: " . ($galleryConfig['last_sync'] ?? 'Never') . "\n";
} else {
    echo "   ⚠️  No gallery configuration found\n";
}

echo "\n";

// Check Gallery Images
echo "3. Gallery Images:\n";
$galleryImages = $db->fetchAll("SELECT COUNT(*) as count FROM gallery_images");
$imageCount = $galleryImages[0]['count'] ?? 0;
echo "   Total gallery images: $imageCount\n";

if ($imageCount > 0) {
    $images = $db->fetchAll("SELECT id, image_url, category, title FROM gallery_images LIMIT 5");
    echo "   Sample images:\n";
    foreach ($images as $img) {
        echo "      - {$img['image_url']} (category: {$img['category']}, title: " . ($img['title'] ?? 'N/A') . ")\n";
    }
}

echo "\n";

// Check Hero Images
echo "4. Hero Images:\n";
$heroImages = $db->fetchAll("SELECT COUNT(*) as count FROM hero_images");
$heroCount = $heroImages[0]['count'] ?? 0;
echo "   Total hero images: $heroCount\n";

echo "\n=== Summary ===\n";
echo "SMTP Config: " . ($smtpConfig ? "✅ Configured" : "❌ Not configured") . "\n";
echo "Gallery Config: " . ($galleryConfig ? "✅ Configured" : "❌ Not configured") . "\n";
echo "Gallery Images: $imageCount\n";
echo "Hero Images: $heroCount\n";