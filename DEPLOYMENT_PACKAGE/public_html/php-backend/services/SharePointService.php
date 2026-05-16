<?php
/**
 * SharePoint Service
 * Handles fetching images from SharePoint/OneDrive for Business
 * 
 * Note: Full functionality requires Microsoft Graph API credentials
 * This is a basic implementation that provides helpful error messages
 */

require_once __DIR__ . '/../utils/OneDriveHelper.php';

class SharePointService {
    private $clientId;
    private $clientSecret;
    private $tenantId;
    
    public function __construct() {
        // Try to get credentials from database first (admin panel configuration)
        try {
            require_once __DIR__ . '/Database.php';
            $db = Database::getInstance();
            // Get active config (is_active = 1) or most recent config if none are active
            $config = $db->fetchOne(
                "SELECT client_id, client_secret, tenant_id, is_active FROM graph_api_config 
                 WHERE is_active = 1 AND client_id != '' AND client_secret != ''
                 ORDER BY id DESC LIMIT 1"
            );
            
            // If no active config, try to get the most recent one (even if inactive)
            if (!$config) {
                $config = $db->fetchOne(
                    "SELECT client_id, client_secret, tenant_id, is_active FROM graph_api_config 
                     WHERE client_id != '' AND client_secret != ''
                     ORDER BY id DESC LIMIT 1"
                );
            }
            
            if ($config && !empty($config['client_id']) && !empty($config['client_secret'])) {
                $this->clientId = $config['client_id'];
                $this->clientSecret = $config['client_secret'];
                $this->tenantId = $config['tenant_id'] ?: 'common';
            } else {
                // Fallback to environment variables
                $this->clientId = getenv('ONEDRIVE_CLIENT_ID') ?: null;
                $this->clientSecret = getenv('ONEDRIVE_CLIENT_SECRET') ?: null;
                $this->tenantId = getenv('ONEDRIVE_TENANT_ID') ?: null;
            }
        } catch (Exception $e) {
            // If database table doesn't exist or query fails, use environment variables
            $this->clientId = getenv('ONEDRIVE_CLIENT_ID') ?: null;
            $this->clientSecret = getenv('ONEDRIVE_CLIENT_SECRET') ?: null;
            $this->tenantId = getenv('ONEDRIVE_TENANT_ID') ?: null;
        }
    }
    
    /**
     * Check if Graph API credentials are configured
     */
    public function isConfigured() {
        return !empty($this->clientId) && !empty($this->clientSecret);
    }
    
