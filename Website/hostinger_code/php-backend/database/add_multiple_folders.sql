-- Migration: Add support for multiple OneDrive folders
-- This script updates the schema to support multiple folders and better organization

-- Step 1: Create onedrive_folders table to store multiple folder configurations
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 2: Add folder_id to gallery_images for organization
ALTER TABLE `gallery_images`
ADD COLUMN `folder_id` int(11) DEFAULT NULL COMMENT 'Reference to onedrive_folders.id' AFTER `category`,
ADD KEY `folder_id` (`folder_id`),
ADD CONSTRAINT `fk_gallery_images_folder` FOREIGN KEY (`folder_id`) REFERENCES `onedrive_folders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 3: Migrate existing gallery_config to onedrive_folders (if data exists)
-- This preserves your existing folder configuration
INSERT INTO `onedrive_folders` (`name`, `folder_link`, `folder_id`, `description`, `is_active`, `sort_order`)
SELECT 
  'Default Folder' as name,
  COALESCE(`onedrive_folder_link`, `google_drive_folder_link`) as folder_link,
  COALESCE(`onedrive_folder_id`, `google_drive_folder_id`) as folder_id,
  'Migrated from gallery_config' as description,
  1 as is_active,
  1 as sort_order
FROM `gallery_config`
WHERE COALESCE(`onedrive_folder_link`, `google_drive_folder_link`) IS NOT NULL
LIMIT 1;

-- Step 4: Update existing gallery_images with folder_id (optional - links to first folder)
UPDATE `gallery_images` 
SET `folder_id` = (SELECT id FROM `onedrive_folders` ORDER BY id ASC LIMIT 1)
WHERE `folder_id` IS NULL AND EXISTS (SELECT 1 FROM `onedrive_folders`);

-- Note: The old gallery_config table can be kept for backward compatibility or dropped later