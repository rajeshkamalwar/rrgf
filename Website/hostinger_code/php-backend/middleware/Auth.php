<?php
/**
 * Authentication Middleware
 */

class Auth {
    private $db;
    private $config;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->config = require __DIR__ . '/../config/app.php';
    }
    
    /**
     * Verify session token from header
     */
    public function verifySession($sessionId) {
        if (empty($sessionId)) {
            return false;
        }
        
        // Clean expired sessions first
        $this->cleanExpiredSessions();
        
        // Check session
        $session = $this->db->fetchOne(
            "SELECT * FROM admin_sessions WHERE id = ? AND expires_at > NOW()",
            [$sessionId]
        );
        
        return $session !== false;
    }
    
    /**
     * Create new session
     */
    public function createSession($userId = 1) {
        $sessionId = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + $this->config['session_lifetime']);
        
        $this->db->insert(
            "INSERT INTO admin_sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
            [$sessionId, $userId, $expiresAt]
        );
        
        return $sessionId;
    }
    
    /**
     * Destroy session
     */
    public function destroySession($sessionId) {
        $this->db->execute(
            "DELETE FROM admin_sessions WHERE id = ?",
            [$sessionId]
        );
    }
    
    /**
     * Clean expired sessions
     */
    private function cleanExpiredSessions() {
        $this->db->execute("DELETE FROM admin_sessions WHERE expires_at < NOW()");
    }
    
    /**
     * Verify admin credentials
     */
    public function verifyCredentials($username, $password) {
        $config = $this->config;
        
        // Check username
        if ($username !== $config['admin_username']) {
            return false;
        }
        
        // Verify password against stored hash
        // In production, get hash from database or env
        if (password_verify($password, $config['admin_password_hash'])) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Require authentication - returns session ID or false
     */
    public function requireAuth() {
        $headers = getallheaders();
        $sessionId = $headers['x-session-id'] ?? $headers['X-Session-Id'] ?? null;
        
        if (!$this->verifySession($sessionId)) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Unauthorized'
            ]);
            exit;
        }
        
        return $sessionId;
    }
}