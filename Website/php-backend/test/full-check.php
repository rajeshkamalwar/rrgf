<?php
/**
 * Full System Check
 * Comprehensive test of all components
 */

echo "=== PHP Backend Full System Check ===\n\n";

$baseUrl = 'http://localhost:8000';
$allPassed = true;
$testsRun = 0;
$testsPassed = 0;

function test($name, $callback) {
    global $testsRun, $testsPassed, $allPassed;
    $testsRun++;
    echo "Testing: $name... ";
    try {
        $result = $callback();
        if ($result) {
            echo "✅ PASSED\n";
            $testsPassed++;
        } else {
            echo "❌ FAILED\n";
            $allPassed = false;
        }
    } catch (Exception $e) {
        echo "❌ FAILED: " . $e->getMessage() . "\n";
        $allPassed = false;
    }
}

// 1. Database Connection
test("Database Connection", function() {
    require_once __DIR__ . '/../config/database.php';
    $config = require __DIR__ . '/../config/database.php';
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    return true;
});

// 2. Database Tables
test("Database Tables", function() {
    require_once __DIR__ . '/../services/Database.php';
    $db = Database::getInstance();
    $tables = ['enquiries', 'contacts', 'admissions', 'visit_schedules', 'documents', 
               'hero_images', 'gallery_images', 'gallery_config', 'smtp_config', 'admin_sessions'];
    foreach ($tables as $table) {
        $result = $db->fetchOne("SHOW TABLES LIKE ?", [$table]);
        if (!$result) return false;
    }
    return true;
});

// 3. API Server Response
test("API Server Running", function() use ($baseUrl) {
    $ch = curl_init($baseUrl . '/api/documents');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $httpCode === 200;
});

// 4. GET /api/documents
test("GET /api/documents", function() use ($baseUrl) {
    $ch = curl_init($baseUrl . '/api/documents');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) return false;
    $data = json_decode($response, true);
    return isset($data['success']) && $data['success'] === true && isset($data['documents']);
});

// 5. GET /api/hero-images
test("GET /api/hero-images", function() use ($baseUrl) {
    $ch = curl_init($baseUrl . '/api/hero-images');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) return false;
    $data = json_decode($response, true);
    return isset($data['success']) && $data['success'] === true && isset($data['images']);
});

// 6. GET /api/gallery
test("GET /api/gallery", function() use ($baseUrl) {
    $ch = curl_init($baseUrl . '/api/gallery');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) return false;
    $data = json_decode($response, true);
    return isset($data['success']) && $data['success'] === true && isset($data['images']);
});

// 7. POST /api/enquiry (Validation)
test("POST /api/enquiry (validation)", function() use ($baseUrl) {
    $ch = curl_init($baseUrl . '/api/enquiry');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'name' => 'Test User',
        'phone' => '1234567890'
    ]));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $data = json_decode($response, true);
    // Should succeed (200) or fail with proper error format (400)
    return isset($data['success']) || (isset($data['error']) && $httpCode >= 400);
});

// 8. POST /api/admin/login (with wrong credentials)
test("POST /api/admin/login (auth check)", function() use ($baseUrl) {
    $ch = curl_init($baseUrl . '/api/admin/login');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'username' => 'wrong',
        'password' => 'wrong'
    ]));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $data = json_decode($response, true);
    // Should return error for wrong credentials
    return isset($data['success']) && $data['success'] === false;
});

// 9. File Upload Directory
test("Upload Directory", function() {
    $uploadDir = __DIR__ . '/../uploads';
    return is_dir($uploadDir) && is_writable($uploadDir);
});

// 10. Configuration Files
test("Configuration Files", function() {
    $files = [
        __DIR__ . '/../config/database.php',
        __DIR__ . '/../config/app.php',
        __DIR__ . '/../api/index.php',
    ];
    foreach ($files as $file) {
        if (!file_exists($file)) return false;
    }
    return true;
});

// Summary
echo "\n=== Summary ===\n";
echo "Tests Run: $testsRun\n";
echo "Tests Passed: $testsPassed\n";
echo "Tests Failed: " . ($testsRun - $testsPassed) . "\n\n";

if ($allPassed) {
    echo "✅ ALL TESTS PASSED!\n";
    echo "\nYour PHP backend is fully functional and ready to use.\n";
} else {
    echo "⚠️  SOME TESTS FAILED\n";
    echo "Please review the errors above.\n";
}

echo "\n=== Detailed Endpoint Test ===\n\n";

// Test all public endpoints with detailed output
$endpoints = [
    'GET /api/documents' => '/api/documents',
    'GET /api/hero-images' => '/api/hero-images',
    'GET /api/gallery' => '/api/gallery',
];

foreach ($endpoints as $name => $endpoint) {
    echo "$name:\n";
    $ch = curl_init($baseUrl . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $data = json_decode($response, true);
    echo "  Status: $httpCode\n";
    echo "  Success: " . ($data['success'] ?? 'N/A') . "\n";
    if (isset($data['documents'])) {
        echo "  Documents: " . count($data['documents']) . "\n";
    }
    if (isset($data['images'])) {
        echo "  Images: " . count($data['images']) . "\n";
    }
    echo "\n";
}

echo "=== Check Complete ===\n";