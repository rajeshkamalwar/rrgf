<?php
/**
 * Application Configuration
 */

return [
    'base_url' => getenv('BASE_URL') ?: '/',
    'admin_username' => getenv('ADMIN_USERNAME') ?: 'admin',
    // Pre-computed bcrypt for "admin123" — do not call password_hash() on every request (slow on shared hosting).
    'admin_password_hash' => getenv('ADMIN_PASSWORD_HASH') ?: '$2y$10$9eQH0Qi8wjqGVgnyZk01B.5Hd6N.sbx54ki5ksHhyWpi0FCvnn8BG',
    'session_lifetime' => 86400, // 24 hours in seconds
    'upload_dir' => __DIR__ . '/../uploads/',
    'upload_url' => '/php-backend/uploads/',
    'max_file_size' => 5 * 1024 * 1024, // 5MB
    'allowed_image_types' => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    'allowed_document_types' => [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
    ],
];