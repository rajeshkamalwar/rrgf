<?php
/**
 * API Router
 * Main entry point for all API requests
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../php_errors.log');

// Discard accidental BOM/whitespace from included config files (breaks JSON responses on shared hosting).
ob_start();

register_shutdown_function(function () {
    $err = error_get_last();
    if (!$err || !in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code(500);
    }
    echo json_encode([
        'success' => false,
        'error' => 'Fatal: ' . $err['message'],
        'file' => basename($err['file']),
        'line' => $err['line'],
    ]);
});

// Set timezone
date_default_timezone_set('Asia/Kolkata');

// Include autoloader and utilities
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../controllers/PublicController.php';
require_once __DIR__ . '/../controllers/AdminController.php';

ob_end_clean();

// Enable CORS
Response::enableCORS();

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];

// _rrgf_path is injected by the .htaccess RewriteRule as a query param — LiteSpeed-safe.
// Falls back to E= env vars (Apache) then REQUEST_URI.
$qPath  = isset($_GET['_rrgf_path']) && $_GET['_rrgf_path'] !== '' ? $_GET['_rrgf_path'] : null;
$envUri = $_SERVER['RRGF_API_URI']
    ?? $_SERVER['REDIRECT_RRGF_API_URI']
    ?? (getenv('RRGF_API_URI') ?: getenv('REDIRECT_RRGF_API_URI') ?: null);

$uri = $qPath
    ?? ($envUri !== null && $envUri !== '' ? $envUri : null)
    ?? ($_SERVER['REQUEST_URI'] ?? '/');

$path = parse_url($uri, PHP_URL_PATH) ?: '';

// Direct script URL (.../php-backend/api/…) — normalize so routing matches cleaned /api/… style
$pba = '/php-backend/api';
if (strpos($path, $pba) === 0) {
    $tail = substr($path, strlen($pba));
    $tail = trim((string) $tail, '/');
    $path = '/api' . ($tail !== '' ? '/' . $tail : '');
}

// Remove base path if needed (e.g., if in subdirectory)
$basePath = '/api';
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

// Remove leading/trailing slashes
$path = trim($path, '/');
$pathParts = explode('/', $path);

// Route handling — instantiate controllers only for the matched route (lighter on shared hosting).
try {
    // Public routes
    if ($path === 'enquiry' && $method === 'POST') {
        (new PublicController())->submitEnquiry();
    }
    elseif ($path === 'contact' && $method === 'POST') {
        (new PublicController())->submitContact();
    }
    elseif ($path === 'admissions' && $method === 'POST') {
        (new PublicController())->submitAdmission();
    }
    elseif ($path === 'visit-schedule' && $method === 'POST') {
        (new PublicController())->submitVisitSchedule();
    }
    elseif ($path === 'documents' && $method === 'GET') {
        (new PublicController())->getDocuments();
    }
    elseif ($path === 'mpd' && $method === 'GET') {
        (new PublicController())->getMpdBundle();
    }
    elseif ($path === 'hero-images' && $method === 'GET') {
        (new PublicController())->getHeroImages();
    }
    elseif ($path === 'gallery' && $method === 'GET') {
        (new PublicController())->getGallery();
    }
    // Admin routes
    elseif (($pathParts[0] ?? '') === 'admin') {
        $adminController = new AdminController();

        if ($path === 'admin/login' && $method === 'POST') {
            $adminController->login();
        }
        elseif ($path === 'admin/check-auth' && $method === 'GET') {
            $adminController->checkAuth();
        }
        elseif ($path === 'admin/logout' && $method === 'POST') {
            $adminController->logout();
        }
        elseif ($path === 'admin/smtp' && $method === 'GET') {
            $adminController->getSMTPConfig();
        }
        elseif ($path === 'admin/smtp' && $method === 'PUT') {
            $adminController->updateSMTPConfig();
        }
        elseif ($path === 'admin/smtp/test-connection' && $method === 'POST') {
            $adminController->testSMTPConnection();
        }
        elseif ($path === 'admin/smtp/test-email' && $method === 'POST') {
            $adminController->sendTestEmail();
        }
        elseif ($path === 'admin/mpd/sample-teachers' && $method === 'GET') {
            $adminController->downloadMpdTeacherSample();
        }
        elseif ($path === 'admin/mpd/teacher-list' && $method === 'POST') {
            $adminController->uploadMpdTeacherList();
        }
        elseif ($path === 'admin/mpd' && $method === 'GET') {
            $adminController->getMpdAdmin();
        }
        elseif ($path === 'admin/mpd' && $method === 'PUT') {
            $adminController->updateMpd();
        }
        elseif ($path === 'admin/documents' && $method === 'GET') {
            $adminController->getDocumentsAdmin();
        }
        elseif ($path === 'admin/documents' && $method === 'POST') {
            $adminController->createDocument();
        }
        elseif ($path === 'admin/documents/reorder' && $method === 'PUT') {
            $adminController->reorderDocuments();
        }
        elseif (($pathParts[1] ?? '') === 'documents' && count($pathParts) === 3 && $method === 'PATCH') {
            $adminController->patchDocumentVisibility($pathParts[2]);
        }
        elseif (($pathParts[1] ?? '') === 'documents' && count($pathParts) === 3 && $method === 'PUT') {
            $adminController->updateDocument($pathParts[2]);
        }
        elseif (($pathParts[1] ?? '') === 'documents' && count($pathParts) === 3 && $method === 'DELETE') {
            $adminController->deleteDocument($pathParts[2]);
        }
        elseif ($path === 'admin/hero-images' && $method === 'GET') {
            $adminController->getHeroImages();
        }
        elseif ($path === 'admin/hero-images' && $method === 'POST') {
            $adminController->uploadHeroImage();
        }
        elseif (($pathParts[1] ?? '') === 'hero-images' && count($pathParts) === 3 && $method === 'DELETE') {
            $adminController->deleteHeroImage($pathParts[2]);
        }
        elseif ($path === 'admin/hero-images/order' && $method === 'PUT') {
            $adminController->updateHeroImageOrder();
        }
        elseif ($path === 'admin/folders' && $method === 'GET') {
            require_once __DIR__ . '/../controllers/FolderController.php';
            (new FolderController())->getFolders();
        }
        elseif ($path === 'admin/folders' && $method === 'POST') {
            require_once __DIR__ . '/../controllers/FolderController.php';
            (new FolderController())->createFolder();
        }
        elseif (($pathParts[1] ?? '') === 'folders' && count($pathParts) === 3 && $method === 'GET') {
            require_once __DIR__ . '/../controllers/FolderController.php';
            (new FolderController())->getFolder($pathParts[2]);
        }
        elseif (($pathParts[1] ?? '') === 'folders' && count($pathParts) === 3 && $method === 'PUT') {
            require_once __DIR__ . '/../controllers/FolderController.php';
            (new FolderController())->updateFolder($pathParts[2]);
        }
        elseif (($pathParts[1] ?? '') === 'folders' && count($pathParts) === 3 && $method === 'DELETE') {
            require_once __DIR__ . '/../controllers/FolderController.php';
            (new FolderController())->deleteFolder($pathParts[2]);
        }
        elseif (($pathParts[1] ?? '') === 'folders' && count($pathParts) === 4 && ($pathParts[3] ?? '') === 'fetch' && $method === 'POST') {
            require_once __DIR__ . '/../controllers/FolderController.php';
            (new FolderController())->fetchFolderImages($pathParts[2]);
        }
        elseif ($path === 'admin/gallery/config' && $method === 'GET') {
            $adminController->getGalleryConfig();
        }
        elseif ($path === 'admin/gallery/config' && $method === 'PUT') {
            $adminController->updateGalleryConfig();
        }
        elseif ($path === 'admin/gallery/fetch-drive' && $method === 'POST') {
            $adminController->fetchOneDriveImages();
        }
        elseif ($path === 'admin/gallery/images' && $method === 'GET') {
            $adminController->getGalleryImages();
        }
        elseif ($path === 'admin/gallery/images' && $method === 'POST') {
            $adminController->addGalleryImage();
        }
        elseif (($pathParts[1] ?? '') === 'gallery' && ($pathParts[2] ?? '') === 'images' && count($pathParts) === 4 && $method === 'PUT') {
            $adminController->updateGalleryImage($pathParts[3]);
        }
        elseif (($pathParts[1] ?? '') === 'gallery' && ($pathParts[2] ?? '') === 'images' && count($pathParts) === 4 && $method === 'DELETE') {
            $adminController->deleteGalleryImage($pathParts[3]);
        }
        elseif ($path === 'admin/gallery/images' && $method === 'DELETE') {
            $adminController->deleteAllGalleryImages();
        }
        elseif ($path === 'admin/graph-api/config' && $method === 'GET') {
            $adminController->getGraphApiConfig();
        }
        elseif ($path === 'admin/graph-api/config' && $method === 'PUT') {
            $adminController->updateGraphApiConfig();
        }
        elseif ($path === 'admin/graph-api/test' && $method === 'POST') {
            $adminController->testGraphApi();
        }
        else {
            Response::error('Route not found', 404);
        }
    }
    else {
        Response::error('Route not found', 404);
    }
} catch (\Throwable $e) {
    error_log("API Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    Response::error('Server error: ' . $e->getMessage(), 500);
}