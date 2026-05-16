<?php
/**
 * Test Graph API User Lookup
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/SharePointService.php';

try {
    $service = new SharePointService();
    $reflection = new ReflectionClass($service);
    $getToken = $reflection->getMethod('getAccessToken');
    $getToken->setAccessible(true);
    
    $token = $getToken->invoke($service);
    echo "Token obtained\n";
    
    // Try different user principal formats
    $formats = [
        'info_neksoftconsultancy_com@neksoftconsultancyservice.onmicrosoft.com',
        'info.neksoftconsultancy.com@neksoftconsultancyservice.onmicrosoft.com',
        'info@neksoftconsultancyservice.onmicrosoft.com',
    ];
    
    $folderId = 'IgC32uBo_r1HRqVsroirjJLCAQZB5bklp3cnB9GwhjMtdAs';
    
    foreach ($formats as $userPrincipal) {
        $url = "https://graph.microsoft.com/v1.0/users/{$userPrincipal}/drive/items/{$folderId}/children";
        echo "\nTrying: $userPrincipal\n";
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json'
            ]
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "HTTP Code: $httpCode\n";
        if ($httpCode === 200) {
            echo "✅ Success with: $userPrincipal\n";
            break;
        } else {
            $error = json_decode($response, true);
            echo "Error: " . ($error['error']['message'] ?? 'Unknown') . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
