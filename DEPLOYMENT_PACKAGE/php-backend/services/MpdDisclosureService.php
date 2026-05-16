<?php

/**
 * CBSE Appendix-IX style mandatory public disclosure payload (single-school row JSON).
 */

class MpdDisclosureService
{
    public static function tableExists($db): bool
    {
        try {
            $row = $db->fetchOne("SHOW TABLES LIKE 'mpd_disclosure'");
            return $row !== false;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function getDefaultPayload(): array
    {
        return [
            'sectionA' => [
                ['sno' => '1', 'information' => 'NAME OF THE SCHOOL', 'details' => 'RR GREENFIELD INTERNATIONAL SCHOOL'],
                ['sno' => '2', 'information' => 'AFFILIATION NO. (IF APPLICABLE)', 'details' => 'As applicable / update from affiliation letter'],
                ['sno' => '3', 'information' => 'SCHOOL CODE (IF APPLICABLE)', 'details' => '21311612021919150645'],
                ['sno' => '4', 'information' => 'COMPLETE ADDRESS WITH PIN CODE', 'details' => 'New bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar'],
                ['sno' => '5', 'information' => 'NAME OF PRINCIPAL', 'details' => 'Rakesh Ranjan'],
                ['sno' => '6', 'information' => 'PRINCIPAL QUALIFICATION', 'details' => 'M.A., B.Ed.'],
                ['sno' => '7', 'information' => 'SCHOOL EMAIL ID', 'details' => 'rrgreenfieldsch@gmail.com'],
                ['sno' => '8', 'information' => 'CONTACT DETAILS (MOBILE)', 'details' => '7903059909, 8210215818'],
            ],
            'staff' => [
                'pgt' => 0,
                'tgt' => 6,
                'prt' => 8,
                'teacherSectionRatio' => '1:1.5',
                'specialEducator' => 1,
                'counsellor' => 1,
            ],
            'teacherListUrl' => '',
            'infrastructure' => [
                'campusAreaSqMtr' => 6070.28,
                'classroomCount' => 22,
                'classroomSizeSqMtr' => 47,
                'labCount' => 6,
                'labSizeSqMtr' => 56,
                'internetFacility' => true,
                'girlsToilets' => 14,
                'boysToilets' => 16,
                /** CBSE SARAS uploads often contain malformed text like "wwwyoutubecom"; leave empty until a valid inspection URL exists */
                'youtubeInspectionUrl' => '',
                'additionalFacilities' => 'Library: 112 sq mtr, Sick Room: 33 sq mtr, Sports & Games Room: 119 sq mtr, Arts & Music Room: 32 sq mtr',
                'infrastructureDocLink' => '/documents/infradoc.jpeg',
            ],
            'results' => [
                'classX' => [
                    'doesNotOffer' => true,
                    'remark' => 'NA',
                    'rows' => [
                        ['year' => '', 'registered' => 0, 'passed' => 0, 'remarks' => 'NA'],
                    ],
                ],
                'classXII' => [
                    'doesNotOffer' => true,
                    'remark' => 'NA',
                    'rows' => [
                        ['year' => '', 'registered' => 0, 'passed' => 0, 'remarks' => 'NA'],
                    ],
                ],
            ],
            'legalDisclaimer' => 'Note: THE SCHOOL NEEDS TO UPLOAD SELF-ATTESTED COPIES OF ABOVE LISTED DOCUMENTS BY CHAIRMAN/MANAGER/SECRETARY AND PRINCIPAL. IN CASE IT IS NOTICED AT LATER STAGE THAT UPLOADED DOCUMENTS ARE NOT GENUINE THEN SCHOOL SHALL BE LIABLE FOR ACTION AS PER NORMS.',
            /** Reference: CBSE/MPD/AFF./2026 — adjust if needed after official communication */
            'complianceDeadline' => '2026-05-21',
            /** Directive date from CBSE communication */
            'directiveReference' => 'CBSE/MPD/AFF./2026 dated 06.05.2026',
        ];
    }

    /**
     * Return normalized https URL if it looks like a real YouTube inspection link; otherwise empty string.
     * Accepts youtube.com (any subdomain), youtu.be, with or without a path segment.
     */
    public static function sanitizeYoutubeInspectionUrl(?string $raw): string
    {
        $s = trim((string) $raw);
        if ($s === '') {
            return '';
        }
        $squash = strtolower(preg_replace('/[\s\.:\/\-]+/', '', $s));
        if ($squash === 'wwwyoutubecom' || $squash === 'youtube') {
            return '';
        }
        if (!preg_match('#^https?://#i', $s)) {
            $s = 'https://' . ltrim($s, '/');
        }
        $s = preg_replace('#^http://#i', 'https://', $s);
        if (!preg_match('#^https://#i', $s)) {
            return '';
        }
        $u = parse_url($s);
        if (!is_array($u) || empty($u['host'])) {
            return '';
        }
        $host = strtolower($u['host']);
        /** youtu.be (short links) */
        if ($host === 'youtu.be') {
            return $s;
        }
        /** youtube.com including m., www., music., etc. */
        if ($host === 'youtube.com' || (strlen($host) > 11 && substr($host, -11) === '.youtube.com')) {
            return $s;
        }

        return '';
    }

    public static function loadPayload(Database $db): array
    {
        if (!self::tableExists($db)) {
            return self::getDefaultPayload();
        }
        $row = $db->fetchOne('SELECT payload_json FROM mpd_disclosure WHERE id = 1');
        if (!$row || empty($row['payload_json'])) {
            $defaults = self::getDefaultPayload();
            self::savePayload($db, $defaults);
            return $defaults;
        }
        $decoded = json_decode($row['payload_json'], true);
        if (!is_array($decoded)) {
            return self::getDefaultPayload();
        }
        return self::mergeWithDefaults($decoded);
    }

    /** Deep-merge missing keys using defaults without overwriting intentional empty strings unnecessarily */
    private static function mergeWithDefaults(array $incoming): array
    {
        $defaults = self::getDefaultPayload();
        $merged = array_replace_recursive($defaults, $incoming);
        $merged['infrastructure']['youtubeInspectionUrl'] = self::sanitizeYoutubeInspectionUrl($merged['infrastructure']['youtubeInspectionUrl'] ?? '');
        return $merged;
    }

    /**
     * @param array|null $incoming partial or full disclosure object from admin
     */
    public static function savePayload(Database $db, ?array $incoming): array
    {
        if (!self::tableExists($db)) {
            throw new Exception('mpd_disclosure table not found — run database migration.');
        }
        $current = self::mergeWithDefaults(self::decodeRow($db));
        if (!$incoming || !count($incoming)) {
            throw new Exception('Nothing to save');
        }
        $merged = array_replace_recursive($current, $incoming);
        $merged['infrastructure']['youtubeInspectionUrl'] = self::sanitizeYoutubeInspectionUrl($merged['infrastructure']['youtubeInspectionUrl'] ?? '');
        $json = json_encode($merged, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $existing = $db->fetchOne('SELECT id FROM mpd_disclosure WHERE id = 1');
        if ($existing) {
            $db->execute('UPDATE mpd_disclosure SET payload_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1', [$json]);
        } else {
            $db->insert('INSERT INTO mpd_disclosure (id, payload_json) VALUES (1, ?)', [$json]);
        }
        return $merged;
    }

    private static function decodeRow(Database $db): array
    {
        $row = $db->fetchOne('SELECT payload_json FROM mpd_disclosure WHERE id = 1');
        if (!$row || empty($row['payload_json'])) {
            return [];
        }
        $decoded = json_decode($row['payload_json'], true);
        return is_array($decoded) ? $decoded : [];
    }

    public static function updatedAt(Database $db): ?string
    {
        if (!self::tableExists($db)) {
            return null;
        }
        $row = $db->fetchOne('SELECT updated_at FROM mpd_disclosure WHERE id = 1');
        return $row['updated_at'] ?? null;
    }
}
