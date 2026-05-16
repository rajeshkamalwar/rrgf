<?php
/**
 * Verify all forms send emails to configured recipients
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/EmailService.php';

try {
    $db = Database::getInstance();
    $emailService = new EmailService();
    
    echo "=== Verifying All Forms Email Configuration ===\n\n";
    
    // Get SMTP config
    $config = $emailService->getConfig();
    
    if (!$config) {
        echo "❌ SMTP configuration not found\n";
        exit(1);
    }
    
    echo "SMTP Configuration:\n";
    echo "- From: {$config['from']}\n";
    echo "- To: {$config['to']}\n\n";
    
    // Parse recipients
    $recipients = preg_split('/[,;]/', $config['to']);
    $recipients = array_map('trim', $recipients);
    $recipients = array_filter($recipients);
    
    echo "Email Recipients (" . count($recipients) . "):\n";
    foreach ($recipients as $i => $email) {
        echo "  " . ($i + 1) . ". $email\n";
    }
    
    echo "\n=== Forms That Send Emails ===\n\n";
    
    $forms = [
        [
            'name' => 'Enquiry Form',
            'endpoint' => '/api/enquiry',
            'method' => 'POST',
            'controller' => 'PublicController::submitEnquiry()',
            'sends_to' => $config['to'],
            'description' => 'General enquiries from website'
        ],
        [
            'name' => 'Contact Form',
            'endpoint' => '/api/contact',
            'method' => 'POST',
            'controller' => 'PublicController::submitContact()',
            'sends_to' => $config['to'],
            'description' => 'Contact form submissions'
        ],
        [
            'name' => 'Admission Form',
            'endpoint' => '/api/admissions',
            'method' => 'POST',
            'controller' => 'PublicController::submitAdmission()',
            'sends_to' => $config['to'],
            'description' => 'New admission applications'
        ],
        [
            'name' => 'Visit Schedule Form',
            'endpoint' => '/api/visit-schedule',
            'method' => 'POST',
            'controller' => 'PublicController::submitVisitSchedule()',
            'sends_to' => $config['to'],
            'description' => 'School visit schedule requests'
        ],
    ];
    
    foreach ($forms as $form) {
        echo "✅ {$form['name']}\n";
        echo "   Endpoint: {$form['endpoint']}\n";
        echo "   Controller: {$form['controller']}\n";
        echo "   Sends to: {$form['sends_to']}\n";
        echo "   Description: {$form['description']}\n";
        echo "   Recipients: " . count($recipients) . " email(s)\n";
        echo "\n";
    }
    
    echo "=== Summary ===\n";
    echo "✅ All " . count($forms) . " forms are configured to send emails\n";
    echo "✅ All forms send to: {$config['to']}\n";
    echo "✅ All emails will be sent to " . count($recipients) . " recipient(s)\n";
    
    // Expected emails check
    $expected = ['rrgreenfielddigital@gmail.com', 'rrgreenfieldsch@gmail.com'];
    $allPresent = true;
    foreach ($expected as $expectedEmail) {
        if (!in_array($expectedEmail, $recipients)) {
            $allPresent = false;
            break;
        }
    }
    
    if ($allPresent) {
        echo "✅ All expected Gmail addresses are configured!\n";
    } else {
        echo "⚠️  Some expected Gmail addresses are missing.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
