<?php
/**
 * Check PHPMailer installation structure
 * This will help diagnose if PHPMailer files are in the correct location
 */

echo "=== Checking PHPMailer Structure ===\n\n";

$basePath = __DIR__ . '/../';

// Check various possible locations
$possiblePaths = [
    'vendor/PHPMailer/PHPMailer/PHPMailer.php',           // Standard Composer structure
    'vendor/PHPMailer/PHPMailer/src/PHPMailer.php',       // GitHub download structure
    'vendor/phpmailer/phpmailer/src/PHPMailer.php',       // Lowercase (Composer)
];

echo "Checking possible PHPMailer paths:\n\n";

foreach ($possiblePaths as $path) {
    $fullPath = $basePath . $path;
    if (file_exists($fullPath)) {
        echo "✓ FOUND: $path\n";
        echo "  Full path: $fullPath\n";
        
        // Try to include and check class
        try {
            require_once $fullPath;
            
            // Check if we need to include other files
            $dir = dirname($fullPath);
            if (file_exists($dir . '/SMTP.php')) {
                require_once $dir . '/SMTP.php';
            }
            if (file_exists($dir . '/Exception.php')) {
                require_once $dir . '/Exception.php';
            }
            
            if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
                echo "  ✓ Class PHPMailer\\PHPMailer\\PHPMailer is available\n";
            } else {
                echo "  ✗ Class not found after including\n";
            }
        } catch (Exception $e) {
            echo "  ✗ Error including file: " . $e->getMessage() . "\n";
        }
        echo "\n";
    } else {
        echo "✗ NOT FOUND: $path\n";
    }
}

// Check vendor directory structure
echo "\n=== Checking vendor directory structure ===\n";
$vendorPath = $basePath . 'vendor';
if (is_dir($vendorPath)) {
    echo "vendor/ directory exists\n";
    
    $phpmailerDirs = [
        'vendor/PHPMailer',
        'vendor/phpmailer',
    ];
    
    foreach ($phpmailerDirs as $dir) {
        $fullDir = $basePath . $dir;
        if (is_dir($fullDir)) {
            echo "\nFound: $dir/\n";
            $items = scandir($fullDir);
            foreach ($items as $item) {
                if ($item !== '.' && $item !== '..') {
                    $itemPath = $fullDir . '/' . $item;
                    $type = is_dir($itemPath) ? '[DIR]' : '[FILE]';
                    echo "  $type $item\n";
                }
            }
        }
    }
} else {
    echo "vendor/ directory does NOT exist\n";
}

echo "\n=== Recommendation ===\n";
echo "PHPMailer files should be at: vendor/PHPMailer/PHPMailer/PHPMailer.php\n";
echo "If files are in 'src' folder, either:\n";
echo "1. Move files from src/ to parent directory, OR\n";
echo "2. Update autoloader/require paths in code\n";
