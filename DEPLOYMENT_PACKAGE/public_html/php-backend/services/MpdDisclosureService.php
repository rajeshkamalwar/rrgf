<?php

/**
 * CBSE Appendix-IX style mandatory public disclosure payload (single-school row JSON).
 * Schema V2: unified `sections[]` array (schemaVersion 2).
 */

class MpdDisclosureService
{
    private const RRGREEN_TEACHER_LIST_URL =
        'https://teams.microsoft.com/l/message/19:61637882c7c9415f8d997814ecca0102@thread.v2/1779111399666?context=%7B%22contextType%22%3A%22chat%22%7D';

    private const MPD_YOUTUBE_INSPECTION_LABEL =
        'LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL (INFRASTRUCTURE)';

    public static function tableExists($db): bool
    {
        try {
            $row = $db->fetchOne("SHOW TABLES LIKE 'mpd_disclosure'");
            return $row !== false;
        } catch (Exception $e) {
            return false;
        }
    }

    /** RR Greenfield CSV seed (rrgreen - Sheet1.csv). */
    private static function getLegacyV1Defaults(): array
    {
        return [
            'sectionA' => [
                ['sno' => '1', 'information' => 'NAME OF THE SCHOOL', 'details' => 'RR GREENFIELD INTERNATIONAL SCHOOL'],
                ['sno' => '2', 'information' => 'AFFILIATION NO. (IF APPLICABLE)', 'details' => '331348'],
                ['sno' => '3', 'information' => 'SCHOOL CODE (IF APPLICABLE)', 'details' => '67201'],
                ['sno' => '4', 'information' => 'COMPLETE ADDRESS WITH PIN CODE', 'details' => 'New bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar'],
                ['sno' => '5', 'information' => 'NAME OF PRINCIPAL', 'details' => 'Rakesh Ranjan'],
                ['sno' => '6', 'information' => 'PRINCIPAL QUALIFICATION', 'details' => 'M.A., B.Ed.'],
                ['sno' => '7', 'information' => 'SCHOOL EMAIL ID', 'details' => 'rrgreenfieldsch@gmail.com'],
                ['sno' => '8', 'information' => 'CONTACT DETAILS (MOBILE)', 'details' => '8210215818, 7903059909'],
            ],
            'staff' => [
                'principal' => 'Rakesh Ranjan',
                'pgt' => 0,
                'tgt' => 6,
                'prt' => 8,
                'teacherSectionRatio' => '1:1.5',
                'specialEducator' => 1,
                'specialEducatorDetails' => 'REENA VISHVAKARMA — D.el.ed (VI), B.ed (special education), MA (social studies) pursuing, CTET qualified, MOB: 6296960455, VI Diploma in visual impairment',
                'counsellor' => 1,
                'counsellorDetails' => 'PAWAN KUMAR RAJ — PG IN PSYCHOLOGY, MOB: 8603119206',
            ],
            'teacherListUrl' => 'https://teams.microsoft.com/l/message/19:61637882c7c9415f8d997814ecca0102@thread.v2/1779111399666?context=%7B%22contextType%22%3A%22chat%22%7D',
            'infrastructure' => [
                'campusAreaSqMtr' => 6070.28,
                'classroomCount' => 22,
                'classroomSizeSqMtr' => 47,
                'labCount' => 6,
                'labSizeSqMtr' => 56,
                'internetFacility' => true,
                'girlsToilets' => 14,
                'boysToilets' => 16,
                'youtubeInspectionUrl' => 'https://youtu.be/iVS2A1JErCQ?si=_Vq3haCLWnUSJkFV',
                'teachersListUrl' => 'https://drive.google.com/file/d/1Fp_vaPgAbnS6Xrw_BH3Ndb-LDdQFzZnd/view?usp=drive_link',
                'infrastructureDocLink' => '',
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
            'complianceDeadline' => '2026-05-21',
            'directiveReference' => 'CBSE/MPD/AFF./2026 dated 06.05.2026',
            'documentSections' => self::getDefaultDocumentSections(),
        ];
    }

    public static function getDefaultPayload(): array
    {
        return self::migrateV1toV2(self::getLegacyV1Defaults());
    }

    public static function isSchemaV2(array $payload): bool
    {
        return (int) ($payload['schemaVersion'] ?? 0) === 2
            && isset($payload['sections'])
            && is_array($payload['sections']);
    }

    /** Convert V1 flat payload to V2 sections[] payload. */
    public static function migrateV1toV2(array $v1): array
    {
        $docSecs = self::normalizeDocumentSections($v1['documentSections'] ?? []);
        $legal = trim((string) ($v1['legalDisclaimer'] ?? ''));
        if ($legal === '') {
            $legal = self::getLegacyV1Defaults()['legalDisclaimer'];
        }
        $deadline = (string) ($v1['complianceDeadline'] ?? '2026-05-21');
        $directive = (string) ($v1['directiveReference'] ?? 'CBSE/MPD/AFF./2026 dated 06.05.2026');

        $infra = is_array($v1['infrastructure'] ?? null) ? $v1['infrastructure'] : [];
        $infraPack = self::infrastructureObjectToInfraTable($infra);

        $staff = is_array($v1['staff'] ?? null) ? $v1['staff'] : [];
        $teacherList = isset($v1['teacherListUrl']) ? trim((string) $v1['teacherListUrl']) : '';
        if ($teacherList === '' && isset($infra['teachersListUrl'])) {
            $teacherList = trim((string) $infra['teachersListUrl']);
        }
        if ($teacherList === '') {
            $teacherList = self::RRGREEN_TEACHER_LIST_URL;
        }

        $sections = [];
        $order = 1;

        $sections[] = [
            'id' => 'general_information',
            'letter' => 'A',
            'title' => 'General Information',
            'sortOrder' => $order++,
            'type' => 'table',
            'visible' => true,
            'fields' => self::sectionAToFields($v1['sectionA'] ?? []),
        ];

        foreach ($docSecs as $ds) {
            if (($ds['id'] ?? '') === 'infrastructure') {
                continue;
            }
            $sections[] = [
                'id' => $ds['id'],
                'letter' => $ds['letter'],
                'title' => $ds['title'],
                'sortOrder' => $order++,
                'type' => 'document_list',
                'visible' => true,
                'segments' => $ds['segments'],
            ];
        }

        $sections[] = [
            'id' => 'staff_teaching',
            'letter' => 'D',
            'title' => 'Staff (Teaching)',
            'sortOrder' => $order++,
            'type' => 'staff_table',
            'visible' => true,
            'staffFields' => self::staffObjectToFields($staff),
            'teacherListUrl' => $teacherList,
        ];

        $sections[] = [
            'id' => 'results',
            'letter' => '',
            'title' => 'Board exam results (Class X & XII)',
            'sortOrder' => $order++,
            'type' => 'result_table',
            'visible' => true,
            'classes' => self::resultsToClasses($v1['results'] ?? []),
            'supportingDocsCategoryId' => 'academic',
        ];

        $sections[] = [
            'id' => 'infrastructure_numeric',
            'letter' => 'E',
            'title' => 'School Infrastructure (parameters)',
            'sortOrder' => $order++,
            'type' => 'infra_table',
            'visible' => true,
            'infraFields' => $infraPack['fields'],
            'youtubeInspectionUrl' => $infraPack['youtube'],
            'infraDocLink' => $infraPack['infraDocLink'],
        ];

        return [
            'schemaVersion' => 2,
            'sections' => $sections,
            'legalDisclaimer' => $legal,
            'complianceDeadline' => $deadline,
            'directiveReference' => $directive,
        ];
    }

    private static function inferFieldType(string $label): string
    {
        $u = strtoupper($label);
        if (strpos($u, 'EMAIL') !== false) {
            return 'email';
        }
        if (strpos($u, 'CONTACT') !== false || strpos($u, 'MOBILE') !== false || strpos($u, 'PHONE') !== false) {
            return 'phone';
        }
        if (strpos($u, 'ADDRESS') !== false || strpos($u, 'PIN') !== false) {
            return 'address';
        }
        if (strpos($u, 'URL') !== false || strpos($u, 'WEBSITE') !== false) {
            return 'url';
        }

        return 'text';
    }

    /** @return array<int, array<string, mixed>> */
    private static function sectionAToFields($rows): array
    {
        if (!is_array($rows)) {
            return [];
        }
        $out = [];
        $n = 1;
        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }
            $label = trim((string) ($row['information'] ?? ''));
            if ($label === '') {
                continue;
            }
            $sno = (string) ($row['sno'] ?? $n);
            $id = self::slugifySectionId($sno) ?: ('row_' . $n);
            $out[] = [
                'id' => $id,
                'label' => $label,
                'value' => (string) ($row['details'] ?? ''),
                'type' => self::inferFieldType($label),
            ];
            $n++;
        }

