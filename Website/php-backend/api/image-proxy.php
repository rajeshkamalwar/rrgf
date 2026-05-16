<?php
/**
 * Image Proxy for Google Drive Images
 * Proxies Google Drive images to avoid CORS issues
 * 
 * Usage: /api/image-proxy.php?url=ENCODED_GOOGLE_DRIVE_URL
 */

// Get the image URL from query parameter
$imageUrl = $_GET['url'] ?? '';

if (empty($imageUrl)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'URL parameter required']);
    exit;
}

// Decode the URL
$imageUrl = urldecode($imageUrl);

// Security: Only allow Google Drive URLs
if (strpos($imageUrl, 'drive.google.com') === false && strpos($imageUrl, 'googleusercontent.com') === false) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Only Google Drive URLs are allowed']);
    exit;
}

// Fetch the image
$ch = curl_init($imageUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

// Get headers to determine content type
curl_setopt($ch, CURLOPT_HEADER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Failed to fetch image', 'code' => $httpCode]);
    exit;
}

// Split headers and body
list($headers, $body) = explode("\r\n\r\n", $response, 2);

// Extract content type from headers
if (preg_match('/Content-Type:\s*([^\r\n]+)/i', $headers, $matches)) {
    header('Content-Type: ' . trim($matches[1]));
} else {
    header('Content-Type: image/jpeg'); // Default
}

// Cache headers
header('Cache-Control: public, max-age=86400'); // Cache for 1 day
header('Access-Control-Allow-Origin: *');

// Output the image
echo $body;