    /**
     * Fetch images from SharePoint folder using Microsoft Graph API
     * 
     * @param string $folderLink SharePoint folder sharing link
     * @return array Array of image URLs
     */
    public function fetchImagesFromFolder($folderLink) {
        if (!$this->isConfigured()) {
            throw new Exception('Microsoft Graph API credentials not configured. Please set ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET, and ONEDRIVE_TENANT_ID environment variables.');
        }
        
        // Get access token first
        $accessToken = $this->getAccessToken();
        
        // Extract folder details (for fallback)
        $spDetails = OneDriveHelper::extractSharePointDetails($folderLink);
        
        // Build Graph API endpoint
        // For personal OneDrive with app-only auth, try multiple approaches
        
        $folderId = $spDetails['folderId'];
        $tenant = $spDetails['tenant'] ?? '';
        $userId = $spDetails['user'];
        
        // The folder ID from SharePoint sharing URL might not be directly usable
        // We'll try using the sharing token approach or drive enumeration
        
        // Try 1: Use drive root and search by sharing token
        // First, try to get the user's drive using their email/UPN
        $userPrincipal = str_replace('_', '@', $userId); // Convert info_neksoftconsultancy_com to info@neksoftconsultancy.com
        
        // For app-only auth with Files.Read.All, try accessing via /users/{id}/drive
        // But first, let's try to find the drive by listing all drives or using the drive endpoint
        // Actually, for personal OneDrive, we need the actual user UPN which might be different
        
        // Use /shares API with the sharing URL (works for both personal OneDrive and SharePoint)
        // Format: /shares/{encoded-sharing-url}/driveItem/children
        // Encode the sharing URL: base64(url).replace('+','-').replace('/','_').replace('=','').rstrip('=')
        $encodedUrl = rtrim(strtr(base64_encode($folderLink), '+/', '-_'), '=');
        $graphUrl = "https://graph.microsoft.com/v1.0/shares/{$encodedUrl}/driveItem/children";
        
        $ch = curl_init($graphUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json'
            ],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2
        ]);
        
        // For local development on Windows/XAMPP, disable SSL verification if needed
        if (PHP_OS_FAMILY === 'Windows' || strpos(php_uname(), 'Windows') !== false) {
            $caPath = ini_get('curl.cainfo');
            if (empty($caPath) || !file_exists($caPath)) {
                // Try to find cacert.pem
                $possiblePaths = [
                    __DIR__ . '/../cacert.pem',
                    __DIR__ . '/../../cacert.pem',
                ];
                $found = false;
                foreach ($possiblePaths as $path) {
                    if (file_exists($path)) {
                        curl_setopt($ch, CURLOPT_CAINFO, $path);
                        $found = true;
                        break;
                    }
                }
                // If still no CA bundle, disable verification for local dev
                if (!$found) {
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                }
            }
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($response === false || !empty($curlError)) {
            throw new Exception("cURL error when calling Graph API: " . $curlError);
        }
        
        if ($httpCode === 0) {
            throw new Exception("Graph API request failed: Unable to connect. Please check your internet connection and firewall settings.");
        }
        
        if ($httpCode !== 200) {
            $errorDetails = json_decode($response, true);
            $errorMessage = isset($errorDetails['error']['message']) 
                ? $errorDetails['error']['message'] 
                : (isset($errorDetails['error']['code']) 
                    ? $errorDetails['error']['code'] 
                    : substr($response, 0, 200));
            throw new Exception("Graph API request failed with code {$httpCode}. Error: " . $errorMessage);
        }
        
        $data = json_decode($response, true);
        if (!isset($data['value'])) {
            throw new Exception('Invalid response from Graph API');
        }
        
        // Filter for image files
        $images = [];
        foreach ($data['value'] as $item) {
            if (isset($item['file']) && $item['file']['mimeType']) {
                $mimeType = $item['file']['mimeType'];
                if (strpos($mimeType, 'image/') === 0) {
                    // Get embed URL for the image
                    $imageId = $item['id'];
                    $embedUrl = $spDetails['baseUrl'] . "/_layouts/15/embed.aspx?UniqueId=" . urlencode($imageId);
                    
                    $images[] = [
                        'imageUrl' => $embedUrl,
                        'thumbnailUrl' => $embedUrl, // SharePoint handles thumbnails
                        'title' => $item['name'] ?? null,
                        'description' => null,
                    ];
                }
            }
        }
        
        return $images;
    }
    
    /**
     * Get OAuth access token from Microsoft Graph API
     */
    private function getAccessToken() {
        $tenantId = $this->tenantId ?: 'common';
        $tokenUrl = "https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token";
        
        $params = [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'scope' => 'https://graph.microsoft.com/.default',
            'grant_type' => 'client_credentials'
        ];
        
        $ch = curl_init($tokenUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($params),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            // Try to use system certificate bundle if available
            CURLOPT_CAINFO => (function_exists('curl_version') && !empty(curl_version()['ssl_version'])) 
                ? null 
                : (file_exists(__DIR__ . '/../cacert.pem') ? __DIR__ . '/../cacert.pem' : null)
        ]);
        
        // For local development on Windows/XAMPP, disable SSL verification if CA bundle not found
        // WARNING: Only for local development! Remove this in production!
        $caBundle = curl_version();
        if (empty($caBundle) || (defined('CURLOPT_CAINFO') && !file_exists(ini_get('curl.cainfo')))) {
            // Try to find cacert.pem in common locations
            $possiblePaths = [
                __DIR__ . '/../cacert.pem',
                __DIR__ . '/../../cacert.pem',
                ini_get('curl.cainfo'),
            ];
            $caPath = null;
            foreach ($possiblePaths as $path) {
                if ($path && file_exists($path)) {
                    $caPath = $path;
                    break;
                }
            }
            
            // If no CA bundle found, disable verification for local dev (Windows/XAMPP issue)
            if (!$caPath && (PHP_OS_FAMILY === 'Windows' || strpos(php_uname(), 'Windows') !== false)) {
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            } elseif ($caPath) {
                curl_setopt($ch, CURLOPT_CAINFO, $caPath);
            }
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($response === false || !empty($curlError)) {
            throw new Exception("cURL error: " . $curlError . ". Please check your internet connection and PHP cURL extension.");
        }
        
        if ($httpCode !== 200) {
            $errorDetails = json_decode($response, true);
            $errorMessage = isset($errorDetails['error_description']) 
                ? $errorDetails['error_description'] 
                : (isset($errorDetails['error']) ? $errorDetails['error'] : substr($response, 0, 200));
            throw new Exception("Failed to get access token. HTTP {$httpCode}: " . $errorMessage);
        }
        
        $data = json_decode($response, true);
        if (!isset($data['access_token'])) {
            throw new Exception('No access token in response');
        }
        
        return $data['access_token'];
    }
}