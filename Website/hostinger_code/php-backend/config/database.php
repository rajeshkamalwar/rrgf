<?php
/**
 * Database Configuration
 * 
 * Update these values with your Hostinger MySQL credentials
 */

return [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'dbname' => getenv('DB_NAME') ?: 'u791315918_rrgfwebsite',
    'username' => getenv('DB_USER') ?: 'u791315918_webadmin',
    'password' => getenv('DB_PASS') ?: 'Welcome@2050@##',
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];