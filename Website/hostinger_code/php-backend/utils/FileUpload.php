<?php
/**
 * File Upload Utility
 */

class FileUpload {
    private $config;
    
    public function __construct() {
        $this->config = require __DIR__ . '/../config/app.php';
    }
    
    /**
     * Handle file upload
     */
    public function upload($fileKey, $subdirectory = '') {
        if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload failed');
        }
        
        $file = $_FILES[$fileKey];
        
        // Validate file size
        if ($file['size'] > $this->config['max_file_size']) {
            throw new Exception('File size exceeds maximum allowed size');
        }
        
        // Validate file type
        $allowedTypes = array_merge(
            $this->config['allowed_image_types'],
            $this->config['allowed_document_types']
        );
        
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('Invalid file type');
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        
        // Create upload directory if it doesn't exist
        $uploadDir = $this->config['upload_dir'] . $subdirectory;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $destination = $uploadDir . '/' . $filename;
        
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to move uploaded file');
        }
        
        return $this->config['upload_url'] . $subdirectory . '/' . $filename;
    }
    
    /**
     * Delete file
     */
    public function delete($fileUrl) {
        if (empty($fileUrl) || strpos($fileUrl, '..') !== false) {
            return false;
        }
        
        // Convert URL to file path
        $filePath = str_replace($this->config['upload_url'], $this->config['upload_dir'], $fileUrl);
        
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        
        return false;
    }
}