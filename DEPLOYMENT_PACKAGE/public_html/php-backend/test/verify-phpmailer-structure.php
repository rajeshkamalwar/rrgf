<?php
/**
 * Verify PHPMailer Structure
 * Checks if PHPMailer is accessible in the current structure
 */

echo "=== Verifying PHPMailer Structure ===\n\n";

$basePath = __DIR__ . '/../';

// Check the standard structure (what user now has)
$standardPath = $basePath . 'vendor/PHPMailer/PHPMailer/PHPMailer.php';

if (file_exists($standardPath)) {
    echo "✓ PHPMailer found at standard location:\n";
    echo "  vendor/PHPMailer/PHPMailer/PHPMailer.php\n\n";
    
    // Try to load it
    try {
        require_once $standardPath;
        
        // Also load required files
        $dir = dirname($standardPath);
        if (file_exists($dir . '/SMTP.php')) {
            require_once $dir . '/SMTP.php';
            echo "✓ SMTP.php loaded\n";
        }
        if (file_exists($dir . '/Exception.php')) {
            require_once $dir . '/Exception.php';
            echo "✓ Exception.php loaded\n";
        }
        
        // Check if class is available
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            echo "\n✓ SUCCESS: PHPMailer class is available!\n";
            echo "  Namespace: PHPMailer\\PHPMailer\\PHPMailer\n";
            echo "  Structure: Standard (correct)\n";
        } else {
            echo "\n✗ ERROR: Class not found after loading\n";
        }
        
    } catch (Exception $e) {
        echo "\n✗ ERROR loading PHPMailer: " . $e->getMessage() . "\n";
    }
    
} else {
    echo "✗ PHPMailer NOT found at standard location\n";
    echo "  Checked: vendor/PHPMailer/PHPMailer/PHPMailer.php\n\n";
    
    // Check alternative locations
    $alternatives = [
        'vendor/PHPMailer/src/PHPMailer.php',
        'vendor/phpmailer/phpmailer/src/PHPMailer.php',
    ];
    
    echo "Checking alternative locations:\n";
    foreach ($alternatives as $alt) {
        $altPath = $basePath . $alt;
        if (file_exists($altPath)) {
            echo "  ✓ Found at: $alt\n";
        } else {
            echo "  ✗ Not found at: $alt\n";
        }
    }
}

echo "\n=== Structure Analysis ===\n";
$vendorPath = $basePath . 'vendor/PHPMailer';
if (is_dir($vendorPath)) {
    echo "vendor/PHPMailer/ exists\n";
    
    // Check what's inside
    $items = scandir($vendorPath);
    foreach ($items as $item) {
        if ($item !== '.' && $item !== '..') {
            $itemPath = $vendorPath . '/' . $item;
            $type = is_dir($itemPath) ? '[DIR]' : '[FILE]';
            $size = is_file($itemPath) ? ' (' . round(filesize($itemPath)/1024, 2) . ' KB)' : '';
            echo "  $type $item$size\n";
            
            // If it's a directory, show contents
            if (is_dir($itemPath) && $item === 'PHPMailer') {
                $subItems = scandir($itemPath);
                echo "    Contents of PHPMailer/:\n";
                foreach ($subItems as $subItem) {
                    if ($subItem !== '.' && $subItem !== '..' && !is_dir($vendorPath . '/' . $item . '/' . $subItem)) {
                        $subPath = $vendorPath . '/' . $item . '/' . $subItem;
                        $subSize = is_file($subPath) ? ' (' . round(filesize($subPath)/1024, 2) . ' KB)' : '';
                        echo "      - $subItem$subSize\n";
                    }
                }
            }
        }
    }
} else {
    echo "vendor/PHPMailer/ does NOT exist\n";
}

echo "\n";
