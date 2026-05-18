<?php
/**
 * Admin API Controllers
 */

require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Request.php';
require_once __DIR__ . '/../middleware/Auth.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../utils/FileUpload.php';

class AdminController {
    private $db;
    private $auth;
    private $emailService;
    private $fileUpload;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->auth = new Auth();
        $this->emailService = new EmailService();
        $this->fileUpload = new FileUpload();
    }
    
    /**
     * POST /api/admin/login
     */
    public function login() {
        $data = Request::jsonBody();

        if (empty($data['username']) || empty($data['password'])) {
            Response::error('Username and password are required');
        }
        
        if ($this->auth->verifyCredentials($data['username'], $data['password'])) {
            $sessionId = $this->auth->createSession();
            Response::success(['sessionId' => $sessionId]);
        } else {
            Response::error('Invalid credentials', 401);
        }
    }
    
    /**
     * GET /api/admin/check-auth
     */
    public function checkAuth() {
        $sessionId = Auth::getSessionHeaderId();
        
        if ($this->auth->verifySession($sessionId)) {
            Response::success(['authenticated' => true]);
        } else {
            Response::success(['authenticated' => false]);
        }
    }
    
    /**
     * POST /api/admin/logout
     */
    public function logout() {
        $sessionId = Auth::getSessionHeaderId();
        
        if ($sessionId) {
            $this->auth->destroySession($sessionId);
        }
        
        Response::success([], 'Logged out successfully');
    }
    
    /**
     * GET /api/admin/smtp
     */
    public function getSMTPConfig() {
        $this->auth->requireAuth();
        
        $config = $this->emailService->getConfig();
        Response::success(['config' => $config]);
    }
    
    /**
     * PUT /api/admin/smtp
     */
    public function updateSMTPConfig() {
        $this->auth->requireAuth();
        
        $data = Request::jsonBody();
        
        try {
            $config = $this->emailService->saveConfig($data);
            Response::success(['config' => $config]);
        } catch (Exception $e) {
            Response::error('Failed to save SMTP configuration: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/smtp/test-connection
     */
    public function testSMTPConnection() {
        $this->auth->requireAuth();
        
        try {
            $this->emailService->testConnection();
            Response::success([], 'Connection successful');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/smtp/test-email
     */
    public function sendTestEmail() {
        $this->auth->requireAuth();
        
        $data = Request::jsonBody();
        
        if (empty($data['testEmail'])) {
            Response::error('Test email address is required');
        }
        
        try {
            $subject = 'Test Email from RRGF School';
            $body = '<p>This is a test email from RRGF School backend system.</p>';
            
            $this->emailService->sendEmailPHPMailer($data['testEmail'], $subject, $body);
            Response::success([], 'Test email sent successfully');
        } catch (Exception $e) {
            Response::error('Failed to send test email: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/documents — create a new document row
     */
    public function createDocument() {
        $this->auth->requireAuth();
        $data = Request::jsonBody();

        $category = $data['category'] ?? '';
        $allowed = ['documents', 'academic', 'infrastructure'];
        if (!in_array($category, $allowed, true)) {
            Response::error('Invalid category. Must be documents, academic, or infrastructure.');
        }

        $information = trim((string)($data['information'] ?? ''));
        if ($information === '') {
            Response::error('information (title) is required');
        }

        $link   = trim((string)($data['link'] ?? '#'));
        $status = ($link !== '' && $link !== '#') ? '✓ Available' : 'Not Available';
        $sno    = trim((string)($data['sno'] ?? ''));

        // Auto-generate sno if not provided — next integer in category
        if ($sno === '') {
            $row  = $this->db->fetchOne(
                'SELECT MAX(CAST(sno AS UNSIGNED)) as m FROM documents WHERE category = ?',
                [$category]
            );
            $sno  = (string)(((int)($row['m'] ?? 0)) + 1);
        }

        // Auto-generate sort_order — put at end
        $maxRow = $this->db->fetchOne(
            'SELECT MAX(sort_order) as m FROM documents WHERE category = ?',
            [$category]
        );
        $sortOrder = ((int)($maxRow['m'] ?? 0)) + 10;

        $id = strtolower(preg_replace('/[^a-z0-9]/i', '', substr($category, 0, 4)))
            . '-' . uniqid();

        try {
            $this->db->insert(
                'INSERT INTO documents (id, category, sno, document, information, link, status, sort_order, hidden_from_public)
                 VALUES (?, ?, ?, NULL, ?, ?, ?, ?, 0)',
                [$id, $category, $sno, $information, $link, $status, $sortOrder]
            );
            $document = $this->db->fetchOne('SELECT * FROM documents WHERE id = ?', [$id]);
            Response::success(['document' => $document]);
        } catch (Exception $e) {
            Response::error('Failed to create document: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/admin/documents/:id — file upload OR JSON meta update (link + title + sno)
     */
    public function updateDocument($documentId) {
        $this->auth->requireAuth();
        
        // File upload path
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            try {
                $file = $_FILES['file'];
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $file['tmp_name']);
                finfo_close($finfo);
                
                if ($mimeType !== 'application/pdf') {
                    Response::error('Only PDF files are allowed');
                }
                
                $fileUrl = $this->fileUpload->upload('file', 'documents');
                
                $this->db->execute(
                    "UPDATE documents SET link = ?, status = '✓ Available' WHERE id = ?",
                    [$fileUrl, $documentId]
                );
                
                $document = $this->db->fetchOne("SELECT * FROM documents WHERE id = ?", [$documentId]);
                Response::success(['document' => $document]);
            } catch (Exception $e) {
                Response::error('Failed to upload document: ' . $e->getMessage(), 500);
            }
            return;
        }

        // JSON meta update — at least one of link / information / sno required
        $data = Request::jsonBody();

        $fields = [];
        $params = [];

        if (array_key_exists('information', $data)) {
            $info = trim((string)$data['information']);
            if ($info === '') Response::error('information cannot be empty');
            $fields[] = 'information = ?';
            $params[] = $info;
            // keep document column in sync (legacy column)
            $fields[] = 'document = NULL';
        }

        if (array_key_exists('sno', $data)) {
            $sno = trim((string)$data['sno']);
            if ($sno === '') Response::error('sno cannot be empty');
            $fields[] = 'sno = ?';
            $params[] = $sno;
        }

        if (array_key_exists('link', $data)) {
            $link = $data['link'];
            $status = ($link === '' || $link === '#') ? 'Not Available' : '✓ Available';
            $fields[] = 'link = ?';
            $fields[] = 'status = ?';
            $params[] = $link;
            $params[] = $status;
        }

        if (empty($fields)) {
            Response::error('Nothing to update — provide information, sno, or link');
        }

        try {
            $params[] = $documentId;
            $this->db->execute(
                'UPDATE documents SET ' . implode(', ', $fields) . ' WHERE id = ?',
                $params
            );
            $document = $this->db->fetchOne('SELECT * FROM documents WHERE id = ?', [$documentId]);
            if (!$document) Response::error('Document not found', 404);
            Response::success(['document' => $document]);
        } catch (Exception $e) {
            Response::error('Failed to update document: ' . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/admin/documents/:id
     */
    public function deleteDocument($documentId) {
        $this->auth->requireAuth();

        try {
            $doc = $this->db->fetchOne('SELECT * FROM documents WHERE id = ?', [$documentId]);
            if (!$doc) {
                Response::error('Document not found', 404);
            }

            $this->db->execute('DELETE FROM documents WHERE id = ?', [$documentId]);
            Response::success(['deleted' => $documentId]);
        } catch (Exception $e) {
            Response::error('Failed to delete document: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/admin/documents (includes hidden rows + sort_order)
     */
    public function getDocumentsAdmin() {
        $this->auth->requireAuth();

        try {
            $documents = $this->db->fetchAll(
                "SELECT * FROM documents ORDER BY category, sort_order ASC, CAST(sno AS UNSIGNED)"
            );
            Response::success(['documents' => $documents]);
        } catch (Exception $e) {
            Response::error('Failed to fetch documents: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PATCH /api/admin/documents/:id — body: { hidden_from_public: boolean }
     */
    public function patchDocumentVisibility($documentId) {
        $this->auth->requireAuth();
        $data = Request::jsonBody();

        if (!array_key_exists('hidden_from_public', $data)) {
            Response::error('hidden_from_public is required');
        }

        $raw = $data['hidden_from_public'];
        $hidden = filter_var($raw, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($hidden === null) {
            $hidden = (bool)((int)$raw);
        }

        try {
            $n = $this->db->execute(
                'UPDATE documents SET hidden_from_public = ? WHERE id = ?',
                [$hidden ? 1 : 0, $documentId]
            );
            if ($n === 0) {
                Response::error('Document not found', 404);
            }
            $document = $this->db->fetchOne('SELECT * FROM documents WHERE id = ?', [$documentId]);
            Response::success(['document' => $document]);
        } catch (Exception $e) {
            Response::error('Failed to update visibility: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/admin/documents/reorder — body: { category, ids: string[] }
     */
    public function reorderDocuments() {
        $this->auth->requireAuth();
        $data = Request::jsonBody();

        $category = $data['category'] ?? '';
        $allowed = ['documents', 'academic', 'infrastructure'];
        if (!in_array($category, $allowed, true)) {
            Response::error('Invalid category');
        }

        $ids = $data['ids'] ?? null;
        if (!is_array($ids) || empty($ids)) {
            Response::error('ids must be a non-empty array');
        }

        foreach ($ids as $id) {
            if (!is_string($id) || $id === '') {
                Response::error('Invalid id in ids');
            }
        }

        try {
            $existing = $this->db->fetchAll(
                'SELECT id FROM documents WHERE category = ?',
                [$category]
            );
            $existingIds = array_column($existing, 'id');
            sort($existingIds);

            $sortedIncoming = $ids;
            sort($sortedIncoming);

            if ($existingIds !== $sortedIncoming) {
                Response::error('ids must list exactly every document in this category');
            }

            $this->db->beginTransaction();
            $order = 10;
            foreach ($ids as $id) {
                $this->db->execute(
                    'UPDATE documents SET sort_order = ? WHERE id = ? AND category = ?',
                    [$order, $id, $category]
                );
                $order += 10;
            }
            $this->db->commit();
            Response::success(['ok' => true]);
        } catch (Exception $e) {
            try {
                $this->db->rollback();
            } catch (Exception $ignored) {
            }
            Response::error('Failed to reorder documents: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/admin/hero-images
     */
    public function getHeroImages() {
        $this->auth->requireAuth();
        
        try {
            $images = $this->db->fetchAll(
                "SELECT id, image_url as imageUrl, `order` FROM hero_images ORDER BY `order` ASC"
            );
            Response::success(['images' => $images]);
        } catch (Exception $e) {
            Response::error('Failed to fetch hero images: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/hero-images
     */
    public function uploadHeroImage() {
        $this->auth->requireAuth();
        
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            Response::error('Image file is required');
        }
        
        try {
            $fileUrl = $this->fileUpload->upload('image', 'hero');
            
            // Get max order
            $maxOrder = $this->db->fetchOne("SELECT MAX(`order`) as max_order FROM hero_images");
            $newOrder = ($maxOrder['max_order'] ?? 0) + 1;
            
            $id = uniqid('hero_');
            $this->db->insert(
                "INSERT INTO hero_images (id, image_url, `order`) VALUES (?, ?, ?)",
                [$id, $fileUrl, $newOrder]
            );
            
            $image = $this->db->fetchOne("SELECT id, image_url as imageUrl, `order` FROM hero_images WHERE id = ?", [$id]);
            Response::success(['image' => $image]);
        } catch (Exception $e) {
            Response::error('Failed to upload hero image: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * DELETE /api/admin/hero-images/:id
     */
    public function deleteHeroImage($id) {
        $this->auth->requireAuth();
        
        try {
            $image = $this->db->fetchOne("SELECT image_url FROM hero_images WHERE id = ?", [$id]);
            if ($image) {
                // Delete file
                $this->fileUpload->delete($image['image_url']);
                
                // Delete from database
                $this->db->execute("DELETE FROM hero_images WHERE id = ?", [$id]);
            }
            
            Response::success([], 'Hero image deleted successfully');
        } catch (Exception $e) {
            Response::error('Failed to delete hero image: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /api/admin/hero-images/order
     */
    public function updateHeroImageOrder() {
        $this->auth->requireAuth();
        
        $data = Request::jsonBody();
        
        if (empty($data['images']) || !is_array($data['images'])) {
            Response::error('Images array is required');
        }
        
        try {
            $this->db->beginTransaction();
            
            foreach ($data['images'] as $index => $image) {
                $this->db->execute(
                    "UPDATE hero_images SET `order` = ? WHERE id = ?",
                    [$index, $image['id']]
                );
            }
            
            $this->db->commit();
            
            $images = $this->db->fetchAll(
                "SELECT id, image_url as imageUrl, `order` FROM hero_images ORDER BY `order` ASC"
            );
            
            Response::success(['images' => $images]);
        } catch (Exception $e) {
            $this->db->rollback();
            Response::error('Failed to update order: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/admin/gallery/config
     */
    public function getGalleryConfig() {
        $this->auth->requireAuth();
        
        try {
            $config = $this->db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");
            if (!$config) {
                $config = ['oneDriveFolderLink' => null, 'oneDriveFolderId' => null, 'lastSync' => null];
            } else {
                // Convert snake_case to camelCase for frontend
                $config = [
                    'oneDriveFolderLink' => $config['onedrive_folder_link'] ?? null,
                    'oneDriveFolderId' => $config['onedrive_folder_id'] ?? null,
                    'lastSync' => $config['last_sync'] ?? null,
                ];
            }
            
            Response::success(['config' => $config]);
        } catch (Exception $e) {
            Response::error('Failed to fetch gallery config: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /api/admin/gallery/config
     */
    public function updateGalleryConfig() {
        $this->auth->requireAuth();
        
        require_once __DIR__ . '/../utils/OneDriveHelper.php';
        
        $data = Request::jsonBody();
        
        try {
            $existing = $this->db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");
            
            // Extract folder ID from OneDrive link (supports SharePoint/OneDrive for Business)
            $folderId = null;
            if (!empty($data['oneDriveFolderLink'])) {
                $folderId = OneDriveHelper::extractFolderId($data['oneDriveFolderLink']);
                
                // For SharePoint URLs, store the full link as folder ID might not be sufficient
                // SharePoint folder IDs need the full context (tenant, user, etc.)
                if (strpos($data['oneDriveFolderLink'], 'sharepoint.com') !== false && !$folderId) {
                    // If extraction failed, store a normalized version
                    // The folder ID extraction should work, but if it doesn't, we'll use the full URL
                    $folderId = $data['oneDriveFolderLink'];
                }
            }
            
            if ($existing) {
                $this->db->execute(
                    "UPDATE gallery_config SET onedrive_folder_link = ?, onedrive_folder_id = ? WHERE id = ?",
                    [$data['oneDriveFolderLink'] ?? null, $folderId, $existing['id']]
                );
            } else {
                $this->db->insert(
                    "INSERT INTO gallery_config (onedrive_folder_link, onedrive_folder_id) VALUES (?, ?)",
                    [$data['oneDriveFolderLink'] ?? null, $folderId]
                );
            }
            
            // Auto-fetch if requested (requires Microsoft Graph API - not implemented yet)
            $imagesAdded = 0;
            if (!empty($data['autoFetch']) && $folderId) {
                // TODO: Implement Microsoft Graph API integration for automatic image fetching
                // For now, users need to add images manually using SharePoint image URLs
                // The folder link is saved, but auto-fetch requires Graph API credentials
                $imagesAdded = 0;
            }
            
            $config = $this->db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");
            // Convert snake_case to camelCase for frontend
            $configFormatted = [
                'oneDriveFolderLink' => $config['onedrive_folder_link'] ?? null,
                'oneDriveFolderId' => $config['onedrive_folder_id'] ?? null,
                'lastSync' => $config['last_sync'] ?? null,
            ];
            $response = ['config' => $configFormatted];
            if ($imagesAdded > 0) {
                $response['imagesAdded'] = $imagesAdded;
            }
            
            Response::success($response);
        } catch (Exception $e) {
            Response::error('Failed to update gallery config: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/gallery/fetch-drive
     */
    public function fetchOneDriveImages() {
        $this->auth->requireAuth();
        
        require_once __DIR__ . '/../utils/OneDriveHelper.php';
        
        try {
            $config = $this->db->fetchOne("SELECT * FROM gallery_config ORDER BY id DESC LIMIT 1");
            
            if (empty($config['onedrive_folder_link'])) {
                Response::error('OneDrive folder not configured');
            }
            
            $folderLink = $config['onedrive_folder_link'];
            $imagesAdded = 0;
            
            // Check if it's a SharePoint/OneDrive for Business URL
            if (strpos($folderLink, 'sharepoint.com') !== false) {
                $imagesAdded = $this->fetchSharePointImages($folderLink, $config['onedrive_folder_id']);
            } else {
                // Personal OneDrive - would need Graph API
                Response::error('Automatic fetching from personal OneDrive requires Microsoft Graph API setup. Please add images manually using OneDrive image URLs.', 501);
                return;
            }
            
            // Update last sync time
            $this->db->execute(
                "UPDATE gallery_config SET last_sync = NOW() WHERE id = ?",
                [$config['id']]
            );
            
            Response::success([
                'imagesAdded' => $imagesAdded,
                'message' => $imagesAdded > 0 
                    ? "Successfully fetched {$imagesAdded} images from SharePoint folder"
                    : "No new images found or unable to fetch. Please add images manually using SharePoint image URLs."
            ]);
            
        } catch (Exception $e) {
            Response::error('Failed to fetch images: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * Attempt to fetch images from SharePoint folder
     * Uses Microsoft Graph API if credentials are configured, otherwise provides helpful error
     */
    private function fetchSharePointImages($folderLink, $folderId) {
        $imagesAdded = 0;
        
        try {
            // Try to use SharePointService with Graph API
            require_once __DIR__ . '/../services/SharePointService.php';
            $sharePointService = new SharePointService();
            
            if ($sharePointService->isConfigured()) {
                // Fetch images using Graph API
                $images = $sharePointService->fetchImagesFromFolder($folderLink);
                
                // Get existing image URLs to avoid duplicates
                $existingImages = $this->db->fetchAll("SELECT image_url FROM gallery_images");
                $existingUrls = array_column($existingImages, 'image_url');
                
                // Add new images
                foreach ($images as $imageData) {
                    if (!in_array($imageData['imageUrl'], $existingUrls)) {
                        $maxOrder = $this->db->fetchOne("SELECT MAX(`order`) as max_order FROM gallery_images");
                        $newOrder = ($maxOrder['max_order'] ?? 0) + 1;
                        
                        $id = uniqid('gallery_');
                        $this->db->insert(
                            "INSERT INTO gallery_images (id, image_url, thumbnail_url, category, title, description, `order`)
                             VALUES (?, ?, ?, ?, ?, ?, ?)",
                            [
                                $id,
                                $imageData['imageUrl'],
                                $imageData['thumbnailUrl'] ?? $imageData['imageUrl'],
                                'events', // Default category
                                $imageData['title'] ?? null,
                                $imageData['description'] ?? null,
                                $newOrder
                            ]
                        );
                        $imagesAdded++;
                    }
                }
            } else {
                // Graph API not configured - provide helpful error
                throw new Exception(
                    'Microsoft Graph API credentials not configured. ' .
                    'To enable automatic image fetching, please configure ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET, and ONEDRIVE_TENANT_ID environment variables. ' .
                    'For now, please add images manually by copying individual image URLs from your SharePoint folder.'
                );
            }
            
        } catch (Exception $e) {
            // Re-throw with helpful message
            throw $e;
        }
        
        return $imagesAdded;
    }
    
    /**
     * GET /api/admin/gallery/images
     * Supports optional folder_id filter
     */
    public function getGalleryImages() {
        $this->auth->requireAuth();
        
        try {
            $folderId = $_GET['folderId'] ?? null;
            
            if ($folderId) {
                $images = $this->db->fetchAll(
                    "SELECT i.id, i.image_url as imageUrl, i.thumbnail_url as thumbnailUrl, i.category, 
                            i.title, i.description, i.`order`, i.folder_id as folderId,
                            f.name as folderName
                     FROM gallery_images i
                     LEFT JOIN onedrive_folders f ON i.folder_id = f.id
                     WHERE i.folder_id = ?
                     ORDER BY i.`order` ASC, i.created_at DESC",
                    [$folderId]
                );
            } else {
                $images = $this->db->fetchAll(
                    "SELECT i.id, i.image_url as imageUrl, i.thumbnail_url as thumbnailUrl, i.category, 
                            i.title, i.description, i.`order`, i.folder_id as folderId,
                            f.name as folderName
                     FROM gallery_images i
                     LEFT JOIN onedrive_folders f ON i.folder_id = f.id
                     ORDER BY i.`order` ASC, i.created_at DESC"
                );
            }
            
            Response::success(['images' => $images]);
        } catch (Exception $e) {
            Response::error('Failed to fetch gallery images: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/gallery/images
     * Supports optional folder_id
     */
    public function addGalleryImage() {
        $this->auth->requireAuth();
        
        $data = Request::jsonBody();
        
        if (empty($data['imageUrl']) || empty($data['category'])) {
            Response::error('Image URL and category are required');
        }
        
        try {
            $maxOrder = $this->db->fetchOne("SELECT MAX(`order`) as max_order FROM gallery_images");
            $newOrder = ($maxOrder['max_order'] ?? 0) + 1;
            
            $id = uniqid('gallery_');
            $this->db->insert(
                "INSERT INTO gallery_images (id, image_url, thumbnail_url, category, title, description, `order`, folder_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $id,
                    $data['imageUrl'],
                    $data['thumbnailUrl'] ?? $data['imageUrl'],
                    $data['category'],
                    $data['title'] ?? null,
                    $data['description'] ?? null,
                    $newOrder,
                    $data['folderId'] ?? null
                ]
            );
            
            $image = $this->db->fetchOne(
                "SELECT i.id, i.image_url as imageUrl, i.thumbnail_url as thumbnailUrl, i.category, 
                        i.title, i.description, i.`order`, i.folder_id as folderId,
                        f.name as folderName
                 FROM gallery_images i
                 LEFT JOIN onedrive_folders f ON i.folder_id = f.id
                 WHERE i.id = ?",
                [$id]
            );
            
            Response::success(['image' => $image]);
        } catch (Exception $e) {
            Response::error('Failed to add gallery image: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /api/admin/gallery/images/:id
     */
    public function updateGalleryImage($id) {
        $this->auth->requireAuth();
        
        $data = Request::jsonBody();
        
        try {
            $updates = [];
            $params = [];
            
            if (isset($data['title'])) {
                $updates[] = "title = ?";
                $params[] = $data['title'];
            }
            if (isset($data['description'])) {
                $updates[] = "description = ?";
                $params[] = $data['description'];
            }
            if (isset($data['category'])) {
                $updates[] = "category = ?";
                $params[] = $data['category'];
            }
            if (isset($data['imageUrl'])) {
                $updates[] = "image_url = ?";
                $params[] = $data['imageUrl'];
            }
            if (isset($data['thumbnailUrl'])) {
                $updates[] = "thumbnail_url = ?";
                $params[] = $data['thumbnailUrl'];
            }
            
            if (empty($updates)) {
                Response::error('No fields to update');
            }
            
            $params[] = $id;
            $this->db->execute(
                "UPDATE gallery_images SET " . implode(', ', $updates) . " WHERE id = ?",
                $params
            );
            
            $image = $this->db->fetchOne(
                "SELECT id, image_url as imageUrl, thumbnail_url as thumbnailUrl, category, title, description, `order`
                 FROM gallery_images WHERE id = ?",
                [$id]
            );
            
            Response::success(['image' => $image]);
        } catch (Exception $e) {
            Response::error('Failed to update gallery image: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * DELETE /api/admin/gallery/images/:id
     */
    public function deleteGalleryImage($id) {
        $this->auth->requireAuth();
        
        try {
            $image = $this->db->fetchOne("SELECT image_url FROM gallery_images WHERE id = ?", [$id]);
            if ($image && !empty($image['image_url']) && strpos($image['image_url'], '/uploads/') !== false) {
                $this->fileUpload->delete($image['image_url']);
            }
            
            $this->db->execute("DELETE FROM gallery_images WHERE id = ?", [$id]);
            Response::success([], 'Gallery image deleted successfully');
        } catch (Exception $e) {
            Response::error('Failed to delete gallery image: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * DELETE /api/admin/gallery/images (delete all)
     */
    public function deleteAllGalleryImages() {
        $this->auth->requireAuth();
        
        try {
            // Get all images to delete uploaded files
            $images = $this->db->fetchAll("SELECT image_url FROM gallery_images");
            foreach ($images as $image) {
                if (!empty($image['image_url']) && strpos($image['image_url'], '/uploads/') !== false) {
                    $this->fileUpload->delete($image['image_url']);
                }
            }
            
            // Delete all gallery images
            $deleted = $this->db->execute("DELETE FROM gallery_images");
            Response::success(['deleted' => $deleted], "All gallery images deleted successfully");
        } catch (Exception $e) {
            Response::error('Failed to delete all gallery images: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/admin/graph-api/config
     * Get Microsoft Graph API configuration
     */
    public function getGraphApiConfig() {
        $this->auth->requireAuth();
        
        try {
            $config = $this->db->fetchOne(
                "SELECT client_id, tenant_id, is_active, updated_at, created_at FROM graph_api_config ORDER BY id DESC LIMIT 1"
            );
            
            if (!$config) {
                Response::success([
                    'clientId' => '',
                    'tenantId' => '',
                    'isActive' => false,
                    'hasSecret' => false
                ]);
                return;
            }
            
            // Don't return the secret, just indicate if it exists
            Response::success([
                'clientId' => $config['client_id'] ?? '',
                'tenantId' => $config['tenant_id'] ?? '',
                'isActive' => (bool)($config['is_active'] ?? false),
                'hasSecret' => !empty($this->db->fetchOne("SELECT 1 FROM graph_api_config WHERE client_secret IS NOT NULL AND client_secret != '' LIMIT 1")),
                'updatedAt' => $config['updated_at'] ?? null,
            ]);
        } catch (Exception $e) {
            Response::error('Failed to get Graph API config: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /api/admin/graph-api/config
     * Update Microsoft Graph API configuration
     */
    public function updateGraphApiConfig() {
        $this->auth->requireAuth();
        
        $data = Request::jsonBody();
        
        if (empty($data['clientId']) || empty($data['tenantId'])) {
            Response::error('Client ID and Tenant ID are required');
            return;
        }
        
        // Client secret is optional (only update if provided)
        try {
            $existing = $this->db->fetchOne("SELECT id FROM graph_api_config ORDER BY id DESC LIMIT 1");
            
            $recordId = null;
            
            if ($existing) {
                $recordId = $existing['id'];
                // Update existing
                if (isset($data['clientSecret']) && !empty($data['clientSecret'])) {
                    $this->db->execute(
                        "UPDATE graph_api_config SET client_id = ?, client_secret = ?, tenant_id = ?, is_active = ? WHERE id = ?",
                        [
                            $data['clientId'],
                            $data['clientSecret'],
                            $data['tenantId'],
                            isset($data['isActive']) ? (int)$data['isActive'] : 1,
                            $recordId
                        ]
                    );
                } else {
                    // Don't update secret if not provided
                    $this->db->execute(
                        "UPDATE graph_api_config SET client_id = ?, tenant_id = ?, is_active = ? WHERE id = ?",
                        [
                            $data['clientId'],
                            $data['tenantId'],
                            isset($data['isActive']) ? (int)$data['isActive'] : 1,
                            $recordId
                        ]
                    );
                }
            } else {
                // Insert new
                $recordId = $this->db->insert(
                    "INSERT INTO graph_api_config (client_id, client_secret, tenant_id, is_active) VALUES (?, ?, ?, ?)",
                    [
                        $data['clientId'],
                        $data['clientSecret'] ?? '',
                        $data['tenantId'],
                        isset($data['isActive']) ? (int)$data['isActive'] : 1
                    ]
                );
            }
            
            // Return updated config
            $updated = $this->db->fetchOne(
                "SELECT client_id, tenant_id, is_active, updated_at FROM graph_api_config WHERE id = ?",
                [$recordId]
            );
            
            Response::success([
                'config' => [
                    'clientId' => $updated['client_id'] ?? '',
                    'tenantId' => $updated['tenant_id'] ?? '',
                    'isActive' => (bool)($updated['is_active'] ?? false),
                    'hasSecret' => !empty($this->db->fetchOne("SELECT 1 FROM graph_api_config WHERE client_secret IS NOT NULL AND client_secret != '' LIMIT 1")),
                ]
            ], 'Graph API configuration updated successfully');
        } catch (Exception $e) {
            Response::error('Failed to update Graph API config: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admin/graph-api/test
     * Test Graph API connection
     */
    public function testGraphApi() {
        $this->auth->requireAuth();
        
        require_once __DIR__ . '/../services/SharePointService.php';
        
        try {
            $service = new SharePointService();
            
            if (!$service->isConfigured()) {
                Response::error('Graph API credentials are not configured', 400);
                return;
            }
            
            // Try to get an access token (this validates credentials)
            $reflection = new ReflectionClass($service);
            $method = $reflection->getMethod('getAccessToken');
            $method->setAccessible(true);
            
            try {
                $token = $method->invoke($service);
                if (!empty($token)) {
                    Response::success(['message' => 'Graph API connection successful! Credentials are valid.'], 'Test successful');
                } else {
                    Response::error('Failed to get access token', 400);
                }
            } catch (Exception $e) {
                Response::error('Graph API test failed: ' . $e->getMessage(), 400);
            }
        } catch (Exception $e) {
            Response::error('Failed to test Graph API: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/admin/mpd
     */
    public function getMpdAdmin() {
        $this->auth->requireAuth();
        try {
            require_once __DIR__ . '/../services/MpdDisclosureService.php';
            $disclosure = MpdDisclosureService::loadPayload($this->db);
            $mpdUpdatedAt = MpdDisclosureService::updatedAt($this->db);

            Response::success([
                'disclosure' => $disclosure,
                'mpdUpdatedAt' => $mpdUpdatedAt,
            ]);
        } catch (Exception $e) {
            Response::error('Failed to load MPD disclosure: ' . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/admin/mpd
     * Body: merged disclosure subtree (arrays/objects replace server merge with defaults).
     */
    public function updateMpd() {
        $this->auth->requireAuth();
        try {
            require_once __DIR__ . '/../services/MpdDisclosureService.php';

            $data = Request::jsonBody();

            $incoming = isset($data['disclosure']) && is_array($data['disclosure']) ? $data['disclosure'] : $data;

            $disclosure = MpdDisclosureService::savePayload($this->db, $incoming);

            Response::success([
                'disclosure' => $disclosure,
                'mpdUpdatedAt' => MpdDisclosureService::updatedAt($this->db),
            ]);
        } catch (Exception $e) {
            Response::error('Failed to save MPD disclosure: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/admin/mpd/teacher-list
     */
    public function uploadMpdTeacherList() {
        $this->auth->requireAuth();

        try {
            require_once __DIR__ . '/../services/MpdDisclosureService.php';

            if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
                Response::error('Teacher list file upload is required');
                return;
            }

            $file = $_FILES['file'];
            if ($file['size'] > 15 * 1024 * 1024) {
                Response::error('Teacher list exceeds 15MB limit');
                return;
            }

            $config = require __DIR__ . '/../config/app.php';

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);

            if (!in_array($mimeType, $config['allowed_document_types'])) {
                Response::error('Only PDF / Excel (.xlsx/.xls) / CSV uploads are allowed for teacher list');
                return;
            }

            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION) ?: '');
            $allowedExtensions = ['pdf', 'xlsx', 'xls', 'csv'];
            if (!in_array($extension, $allowedExtensions)) {
                Response::error('Invalid file extension for teacher list');
                return;
            }

            $filename = 'teacher-list_' . uniqid() . '_' . time() . '.' . $extension;
            $subdirectory = 'mpd';
            $uploadDir = rtrim($config['upload_dir'], '/') . '/' . $subdirectory;
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $destination = $uploadDir . '/' . $filename;

            if (!move_uploaded_file($file['tmp_name'], $destination)) {
                Response::error('Could not persist teacher list upload');
                return;
            }

            $fileUrl = $config['upload_url'] . $subdirectory . '/' . $filename;
            MpdDisclosureService::savePayload($this->db, ['teacherListUrl' => $fileUrl]);

            Response::success([
                'teacherListUrl' => $fileUrl,
                'disclosure' => MpdDisclosureService::loadPayload($this->db),
                'mpdUpdatedAt' => MpdDisclosureService::updatedAt($this->db),
            ]);
        } catch (Exception $e) {
            Response::error('Failed teacher list upload: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/admin/mpd/sample-teachers
     */
    public function downloadMpdTeacherSample() {
        $this->auth->requireAuth();

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="cbse-teacher-list-sample.csv"');

        $stream = fopen('php://output', 'w');
        fprintf($stream, chr(0xEF) . chr(0xBB) . chr(0xBF));
        fputcsv($stream, [
            'Name',
            'Gender',
            'Academic qualification',
            'Professional qualification',
            'Designation',
            'Teaching subject/s',
            'Year of joining at this school',
        ]);
        fclose($stream);
        exit;
    }
}