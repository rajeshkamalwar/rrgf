<?php
/**
 * API Router
 * Main entry point for all API requests
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors, log them instead
ini_set('log_errors', 1);

// Set timezone
date_default_timezone_set('Asia/Kolkata');

// Include autoloader and utilities
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../controllers/PublicController.php';
require_once __DIR__ . '/../controllers/AdminController.php';

// Enable CORS
Response::enableCORS();

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Remove base path if needed (e.g., if in subdirectory)
$basePath = '/api';
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

// Remove leading/trailing slashes
$path = trim($path, '/');
$pathParts = explode('/', $path);

// Route handling
try {
    $publicController = new PublicController();
    $adminController = new AdminController();
    
    // Public routes
    if ($path === 'enquiry' && $method === 'POST') {
        $publicController->submitEnquiry();
    }
    elseif ($path === 'contact' && $method === 'POST') {
        $publicController->submitContact();
    }
    elseif ($path === 'admissions' && $method === 'POST') {
        $publicController->submitAdmission();
    }
    elseif ($path === 'visit-schedule' && $method === 'POST') {
        $publicController->submitVisitSchedule();
    }
    elseif ($path === 'documents' && $method === 'GET') {
        $publicController->getDocuments();
    }
    elseif ($path === 'hero-images' && $method === 'GET') {
        $publicController->getHeroImages();
    }
    elseif ($path === 'gallery' && $method === 'GET') {
        $publicController->getGallery();
    }
    // Admin routes
    elseif ($pathParts[0] === 'admin') {
        // Login
        if ($path === 'admin/login' && $method === 'POST') {
            $adminController->login();
        }
        // Check auth
        elseif ($path === 'admin/check-auth' && $method === 'GET') {
            $adminController->checkAuth();
        }
        // Logout
        elseif ($path === 'admin/logout' && $method === 'POST') {
            $adminController->logout();
        }
        // SMTP routes
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
        // Documents routes
        elseif ($pathParts[1] === 'documents' && count($pathParts) === 3 && $method === 'PUT') {
            $adminController->updateDocument($pathParts[2]);
        }
        // Hero images routes
        elseif ($path === 'admin/hero-images' && $method === 'GET') {
            $adminController->getHeroImages();
        }
        elseif ($path === 'admin/hero-images' && $method === 'POST') {
            $adminController->uploadHeroImage();
        }
        elseif ($pathParts[1] === 'hero-images' && count($pathParts) === 3 && $method === 'DELETE') {
            $adminController->deleteHeroImage($pathParts[2]);
        }
        elseif ($path === 'admin/hero-images/order' && $method === 'PUT') {
            $adminController->updateHeroImageOrder();
        }
        // Folder management routes
        require_once __DIR__ . '/../controllers/FolderController.php';
        $folderController = new FolderController();
        
        if ($path === 'admin/folders' && $method === 'GET') {
            $folderController->getFolders();
        }
        elseif ($path === 'admin/folders' && $method === 'POST') {
            $folderController->createFolder();
        }
        elseif ($pathParts[0] === 'admin' && $pathParts[1] === 'folders' && count($pathParts) === 3 && $method === 'GET') {
            $folderController->getFolder($pathParts[2]);
        }
        elseif ($pathParts[0] === 'admin' && $pathParts[1] === 'folders' && count($pathParts) === 3 && $method === 'PUT') {
            $folderController->updateFolder($pathParts[2]);
        }
        elseif ($pathParts[0] === 'admin' && $pathParts[1] === 'folders' && count($pathParts) === 3 && $method === 'DELETE') {
            $folderController->deleteFolder($pathParts[2]);
        }
        elseif ($pathParts[0] === 'admin' && $pathParts[1] === 'folders' && count($pathParts) === 4 && $pathParts[3] === 'fetch' && $method === 'POST') {
            $folderController->fetchFolderImages($pathParts[2]);
        }
        
        // Gallery routes (backward compatibility - keep old endpoints)
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
        elseif ($pathParts[1] === 'gallery' && $pathParts[2] === 'images' && count($pathParts) === 4 && $method === 'PUT') {
            $adminController->updateGalleryImage($pathParts[3]);
        }
        elseif ($pathParts[1] === 'gallery' && $pathParts[2] === 'images' && count($pathParts) === 4 && $method === 'DELETE') {
            $adminController->deleteGalleryImage($pathParts[3]);
        }
        elseif ($path === 'admin/gallery/images' && $method === 'DELETE') {
            $adminController->deleteAllGalleryImages();
        }
        // Graph API configuration routes
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
} catch (PDOException $e) {
    error_log("Database Error: " . $e->getMessage() . " | Code: " . $e->getCode());
    Response::error('Database connection error. Please check database configuration.', 500);
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage() . " | File: " . $e->getFile() . " | Line: " . $e->getLine() . " | Trace: " . $e->getTraceAsString());
    // In production, don't expose internal errors
    Response::error('Internal server error', 500);
}