<?php
/**
 * Minimal login test via WEB (not CLI). Delete after fixing.
 * Open: https://rrgreenfieldmadhepura.in/php-backend/patch-login.php
 */
header('Content-Type: application/json; charset=UTF-8');

ob_start();
try {
    require __DIR__ . '/config/database.php';
} catch (Throwable $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'step' => 'database.php', 'error' => $e->getMessage()]);
    exit;
}
$bom = ob_get_clean();

try {
    require_once __DIR__ . '/middleware/Auth.php';
    $auth = new Auth();
    $app = require __DIR__ . '/config/app.php';
    $ok = password_verify('admin123', $app['admin_password_hash']);
    if (!$ok) {
        echo json_encode(['success' => false, 'step' => 'password_verify', 'bom' => $bom !== '' ? bin2hex(substr($bom, 0, 8)) : null]);
        exit;
    }
    $sid = $auth->createSession();
    echo json_encode([
        'success' => true,
        'sessionId' => $sid,
        'bom_from_config' => $bom !== '' ? bin2hex(substr($bom, 0, 8)) : null,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine(),
        'bom' => $bom !== '' ? bin2hex(substr($bom, 0, 8)) : null,
    ]);
}
