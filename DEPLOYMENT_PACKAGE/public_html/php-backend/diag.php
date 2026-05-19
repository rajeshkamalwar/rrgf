<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/plain');

$base = __DIR__;
$files = [
    'services/Database.php',
    'middleware/Auth.php',
    'config/app.php',
    'config/database.php',
    'config/database.local.php',
    'utils/Response.php',
    'utils/Request.php',
    'controllers/AdminController.php',
    'controllers/FolderController.php',
    'controllers/PublicController.php',
];

foreach ($files as $f) {
    $exists = file_exists($base . '/' . $f) ? 'OK' : 'MISSING';
    echo "$exists  $f\n";
}

echo "\n--- Testing DB connection ---\n";
try {
    $cfg = require $base . '/config/database.php';
    $opts = $cfg['options'] ?? [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    $dsn = "mysql:host={$cfg['host']};dbname={$cfg['dbname']};charset=" . ($cfg['charset'] ?? 'utf8mb4');
    $pdo = new PDO($dsn, $cfg['username'], $cfg['password'], $opts);
    echo "DB: Connected OK\n";
    $t = $pdo->query("SHOW TABLES LIKE 'admin_sessions'")->fetch();
    echo $t ? "admin_sessions: OK\n" : "admin_sessions: MISSING (import database/schema.sql)\n";
} catch (\Throwable $e) {
    echo "DB ERROR: " . $e->getMessage() . "\n";
}

echo "\n--- Admin password verify ---\n";
$app = require $base . '/config/app.php';
echo password_verify('admin123', $app['admin_password_hash']) ? "admin123 hash: OK\n" : "admin123 hash: FAIL\n";
