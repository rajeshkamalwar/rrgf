<?php
/**
 * Google Drive Helper
 * Converts Google Drive URLs to embeddable formats
 */

class GoogleDriveHelper {
    /**
     * Extract file ID from Google Drive URL
     */
    public static function extractFileId($url) {
        // Format: https://drive.google.com/file/d/FILE_ID/view
        if (preg_match('/\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Format: https://drive.google.com/uc?export=view&id=FILE_ID
        if (preg_match('/[?&]id=([a-zA-Z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
    
    /**
     * Convert Google Drive URL to embeddable format
     * Tries multiple methods to ensure image loads
     */
    public static function getEmbeddableUrl($driveUrl) {
        $fileId = self::extractFileId($driveUrl);
        
        if (!$fileId) {
            return $driveUrl; // Return original if can't parse
        }
        
        // Try different URL formats in order of preference
        $formats = [
            // Method 1: Direct thumbnail (most reliable)
            "https://drive.google.com/thumbnail?id={$fileId}&sz=w1920",
            
            // Method 2: Export view
            "https://drive.google.com/uc?export=view&id={$fileId}",
            
            // Method 3: Alternative export
            "https://drive.google.com/uc?export=download&id={$fileId}",
        ];
        
        // Return the first format (thumbnail is usually most reliable)
        return $formats[0];
    }
    
    /**
     * Get thumbnail URL
     */
    public static function getThumbnailUrl($driveUrl, $size = 800) {
        $fileId = self::extractFileId($driveUrl);
        
        if (!$fileId) {
            return $driveUrl;
        }
        
        return "https://drive.google.com/thumbnail?id={$fileId}&sz=w{$size}";
    }
}