        return $out;
    }

    /** @return array<int, array<string, mixed>> */
    private static function staffObjectToFields(array $s): array
    {
        $out = [];
        $principal = trim((string) ($s['principal'] ?? ''));
        if ($principal !== '') {
            $out[] = ['id' => 'principal', 'label' => 'Principal', 'value' => $principal, 'type' => 'text'];
        }
        $defs = [
            ['id' => 'pgt', 'label' => 'a) PGT', 'key' => 'pgt'],
            ['id' => 'tgt', 'label' => 'b) TGT', 'key' => 'tgt'],
            ['id' => 'prt', 'label' => 'c) PRT', 'key' => 'prt'],
            ['id' => 'teacherSectionRatio', 'label' => 'Teachers Section Ratio', 'key' => 'teacherSectionRatio'],
            ['id' => 'specialEducator', 'label' => 'Special Educator', 'key' => 'specialEducator'],
        ];
        foreach ($defs as $d) {
            $key = $d['key'];
            $val = $s[$key] ?? ($key === 'teacherSectionRatio' ? '1:1.5' : 0);
            $out[] = [
                'id' => $d['id'],
                'label' => $d['label'],
                'value' => (string) $val,
                'type' => $key === 'teacherSectionRatio' ? 'text' : 'number',
            ];
        }
        $specDet = trim((string) ($s['specialEducatorDetails'] ?? ''));
        if ($specDet !== '') {
            $out[] = [
                'id' => 'special_educator_details',
                'label' => 'Special Educator (details)',
                'value' => $specDet,
                'type' => 'text',
            ];
        }
        $out[] = [
            'id' => 'counsellor',
            'label' => 'Counsellor / Wellness Teacher',
            'value' => (string) ($s['counsellor'] ?? 0),
            'type' => 'number',
        ];
        $counsDet = trim((string) ($s['counsellorDetails'] ?? ''));
        if ($counsDet !== '') {
            $out[] = [
                'id' => 'counsellor_details',
                'label' => 'Counsellor / Wellness Teacher (details)',
                'value' => $counsDet,
                'type' => 'text',
            ];
        }

        return $out;
    }

    /** @return array{fields: array<int,array<string,mixed>>, youtube: string, infraDocLink: string} */
    private static function infrastructureObjectToInfraTable(array $i): array
    {
        $yt = (string) ($i['youtubeInspectionUrl'] ?? '');
        $doc = (string) ($i['infrastructureDocLink'] ?? '');
        $labCount = $i['labCount'] ?? 0;
        $labPad = str_pad((string) $labCount, 2, '0', STR_PAD_LEFT);

        $fields = [
            [
                'id' => 'campus_area_sq_mtr',
                'label' => 'TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR)',
                'value' => (string) ($i['campusAreaSqMtr'] ?? ''),
                'type' => 'number',
            ],
            [
                'id' => 'classrooms',
                'label' => 'NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)',
                'value' => ($i['classroomCount'] ?? '') . ' (each ' . ($i['classroomSizeSqMtr'] ?? '') . ' sq mtr)',
                'type' => 'text',
            ],
            [
                'id' => 'labs',
                'label' => 'NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)',
                'value' => $labPad . ' (each ' . ($i['labSizeSqMtr'] ?? '') . ' sq mtr)',
                'type' => 'text',
            ],
            [
                'id' => 'internet_facility',
                'label' => 'INTERNET FACILITY',
                'value' => !empty($i['internetFacility']) ? 'true' : 'false',
                'type' => 'boolean',
            ],
            [
                'id' => 'girls_toilets',
                'label' => 'NO. OF GIRLS TOILETS',
                'value' => (string) ($i['girlsToilets'] ?? ''),
                'type' => 'number',
            ],
            [
                'id' => 'boys_toilets',
                'label' => 'NO. OF BOYS TOILETS',
                'value' => (string) ($i['boysToilets'] ?? ''),
                'type' => 'number',
            ],
        ];
        $ytValue = trim($yt) !== '' ? trim($yt) : 'https://youtu.be/iVS2A1JErCQ?si=_Vq3haCLWnUSJkFV';
        $fields[] = [
            'id' => 'youtube_inspection',
            'label' => self::MPD_YOUTUBE_INSPECTION_LABEL,
            'value' => $ytValue,
            'type' => 'url',
        ];
        $teachersList = trim((string) ($i['teachersListUrl'] ?? ''));
        if ($teachersList !== '') {
            $fields[] = [
                'id' => 'teachers_list',
                'label' => 'TEACHERS LIST',
                'value' => $teachersList,
                'type' => 'url',
            ];
        }
        $extra = trim((string) ($i['additionalFacilities'] ?? ''));
        if ($extra !== '') {
            $fields[] = [
                'id' => 'additional_facilities',
                'label' => 'ADDITIONAL FACILITIES (AS APPLICABLE)',
                'value' => $extra,
                'type' => 'text',
            ];
        }

        return [
            'fields' => self::reorderInfraDisplayFields($fields, $ytValue),
            'youtube' => $ytValue,
            'infraDocLink' => $doc,
        ];
    }

    /**
     * CSV order: parameters 1–6, YouTube (7), Teachers list (8).
     *
     * @param array<int, array<string, mixed>> $fields
     *
     * @return array<int, array<string, mixed>>
     */
    private static function reorderInfraDisplayFields(array $fields, string $youtubeUrl): array
    {
        $coreIds = [
            'campus_area_sq_mtr',
            'classrooms',
            'labs',
            'internet_facility',
            'girls_toilets',
            'boys_toilets',
        ];
        $byId = [];
        foreach ($fields as $f) {
            if (is_array($f) && isset($f['id'])) {
                $byId[(string) $f['id']] = $f;
            }
        }
        $out = [];
        foreach ($coreIds as $id) {
            if (isset($byId[$id])) {
                $out[] = $byId[$id];
            }
        }
        $ytValue = trim($youtubeUrl) !== '' ? trim($youtubeUrl) : 'https://youtu.be/iVS2A1JErCQ?si=_Vq3haCLWnUSJkFV';
        $youtube = $byId['youtube_inspection'] ?? [
            'id' => 'youtube_inspection',
            'label' => self::MPD_YOUTUBE_INSPECTION_LABEL,
            'value' => $ytValue,
            'type' => 'url',
        ];
        if (trim((string) ($youtube['value'] ?? '')) === '') {
            $youtube['value'] = $ytValue;
        }
        $tailIds = array_merge($coreIds, ['youtube_inspection', 'teachers_list', 'additional_facilities']);
        foreach ($fields as $f) {
            if (!is_array($f) || !isset($f['id'])) {
                continue;
            }
            $id = (string) $f['id'];
            if (!in_array($id, $tailIds, true)) {
                $out[] = $f;
            }
        }
        $out[] = $youtube;
        if (isset($byId['teachers_list'])) {
            $out[] = $byId['teachers_list'];
        }
        if (isset($byId['additional_facilities'])) {
            $out[] = $byId['additional_facilities'];
        }

        return $out;
    }

    /** @return array<int, array<string, mixed>> */
    private static function resultsToClasses($results): array
    {
        if (!is_array($results)) {
            $results = [];
        }
        $cx = is_array($results['classX'] ?? null) ? $results['classX'] : [];
        $cxii = is_array($results['classXII'] ?? null) ? $results['classXII'] : [];
        if (!$cxii && is_array($results['class XII'] ?? null)) {
            $cxii = $results['class XII'];
        }

        $rowFrom = static function ($o, $fallback) {
            $rows = is_array($o['rows'] ?? null) ? $o['rows'] : [];
            $first = is_array($rows[0] ?? null) ? $rows[0] : [];

            return [
                'year' => (string) ($first['year'] ?? $fallback['year']),
                'registered' => (int) ($first['registered'] ?? $fallback['registered']),
                'passed' => (int) ($first['passed'] ?? $fallback['passed']),
                'remarks' => (string) ($first['remarks'] ?? $fallback['remarks']),
            ];
        };
        $fb = ['year' => '', 'registered' => 0, 'passed' => 0, 'remarks' => 'NA'];

        return [
            [
                'id' => 'class_x',
                'label' => 'RESULT: CLASS X',
                'doesNotOffer' => !empty($cx['doesNotOffer']),
                'remark' => (string) ($cx['remark'] ?? 'NA'),
                'rows' => [$rowFrom($cx, $fb)],
            ],
            [
                'id' => 'class_xii',
                'label' => 'RESULT: CLASS XII',
                'doesNotOffer' => !empty($cxii['doesNotOffer']),
                'remark' => (string) ($cxii['remark'] ?? 'NA'),
                'rows' => [$rowFrom($cxii, $fb)],
            ],
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
                        'keywords' => ['fee', 'calendar', 'result', 'academic', 'smc', 'pta'],
                    ],
                ],
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

    /**
     * Document categories allowed for uploads — every `document_list` section id.
     *
     * @return string[]
     */
    public static function allowedCategoryIds(array $payload): array
    {
        $sections = self::documentSectionsFromPayload($payload);

        return array_values(array_map(static function ($s) {
            return $s['id'];
        }, $sections));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function documentSectionsFromPayload(array $payload): array
    {
        if (self::isSchemaV2($payload)) {
            $out = [];
            foreach ($payload['sections'] as $sec) {
                if (!is_array($sec) || ($sec['type'] ?? '') !== 'document_list') {
                    continue;
                }
                $segRaw = $sec['segments'] ?? [];
                $tmp = [
                    'id' => self::slugifySectionId((string) ($sec['id'] ?? '')),
                    'letter' => (string) ($sec['letter'] ?? ''),
                    'title' => (string) ($sec['title'] ?? ''),
                    'sortOrder' => (int) ($sec['sortOrder'] ?? count($out) + 1),
                    'segments' => is_array($segRaw) ? $segRaw : [],
                ];
                if ($tmp['id'] === '') {
                    continue;
                }
                $out[] = $tmp;
            }

            return self::normalizeDocumentSections($out);
        }

        return self::normalizeDocumentSections($payload['documentSections'] ?? []);
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
        foreach (self::documentSectionsFromPayload($payload) as $sec) {
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
        $hay = strtolower($title);
        foreach (self::documentSectionsFromPayload($payload) as $sec) {
            if ($sec['id'] !== $category || empty($sec['segments'])) {
                continue;
            }
            foreach ($sec['segments'] as $seg) {
                foreach ($seg['keywords'] ?? [] as $kw) {
                    if ($kw !== '' && strpos($hay, strtolower((string) $kw)) !== false) {
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
        $host = preg_replace('/^www\./', '', $host);
        if ($host === 'youtu.be') {
            return $s;
        }
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

    private static function mergeWithDefaults(array $incoming): array
    {
        if (!self::isSchemaV2($incoming)) {
            $incoming = self::migrateV1toV2($incoming);
        }
        $defaults = self::getDefaultPayload();
        $merged = $incoming;
        if (trim((string) ($merged['legalDisclaimer'] ?? '')) === '') {
            $merged['legalDisclaimer'] = $defaults['legalDisclaimer'];
        }
        if (trim((string) ($merged['complianceDeadline'] ?? '')) === '') {
            $merged['complianceDeadline'] = $defaults['complianceDeadline'];
        }
        if (trim((string) ($merged['directiveReference'] ?? '')) === '') {
            $merged['directiveReference'] = $defaults['directiveReference'];
        }
        if (empty($merged['sections']) || !is_array($merged['sections'])) {
            $merged['sections'] = $defaults['sections'];
        } else {
            $merged['sections'] = self::normalizeSectionsV2($merged['sections']);
        }
        $merged['schemaVersion'] = 2;
        foreach ($merged['sections'] as &$sec) {
            if (!is_array($sec)) {
                continue;
            }
            if (($sec['type'] ?? '') === 'infra_table') {
                $sec['youtubeInspectionUrl'] = self::sanitizeYoutubeInspectionUrl($sec['youtubeInspectionUrl'] ?? '');
            }
        }
        unset($sec);

        return $merged;
    }

    /**
     * @param array<int, array<string, mixed>> $sections
     *
     * @return array<int, array<string, mixed>>
     */
    private static function normalizeSectionsV2(array $sections): array
    {
        $out = [];
        foreach ($sections as $i => $sec) {
            if (!is_array($sec)) {
                continue;
            }
            $out[] = self::normalizeOneSection($sec, $i);
        }
        usort($out, static function ($a, $b) {
            return ($a['sortOrder'] ?? 0) <=> ($b['sortOrder'] ?? 0);
        });
        $n = 1;
        foreach ($out as &$s) {
            $s['sortOrder'] = $n++;
        }
        unset($s);

        return $out;
    }

    /** @param array<string, mixed> $sec */
    private static function normalizeOneSection(array $sec, int $index): array
    {
        $id = self::slugifySectionId((string) ($sec['id'] ?? ('section_' . ($index + 1))));
        if ($id === '') {
            $id = 'section_' . ($index + 1);
        }
        $type = (string) ($sec['type'] ?? 'table');
        $allowed = ['table', 'document_list', 'staff_table', 'result_table', 'infra_table', 'freetext'];
        if (!in_array($type, $allowed, true)) {
            $type = 'table';
        }
        $base = [
            'id' => $id,
            'letter' => strtoupper(substr(trim((string) ($sec['letter'] ?? '')), 0, 3)),
            'title' => trim((string) ($sec['title'] ?? $id)),
            'sortOrder' => (int) ($sec['sortOrder'] ?? $index + 1),
            'type' => $type,
            'visible' => !array_key_exists('visible', $sec) || $sec['visible'] !== false,
        ];
        if ($type === 'table') {
            if (!empty($sec['fields']) && is_array($sec['fields'])) {
                $base['fields'] = $sec['fields'];
            }
            if (array_key_exists('tableGroups', $sec) && is_array($sec['tableGroups'])) {
                $base['tableGroups'] = $sec['tableGroups'];
            }
        }
        if ($type === 'document_list') {
            $wrapped = self::normalizeDocumentSections([
                [
                    'id' => $base['id'],
                    'letter' => $base['letter'],
                    'title' => $base['title'],
                    'sortOrder' => $base['sortOrder'],
                    'segments' => is_array($sec['segments'] ?? null) ? $sec['segments'] : [],
                ],
            ]);
            $base['segments'] = $wrapped[0]['segments'] ?? [];
        }
        if ($type === 'staff_table') {
            $teacherUrl = trim((string) ($sec['teacherListUrl'] ?? ''));
            $base['teacherListUrl'] = $teacherUrl !== '' ? $teacherUrl : self::RRGREEN_TEACHER_LIST_URL;
            if (!empty($sec['staffFields']) && is_array($sec['staffFields'])) {
                $base['staffFields'] = $sec['staffFields'];
            }
        }
        if ($type === 'result_table') {
            $base['supportingDocsCategoryId'] = (string) ($sec['supportingDocsCategoryId'] ?? 'academic');
            if (!empty($sec['classes']) && is_array($sec['classes'])) {
                $base['classes'] = $sec['classes'];
            }
        }
        if ($type === 'infra_table') {
            $yt = self::sanitizeYoutubeInspectionUrl($sec['youtubeInspectionUrl'] ?? '');
            if ($yt === '') {
                $yt = 'https://youtu.be/iVS2A1JErCQ?si=_Vq3haCLWnUSJkFV';
            }
            $base['youtubeInspectionUrl'] = $yt;
            $base['infraDocLink'] = (string) ($sec['infraDocLink'] ?? '');
            $rawFields = !empty($sec['infraFields']) && is_array($sec['infraFields']) ? $sec['infraFields'] : [];
            $base['infraFields'] = self::reorderInfraDisplayFields($rawFields, $yt);
        }
        if ($type === 'freetext') {
            $base['content'] = (string) ($sec['content'] ?? '');
        }

        return $base;
    }

    /** Apply teacher list URL to first staff_table section (teacher list upload API). */
    private static function applyTeacherListUrl(array $payload, string $url): array
    {
        if (!self::isSchemaV2($payload)) {
            $payload = self::migrateV1toV2($payload);
        }
        if (!isset($payload['sections']) || !is_array($payload['sections'])) {
            return $payload;
        }
        foreach ($payload['sections'] as &$sec) {
            if (!is_array($sec)) {
                continue;
            }
            if (($sec['type'] ?? '') === 'staff_table') {
                $sec['teacherListUrl'] = $url;
                break;
            }
        }
        unset($sec);

        return $payload;
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
        $teacherIncoming = $incoming['teacherListUrl'] ?? null;
        $sectionsIncoming = null;
        if (isset($incoming['sections']) && is_array($incoming['sections'])) {
            $sectionsIncoming = $incoming['sections'];
            $incomingCopy = $incoming;
            unset($incomingCopy['sections']);
            $incoming = $incomingCopy;
        }
        $merged = array_replace_recursive($current, $incoming);
        if (is_array($sectionsIncoming)) {
            $merged['sections'] = self::normalizeSectionsV2($sectionsIncoming);
        }
        if (is_string($teacherIncoming)) {
            $merged = self::applyTeacherListUrl($merged, $teacherIncoming);
        }
        $merged = self::mergeWithDefaults($merged);
        /** Store V2-only JSON (drop legacy V1 top-level keys if present). */
        if (self::isSchemaV2($merged)) {
            foreach (['teacherListUrl', 'sectionA', 'staff', 'infrastructure', 'results', 'documentSections'] as $legacy) {
                unset($merged[$legacy]);
            }
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
