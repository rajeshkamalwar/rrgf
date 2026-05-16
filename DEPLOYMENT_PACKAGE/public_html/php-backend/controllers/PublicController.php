<?php
/**
 * Public API Controllers
 */

require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Request.php';
require_once __DIR__ . '/../services/EmailService.php';

class PublicController {
    private $db;
    private $emailService;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->emailService = new EmailService();
    }
    
    /**
     * POST /api/enquiry
     */
    public function submitEnquiry() {
        $data = Request::jsonBody();

        // Validate required fields
        if (empty($data['name']) || empty($data['phone'])) {
            Response::error('Name and phone are required');
        }
        
        try {
            $this->db->insert(
                "INSERT INTO enquiries (name, email, phone, student_name, class, subject, message) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    $data['name'] ?? '',
                    $data['email'] ?? null,
                    $data['phone'] ?? '',
                    $data['studentName'] ?? null,
                    $data['class'] ?? null,
                    $data['subject'] ?? null,
                    $data['message'] ?? null
                ]
            );
            
            // Send email notification
            try {
                $config = $this->emailService->getConfig();
                if ($config) {
                    $subject = 'New Enquiry from ' . $data['name'];
                    $body = $this->formatEnquiryEmail($data);
                    $this->emailService->sendEmailPHPMailer($config['to'], $subject, $body);
                }
            } catch (Exception $e) {
                // Log but don't fail the request
                error_log('Email send failed: ' . $e->getMessage());
            }
            
            Response::success([], 'Enquiry submitted successfully');
        } catch (Exception $e) {
            Response::error('Failed to submit enquiry: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/contact
     */
    public function submitContact() {
        $data = Request::jsonBody();

        if (empty($data['name']) || empty($data['email']) || empty($data['subject']) || empty($data['description'])) {
            Response::error('All fields are required');
        }
        
        try {
            $this->db->insert(
                "INSERT INTO contacts (name, email, subject, description) VALUES (?, ?, ?, ?)",
                [$data['name'], $data['email'], $data['subject'], $data['description']]
            );
            
            // Send email notification
            try {
                $config = $this->emailService->getConfig();
                if ($config) {
                    $subject = 'Contact Form: ' . $data['subject'];
                    $body = $this->formatContactEmail($data);
                    $this->emailService->sendEmailPHPMailer($config['to'], $subject, $body);
                }
            } catch (Exception $e) {
                error_log('Email send failed: ' . $e->getMessage());
            }
            
            Response::success([], 'Message sent successfully');
        } catch (Exception $e) {
            Response::error('Failed to send message: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/admissions
     */
    public function submitAdmission() {
        $data = Request::jsonBody();

        // Validate required fields
        $required = ['studentName', 'dateOfBirth', 'gender', 'classSeeking', 'parentName', 
                     'phone', 'email', 'address', 'emergencyContactName', 'emergencyContactPhone'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                Response::error("Field $field is required");
            }
        }
        
        try {
            $this->db->insert(
                "INSERT INTO admissions (
                    student_name, date_of_birth, gender, class_seeking, previous_school, previous_class,
                    parent_name, relationship, occupation, phone, alternate_phone, email, address,
                    emergency_contact_name, emergency_contact_phone, message
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $data['studentName'],
                    $data['dateOfBirth'],
                    $data['gender'],
                    $data['classSeeking'],
                    $data['previousSchool'] ?? '',
                    $data['previousClass'] ?? '',
                    $data['parentName'],
                    $data['relationship'] ?? 'parent',
                    $data['occupation'] ?? '',
                    $data['phone'],
                    $data['alternatePhone'] ?? '',
                    $data['email'],
                    $data['address'],
                    $data['emergencyContactName'],
                    $data['emergencyContactPhone'],
                    $data['message'] ?? ''
                ]
            );
            
            // Send email notification
            try {
                $config = $this->emailService->getConfig();
                if ($config) {
                    $subject = 'New Admission Application: ' . $data['studentName'];
                    $body = $this->formatAdmissionEmail($data);
                    $this->emailService->sendEmailPHPMailer($config['to'], $subject, $body);
                }
            } catch (Exception $e) {
                error_log('Email send failed: ' . $e->getMessage());
            }
            
            Response::success([], 'Admission application submitted successfully');
        } catch (Exception $e) {
            Response::error('Failed to submit application: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/visit-schedule
     */
    public function submitVisitSchedule() {
        $data = Request::jsonBody();

        $required = ['name', 'email', 'phone', 'preferredDate', 'preferredTime', 'numberOfVisitors', 'purpose'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                Response::error("Field $field is required");
            }
        }
        
        try {
            $this->db->insert(
                "INSERT INTO visit_schedules (name, email, phone, preferred_date, preferred_time, number_of_visitors, purpose, message)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $data['name'],
                    $data['email'],
                    $data['phone'],
                    $data['preferredDate'],
                    $data['preferredTime'],
                    $data['numberOfVisitors'],
                    $data['purpose'],
                    $data['message'] ?? null
                ]
            );
            
            // Send email notification
            try {
                $config = $this->emailService->getConfig();
                if ($config) {
                    $subject = 'New Visit Schedule Request from ' . $data['name'];
                    $body = $this->formatVisitScheduleEmail($data);
                    $this->emailService->sendEmailPHPMailer($config['to'], $subject, $body);
                }
            } catch (Exception $e) {
                error_log('Email send failed: ' . $e->getMessage());
            }
            
            Response::success([], 'Visit request submitted successfully');
        } catch (Exception $e) {
            Response::error('Failed to submit visit request: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/documents
     */
    public function getDocuments() {
        try {
            $documents = $this->db->fetchAll("SELECT * FROM documents ORDER BY category, CAST(sno AS UNSIGNED)");
            
            Response::success(['documents' => $documents]);
        } catch (Exception $e) {
            Response::error('Failed to fetch documents: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/mpd
     * Full mandatory public disclosure bundle (Appendix‑IX structured fields + uploaded documents lists).
     */
    public function getMpdBundle() {
        try {
            require_once __DIR__ . '/../services/MpdDisclosureService.php';
            $documents = $this->db->fetchAll("SELECT * FROM documents ORDER BY category, CAST(sno AS UNSIGNED)");
            $disclosure = MpdDisclosureService::loadPayload($this->db);
            $mpdUpdatedAt = MpdDisclosureService::updatedAt($this->db);

            Response::success([
                'documents' => $documents,
                'disclosure' => $disclosure,
                'mpdUpdatedAt' => $mpdUpdatedAt,
                'canonicalPath' => '/mandatory-public-disclosure',
                'alternatePaths' => ['/mandatory-disclosure'],
            ]);
        } catch (Exception $e) {
            Response::error('Failed to load disclosure: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/hero-images
     */
    public function getHeroImages() {
        try {
            $images = $this->db->fetchAll("SELECT id, image_url as imageUrl, `order` FROM hero_images ORDER BY `order` ASC");
            
            Response::success(['images' => $images]);
        } catch (Exception $e) {
            Response::error('Failed to fetch hero images: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/gallery
     */
    public function getGallery() {
        try {
            $images = $this->db->fetchAll(
                "SELECT id, image_url, thumbnail_url, category, title, description, `order` 
                 FROM gallery_images ORDER BY `order` ASC, created_at DESC"
            );
            
            // Convert to camelCase and ensure proper URL format for embedding
            require_once __DIR__ . '/../utils/OneDriveHelper.php';
            $formattedImages = array_map(function($img) {
                $imageUrl = $img['image_url'];
                $thumbnailUrl = $img['thumbnail_url'] ?? $img['image_url'];
                
                // Convert OneDrive/SharePoint URL to embeddable format if needed
                if (strpos($imageUrl, 'onedrive') !== false || strpos($imageUrl, 'sharepoint.com') !== false || strpos($imageUrl, '1drv.ms') !== false) {
                    $imageUrl = OneDriveHelper::getEmbeddableUrl($imageUrl);
                    $thumbnailUrl = OneDriveHelper::getThumbnailUrl($img['image_url'], 800);
                }
                
                return [
                    'id' => $img['id'],
                    'imageUrl' => $imageUrl,
                    'thumbnailUrl' => $thumbnailUrl,
                    'category' => $img['category'],
                    'title' => $img['title'],
                    'description' => $img['description'],
                    'order' => (int)$img['order'],
                ];
            }, $images);
            
            Response::success(['images' => $formattedImages]);
        } catch (Exception $e) {
            Response::error('Failed to fetch gallery: ' . $e->getMessage(), 500);
        }
    }
    
    // Email formatting helpers
    private function formatEnquiryEmail($data) {
        return "
        <h2>New Enquiry</h2>
        <p><strong>Name:</strong> {$data['name']}</p>
        <p><strong>Email:</strong> " . ($data['email'] ?? 'N/A') . "</p>
        <p><strong>Phone:</strong> {$data['phone']}</p>
        <p><strong>Student Name:</strong> " . ($data['studentName'] ?? 'N/A') . "</p>
        <p><strong>Class:</strong> " . ($data['class'] ?? 'N/A') . "</p>
        <p><strong>Subject:</strong> " . ($data['subject'] ?? 'N/A') . "</p>
        <p><strong>Message:</strong> " . ($data['message'] ?? 'N/A') . "</p>
        ";
    }
    
    private function formatContactEmail($data) {
        return "
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> {$data['name']}</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>Subject:</strong> {$data['subject']}</p>
        <p><strong>Description:</strong></p>
        <p>{$data['description']}</p>
        ";
    }
    
    private function formatAdmissionEmail($data) {
        return "
        <h2>New Admission Application</h2>
        <h3>Student Information</h3>
        <p><strong>Name:</strong> {$data['studentName']}</p>
        <p><strong>Date of Birth:</strong> {$data['dateOfBirth']}</p>
        <p><strong>Gender:</strong> {$data['gender']}</p>
        <p><strong>Class Seeking:</strong> {$data['classSeeking']}</p>
        <p><strong>Previous School:</strong> " . ($data['previousSchool'] ?? 'N/A') . "</p>
        <p><strong>Previous Class:</strong> " . ($data['previousClass'] ?? 'N/A') . "</p>
        
        <h3>Parent/Guardian Information</h3>
        <p><strong>Name:</strong> {$data['parentName']}</p>
        <p><strong>Relationship:</strong> " . ($data['relationship'] ?? 'N/A') . "</p>
        <p><strong>Occupation:</strong> " . ($data['occupation'] ?? 'N/A') . "</p>
        <p><strong>Phone:</strong> {$data['phone']}</p>
        <p><strong>Alternate Phone:</strong> " . ($data['alternatePhone'] ?? 'N/A') . "</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>Address:</strong> {$data['address']}</p>
        
        <h3>Emergency Contact</h3>
        <p><strong>Name:</strong> {$data['emergencyContactName']}</p>
        <p><strong>Phone:</strong> {$data['emergencyContactPhone']}</p>
        
        <h3>Additional Information</h3>
        <p>" . ($data['message'] ?? 'None') . "</p>
        ";
    }
    
    private function formatVisitScheduleEmail($data) {
        return "
        <h2>New Visit Schedule Request</h2>
        <p><strong>Name:</strong> {$data['name']}</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>Phone:</strong> {$data['phone']}</p>
        <p><strong>Preferred Date:</strong> {$data['preferredDate']}</p>
        <p><strong>Preferred Time:</strong> {$data['preferredTime']}</p>
        <p><strong>Number of Visitors:</strong> {$data['numberOfVisitors']}</p>
        <p><strong>Purpose:</strong> {$data['purpose']}</p>
        <p><strong>Message:</strong> " . ($data['message'] ?? 'None') . "</p>
        ";
    }
}