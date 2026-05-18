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
    ['documents', '1', 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', '#', 'Not Applicable', null],
    ['documents', '2', 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', 'https://drive.google.com/file/d/1_U-6Z0SzHIjsdmbgpCOYw6JG78fdbqEN/view?usp=drive_link', '✓ Available', null],
    ['documents', '3', 'NOC', 'https://drive.google.com/file/d/1Obc3UH55OKpTL4kH5lbSjP7qpg5X-9PH/view?usp=drive_link', '✓ Available', null],
    ['documents', '4', 'Recognition certificate under RTE Act 2009', 'https://drive.google.com/file/d/1Yoam5ydRykVBdFhWijlDroqwOec3Tymz/view?usp=drive_link', '✓ Available', null],
    ['documents', '5', 'Building Safety certificate', 'https://drive.google.com/file/d/1U6yscxWK7zWvXYKYR3g3lYtzHBp_dCxO/view?usp=drive_link', '✓ Available', null],
    ['documents', '6', 'Fire certificate', 'https://drive.google.com/file/d/1M3vYQvGBpwrgNfLs0Uw5h1qYBRR8lES0/view?usp=drive_link', '✓ Available', null],
    ['documents', '7', 'Self Certification', 'https://drive.google.com/file/d/1hCbN57rVw9TbogUmT6d2BiYVHkzEbonb/view?usp=drive_link', '✓ Available', null],
    ['documents', '8', 'Water Health & Sanitation certificate', 'https://drive.google.com/file/d/10fat_7Zt2tYlaHDM7zk8W5gjA0mev6Jg/view?usp=drive_link', '✓ Available', null],
    ['academic', '1', 'Fees structure', 'https://drive.google.com/file/d/1yl_zxhoXe0Yap2aNW5i2NNJ-sg4H-DVg/view?usp=drive_link', '✓ Available', 'general_academic'],
    ['academic', '2', 'Annual Academic Calendar', 'https://drive.google.com/file/d/1uzwqM4WR-vXV1u1Rtc4rBrzsBMoBYxMZ/view?usp=drive_link', '✓ Available', 'general_academic'],
    ['academic', '3', 'SMC List', 'https://drive.google.com/file/d/1-vKxoy3tJHrGGrHxWz5GUtTAlEOhvfxJ/view?usp=drive_link', '✓ Available', 'general_academic'],
    ['academic', '4', 'PTA', 'https://drive.google.com/file/d/1SZPc1SI2MtQHFtvgVlRtysI9xLc0NkSL/view?usp=drive_link', '✓ Available', 'general_academic'],
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
