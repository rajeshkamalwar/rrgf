<?php
/**
 * API Endpoint Test Script
 * Tests all API endpoints to verify they work correctly
 */

$baseUrl = 'http://localhost:8000';
$sessionId = null;

echo "=== API Endpoint Tests ===\n\n";

// Helper function to make requests
function makeRequest($method, $endpoint, $data = null, $sessionId = null) {
    global $baseUrl;
    
    $url = $baseUrl . $endpoint;
    $ch = curl_init($url);
    
    $headers = ['Content-Type: application/json'];
    if ($sessionId) {
        $headers[] = 'x-session-id: ' . $sessionId;
    }
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'body' => json_decode($response, true),
        'raw' => $response
    ];
}

// Test 1: Public Endpoints
echo "1. Testing Public Endpoints:\n";

// Test GET /api/documents
echo "\n   GET /api/documents: ";
$result = makeRequest('GET', '/api/documents');
if ($result['code'] === 200 && isset($result['body']['success'])) {
    echo "✅ OK (found " . count($result['body']['documents'] ?? []) . " documents)\n";
} else {
    echo "❌ FAILED (code: {$result['code']})\n";
    echo "   Response: " . substr($result['raw'], 0, 100) . "\n";
}

// Test GET /api/hero-images
echo "   GET /api/hero-images: ";
$result = makeRequest('GET', '/api/hero-images');
if ($result['code'] === 200 && isset($result['body']['success'])) {
    echo "✅ OK\n";
} else {
    echo "❌ FAILED\n";
}

// Test GET /api/gallery
echo "   GET /api/gallery: ";
$result = makeRequest('GET', '/api/gallery');
if ($result['code'] === 200 && isset($result['body']['success'])) {
    echo "✅ OK\n";
} else {
    echo "❌ FAILED\n";
}

// Test POST /api/enquiry (should work)
echo "   POST /api/enquiry: ";
$enquiryData = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'phone' => '1234567890',
    'subject' => 'Test Enquiry'
];
$result = makeRequest('POST', '/api/enquiry', $enquiryData);
if ($result['code'] === 200 && isset($result['body']['success'])) {
    echo "✅ OK\n";
} else {
    echo "❌ FAILED\n";
}

// Test 2: Admin Authentication
echo "\n2. Testing Admin Authentication:\n";

// Test POST /api/admin/login
echo "\n   POST /api/admin/login: ";
$loginData = [
    'username' => 'admin', // Update with your admin username
    'password' => 'admin123' // Update with your admin password
];
$result = makeRequest('POST', '/api/admin/login', $loginData);
if ($result['code'] === 200 && isset($result['body']['success']) && isset($result['body']['sessionId'])) {
    $sessionId = $result['body']['sessionId'];
    echo "✅ OK (Session ID: " . substr($sessionId, 0, 20) . "...)\n";
} else {
    echo "❌ FAILED (code: {$result['code']})\n";
    echo "   Response: " . substr($result['raw'], 0, 200) . "\n";
    echo "   Note: Update username/password in this test file\n";
}

// Test GET /api/admin/check-auth
if ($sessionId) {
    echo "   GET /api/admin/check-auth: ";
    $result = makeRequest('GET', '/api/admin/check-auth', null, $sessionId);
    if ($result['code'] === 200 && isset($result['body']['authenticated']) && $result['body']['authenticated']) {
        echo "✅ OK\n";
    } else {
        echo "❌ FAILED\n";
    }
    
    // Test GET /api/admin/smtp
    echo "   GET /api/admin/smtp: ";
    $result = makeRequest('GET', '/api/admin/smtp', null, $sessionId);
    if ($result['code'] === 200) {
        echo "✅ OK\n";
    } else {
        echo "❌ FAILED\n";
    }
} else {
    echo "   ⚠️  Skipping admin endpoints (login failed)\n";
}

echo "\n=== Test Complete ===\n";
echo "\nTo test with real data:\n";
echo "1. Start server: php -S localhost:8000 -t ..\n";
echo "2. Update admin credentials in this file if needed\n";
echo "3. Run: php test-api.php\n";