<?php
/**
 * Test Google Drive Image URLs
 * Check if URLs are accessible and can be embedded
 */

echo "=== Testing Google Drive Image URLs ===\n\n";

// Sample image URL from database
$testUrls = [
    'https://drive.google.com/uc?export=view&id=1zAj407IxVPfPOwkjXCii8mriHymq_LbZ',
    'https://drive.google.com/thumbnail?id=1zAj407IxVPfPOwkjXCii8mriHymq_LbZ&sz=w800',
];

foreach ($testUrls as $url) {
    echo "Testing: $url\n";
    
    // Test with cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    
    echo "  HTTP Code: $httpCode\n";
    echo "  Content-Type: $contentType\n";
    
    if ($httpCode === 200) {
        echo "  ✅ URL is accessible\n";
    } elseif ($httpCode === 302 || $httpCode === 301) {
        echo "  ⚠️  Redirect (might work but could cause issues)\n";
    } elseif ($httpCode === 403) {
        echo "  ❌ Forbidden - File permissions issue\n";
    } else {
        echo "  ❌ Error code: $httpCode\n";
    }
    echo "\n";
}

echo "=== Alternative URL Formats ===\n";
echo "For images that don't work with standard URLs, try:\n";
echo "1. https://lh3.googleusercontent.com/d/FILE_ID (if file is publicly shared)\n";
echo "2. Use Google Drive API with proper authentication\n";
echo "3. Host images on a dedicated image hosting service\n";