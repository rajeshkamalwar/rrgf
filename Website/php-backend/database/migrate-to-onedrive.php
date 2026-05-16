<?php
/**
 * Database Migration Script: Google Drive to OneDrive
 * 
 * This script migrates the gallery_config table from Google Drive fields to OneDrive fields.
 * 
 * IMPORTANT: Backup your database before running this script!
 * 
 * Usage:
 *   php migrate-to-onedrive.php
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
    
    echo "=== OneDrive Migration Script ===\n\n";
    
    // Check if OneDrive columns already exist
    $checkColumns = $pdo->query("SHOW COLUMNS FROM gallery_config LIKE 'onedrive_folder_link'");
    if ($checkColumns->rowCount() > 0) {
        echo "⚠️  OneDrive columns already exist.\n";
        echo "Do you want to continue? This will check if Google Drive columns exist and remove them. (yes/no): ";
        $handle = fopen("php://stdin", "r");
        $line = trim(fgets($handle));
        fclose($handle);
        
        if (strtolower($line) !== 'yes') {
            echo "Migration cancelled.\n";
            exit(0);
        }
    } else {
        echo "Step 1: Adding OneDrive columns...\n";
        $pdo->exec("
            ALTER TABLE `gallery_config`
            ADD COLUMN `onedrive_folder_link` varchar(500) DEFAULT NULL,
            ADD COLUMN `onedrive_folder_id` varchar(100) DEFAULT NULL
        ");
        echo "✓ OneDrive columns added successfully.\n\n";
    }
    
    // Check if Google Drive columns exist
    $checkGoogleDrive = $pdo->query("SHOW COLUMNS FROM gallery_config LIKE 'google_drive_folder_link'");
    if ($checkGoogleDrive->rowCount() > 0) {
        echo "Step 2: Checking for Google Drive data...\n";
        $existingData = $pdo->query("SELECT google_drive_folder_link, google_drive_folder_id FROM gallery_config WHERE google_drive_folder_link IS NOT NULL LIMIT 1");
        $row = $existingData->fetch(PDO::FETCH_ASSOC);
        
        if ($row && !empty($row['google_drive_folder_link'])) {
            echo "⚠️  Found existing Google Drive configuration:\n";
            echo "   Link: {$row['google_drive_folder_link']}\n";
            echo "   ID: {$row['google_drive_folder_id']}\n\n";
            echo "Note: Google Drive links cannot be automatically converted to OneDrive.\n";
            echo "You'll need to manually configure your OneDrive folder in the admin panel.\n\n";
            
            echo "Do you want to remove Google Drive columns now? (yes/no): ";
            $handle = fopen("php://stdin", "r");
            $line = trim(fgets($handle));
            fclose($handle);
            
            if (strtolower($line) === 'yes') {
                echo "Step 3: Removing Google Drive columns...\n";
                $pdo->exec("
                    ALTER TABLE `gallery_config`
                    DROP COLUMN `google_drive_folder_link`,
                    DROP COLUMN `google_drive_folder_id`
                ");
                echo "✓ Google Drive columns removed successfully.\n\n";
            } else {
                echo "Google Drive columns kept. You can remove them manually later.\n\n";
            }
        } else {
            echo "No Google Drive data found. Safe to remove columns.\n";
            echo "Do you want to remove Google Drive columns now? (yes/no): ";
            $handle = fopen("php://stdin", "r");
            $line = trim(fgets($handle));
            fclose($handle);
            
            if (strtolower($line) === 'yes') {
                echo "Step 3: Removing Google Drive columns...\n";
                $pdo->exec("
                    ALTER TABLE `gallery_config`
                    DROP COLUMN `google_drive_folder_link`,
                    DROP COLUMN `google_drive_folder_id`
                ");
                echo "✓ Google Drive columns removed successfully.\n\n";
            }
        }
    } else {
        echo "✓ Google Drive columns already removed or never existed.\n\n";
    }
    
    echo "=== Migration Complete ===\n\n";
    echo "Next steps:\n";
    echo "1. Go to your admin panel\n";
    echo "2. Navigate to Gallery section\n";
    echo "3. Configure your OneDrive folder link\n";
    echo "4. Add images using OneDrive URLs\n\n";
    
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
    echo "\nMake sure:\n";
    echo "- Database credentials are correct in config/database.php\n";
    echo "- Database exists\n";
    echo "- You have proper permissions\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}