<?php
/**
 * Folder Management Controller
 * Handles CRUD operations for OneDrive folders
 */

require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../utils/OneDriveHelper.php';

class FolderController {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->auth = new Auth();
    }
    
    /**
     * GET /api/admin/folders
     * Get all folders
     */
    public function getFolders() {
        $this->auth->requireAuth();
        
        try {
            $folders = $this->db->fetchAll(
                "SELECT id, name, folder_link, folder_id, description, is_active, sort_order, created_at, updated_at
                 FROM onedrive_folders 
                 ORDER BY sort_order ASC, name ASC"
            );
            
            // Convert snake_case to camelCase for frontend and get image counts
            $formattedFolders = [];
            foreach ($folders as $folder) {
                $imageCount = $this->db->fetchOne(
                    "SELECT COUNT(*) as count FROM gallery_images WHERE folder_id = ?",
                    [$folder['id']]
                );
                
                $formattedFolders[] = [
                    'id' => (int)$folder['id'],
                    'name' => $folder['name'],
                    'folderLink' => $folder['folder_link'],
                    'folderId' => $folder['folder_id'],
                    'description' => $folder['description'],
                    'isActive' => (bool)$folder['is_active'],
                    'sortOrder' => (int)$folder['sort_order'],
                    'imageCount' => (int)($imageCount['count'] ?? 0),
                    'createdAt' => $folder['created_at'],
                    'updatedAt' => $folder['updated_at'],
                ];
            }
            
            Response::success(['folders' => $formattedFolders]);
        } catch (Exception $e) {
            Response::error('Failed to fetch folders: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/admin/folders/:id
     * Get single folder
     */
    public function getFolder($id) {
        $this->auth->requireAuth();
        
        try {
            $folder = $this->db->fetchOne(
                "SELECT id, name, folder_link, folder_id, description, is_active, sort_order, created_at, updated_at
                 FROM onedrive_folders WHERE id = ?",
                [$id]
            );
            
            if (!$folder) {
                Response::error('Folder not found', 404);
                return;
            }
            
            // Get image count
            $imageCount = $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM gallery_images WHERE folder_id = ?",
                [$id]
            );
            
            // Convert snake_case to camelCase for frontend
            $formattedFolder = [
                'id' => (int)$folder['id'],
                'name' => $folder['name'],
                'folderLink' => $folder['folder_link'],
                'folderId' => $folder['folder_id'],
                'description' => $folder['description'],
                'isActive' => (bool)$folder['is_active'],
                'sortOrder' => (int)$folder['sort_order'],
                'imageCount' => (int)($imageCount['count'] ?? 0),
                'createdAt' => $folder['created_at'],
                'updatedAt' => $folder['updated_at'],
            ];
            
            Response::success(['folder' => $formattedFolder]);
        } catch (Exception $e) {
            Response::error('Failed to fetch folder: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/folders
     * Create new folder
     */
    public function createFolder() {
        $this->auth->requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['name']) || empty($data['folderLink'])) {
            Response::error('Name and folder link are required');
            return;
        }
        
        try {
            // Extract folder ID
            $folderId = OneDriveHelper::extractFolderId($data['folderLink']);
            
            // Get max sort order
            $maxOrder = $this->db->fetchOne("SELECT MAX(sort_order) as max_order FROM onedrive_folders");
            $newOrder = ($maxOrder['max_order'] ?? 0) + 1;
            
            $insertedId = $this->db->insert(
                "INSERT INTO onedrive_folders (name, folder_link, folder_id, description, is_active, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [
                    $data['name'],
                    $data['folderLink'],
                    $folderId,
                    $data['description'] ?? null,
                    isset($data['isActive']) ? (int)$data['isActive'] : 1,
                    $newOrder
                ]
            );
            
            $folder = $this->db->fetchOne(
                "SELECT id, name, folder_link, folder_id, description, is_active, sort_order, created_at, updated_at
                 FROM onedrive_folders WHERE id = ?",
                [$insertedId]
            );
            
            // Convert snake_case to camelCase for frontend
            $formattedFolder = [
                'id' => (int)$folder['id'],
                'name' => $folder['name'],
                'folderLink' => $folder['folder_link'],
                'folderId' => $folder['folder_id'],
                'description' => $folder['description'],
                'isActive' => (bool)$folder['is_active'],
                'sortOrder' => (int)$folder['sort_order'],
                'createdAt' => $folder['created_at'],
                'updatedAt' => $folder['updated_at'],
            ];
            
            Response::success(['folder' => $formattedFolder], 'Folder created successfully');
        } catch (Exception $e) {
            Response::error('Failed to create folder: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /api/admin/folders/:id
     * Update folder
     */
    public function updateFolder($id) {
        $this->auth->requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        try {
            $updates = [];
            $params = [];
            
            if (isset($data['name'])) {
                $updates[] = "name = ?";
                $params[] = $data['name'];
            }
            if (isset($data['folderLink'])) {
                $folderId = OneDriveHelper::extractFolderId($data['folderLink']);
                $updates[] = "folder_link = ?";
                $updates[] = "folder_id = ?";
                $params[] = $data['folderLink'];
                $params[] = $folderId;
            }
            if (isset($data['description'])) {
                $updates[] = "description = ?";
                $params[] = $data['description'];
            }
            if (isset($data['isActive']) || array_key_exists('isActive', $data)) {
                $updates[] = "is_active = ?";
                $params[] = isset($data['isActive']) ? (int)$data['isActive'] : 0;
            }
            if (isset($data['sortOrder'])) {
                $updates[] = "sort_order = ?";
                $params[] = (int)$data['sortOrder'];
            }
            
            if (empty($updates)) {
                Response::error('No fields to update');
                return;
            }
            
            $params[] = (int)$id;
            $this->db->execute(
                "UPDATE onedrive_folders SET " . implode(', ', $updates) . " WHERE id = ?",
                $params
            );
            
            $folder = $this->db->fetchOne(
                "SELECT id, name, folder_link, folder_id, description, is_active, sort_order, created_at, updated_at
                 FROM onedrive_folders WHERE id = ?",
                [$id]
            );
            
            // Convert snake_case to camelCase for frontend
            $formattedFolder = [
                'id' => (int)$folder['id'],
                'name' => $folder['name'],
                'folderLink' => $folder['folder_link'],
                'folderId' => $folder['folder_id'],
                'description' => $folder['description'],
                'isActive' => (bool)$folder['is_active'],
                'sortOrder' => (int)$folder['sort_order'],
                'createdAt' => $folder['created_at'],
                'updatedAt' => $folder['updated_at'],
            ];
            
            Response::success(['folder' => $formattedFolder], 'Folder updated successfully');
        } catch (Exception $e) {
            Response::error('Failed to update folder: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * DELETE /api/admin/folders/:id
     * Delete folder (images remain but folder_id is set to NULL)
     */
    public function deleteFolder($id) {
        $this->auth->requireAuth();
        
        try {
            // Check if folder has images
            $imageCount = $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM gallery_images WHERE folder_id = ?",
                [$id]
            );
            $count = (int)($imageCount['count'] ?? 0);
            
            if ($count > 0) {
                // Set folder_id to NULL for images (due to ON DELETE SET NULL)
                $this->db->execute(
                    "UPDATE gallery_images SET folder_id = NULL WHERE folder_id = ?",
                    [$id]
                );
            }
            
            // Delete folder
            $this->db->execute("DELETE FROM onedrive_folders WHERE id = ?", [$id]);
            
            Response::success([], "Folder deleted successfully. {$count} images were unlinked.");
        } catch (Exception $e) {
            Response::error('Failed to delete folder: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/folders/:id/fetch
     * Fetch images from a specific folder
     */
    public function fetchFolderImages($id) {
        $this->auth->requireAuth();
        
        require_once __DIR__ . '/../services/SharePointService.php';
        
        try {
            // Validate ID
            $folderId = (int)$id;
            if ($folderId <= 0) {
                Response::error('Invalid folder ID', 400);
                return;
            }
            
            $folder = $this->db->fetchOne(
                "SELECT id, name, folder_link, folder_id FROM onedrive_folders WHERE id = ?",
                [$folderId]
            );
            
            if (!$folder) {
                Response::error('Folder not found', 404);
                return;
            }
            
            if (empty($folder['folder_link'])) {
                Response::error('Folder link not configured', 400);
                return;
            }
            
            // Use existing fetch logic
            $sharePointService = new SharePointService();
            $imagesAdded = 0;
            
            if ($sharePointService->isConfigured()) {
                $images = $sharePointService->fetchImagesFromFolder($folder['folder_link']);
                
                // Get existing image URLs
                $existingImages = $this->db->fetchAll("SELECT image_url FROM gallery_images");
                $existingUrls = array_column($existingImages, 'image_url');
                
                // Add new images with folder_id
                foreach ($images as $imageData) {
                    if (!in_array($imageData['imageUrl'], $existingUrls)) {
                        $maxOrder = $this->db->fetchOne("SELECT MAX(`order`) as max_order FROM gallery_images");
                        $newOrder = ($maxOrder['max_order'] ?? 0) + 1;
                        
                        $imageId = uniqid('gallery_');
                        $this->db->insert(
                            "INSERT INTO gallery_images (id, image_url, thumbnail_url, category, title, description, `order`, folder_id)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            [
                                $imageId,
                                $imageData['imageUrl'],
                                $imageData['thumbnailUrl'] ?? $imageData['imageUrl'],
                                'events',
                                $imageData['title'] ?? null,
                                $imageData['description'] ?? null,
                                $newOrder,
                                $folderId
                            ]
                        );
                        $imagesAdded++;
                    }
                }
            } else {
                Response::error('Microsoft Graph API credentials not configured or not enabled. Please configure Graph API in Admin Panel → Graph API and make sure "Enable Graph API" is checked.', 501);
                return;
            }
            
            Response::success([
                'imagesAdded' => $imagesAdded,
                'message' => $imagesAdded > 0 
                    ? "Successfully fetched {$imagesAdded} images from folder '{$folder['name']}'"
                    : "No new images found in folder '{$folder['name']}'"
            ]);
            
        } catch (Exception $e) {
            $errorMessage = $e->getMessage();
            
            // Provide helpful error messages
            if (strpos($errorMessage, '401') !== false || strpos($errorMessage, 'Unauthorized') !== false) {
                Response::error(
                    'Graph API authentication failed. Please check: ' .
                    '1) API permissions include Files.Read.All and Sites.Read.All, ' .
                    '2) Admin consent is granted, ' .
                    '3) The sharing link is accessible. ' .
                    'Error: ' . $errorMessage, 
                    401
                );
            } elseif (strpos($errorMessage, '404') !== false || strpos($errorMessage, 'not found') !== false) {
                Response::error(
                    'Folder not found via Graph API. This might be because: ' .
                    '1) The sharing link format is not supported for app-only authentication, ' .
                    '2) The folder is not accessible with current permissions. ' .
                    'Please try adding images manually using individual image URLs. ' .
                    'Error: ' . $errorMessage,
                    404
                );
            } else {
                Response::error('Failed to fetch images: ' . $errorMessage . '. You can still add images manually using individual image URLs from your SharePoint folder.', 500);
            }
        }
    }
}