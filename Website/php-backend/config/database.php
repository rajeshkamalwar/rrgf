<?php
/**
 * Database Configuration
 *
 * On the server, create config/database.local.php with actual credentials.
 * That file is gitignored so it never gets overwritten by deployments.
 */

if (file_exists(__DIR__ . '/database.local.php')) {
    return require __DIR__ . '/database.local.php';
}

return [
    'host'     => getenv('DB_HOST') ?: 'localhost',
    'dbname'   => getenv('DB_NAME') ?: 'rrgf',
    'username' => getenv('DB_USER') ?: 'root',
    'password' => getenv('DB_PASS') ?: '',
    'charset'  => 'utf8mb4',
    'options'  => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ],
];