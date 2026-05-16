-- Migration script to convert Google Drive fields to OneDrive fields
-- Run this script to update your database schema

-- Step 1: Add new OneDrive columns
ALTER TABLE `gallery_config`
ADD COLUMN `onedrive_folder_link` varchar(500) DEFAULT NULL AFTER `google_drive_folder_id`,
ADD COLUMN `onedrive_folder_id` varchar(100) DEFAULT NULL AFTER `onedrive_folder_link`;

-- Step 2: Migrate existing data (if you want to preserve it)
-- UPDATE `gallery_config` 
-- SET `onedrive_folder_link` = `google_drive_folder_link`,
--     `onedrive_folder_id` = `google_drive_folder_id`
-- WHERE `google_drive_folder_link` IS NOT NULL;

-- Step 3: Drop old Google Drive columns (uncomment when ready)
-- ALTER TABLE `gallery_config`
-- DROP COLUMN `google_drive_folder_link`,
-- DROP COLUMN `google_drive_folder_id`;

-- Note: Keep the old columns until you're sure the migration works
-- You can drop them later after testing