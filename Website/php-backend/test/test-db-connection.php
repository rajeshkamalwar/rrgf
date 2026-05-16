<?php
/**
 * Test Database Connection
 * Tests connection to XAMPP MySQL database
 */

echo "=== Database Connection Test ===\n\n";

require_once __DIR__ . '/../config/database.php';
$config = require __DIR__ . '/../config/database.php';

echo "Configuration:\n";
echo "  Host: {$config['host']}\n";
echo "  Database: {$config['dbname']}\n";
echo "  Username: {$config['username']}\n";
echo "  Password: " . (empty($config['password']) ? '(empty)' : '***') . "\n\n";

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    echo "✅ Database connection successful!\n\n";
    
    // Check if tables exist
    echo "Checking tables:\n";
    $tables = ['enquiries', 'contacts', 'admissions', 'visit_schedules', 'documents', 
               'hero_images', 'gallery_images', 'gallery_config', 'smtp_config', 'admin_sessions'];
    
    $missing = [];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "  ✅ $table\n";
        } else {
            echo "  ❌ $table - MISSING\n";
            $missing[] = $table;
        }
    }
    
    if (!empty($missing)) {
        echo "\n⚠️  Some tables are missing.\n";
        echo "Please import database/schema.sql to create them.\n";
        echo "\nTo import, run in MySQL:\n";
        echo "  mysql -u root rrgf < database/schema.sql\n";
        echo "\nOr use phpMyAdmin:\n";
        echo "  1. Open phpMyAdmin (http://localhost/phpmyadmin)\n";
        echo "  2. Select 'rrgf' database\n";
        echo "  3. Click 'Import' tab\n";
        echo "  4. Choose database/schema.sql file\n";
        echo "  5. Click 'Go'\n";
    } else {
        echo "\n✅ All tables exist!\n";
        
        // Test query
        echo "\nTesting query:\n";
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM documents");
        $result = $stmt->fetch();
        echo "  Documents count: {$result['count']}\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection failed!\n\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        echo "The database '{$config['dbname']}' does not exist.\n";
        echo "\nTo create it, run in MySQL:\n";
        echo "  mysql -u root -e \"CREATE DATABASE rrgf;\"\n";
        echo "\nOr use phpMyAdmin:\n";
        echo "  1. Open phpMyAdmin (http://localhost/phpmyadmin)\n";
        echo "  2. Click 'New' to create database\n";
        echo "  3. Name it 'rrgf'\n";
        echo "  4. Click 'Create'\n";
        echo "  5. Then import database/schema.sql\n";
    } elseif (strpos($e->getMessage(), 'Access denied') !== false) {
        echo "Access denied. Please check:\n";
        echo "  - Username: {$config['username']}\n";
        echo "  - Password: Check config/database.php\n";
        echo "  - XAMPP MySQL is running\n";
    }
}

echo "\n=== Test Complete ===\n";