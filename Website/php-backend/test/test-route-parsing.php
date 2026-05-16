<?php
/**
 * Test route parsing for folder routes
 */

$testUrls = [
    '/api/admin/folders',
    '/api/admin/folders/1',
    '/api/admin/folders/1/fetch',
];

foreach ($testUrls as $uri) {
    $path = parse_url($uri, PHP_URL_PATH);
    $basePath = '/api';
    if (strpos($path, $basePath) === 0) {
        $path = substr($path, strlen($basePath));
    }
    $path = trim($path, '/');
    $pathParts = explode('/', $path);
    
    echo "URL: $uri\n";
    echo "Path: $path\n";
    echo "Parts: " . implode(', ', $pathParts) . "\n";
    echo "Count: " . count($pathParts) . "\n";
    
    // Test folder fetch route
    if ($pathParts[0] === 'admin' && $pathParts[1] === 'folders' && count($pathParts) === 4 && $pathParts[3] === 'fetch') {
        echo "✓ Matches fetch route (ID: {$pathParts[2]})\n";
    } elseif ($path === 'admin/folders') {
        echo "✓ Matches folders list route\n";
    } elseif ($pathParts[0] === 'admin' && $pathParts[1] === 'folders' && count($pathParts) === 3) {
        echo "✓ Matches single folder route (ID: {$pathParts[2]})\n";
    } else {
        echo "✗ No match\n";
    }
    echo "\n";
}