<?php
/**
 * Verify SMTP Configuration
 * Checks if SMTP credentials are correctly stored in database
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

echo "<!DOCTYPE html><html><head><title>SMTP Config Verification</title>";
echo "<style>body{font-family:monospace;padding:20px;} .success{color:green;} .error{color:red;} .warning{color:orange;} pre{background:#f0f0f0;padding:10px;}</style>";
echo "</head><body>";
echo "<h1>SMTP Configuration Verification</h1><hr>";

try {
    $db = Database::getInstance();
    
    // Get current SMTP config
    $smtp = $db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
    
    if (!$smtp) {
        die("<p class='error'>❌ ERROR: No SMTP configuration found in database!</p></body></html>");
    }
    
    $password = !empty($smtp['password']) ? base64_decode($smtp['password']) : '';
    
    echo "<h2>Current Database Configuration:</h2>";
    echo "<pre>";
    echo "Host:     " . htmlspecialchars($smtp['host'] ?? 'NOT SET') . "\n";
    echo "Port:     " . htmlspecialchars($smtp['port'] ?? 'NOT SET') . "\n";
    echo "Username: " . htmlspecialchars($smtp['user'] ?? 'NOT SET') . "\n";
    echo "From:     " . htmlspecialchars($smtp['from'] ?? 'NOT SET') . "\n";
    echo "To:       " . htmlspecialchars($smtp['to'] ?? 'NOT SET') . "\n";
    echo "Password: " . (strlen($password) > 0 ? '[SET - ' . strlen($password) . ' chars]' : 'NOT SET') . "\n";
    echo "</pre>";
    
    echo "<hr><h2>Expected Configuration:</h2>";
    echo "<pre>";
    echo "Host:     smtp.hostinger.com\n";
    echo "Port:     465\n";
    echo "Username: info@rrgreenfieldmadhepura.in\n";
    echo "From:     info@rrgreenfieldmadhepura.in (usually same as username)\n";
    echo "To:       rrgreenfielddigital@gmail.com,rrgreenfieldsch@gmail.com\n";
    echo "Password: Welcome@2026@#\n";
    echo "</pre>";
    
    echo "<hr><h2>Verification:</h2>";
    
    $issues = [];
    $correct = [];
    
    // Check host
    if (($smtp['host'] ?? '') === 'smtp.hostinger.com') {
        $correct[] = "✓ Host is correct";
    } else {
        $issues[] = "✗ Host mismatch: Expected 'smtp.hostinger.com', found '" . htmlspecialchars($smtp['host'] ?? 'NOT SET') . "'";
    }
    
    // Check port
    if ((int)($smtp['port'] ?? 0) === 465) {
        $correct[] = "✓ Port is correct (465)";
    } else {
        $issues[] = "✗ Port mismatch: Expected '465', found '" . htmlspecialchars($smtp['port'] ?? 'NOT SET') . "'";
    }
    
    // Check username
    if (($smtp['user'] ?? '') === 'info@rrgreenfieldmadhepura.in') {
        $correct[] = "✓ Username is correct";
    } else {
        $issues[] = "✗ Username mismatch: Expected 'info@rrgreenfieldmadhepura.in', found '" . htmlspecialchars($smtp['user'] ?? 'NOT SET') . "'";
    }
    
    // Check password
    if ($password === 'Welcome@2026@#') {
        $correct[] = "✓ Password is correct";
    } else {
        if (strlen($password) > 0) {
            $issues[] = "✗ Password mismatch: Expected 'Welcome@2026@#', found different password (" . strlen($password) . " chars)";
        } else {
            $issues[] = "✗ Password is NOT SET";
        }
    }
    
    // Display results
    if (!empty($correct)) {
        echo "<h3 class='success'>Correct Settings:</h3>";
        echo "<ul>";
        foreach ($correct as $item) {
            echo "<li class='success'>" . $item . "</li>";
        }
        echo "</ul>";
    }
    
    if (!empty($issues)) {
        echo "<h3 class='error'>Issues Found:</h3>";
        echo "<ul>";
        foreach ($issues as $issue) {
            echo "<li class='error'>" . $issue . "</li>";
        }
        echo "</ul>";
    }
    
    if (empty($issues)) {
        echo "<p class='success'><strong>✅ All SMTP settings are correct!</strong></p>";
    } else {
        echo "<p class='error'><strong>⚠️ Some settings need to be updated.</strong></p>";
        echo "<h3>To Fix:</h3>";
        echo "<p>Go to your admin panel → SMTP Configuration and update the incorrect settings.</p>";
    }
    
    // Check if all required fields are present
    echo "<hr><h2>Completeness Check:</h2>";
    $required = ['host', 'port', 'user', 'password', 'from', 'to'];
    $missing = [];
    foreach ($required as $field) {
        if ($field === 'password') {
            if (empty($password)) {
                $missing[] = $field;
            }
        } else {
            if (empty($smtp[$field])) {
                $missing[] = $field;
            }
        }
    }
    
    if (empty($missing)) {
        echo "<p class='success'>✓ All required fields are set</p>";
    } else {
        echo "<p class='error'>✗ Missing fields: " . implode(', ', $missing) . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

echo "</body></html>";
