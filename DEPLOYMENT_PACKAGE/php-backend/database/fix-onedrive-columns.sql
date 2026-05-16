-- Quick fix: Add OneDrive columns if they don't exist
-- This script adds the columns without removing the old ones (safe migration)

-- Check if columns exist and add them if they don't
-- Note: This uses a safe approach - ALTER TABLE with IF NOT EXISTS equivalent

-- Step 1: Add onedrive_folder_link column if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = 'gallery_config';
SET @columnname = 'onedrive_folder_link';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' varchar(500) DEFAULT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 2: Add onedrive_folder_id column if it doesn't exist
SET @columnname = 'onedrive_folder_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' varchar(100) DEFAULT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Simpler approach (run these directly if the above doesn't work):
-- ALTER TABLE `gallery_config` ADD COLUMN `onedrive_folder_link` varchar(500) DEFAULT NULL;
-- ALTER TABLE `gallery_config` ADD COLUMN `onedrive_folder_id` varchar(100) DEFAULT NULL;