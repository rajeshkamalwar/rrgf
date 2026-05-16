<?php
/**
 * Setup script for multiple folders feature
 * Run this to create the necessary database tables and columns
 */

require_once __DIR__ . '/../config/database.php';

$dbConfig = require __DIR__ . '/../config/database.php';

try {
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset={$dbConfig['charset']}",
        $dbConfig['username'],
        $dbConfig['password'],
        $dbConfig['options']
    );
    
    echo "=== Setting up Multiple Folders Feature ===\n\n";
    
    // Check if onedrive_folders table exists
    $tableExists = $pdo->query("SHOW TABLES LIKE 'onedrive_folders'")->rowCount() > 0;
    
    if (!$tableExists) {
        echo "Step 1: Creating onedrive_folders table...\n";
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `onedrive_folders` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `name` varchar(255) NOT NULL COMMENT 'Display name for the folder',
              `folder_link` varchar(500) NOT NULL COMMENT 'OneDrive/SharePoint folder sharing link',
              `folder_id` varchar(200) DEFAULT NULL COMMENT 'Extracted folder ID',
              `description` text DEFAULT NULL COMMENT 'Optional description',
              `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Enable/disable folder',
              `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT 'Display order',
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`id`),
              KEY `is_active` (`is_active`),
              KEY `sort_order` (`sort_order`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        echo "✓ Table created\n\n";
    } else {
        echo "✓ onedrive_folders table already exists\n\n";
    }
    
    // Check if folder_id column exists in gallery_images
    $columnExists = $pdo->query("SHOW COLUMNS FROM gallery_images LIKE 'folder_id'")->rowCount() > 0;
    
    if (!$columnExists) {
        echo "Step 2: Adding folder_id column to gallery_images...\n";
        try {
            $pdo->exec("ALTER TABLE `gallery_images` ADD COLUMN `folder_id` int(11) DEFAULT NULL COMMENT 'Reference to onedrive_folders.id' AFTER `category`");
            echo "✓ Column added\n\n";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate column name') === false) {
                throw $e;
            }
            echo "✓ Column already exists\n\n";
        }
        
        // Add foreign key (optional - may fail if there's existing data)
        try {
            $pdo->exec("ALTER TABLE `gallery_images` ADD KEY `folder_id` (`folder_id`)");
            echo "✓ Index added\n\n";
        } catch (PDOException $e) {
            echo "⚠ Index may already exist (continuing...)\n\n";
        }
        
        try {
            $pdo->exec("ALTER TABLE `gallery_images` ADD CONSTRAINT `fk_gallery_images_folder` FOREIGN KEY (`folder_id`) REFERENCES `onedrive_folders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE");
            echo "✓ Foreign key added\n\n";
        } catch (PDOException $e) {
            echo "⚠ Foreign key may already exist or failed (continuing...)\n\n";
        }
    } else {
        echo "✓ folder_id column already exists\n\n";
    }
    
    // Migrate existing folder from gallery_config if it exists
    echo "Step 3: Migrating existing folder configuration...\n";
    $existingConfig = $pdo->query("SELECT onedrive_folder_link, onedrive_folder_id FROM gallery_config WHERE onedrive_folder_link IS NOT NULL LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    
    if ($existingConfig && !empty($existingConfig['onedrive_folder_link'])) {
        $folderExists = $pdo->prepare("SELECT COUNT(*) FROM onedrive_folders WHERE folder_link = ?");
        $folderExists->execute([$existingConfig['onedrive_folder_link']]);
        
        if ($folderExists->fetchColumn() == 0) {
            $pdo->prepare("
                INSERT INTO onedrive_folders (name, folder_link, folder_id, description, is_active, sort_order)
                VALUES (?, ?, ?, ?, ?, ?)
            ")->execute([
                'Default Folder',
                $existingConfig['onedrive_folder_link'],
                $existingConfig['onedrive_folder_id'],
                'Migrated from gallery_config',
                1,
                1
            ]);
            echo "✓ Existing folder migrated to onedrive_folders\n\n";
        } else {
            echo "✓ Folder already exists in onedrive_folders\n\n";
        }
    } else {
        echo "⚠ No existing folder configuration to migrate\n\n";
    }
    
    echo "=== Setup Complete! ===\n\n";
    echo "You can now use the folder management features in the admin panel.\n";
    
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
    exit(1);
}