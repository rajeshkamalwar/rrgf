<?php
/**
 * OneDrive Helper
 * Converts OneDrive URLs to embeddable formats
 */

class OneDriveHelper {
    /**
     * Extract file ID from OneDrive URL
     * Handles multiple OneDrive URL formats including SharePoint/OneDrive for Business
     */
    public static function extractFileId($url) {
        // Format 1: SharePoint/OneDrive for Business sharing link - FOLDER
        // https://tenant-my.sharepoint.com/:f:/g/personal/user/FOLDER_ID?e=TOKEN
        if (preg_match('/sharepoint\.com\/:f:\/g\/personal\/[^\/]+\/([A-Za-z0-9_-]+)(\?|$)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Format 1b: SharePoint/OneDrive for Business sharing link - IMAGE
        // https://tenant-my.sharepoint.com/:i:/g/personal/user/FILE_ID?e=TOKEN
        if (preg_match('/sharepoint\.com\/:i:\/g\/personal\/[^\/]+\/([A-Za-z0-9_-]+)(\?|$)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Format 2: SharePoint embed URL with UniqueId parameter
        // https://tenant-my.sharepoint.com/.../_layouts/15/embed.aspx?UniqueId=FILE_ID
        if (preg_match('/[?&]UniqueId=([A-Za-z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Format 3: https://onedrive.live.com/embed?cid=CID&resid=RESID
        if (preg_match('/resid=([^&"\']+)/', $url, $matches)) {
            return urldecode($matches[1]);
        }
        
        // Format 4: https://1drv.ms/f/s!FOLDER_ID or https://1drv.ms/i/s!FILE_ID
        if (preg_match('/1drv\.ms\/[fi]\/s!([A-Za-z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Format 5: https://onedrive.live.com/?id=ROOT/FILE_ID
        if (preg_match('/\?id=ROOT%2F([^&"\']+)/', $url, $matches)) {
            return urldecode($matches[1]);
        }
        
        // Format 6: Direct embed URL with resid
        if (preg_match('/resid=([^&"\']+)/', urldecode($url), $matches)) {
            return urldecode($matches[1]);
        }
        
        return null;
    }
    
    /**
     * Extract folder ID from OneDrive folder link (supports SharePoint/OneDrive for Business)
     */
    public static function extractFolderId($url) {
        // For SharePoint URLs, extract the folder ID
        if (strpos($url, 'sharepoint.com') !== false) {
            // Format: https://tenant-my.sharepoint.com/:f:/g/personal/user/FOLDER_ID?e=TOKEN
            if (preg_match('/sharepoint\.com\/:f:\/g\/personal\/([^\/]+)\/([A-Za-z0-9_-]+)/', $url, $matches)) {
                return $matches[2]; // Return the folder ID
            }
        }
        
        // For regular OneDrive URLs
        $fileId = self::extractFileId($url);
        return $fileId;
    }
    
    /**
     * Extract SharePoint site details from URL
     * Returns array with tenant, user, and folder ID
     */
    public static function extractSharePointDetails($url) {
        if (strpos($url, 'sharepoint.com') === false) {
            return null;
        }
        
        // Extract tenant and user from SharePoint URL - FOLDER
        // Format: https://tenant-my.sharepoint.com/:f:/g/personal/user/FOLDER_ID
        if (preg_match('/https?:\/\/([^-]+)-my\.sharepoint\.com\/:f:\/g\/personal\/([^\/]+)\/([A-Za-z0-9_-]+)/', $url, $matches)) {
            return [
                'tenant' => $matches[1],
                'user' => $matches[2],
                'folderId' => $matches[3],
                'baseUrl' => "https://{$matches[1]}-my.sharepoint.com/personal/{$matches[2]}"
            ];
        }
        
        // Extract tenant and user from SharePoint URL - IMAGE
        // Format: https://tenant-my.sharepoint.com/:i:/g/personal/user/FILE_ID
        if (preg_match('/https?:\/\/([^-]+)-my\.sharepoint\.com\/:i:\/g\/personal\/([^\/]+)\/([A-Za-z0-9_-]+)/', $url, $matches)) {
            return [
                'tenant' => $matches[1],
                'user' => $matches[2],
                'fileId' => $matches[3],
                'baseUrl' => "https://{$matches[1]}-my.sharepoint.com/personal/{$matches[2]}"
            ];
        }
        
        return null;
    }
    
    /**
     * Convert OneDrive URL to embeddable format for images
     * OneDrive images need to be converted to embed URLs
     * Supports both personal OneDrive and SharePoint/OneDrive for Business
     */
    public static function getEmbeddableUrl($onedriveUrl) {
        // If already an embed URL, return as is
        if (strpos($onedriveUrl, 'embed') !== false || strpos($onedriveUrl, 'download.aspx') !== false) {
            return $onedriveUrl;
        }
        
        // Handle SharePoint/OneDrive for Business URLs
        if (strpos($onedriveUrl, 'sharepoint.com') !== false) {
            $spDetails = self::extractSharePointDetails($onedriveUrl);
            $fileId = self::extractFileId($onedriveUrl);
            
            if ($spDetails && $fileId) {
                // Convert SharePoint sharing link to embed format
                // Format: https://tenant-my.sharepoint.com/personal/user/_layouts/15/embed.aspx?UniqueId=FILE_ID
                return $spDetails['baseUrl'] . "/_layouts/15/embed.aspx?UniqueId=" . urlencode($fileId);
            }
            
            // If we can't extract details but have a file ID, try basic embed format
            if ($fileId) {
                // Try to extract tenant and user from the URL
                if (preg_match('/https?:\/\/([^-]+)-my\.sharepoint\.com\/:i?:\/g\/personal\/([^\/]+)/', $onedriveUrl, $matches)) {
                    $baseUrl = "https://{$matches[1]}-my.sharepoint.com/personal/{$matches[2]}";
                    return $baseUrl . "/_layouts/15/embed.aspx?UniqueId=" . urlencode($fileId);
                }
            }
            
            // If we can't extract details, try to use the URL as-is or convert sharing link
            // SharePoint sharing links can sometimes work directly as image URLs
            return $onedriveUrl;
        }
        
        // Handle personal OneDrive URLs
        $fileId = self::extractFileId($onedriveUrl);
        
        if (!$fileId) {
            return $onedriveUrl; // Return original if can't parse
        }
        
        // Extract CID if present (Container ID)
        $cid = null;
        if (preg_match('/cid=([^&"\']+)/', $onedriveUrl, $cidMatches)) {
            $cid = urldecode($cidMatches[1]);
        }
        
        // Build embed URL
        // Format: https://onedrive.live.com/embed?cid=CID&resid=RESID&authkey=!AUTHKEY
        // For public images, we can use a simpler format
        if ($cid) {
            // Full embed URL with CID and resid
            return "https://onedrive.live.com/embed?cid=" . urlencode($cid) . "&resid=" . urlencode($fileId) . "&authkey=%21";
        } else {
            // Simplified embed URL (works for publicly shared files)
            // Alternative: Use direct download URL
            return "https://onedrive.live.com/download?cid=" . urlencode($fileId) . "&resid=" . urlencode($fileId) . "&parId=" . urlencode($fileId) . "&authkey=%21&o=OneUp";
        }
    }
    
    /**
     * Get thumbnail URL for OneDrive image
     * OneDrive provides thumbnails via Microsoft Graph API or direct thumbnail URLs
     * Supports both personal OneDrive and SharePoint/OneDrive for Business
     */
    public static function getThumbnailUrl($onedriveUrl, $size = 800) {
        // Handle SharePoint/OneDrive for Business URLs
        if (strpos($onedriveUrl, 'sharepoint.com') !== false) {
            // For SharePoint, use the embed URL (same as full image)
            // SharePoint handles resizing automatically via CSS or we can add width/height params
            $embedUrl = self::getEmbeddableUrl($onedriveUrl);
            // SharePoint embed URLs can accept size parameters
            return $embedUrl . (strpos($embedUrl, '?') !== false ? '&' : '?') . "width={$size}&height={$size}";
        }
        
        // Handle personal OneDrive URLs
        $fileId = self::extractFileId($onedriveUrl);
        
        if (!$fileId) {
            return $onedriveUrl;
        }
        
        // Extract CID if available
        $cid = null;
        if (preg_match('/cid=([^&"\']+)/', $onedriveUrl, $cidMatches)) {
            $cid = urldecode($cidMatches[1]);
        }
        
        // For thumbnails, we use the embed URL which OneDrive will resize
        // Size parameter can be added: &width=800&height=800
        if ($cid) {
            return "https://onedrive.live.com/embed?cid=" . urlencode($cid) . "&resid=" . urlencode($fileId) . "&authkey=%21&width={$size}&height={$size}";
        } else {
            // Fallback to embed URL
            return self::getEmbeddableUrl($onedriveUrl);
        }
    }
    
    /**
     * Convert 1drv.ms short URL to full URL
     * This requires making a request to get the redirect
     */
    public static function expandShortUrl($shortUrl) {
        // If not a short URL, return as is
        if (strpos($shortUrl, '1drv.ms') === false) {
            return $shortUrl;
        }
        
        // Use a simple redirect check (for PHP environments with allow_url_fopen)
        // In production, you might want to use cURL
        $context = stream_context_create([
            'http' => [
                'method' => 'HEAD',
                'follow_location' => 1,
                'max_redirects' => 5,
                'user_agent' => 'Mozilla/5.0'
            ]
        ]);
        
        $headers = @get_headers($shortUrl, 1, $context);
        
        if ($headers && isset($headers['Location'])) {
            $location = is_array($headers['Location']) ? end($headers['Location']) : $headers['Location'];
            return $location;
        }
        
        return $shortUrl;
    }
    
    /**
     * Convert OneDrive sharing link to direct image URL
     * This is a helper for when users paste sharing links
     */
    public static function convertSharingLinkToEmbed($sharingLink) {
        // Expand short URLs first
        $expandedUrl = self::expandShortUrl($sharingLink);
        
        // Extract file/resource ID
        $resourceId = self::extractFileId($expandedUrl);
        
        if (!$resourceId) {
            return $sharingLink; // Return original if can't parse
        }
        
        // Extract CID if available
        $cid = null;
        if (preg_match('/cid=([^&"\']+)/', $expandedUrl, $cidMatches)) {
            $cid = urldecode($cidMatches[1]);
        }
        
        // Build embed URL
        if ($cid) {
            return "https://onedrive.live.com/embed?cid=" . urlencode($cid) . "&resid=" . urlencode($resourceId) . "&authkey=%21";
        } else {
            // Try to construct a basic embed URL
            // Note: This may not work for all OneDrive links without proper authentication
            return "https://onedrive.live.com/embed?resid=" . urlencode($resourceId) . "&authkey=%21";
        }
    }
}