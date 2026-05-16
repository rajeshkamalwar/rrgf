<?php
/**
 * Setup Database Script
 * Creates database and imports schema
 */

echo "=== Database Setup Script ===\n\n";

require_once __DIR__ . '/../config/database.php';
$config = require __DIR__ . '/../config/database.php';

// Connect without database first
try {
    $dsn = "mysql:host={$config['host']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    echo "✅ Connected to MySQL server\n\n";
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '{$config['dbname']}'");
    if ($stmt->rowCount() > 0) {
        echo "Database '{$config['dbname']}' already exists.\n";
        echo "Do you want to recreate it? (WARNING: This will delete all data)\n";
        echo "Skip this step if you just want to import schema.\n\n";
    } else {
        // Create database
        echo "Creating database '{$config['dbname']}'...\n";
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$config['dbname']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "✅ Database created\n\n";
    }
    
    // Now connect to the database
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    // Check if tables exist
    $stmt = $pdo->query("SHOW TABLES");
    $existingTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($existingTables) > 0) {
        echo "⚠️  Database already has tables: " . implode(', ', $existingTables) . "\n";
        echo "Schema import skipped. If you want to recreate tables, delete them first.\n\n";
    } else {
        // Read and execute schema.sql
        $schemaFile = __DIR__ . '/../database/schema.sql';
        if (file_exists($schemaFile)) {
            echo "Importing schema from database/schema.sql...\n";
            $sql = file_get_contents($schemaFile);
            
            // Remove comments and split by semicolon
            $sql = preg_replace('/--.*$/m', '', $sql);
            $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
            $statements = array_filter(array_map('trim', explode(';', $sql)));
            
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    try {
                        $pdo->exec($statement);
                    } catch (PDOException $e) {
                        // Ignore "already exists" errors
                        if (strpos($e->getMessage(), 'already exists') === false) {
                            echo "  ⚠️  Warning: " . substr($e->getMessage(), 0, 100) . "\n";
                        }
                    }
                }
            }
            
            echo "✅ Schema imported\n\n";
        } else {
            echo "❌ Schema file not found: $schemaFile\n";
        }
    }
    
    // Verify tables
    echo "Verifying tables:\n";
    $tables = ['enquiries', 'contacts', 'admissions', 'visit_schedules', 'documents', 
               'hero_images', 'gallery_images', 'gallery_config', 'smtp_config', 'admin_sessions'];
    
    $allExist = true;
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            // Count rows
            $countStmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
            $count = $countStmt->fetch()['count'];
            echo "  ✅ $table ($count rows)\n";
        } else {
            echo "  ❌ $table - MISSING\n";
            $allExist = false;
        }
    }
    
    if ($allExist) {
        echo "\n✅ Database setup complete!\n";
        echo "\nYou can now test the API endpoints.\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nMake sure:\n";
    echo "  1. XAMPP MySQL is running\n";
    echo "  2. MySQL credentials in config/database.php are correct\n";
    echo "  3. MySQL user has permission to create databases\n";
}

echo "\n=== Setup Complete ===\n";