<?php
/**
 * One-off API diagnostics — open https://yoursite.in/php-backend/test-api.php then DELETE this file.
 */
header('Content-Type: application/json; charset=UTF-8');
error_reporting(E_ALL);
ini_set('display_errors', '0');

$result = ['success' => false, 'steps' => []];

try {
    $result['steps'][] = 'php ' . PHP_VERSION;

    ob_start();
    $cfg = require __DIR__ . '/config/database.php';
    $bom = ob_get_clean();
    if ($bom !== '') {
        $result['bom_bytes'] = bin2hex(substr($bom, 0, 16));
        $result['steps'][] = 'WARNING: config output bytes before JSON (BOM/whitespace)';
    } else {
        $result['steps'][] = 'config clean (no BOM)';
    }

    $opts = $cfg['options'] ?? [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    $dsn = 'mysql:host=' . $cfg['host'] . ';dbname=' . $cfg['dbname'] . ';charset=' . ($cfg['charset'] ?? 'utf8mb4');
    $pdo = new PDO($dsn, $cfg['username'], $cfg['password'], $opts);
    $result['steps'][] = 'database connected';

    $pdo->query('SELECT 1 FROM admin_sessions LIMIT 1');
    $result['steps'][] = 'admin_sessions table ok';

    require_once __DIR__ . '/services/Database.php';
    require_once __DIR__ . '/middleware/Auth.php';
    $auth = new Auth();
    $result['steps'][] = 'auth loaded';

    $app = require __DIR__ . '/config/app.php';
    $result['password_verify'] = password_verify('admin123', $app['admin_password_hash']);

    if ($result['password_verify']) {
        $result['sessionId'] = $auth->createSession();
        $result['steps'][] = 'session created';
    } else {
        $result['steps'][] = 'password_verify failed (update config/app.php on server)';
    }

    $result['success'] = (bool) $result['password_verify'];
} catch (Throwable $e) {
    $result['error'] = $e->getMessage();
    $result['file'] = basename($e->getFile());
    $result['line'] = $e->getLine();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
