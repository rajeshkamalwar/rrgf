<?php
/**
 * Link documents from Website/documents folder to database
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/Database.php';

try {
    $db = Database::getInstance();
    
    // Map document filenames to database document information
    $documentMappings = [
        // Category: documents
        'Registration Certificate.pdf' => ['category' => 'documents', 'sno' => '1', 'information' => 'Registration Certificate'],
        'trustdeed.pdf' => ['category' => 'documents', 'sno' => '2', 'information' => 'Trust Deed'],
        'RTE.pdf' => ['category' => 'documents', 'sno' => '3', 'information' => 'Right to Education (RTE)'],
        'Calander.pdf' => ['category' => 'documents', 'sno' => '4', 'information' => 'School Calendar'],
        'Fees structure.pdf' => ['category' => 'documents', 'sno' => '5', 'information' => 'Fees Structure'],
        'Self Certification proforma.pdf' => ['category' => 'documents', 'sno' => '6', 'information' => 'Self Certification Proforma'],
        'PTA.pdf' => ['category' => 'documents', 'sno' => '7', 'information' => 'Parent Teacher Association'],
        'SMC_List.pdf' => ['category' => 'documents', 'sno' => '8', 'information' => 'School Management Committee (SMC) List'],
        
        // Category: academic
        'NOC.pdf' => ['category' => 'academic', 'sno' => '1', 'information' => 'No Objection Certificate (NOC)'],
        
        // Category: infrastructure
        'INFRASTRUCTURE.pdf' => ['category' => 'infrastructure', 'sno' => '1', 'information' => 'Infrastructure Details'],
        'land.pdf' => ['category' => 'infrastructure', 'sno' => '2', 'information' => 'Land Certificate'],
        'Building safty certificate.pdf' => ['category' => 'infrastructure', 'sno' => '3', 'information' => 'Building Safety Certificate'],
        'fire.pdf' => ['category' => 'infrastructure', 'sno' => '4', 'information' => 'Fire Safety Certificate'],
        'Drinking water Sanitation certificate.pdf' => ['category' => 'infrastructure', 'sno' => '5', 'information' => 'Drinking Water & Sanitation Certificate'],
        'Water testing report.pdf' => ['category' => 'infrastructure', 'sno' => '6', 'information' => 'Water Testing Report'],
    ];
    
    $documentsPath = __DIR__ . '/../../documents';
    
    if (!is_dir($documentsPath)) {
        echo "❌ Documents directory not found: $documentsPath\n";
        exit(1);
    }
    
    echo "=== Linking Documents to Database ===\n\n";
    echo "Documents path: $documentsPath\n\n";
    
    // Get all PDF files
    $files = [];
    $dir = opendir($documentsPath);
    while (($file = readdir($dir)) !== false) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if ($ext === 'pdf') {
            $files[] = $file;
        }
    }
    closedir($dir);
    
    echo "Found " . count($files) . " PDF files\n\n";
    
    // Get existing documents from database
    $existingDocs = $db->fetchAll("SELECT id, sno, category, document FROM documents");
    $existingMap = [];
    foreach ($existingDocs as $doc) {
        $key = $doc['category'] . '_' . $doc['sno'];
        $existingMap[$key] = $doc;
    }
    
    $updated = 0;
    $created = 0;
    $skipped = 0;
    
    foreach ($files as $file) {
        $filename = $file;
        $normalizedFilename = $file; // Keep original case for display
        
        // Find mapping
        $mapping = null;
        foreach ($documentMappings as $mapFile => $mapData) {
            if (strcasecmp($file, $mapFile) === 0) {
                $mapping = $mapData;
                break;
            }
        }
        
        if (!$mapping) {
            echo "⏭️  Skipped (no mapping): $file\n";
            $skipped++;
            continue;
        }
        
        // Construct document link (relative to public folder)
        $documentLink = '/documents/' . urlencode($file);
        
        // Check if document already exists
        $key = $mapping['category'] . '_' . $mapping['sno'];
        $existing = $existingMap[$key] ?? null;
        
        if ($existing) {
            // Update existing
            try {
                $db->execute(
                    "UPDATE documents SET document = ?, link = ?, status = 'Available' WHERE id = ?",
                    [$normalizedFilename, $documentLink, $existing['id']]
                );
                echo "✅ Updated: {$mapping['information']} ({$mapping['category']}, SNO: {$mapping['sno']}) -> $file\n";
                $updated++;
            } catch (Exception $e) {
                echo "❌ Error updating {$mapping['information']}: " . $e->getMessage() . "\n";
            }
        } else {
            // Create new
            try {
                $id = uniqid('doc_');
                $db->insert(
                    "INSERT INTO documents (id, category, sno, document, information, link, status) 
                     VALUES (?, ?, ?, ?, ?, ?, 'Available')",
                    [
                        $id,
                        $mapping['category'],
                        $mapping['sno'],
                        $normalizedFilename,
                        $mapping['information'],
                        $documentLink
                    ]
                );
                echo "✅ Created: {$mapping['information']} ({$mapping['category']}, SNO: {$mapping['sno']}) -> $file\n";
                $created++;
            } catch (Exception $e) {
                echo "❌ Error creating {$mapping['information']}: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "\n=== Summary ===\n";
    echo "Created: $created documents\n";
    echo "Updated: $updated documents\n";
    echo "Skipped: $skipped files (no mapping)\n";
    echo "Total processed: " . count($files) . " files\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
