<?php
/**
 * Migrate SMTP and Gallery Configurations from JSON files to Database
 * This script reads the old Node.js backend JSON files and migrates them to MySQL
 */

require_once __DIR__ . '/../services/Database.php';

echo "=== Migrate SMTP and Gallery Configurations ===\n\n";

$db = Database::getInstance();
$baseDir = __DIR__ . '/../../';

// 1. Migrate SMTP Config
echo "1. Migrating SMTP Configuration...\n";
$smtpConfigFile = $baseDir . 'smtp-config.json';
if (file_exists($smtpConfigFile)) {
    try {
        $json = file_get_contents($smtpConfigFile);
        $config = json_decode($json, true);
        
        if ($config && isset($config['host'])) {
            // Check if config already exists
            $existing = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
            
            // Encode password for storage
            $password = base64_encode($config['password'] ?? '');
            
            if ($existing) {
                // Update existing
                $db->execute(
                    "UPDATE smtp_config SET host = ?, port = ?, user = ?, password = ?, `from` = ?, `to` = ? WHERE id = ?",
                    [
                        $config['host'] ?? '',
                        $config['port'] ?? 587,
                        $config['user'] ?? '',
                        $password,
                        $config['from'] ?? '',
                        $config['to'] ?? '',
                        $existing['id']
                    ]
                );
                echo "   ✅ Updated existing SMTP config\n";
            } else {
                // Insert new
                $db->insert(
                    "INSERT INTO smtp_config (host, port, user, password, `from`, `to`) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        $config['host'] ?? '',
                        $config['port'] ?? 587,
                        $config['user'] ?? '',
                        $password,
                        $config['from'] ?? '',
                        $config['to'] ?? ''
                    ]
                );
                echo "   ✅ Inserted SMTP config\n";
            }
            
            echo "      Host: {$config['host']}\n";
            echo "      Port: {$config['port']}\n";
            echo "      User: {$config['user']}\n";
            echo "      From: {$config['from']}\n";
            echo "      To: {$config['to']}\n";
        } else {
            echo "   ⚠️  Invalid SMTP config file format\n";
        }
    } catch (Exception $e) {
        echo "   ❌ Error migrating SMTP config: " . $e->getMessage() . "\n";
    }
} else {
    echo "   ⚠️  SMTP config file not found: $smtpConfigFile\n";
    echo "      (This is OK if no SMTP config was set before)\n";
}

echo "\n";

// 2. Migrate Gallery Config
echo "2. Migrating Gallery Configuration...\n";
$galleryConfigFile = $baseDir . 'gallery-config.json';
if (file_exists($galleryConfigFile)) {
    try {
        $json = file_get_contents($galleryConfigFile);
        $config = json_decode($json, true);
        
        if ($config) {
            $existing = $db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");
            
            if ($existing) {
                $db->execute(
                    "UPDATE gallery_config SET google_drive_folder_link = ?, google_drive_folder_id = ?, last_sync = ? WHERE id = ?",
                    [
                        $config['googleDriveFolderLink'] ?? null,
                        $config['googleDriveFolderId'] ?? null,
                        $config['lastSync'] ?? null,
                        $existing['id']
                    ]
                );
                echo "   ✅ Updated existing gallery config\n";
            } else {
                $db->insert(
                    "INSERT INTO gallery_config (google_drive_folder_link, google_drive_folder_id, last_sync) VALUES (?, ?, ?)",
                    [
                        $config['googleDriveFolderLink'] ?? null,
                        $config['googleDriveFolderId'] ?? null,
                        $config['lastSync'] ?? null
                    ]
                );
                echo "   ✅ Inserted gallery config\n";
            }
            
            if (!empty($config['googleDriveFolderLink'])) {
                echo "      Google Drive Folder: {$config['googleDriveFolderLink']}\n";
            }
            if (!empty($config['lastSync'])) {
                echo "      Last Sync: {$config['lastSync']}\n";
            }
        } else {
            echo "   ⚠️  Invalid gallery config file format\n";
        }
    } catch (Exception $e) {
        echo "   ❌ Error migrating gallery config: " . $e->getMessage() . "\n";
    }
} else {
    echo "   ⚠️  Gallery config file not found: $galleryConfigFile\n";
    echo "      (This is OK if no gallery config was set before)\n";
}

echo "\n";

// 3. Migrate Gallery Images
echo "3. Migrating Gallery Images...\n";
$galleryImagesFile = $baseDir . 'gallery-images.json';
if (file_exists($galleryImagesFile)) {
    try {
        $json = file_get_contents($galleryImagesFile);
        $images = json_decode($json, true);
        
        if (is_array($images) && count($images) > 0) {
            // Clear existing images (optional - comment out if you want to keep existing)
            // $db->execute("DELETE FROM gallery_images");
            
            $added = 0;
            foreach ($images as $image) {
                // Check if image already exists (by imageUrl)
                $existing = $db->fetchOne("SELECT id FROM gallery_images WHERE image_url = ?", [$image['imageUrl']]);
                
                if (!$existing) {
                    $db->insert(
                        "INSERT INTO gallery_images (id, image_url, thumbnail_url, category, title, description, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [
                            $image['id'] ?? uniqid('gallery_'),
                            $image['imageUrl'],
                            $image['thumbnailUrl'] ?? $image['imageUrl'],
                            $image['category'] ?? 'events',
                            $image['title'] ?? null,
                            $image['description'] ?? null,
                            $image['order'] ?? 0
                        ]
                    );
                    $added++;
                }
            }
            
            echo "   ✅ Migrated $added gallery images\n";
            echo "      Total images in file: " . count($images) . "\n";
        } else {
            echo "   ⚠️  No gallery images found in file\n";
        }
    } catch (Exception $e) {
        echo "   ❌ Error migrating gallery images: " . $e->getMessage() . "\n";
    }
} else {
    echo "   ⚠️  Gallery images file not found: $galleryImagesFile\n";
    echo "      (This is OK if no gallery images were added before)\n";
}

echo "\n";

// Summary
echo "=== Summary ===\n";
$smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
$gallery = $db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");
$imageCount = $db->fetchOne("SELECT COUNT(*) as count FROM gallery_images")['count'];

echo "SMTP Config: " . ($smtp ? "✅ Migrated" : "❌ Not found") . "\n";
echo "Gallery Config: " . ($gallery ? "✅ Migrated" : "❌ Not found") . "\n";
echo "Gallery Images: $imageCount\n";

echo "\n✅ Migration complete!\n";
echo "\nYou can now:\n";
echo "  1. Use the admin panel to manage these settings\n";
echo "  2. Test SMTP: http://localhost:3000/backend → SMTP Settings\n";
echo "  3. Test Gallery: http://localhost:3000/backend → Gallery\n";