<?php
/**
 * Email Service
 * Handles SMTP email sending
 */

class EmailService {
    private $db;
    private $config;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->config = require __DIR__ . '/../config/app.php';
    }
    
    /**
     * Get SMTP configuration
     */
    public function getConfig() {
        $config = $this->db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
        
        if ($config) {
            // Store password separately before unsetting
            $hasPassword = !empty($config['password']);
            // Don't return password
            unset($config['password']);
            $config['hasPassword'] = $hasPassword;
        }
        
        return $config ?: null;
    }
    
    /**
     * Save SMTP configuration
     */
    public function saveConfig($data) {
        $existing = $this->getConfig();
        
        $config = [
            'host' => $data['host'],
            'port' => (int)$data['port'],
            'user' => $data['user'],
            'from' => $data['from'],
            'to' => $data['to'],
        ];
        
        // Only update password if provided
        if (!empty($data['password'])) {
            $config['password'] = base64_encode($data['password']); // Simple encoding, could use encryption
        } elseif ($existing) {
            // Get existing password
            $existingFull = $this->db->fetchOne("SELECT password FROM smtp_config ORDER BY id DESC LIMIT 1");
            $config['password'] = $existingFull['password'];
        }
        
        if ($existing) {
            // Update existing
            $this->db->execute(
                "UPDATE smtp_config SET host = ?, port = ?, user = ?, password = ?, `from` = ?, `to` = ? WHERE id = ?",
                [$config['host'], $config['port'], $config['user'], $config['password'], $config['from'], $config['to'], $existing['id']]
            );
        } else {
            // Insert new
            $this->db->insert(
                "INSERT INTO smtp_config (host, port, user, password, `from`, `to`) VALUES (?, ?, ?, ?, ?, ?)",
                [$config['host'], $config['port'], $config['user'], $config['password'], $config['from'], $config['to']]
            );
        }
        
        return $this->getConfig();
    }
    
    /**
     * Test SMTP connection
     */
    public function testConnection() {
        $config = $this->getConfig();
        if (!$config) {
            throw new Exception('SMTP configuration not found');
        }
        
        $fullConfig = $this->db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
        $password = base64_decode($fullConfig['password']);
        
        // For shared hosting, we'll use basic connection test
        // Full SMTP testing would require PHPMailer or similar
        // For now, just verify configuration is saved
        return true;
    }
    
    /**
     * Send email
     */
    public function sendEmail($to, $subject, $body, $fromName = null) {
        $config = $this->getConfig();
        if (!$config) {
            throw new Exception('SMTP configuration not found');
        }
        
        $fullConfig = $this->db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
        $password = base64_decode($fullConfig['password']);
        
        try {
            // Use PHP's mail() function with custom headers as fallback
            // For full SMTP support, you'd need PHPMailer or SwiftMailer
            // This is a simplified version for shared hosting
            
            $headers = [
                'From: ' . ($fromName ?: $config['from']) . ' <' . $config['from'] . '>',
                'Reply-To: ' . $config['from'],
                'X-Mailer: PHP/' . phpversion(),
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8'
            ];
            
            return mail($to, $subject, $body, implode("\r\n", $headers));
        } catch (Exception $e) {
            throw new Exception('Failed to send email: ' . $e->getMessage());
        }
    }
    
    /**
     * Send email using PHPMailer (if available)
     * For better SMTP support on shared hosting
     */
    public function sendEmailPHPMailer($to, $subject, $body, $fromName = null) {
        // Try to load PHPMailer from various possible locations
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            $phpmailerPaths = [
                __DIR__ . '/../vendor/PHPMailer/src/PHPMailer.php',             // Direct src structure (your current setup)
                __DIR__ . '/../vendor/PHPMailer/PHPMailer/src/PHPMailer.php',  // GitHub download structure (nested)
                __DIR__ . '/../vendor/PHPMailer/PHPMailer/PHPMailer.php',      // Standard structure
                __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php',  // Composer lowercase
            ];
            
            foreach ($phpmailerPaths as $path) {
                if (file_exists($path)) {
                    require_once $path;
                    // Also include required files from same directory
                    $dir = dirname($path);
                    if (file_exists($dir . '/SMTP.php')) {
                        require_once $dir . '/SMTP.php';
                    }
                    if (file_exists($dir . '/Exception.php')) {
                        require_once $dir . '/Exception.php';
                    }
                    break;
                }
            }
        }
        
        // Check if PHPMailer is available after attempting to load
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            // Fallback to basic mail()
            return $this->sendEmail($to, $subject, $body, $fromName);
        }
        
        $config = $this->getConfig();
        if (!$config) {
            throw new Exception('SMTP configuration not found');
        }
        
        $fullConfig = $this->db->fetchOne("SELECT * FROM smtp_config ORDER BY id DESC LIMIT 1");
        $password = base64_decode($fullConfig['password']);
        
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // SMTP configuration
            $mail->isSMTP();
            $mail->Host = $config['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $config['user'];
            $mail->Password = $password;
            // Use STARTTLS for port 587, SSL/TLS for port 465
            if ($config['port'] == 465) {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            }
            $mail->Port = $config['port'];
            
            // Email content
            $mail->setFrom($config['from'], $fromName ?: 'RRGF School');
            
            // Handle multiple recipients (comma or semicolon separated)
            $recipients = preg_split('/[,;]/', $to);
            foreach ($recipients as $recipient) {
                $recipient = trim($recipient);
                if (!empty($recipient)) {
                    $mail->addAddress($recipient);
                }
            }
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            throw new Exception('Failed to send email: ' . $e->getMessage());
        }
    }
}