<?php
/**
 * Application Configuration
 */

return [
    'base_url' => getenv('BASE_URL') ?: '/',
    'admin_username' => getenv('ADMIN_USERNAME') ?: 'admin',
    'admin_password_hash' => getenv('ADMIN_PASSWORD_HASH') ?: password_hash('admin123', PASSWORD_BCRYPT), // Change this!
    'session_lifetime' => 86400, // 24 hours in seconds
    'upload_dir' => __DIR__ . '/../uploads/',
    'upload_url' => '/uploads/',
    'max_file_size' => 5 * 1024 * 1024, // 5MB
    'allowed_image_types' => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    'allowed_document_types' => [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
    ],
];