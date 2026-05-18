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
            'documentSections' => self::getDefaultDocumentSections(),
        ];
    }

    /** Configurable document sections (B/C/E + custom) with optional segments for mapping rows. */
    public static function getDefaultDocumentSections(): array
    {
        return [
            [
                'id' => 'documents',
                'letter' => 'B',
                'title' => 'Documents and Information',
                'sortOrder' => 1,
                'segments' => [
                    [
                        'id' => 'compliance',
                        'label' => 'Compliance & certificates',
                        'sortOrder' => 1,
                        'keywords' => ['fire', 'building', 'sanitary', 'trust', 'affidavit', 'recognition', 'noc'],
                    ],
                    [
                        'id' => 'governance',
                        'label' => 'Governance & committees',
                        'sortOrder' => 2,
                        'keywords' => ['smc', 'pta', 'management committee', 'self certification'],
                    ],
                ],
            ],
            [
                'id' => 'academic',
                'letter' => 'C',
                'title' => 'Result and Academics',
                'sortOrder' => 2,
                'segments' => [
                    [
                        'id' => 'class_x',
                        'label' => 'Class X',
                        'sortOrder' => 1,
                        'keywords' => ['class x', 'class-x', '10th'],
                    ],
                    [
                        'id' => 'class_xii',
                        'label' => 'Class XII',
                        'sortOrder' => 2,
                        'keywords' => ['class xii', 'class 12', '12th', 'senior secondary'],
                    ],
                    [
                        'id' => 'general_academic',
                        'label' => 'General academic',
                        'sortOrder' => 3,
                        'keywords' => ['fee', 'calendar', 'result', 'academic'],
                    ],
                ],
            ],
            [
                'id' => 'infrastructure',
                'letter' => 'E',
                'title' => 'School Infrastructure',
                'sortOrder' => 3,
                'segments' => [],
            ],
        ];
    }

    public static function normalizeDocumentSections($sections): array
    {
        if (!is_array($sections)) {
            return self::getDefaultDocumentSections();
        }
        $out = [];
        foreach ($sections as $sec) {
            if (!is_array($sec)) {
                continue;
            }
            $id = self::slugifySectionId((string) ($sec['id'] ?? $sec['title'] ?? ''));
            if ($id === '') {
                continue;
            }
            $segments = [];
            if (!empty($sec['segments']) && is_array($sec['segments'])) {
                foreach ($sec['segments'] as $seg) {
                    if (!is_array($seg)) {
                        continue;
                    }
                    $segId = self::slugifySectionId((string) ($seg['id'] ?? $seg['label'] ?? ''));
                    if ($segId === '') {
                        continue;
                    }
                    $kw = [];
                    if (!empty($seg['keywords']) && is_array($seg['keywords'])) {
                        foreach ($seg['keywords'] as $k) {
                            $k = trim((string) $k);
                            if ($k !== '') {
                                $kw[] = $k;
                            }
                        }
                    }
                    $segments[] = [
                        'id' => $segId,
                        'label' => trim((string) ($seg['label'] ?? $segId)),
                        'sortOrder' => (int) ($seg['sortOrder'] ?? count($segments) + 1),
                        'keywords' => $kw,
                    ];
                }
            }
            usort($segments, static function ($a, $b) {
                return ($a['sortOrder'] ?? 0) <=> ($b['sortOrder'] ?? 0);
            });
            $out[] = [
                'id' => $id,
                'letter' => strtoupper(substr(trim((string) ($sec['letter'] ?? '')), 0, 3)),
                'title' => trim((string) ($sec['title'] ?? $id)),
                'sortOrder' => (int) ($sec['sortOrder'] ?? count($out) + 1),
                'segments' => $segments,
            ];
        }
        if (count($out) === 0) {
            return self::getDefaultDocumentSections();
        }
        usort($out, static function ($a, $b) {
            return ($a['sortOrder'] ?? 0) <=> ($b['sortOrder'] ?? 0);
        });
        return $out;
    }

    public static function slugifySectionId(string $raw): string
    {
        $s = strtolower(trim($raw));
        $s = preg_replace('/[^a-z0-9]+/', '_', $s);
        $s = trim($s, '_');
        return substr($s, 0, 64);
    }

    /** @return string[] */
    public static function allowedCategoryIds(array $payload): array
    {
        $sections = self::normalizeDocumentSections($payload['documentSections'] ?? []);
        return array_values(array_map(static function ($s) {
            return $s['id'];
        }, $sections));
    }

    public static function isAllowedCategory(array $payload, string $category): bool
    {
        $category = self::slugifySectionId($category);
        return in_array($category, self::allowedCategoryIds($payload), true);
    }

    public static function isValidSegmentForCategory(array $payload, string $category, ?string $segmentId): bool
    {
        if ($segmentId === null || $segmentId === '') {
            return true;
        }
        $category = self::slugifySectionId($category);
        $segmentId = self::slugifySectionId($segmentId);
        foreach (self::normalizeDocumentSections($payload['documentSections'] ?? []) as $sec) {
            if ($sec['id'] !== $category) {
                continue;
            }
            foreach ($sec['segments'] as $seg) {
                if ($seg['id'] === $segmentId) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    /** Keyword-based segment mapping for new/updated document titles. */
    public static function suggestSegmentId(array $payload, string $category, string $title): ?string
    {
        $category = self::slugifySectionId($category);
        $sections = self::normalizeDocumentSections($payload['documentSections'] ?? []);
        $hay = strtolower($title);
        foreach ($sections as $sec) {
            if ($sec['id'] !== $category || empty($sec['segments'])) {
                continue;
            }
            foreach ($sec['segments'] as $seg) {
                foreach ($seg['keywords'] ?? [] as $kw) {
                    if ($kw !== '' && strpos($hay, strtolower($kw)) !== false) {
                        return $seg['id'];
                    }
                }
            }
        }
        return null;
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
        $merged['documentSections'] = self::normalizeDocumentSections($merged['documentSections'] ?? []);
        if (!empty($merged['sectionA']) && is_array($merged['sectionA'])) {
            $merged['sectionA'] = self::normalizeSectionARows($merged['sectionA']);
        }
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
        $merged['documentSections'] = self::normalizeDocumentSections($merged['documentSections'] ?? []);
        if (!empty($merged['sectionA']) && is_array($merged['sectionA'])) {
            $merged['sectionA'] = self::normalizeSectionARows($merged['sectionA']);
        }
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

    public static function normalizeSectionARows(array $rows): array
    {
        $out = [];
        $n = 1;
        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }
            $info = trim((string) ($row['information'] ?? ''));
            if ($info === '') {
                continue;
            }
            $out[] = [
                'sno' => (string) ($row['sno'] ?? $n),
                'information' => $info,
                'details' => (string) ($row['details'] ?? ''),
            ];
            $n++;
        }
        return $out;
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
