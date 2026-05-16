<?php
/**
 * Setup Test Script
 * Run this to verify your PHP backend is configured correctly
 */

echo "=== PHP Backend Setup Test ===\n\n";

// Test 1: PHP Version
echo "1. PHP Version: ";
$phpVersion = phpversion();
echo $phpVersion . "\n";
if (version_compare($phpVersion, '7.4.0', '<')) {
    echo "   ❌ ERROR: PHP 7.4+ required\n";
    exit(1);
} else {
    echo "   ✅ OK\n";
}

// Test 2: Required Extensions
echo "\n2. Required PHP Extensions:\n";
$required = ['pdo', 'pdo_mysql', 'json', 'mbstring', 'fileinfo'];
foreach ($required as $ext) {
    if (extension_loaded($ext)) {
        echo "   ✅ $ext\n";
    } else {
        echo "   ❌ $ext - MISSING\n";
    }
}

// Test 3: Database Connection
echo "\n3. Database Connection:\n";
try {
    $config = require __DIR__ . '/../config/database.php';
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    echo "   ✅ Connected to database: {$config['dbname']}\n";
    
    // Test tables exist
    $tables = ['enquiries', 'contacts', 'admissions', 'visit_schedules', 'documents', 
               'hero_images', 'gallery_images', 'gallery_config', 'smtp_config', 'admin_sessions'];
    echo "\n4. Database Tables:\n";
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "   ✅ $table\n";
        } else {
            echo "   ❌ $table - MISSING (run schema.sql)\n";
        }
    }
} catch (PDOException $e) {
    echo "   ❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "   Please check config/database.php\n";
}

// Test 4: File Permissions
echo "\n5. File Permissions:\n";
$uploadDir = __DIR__ . '/../uploads';
if (is_dir($uploadDir)) {
    echo "   ✅ uploads/ directory exists\n";
    if (is_writable($uploadDir)) {
        echo "   ✅ uploads/ is writable\n";
    } else {
        echo "   ❌ uploads/ is not writable (chmod 755 or 777)\n";
    }
} else {
    echo "   ❌ uploads/ directory missing\n";
}

$subDirs = ['documents', 'hero'];
foreach ($subDirs as $dir) {
    $path = $uploadDir . '/' . $dir;
    if (is_dir($path)) {
        echo "   ✅ uploads/$dir/ exists\n";
    } else {
        echo "   ❌ uploads/$dir/ missing\n";
    }
}

// Test 5: Config Files
echo "\n6. Configuration Files:\n";
$configFiles = [
    '../config/database.php' => 'Database config',
    '../config/app.php' => 'App config',
    '../.htaccess' => 'Apache config',
];
foreach ($configFiles as $file => $name) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        echo "   ✅ $name\n";
    } else {
        echo "   ❌ $name - MISSING\n";
    }
}

echo "\n=== Test Complete ===\n";
echo "\nIf all tests pass, your backend is ready!\n";
echo "Start the server: php -S localhost:8000 -t ..\n";
echo "Then test: http://localhost:8000/api/documents\n";