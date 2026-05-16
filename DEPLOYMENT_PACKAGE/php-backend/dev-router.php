<?php
declare(strict_types=1);

/**
 * Routes `/api/*` to `api/index.php` like Apache mod_rewrite (.htaccess).
 * Run from this directory:
 *   php -S localhost:8000 dev-router.php
 */

$urlPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$normalized = str_replace('\\', '/', $urlPath);

$requestedFile =
    '/' === $normalized ? false : realpath(__DIR__ . DIRECTORY_SEPARATOR . ltrim($normalized, '/'));
$root = realpath(__DIR__);

if (
    $requestedFile !== false
    && $root !== false
    && is_file($requestedFile)
    && str_starts_with(str_replace('\\', '/', $requestedFile), str_replace('\\', '/', $root))
) {
    return false;
}

if ($normalized === '/api' || str_starts_with($normalized, '/api/')) {
    require __DIR__ . '/api/index.php';
    return true;
}

return false;
