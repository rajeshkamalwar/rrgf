<?php
/**
 * Apply RR Greenfield MPD content from rrgreen - Sheet1.csv to this database.
 * Run once on server: php database/apply_rrgreen_csv_seed.php
 */
require_once __DIR__ . '/../services/Database.php';
require_once __DIR__ . '/../services/DocumentsSchema.php';
require_once __DIR__ . '/../services/MpdDisclosureService.php';

$db = Database::getInstance();
DocumentsSchema::ensure($db);

$payload = MpdDisclosureService::getDefaultPayload();
MpdDisclosureService::savePayload($db, $payload);
echo "Saved MPD disclosure payload (schema V2, CSV order).\n";

$rows = [
    ['documents', '1', 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', '/documents/affiliation-letter.pdf', '✓ Available', null],
    ['documents', '2', 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', '/documents/trust-registration.pdf', '✓ Available', null],
    ['documents', '3', 'NOC', '/documents/noc.pdf', '✓ Available', null],
    ['documents', '4', 'Recognition certificate under RTE Act 2009', '/documents/recognition-certificate-rte.pdf', '✓ Available', null],
    ['documents', '5', 'Building Safety certificate', '/documents/building-safety-certificate.pdf', '✓ Available', null],
    ['documents', '6', 'Fire Safety certificate', '/documents/fire-safety-certificate.pdf', '✓ Available', null],
    ['documents', '7', 'Self Certification', '/documents/self-certification.pdf', '✓ Available', null],
    ['documents', '8', 'Water Health & Sanitation certificate', '/documents/water-health-and-sanitation-certificate.pdf', '✓ Available', null],
    ['academic', '1', 'Fees structure', '/documents/fees-structure.pdf', '✓ Available', 'general_academic'],
    ['academic', '2', 'Annual Academic Calendar', '/documents/academic-calendar.pdf', '✓ Available', 'general_academic'],
    ['academic', '3', 'SMC List', '/documents/smc-list.pdf', '✓ Available', 'general_academic'],
    ['academic', '4', 'PTA', '/documents/pta.pdf', '✓ Available', 'general_academic'],
    ['academic', '5', 'Last 3 yrs Result of the board examination as per applicability', '#', 'Not Applicable', 'general_academic'],
];

$pdo = $db->getConnection();
$updated = 0;
$inserted = 0;

foreach ($rows as [$cat, $sno, $info, $link, $status, $seg]) {
    $existing = $db->fetchOne(
        'SELECT id FROM documents WHERE category = ? AND sno = ? LIMIT 1',
        [$cat, $sno]
    );
    $sortOrder = (int) $sno * 10;
    $hidden = 0;
    if ($existing) {
        $db->execute(
            'UPDATE documents SET information = ?, document = ?, link = ?, status = ?, segment_id = ?, sort_order = ?, hidden_from_public = ? WHERE id = ?',
            [$info, $info, $link, $status, $seg, $sortOrder, $hidden, $existing['id']]
        );
        $updated++;
    } else {
        $id = substr($cat, 0, 4) . '-' . uniqid();
        $db->insert(
            'INSERT INTO documents (id, category, segment_id, sno, document, information, link, status, sort_order, hidden_from_public)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [$id, $cat, $seg, $sno, $info, $info, $link, $status, $sortOrder, $hidden]
        );
        $inserted++;
    }
}

echo "Documents: updated $updated, inserted $inserted.\n";
echo "Done. Hard-refresh https://rrgreenfieldmadhepura.in/mandatory-public-disclosure\n";
