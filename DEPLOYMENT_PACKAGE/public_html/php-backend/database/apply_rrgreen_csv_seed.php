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
    ['documents', '1', 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', 'https://rrgreenfieldmadhepura.in/documents/Affiliation%20Letter.pdf', '✓ Available', null],
    ['documents', '2', 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', 'https://rrgreenfieldmadhepura.in/documents/TRUST%20REG.pdf', '✓ Available', null],
    ['documents', '3', 'NOC', 'https://rrgreenfieldmadhepura.in/documents/NOC.pdf', '✓ Available', null],
    ['documents', '4', 'Recognition certificate under RTE Act 2009', 'https://rrgreenfieldmadhepura.in/documents/RECOGNITION%20CERTIFICATE%20(RTE).pdf', '✓ Available', null],
    ['documents', '5', 'Building Safety certificate', 'https://rrgreenfieldmadhepura.in/documents/Building%20Safety%20certificate.pdf', '✓ Available', null],
    ['documents', '6', 'Fire Safety certificate', 'https://rrgreenfieldmadhepura.in/documents/Fire%20Safety%20Certificate.pdf', '✓ Available', null],
    ['documents', '7', 'Self Certification', 'https://rrgreenfieldmadhepura.in/documents/SELF%20CERTIFICATION.pdf', '✓ Available', null],
    ['documents', '8', 'Water Health & Sanitation certificate', 'https://rrgreenfieldmadhepura.in/documents/WATER%20HEALTH%20AND%20SANITATION%20CERTIFICATE.pdf', '✓ Available', null],
    ['academic', '1', 'Fees structure', 'https://rrgreenfieldmadhepura.in/documents/Fees%20Structure.pdf', '✓ Available', 'general_academic'],
    ['academic', '2', 'Annual Academic Calendar', 'https://rrgreenfieldmadhepura.in/documents/Annual%20Academic%20Calendar.pdf', '✓ Available', 'general_academic'],
    ['academic', '3', 'SMC List', 'https://rrgreenfieldmadhepura.in/documents/SMC%20List.pdf', '✓ Available', 'general_academic'],
    ['academic', '4', 'PTA', 'https://rrgreenfieldmadhepura.in/documents/PTA.pdf', '✓ Available', 'general_academic'],
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
