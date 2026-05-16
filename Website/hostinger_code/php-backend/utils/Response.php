<?php
/**
 * Response Utility
 */

class Response {
    /**
     * Send JSON response
     */
    public static function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
    
    /**
     * Send success response
     */
    public static function success($data = [], $message = null) {
        $response = ['success' => true];
        if ($message) {
            $response['message'] = $message;
        }
        $response = array_merge($response, $data);
        self::json($response);
    }
    
    /**
     * Send error response
     */
    public static function error($message, $statusCode = 400, $errors = []) {
        $response = [
            'success' => false,
            'error' => $message
        ];
        if (!empty($errors)) {
            $response['errors'] = $errors;
        }
        self::json($response, $statusCode);
    }
    
    /**
     * Enable CORS
     */
    public static function enableCORS() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, x-session-id, X-Session-Id');
        
        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}