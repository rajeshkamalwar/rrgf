import {
  createRrgreenV1Seed,
  RRGREEN_TEACHER_LIST_URL,
  RRGREEN_YOUTUBE_INSPECTION_URL,
} from '@/lib/mpdRrgreenSeed';

export interface MpdDocumentSegment {
  id: string;
  label: string;
  sortOrder: number;
  keywords: string[];
}

export interface MpdDocumentSection {
  id: string;
  letter: string;
  title: string;
  sortOrder: number;
  segments: MpdDocumentSegment[];
}

export const DEFAULT_DOCUMENT_SECTIONS: MpdDocumentSection[] = [
  {
    id: 'documents',
    letter: 'B',
    title: 'Documents and Information',
    sortOrder: 1,
    segments: [
      {
        id: 'compliance',
        label: 'Compliance & certificates',
        sortOrder: 1,
        keywords: ['fire', 'building', 'sanitary', 'trust', 'affidavit', 'recognition', 'noc'],
      },
      {
        id: 'governance',
        label: 'Governance & committees',
        sortOrder: 2,
        keywords: ['smc', 'pta', 'management committee', 'self certification'],
      },
    ],
  },
  {
    id: 'academic',
    letter: 'C',
    title: 'Result and Academics',
    sortOrder: 2,
    segments: [
      { id: 'class_x', label: 'Class X', sortOrder: 1, keywords: ['class x', 'class-x', '10th'] },
      {
        id: 'class_xii',
        label: 'Class XII',
        sortOrder: 2,
        keywords: ['class xii', 'class 12', '12th', 'senior secondary'],
      },
      {
        id: 'general_academic',
        label: 'General academic',
        sortOrder: 3,
        keywords: ['fee', 'calendar', 'result', 'academic', 'smc', 'pta'],
      },
    ],
  },
];

export function slugifySectionId(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
}

export function normalizeDocumentSections(sections: unknown): MpdDocumentSection[] {
  if (!Array.isArray(sections) || sections.length === 0) {
    return DEFAULT_DOCUMENT_SECTIONS.map((s) => ({
      ...s,
      segments: s.segments.map((seg) => ({ ...seg, keywords: [...seg.keywords] })),
    }));
  }
  const out: MpdDocumentSection[] = [];
  for (const sec of sections) {
    if (!sec || typeof sec !== 'object') continue;
    const rec = sec as Record<string, unknown>;
    const id = slugifySectionId(String(rec.id ?? rec.title ?? ''));
    if (!id) continue;
    const segments: MpdDocumentSegment[] = [];
    if (Array.isArray(rec.segments)) {
      for (const seg of rec.segments) {
        if (!seg || typeof seg !== 'object') continue;
        const sr = seg as Record<string, unknown>;
        const segId = slugifySectionId(String(sr.id ?? sr.label ?? ''));
        if (!segId) continue;
        const kw: string[] = [];
        if (Array.isArray(sr.keywords)) {
          for (const k of sr.keywords) {
            const t = String(k).trim();
            if (t) kw.push(t);
          }
        }
        segments.push({
          id: segId,
          label: String(sr.label ?? segId).trim(),
          sortOrder: Number(sr.sortOrder ?? segments.length + 1),
          keywords: kw,
        });
      }
    }
    segments.sort((a, b) => a.sortOrder - b.sortOrder);
    out.push({
      id,
      letter: String(rec.letter ?? '').trim().toUpperCase().slice(0, 3),
      title: String(rec.title ?? id).trim(),
      sortOrder: Number(rec.sortOrder ?? out.length + 1),
      segments,
    });
  }
  if (out.length === 0) return normalizeDocumentSections(null);
  out.sort((a, b) => a.sortOrder - b.sortOrder);
  return out;
}

export function suggestSegmentId(
  sections: MpdDocumentSection[],
  category: string,
  title: string,
): string | null {
  const cat = slugifySectionId(category);
  const hay = title.toLowerCase();
  const sec = sections.find((s) => s.id === cat);
  if (!sec?.segments?.length) return null;
  for (const seg of sec.segments) {
    for (const kw of seg.keywords) {
      if (kw && hay.includes(kw.toLowerCase())) return seg.id;
    }
  }
  return null;
}

export function segmentLabel(
  sections: MpdDocumentSection[],
  category: string,
  segmentId: string | null | undefined,
): string {
  if (!segmentId) return '';
  const sec = sections.find((s) => s.id === category);
  const seg = sec?.segments.find((s) => s.id === segmentId);
  return seg?.label ?? segmentId;
}

export interface DocWithSegment {
  segment_id?: string | null;
  category: string;
  information?: string;
  document?: string;
}

export function sortDisclosureDocs<T extends { sort_order?: number | string; sno?: string }>(
  docs: T[],
): T[] {
  return [...docs].sort((a, b) => {
    const ao = Number(a.sort_order ?? a.sno ?? 0);
    const bo = Number(b.sort_order ?? b.sno ?? 0);
    if (ao !== bo) return ao - bo;
    return String(a.sno ?? '').localeCompare(String(b.sno ?? ''), undefined, { numeric: true });
  });
}

export function groupDocsBySegment<T extends DocWithSegment>(
  docs: T[],
  section: MpdDocumentSection,
): { segmentId: string; label: string; docs: T[] }[] {
  if (!section.segments.length) {
    return [{ segmentId: '', label: '', docs }];
  }
  const groups: { segmentId: string; label: string; docs: T[] }[] = section.segments.map((seg) => ({
    segmentId: seg.id,
    label: seg.label,
    docs: [],
  }));
  const unmapped: T[] = [];
  for (const doc of docs) {
    const sid = doc.segment_id ? slugifySectionId(String(doc.segment_id)) : '';
    const g = groups.find((x) => x.segmentId === sid);
    if (g) g.docs.push(doc);
    else unmapped.push(doc);
  }
  if (unmapped.length) {
    groups.push({ segmentId: '_other', label: 'Other', docs: unmapped });
  }
  return groups.filter((g) => g.docs.length > 0);
}

export function addDocumentCategory(sections: MpdDocumentSection[]): MpdDocumentSection[] {
  const id = slugifySectionId(`category_${sections.length + 1}`);
  return [
    ...sections,
    {
      id,
      letter: 'F',
      title: 'New category',
      sortOrder: sections.length + 1,
      segments: [],
    },
  ];
}

export function updateDocumentCategoryAt(
  sections: MpdDocumentSection[],
  index: number,
  patch: Partial<MpdDocumentSection>,
): MpdDocumentSection[] {
  return sections.map((sec, i) => {
    if (i !== index) return sec;
    const next = { ...sec, ...patch };
    if (patch.id !== undefined) next.id = slugifySectionId(patch.id);
    if (patch.letter !== undefined) next.letter = String(patch.letter).trim().toUpperCase().slice(0, 3);
    if (patch.title !== undefined) next.title = String(patch.title).trim();
    if (patch.sortOrder !== undefined) next.sortOrder = Number(patch.sortOrder) || 1;
    return next;
  });
}

export function removeDocumentCategoryAt(
  sections: MpdDocumentSection[],
  index: number,
): MpdDocumentSection[] {
  if (sections.length <= 1) return sections;
  return sections.filter((_, i) => i !== index);
}

export function addSegmentToCategory(
  sections: MpdDocumentSection[],
  categoryIndex: number,
): MpdDocumentSection[] {
  return sections.map((sec, i) => {
    if (i !== categoryIndex) return sec;
    const segId = slugifySectionId(`segment_${sec.segments.length + 1}`);
    return {
      ...sec,
      segments: [
        ...sec.segments,
        {
          id: segId,
          label: 'New segment',
          sortOrder: sec.segments.length + 1,
          keywords: [],
        },
      ],
    };
  });
}

export function updateSegmentAt(
  sections: MpdDocumentSection[],
  categoryIndex: number,
  segmentIndex: number,
  patch: Partial<MpdDocumentSegment> & { keywords?: string | string[] },
): MpdDocumentSection[] {
  return sections.map((sec, i) => {
    if (i !== categoryIndex) return sec;
    return {
      ...sec,
      segments: sec.segments.map((seg, j) => {
        if (j !== segmentIndex) return seg;
        const next = { ...seg, ...patch };
        if (patch.id !== undefined) next.id = slugifySectionId(patch.id);
        if (patch.keywords !== undefined) {
          next.keywords =
            typeof patch.keywords === 'string'
              ? patch.keywords.split(',').map((k) => k.trim()).filter(Boolean)
              : patch.keywords;
        }
        return next;
      }),
    };
  });
}

export function removeSegmentAt(
  sections: MpdDocumentSection[],
  categoryIndex: number,
  segmentIndex: number,
): MpdDocumentSection[] {
  return sections.map((sec, i) => {
    if (i !== categoryIndex) return sec;
    return {
      ...sec,
      segments: sec.segments.filter((_, j) => j !== segmentIndex),
    };
  });
}

/** Create category from title; optional explicit slug id. */
export function createDocumentCategory(
  sections: MpdDocumentSection[],
  opts: { title: string; letter?: string; id?: string },
): { categories: MpdDocumentSection[]; newId: string } | { error: string } {
  const title = opts.title.trim();
  if (!title) return { error: 'Category title is required' };
  const id = slugifySectionId(opts.id?.trim() || title);
  if (!id) return { error: 'Invalid category ID' };
  if (sections.some((s) => s.id === id)) return { error: 'Category ID already exists' };
  const letter = (opts.letter ?? 'F').trim().toUpperCase().slice(0, 3);
  return {
    categories: [
      ...sections,
      {
        id,
        letter,
        title,
        sortOrder: sections.length + 1,
        segments: [],
      },
    ],
    newId: id,
  };
}

// ---------------------------------------------------------------------------
// Appendix-IX V2: unified sections[] payload (schemaVersion 2)
// ---------------------------------------------------------------------------

export type MpdSectionFieldType = 'text' | 'url' | 'email' | 'phone' | 'address' | 'number' | 'boolean';

export type MpdSectionType =
  | 'table'
  | 'document_list'
  | 'staff_table'
  | 'result_table'
  | 'infra_table'
  | 'freetext';

export interface MpdSectionField {
  id: string;
  label: string;
  value: string;
  type: MpdSectionFieldType;
  hint?: string;
  linkable?: boolean;
  /** When set, row appears under this group (see `tableGroups` on the same section). */
  groupId?: string;
}

/** Sub-heading block for key/value (`table`) sections — `fields[].groupId` references `id`. */
export interface MpdTableRowGroup {
  id: string;
  title: string;
  sortOrder: number;
}

export interface MpdResultYearRow {
  year: string;
  registered: number;
  passed: number;
  remarks: string;
}

export interface MpdResultClass {
  id: string;
  label: string;
  doesNotOffer: boolean;
  remark: string;
  rows: MpdResultYearRow[];
}

export interface MpdSection {
  id: string;
  letter: string;
  title: string;
  sortOrder: number;
  type: MpdSectionType;
  visible: boolean;
  fields?: MpdSectionField[];
  segments?: MpdDocumentSegment[];
  staffFields?: MpdSectionField[];
  teacherListUrl?: string;
  classes?: MpdResultClass[];
  /** e.g. "academic" — supporting PDF rows for result tables */
  supportingDocsCategoryId?: string;
  infraFields?: MpdSectionField[];
  youtubeInspectionUrl?: string;
  infraDocLink?: string;
  content?: string;
  /** Optional row groups for `type: 'table'` only */
  tableGroups?: MpdTableRowGroup[];
}

export interface MpdPayloadV2 {
  schemaVersion: 2;
  sections: MpdSection[];
  legalDisclaimer: string;
  complianceDeadline: string;
  directiveReference: string;
}

export function isMpdPayloadV2(x: unknown): x is MpdPayloadV2 {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return o.schemaVersion === 2 && Array.isArray(o.sections);
}

/** Infer field editor/display type from legacy Section A label (migration). */
export function inferMpdFieldTypeFromLabel(label: string): MpdSectionFieldType {
  const u = label.toUpperCase();
  if (u.includes('EMAIL')) return 'email';
  if (u.includes('CONTACT') || u.includes('MOBILE') || u.includes('PHONE')) return 'phone';
  if (u.includes('ADDRESS') || u.includes('PIN')) return 'address';
  if (u.includes('URL') || u.includes('WEBSITE')) return 'url';
  return 'text';
}

function migrateSectionARowToFields(
  rows: unknown,
): MpdSectionField[] {
  if (!Array.isArray(rows)) return [];
  const out: MpdSectionField[] = [];
  let n = 1;
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const label = String(r.information ?? '').trim();
    if (!label) continue;
    const id = slugifySectionId(String(r.sno ?? `row_${n}`)) || `row_${n}`;
    out.push({
      id,
      label,
      value: String(r.details ?? ''),
      type: inferMpdFieldTypeFromLabel(label),
    });
    n++;
  }
  return out;
}

function staffObjectToFields(staff: Record<string, unknown> | undefined): MpdSectionField[] {
  const s = staff ?? {};
  const out: MpdSectionField[] = [];
  const principal = String(s.principal ?? '').trim();
  if (principal) {
    out.push({ id: 'principal', label: 'Principal', value: principal, type: 'text' });
  }
  out.push(
    { id: 'pgt', label: 'a) PGT', value: String(s.pgt ?? 0), type: 'number' },
    { id: 'tgt', label: 'b) TGT', value: String(s.tgt ?? 0), type: 'number' },
    { id: 'prt', label: 'c) PRT', value: String(s.prt ?? 0), type: 'number' },
    {
      id: 'teacherSectionRatio',
      label: 'Teachers Section Ratio',
      value: String(s.teacherSectionRatio ?? '1:1.5'),
      type: 'text',
    },
    {
      id: 'specialEducator',
      label: 'Special Educator',
      value: String(s.specialEducator ?? 0),
      type: 'number',
    },
  );
  const specDet = String(s.specialEducatorDetails ?? '').trim();
  if (specDet) {
    out.push({
      id: 'special_educator_details',
      label: 'Special Educator (details)',
      value: specDet,
      type: 'text',
    });
  }
  out.push({
    id: 'counsellor',
    label: 'Counsellor / Wellness Teacher',
    value: String(s.counsellor ?? 0),
    type: 'number',
  });
  const counsDet = String(s.counsellorDetails ?? '').trim();
  if (counsDet) {
    out.push({
      id: 'counsellor_details',
      label: 'Counsellor / Wellness Teacher (details)',
      value: counsDet,
      type: 'text',
    });
  }
  return out;
}

function infrastructureToFields(infra: Record<string, unknown> | undefined): {
  fields: MpdSectionField[];
  youtube: string;
  infraDocLink: string;
} {
  const i = infra ?? {};
  const yt = String(i.youtubeInspectionUrl ?? '');
  const doc = String(i.infrastructureDocLink ?? '');
  const fields: MpdSectionField[] = [
    {
      id: 'campus_area_sq_mtr',
      label: 'TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR)',
      value: String(i.campusAreaSqMtr ?? ''),
      type: 'number',
    },
    {
      id: 'classrooms',
      label: 'NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)',
      value: `${i.classroomCount ?? ''} (each ${i.classroomSizeSqMtr ?? ''} sq mtr)`,
      type: 'text',
    },
    {
      id: 'labs',
      label: 'NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)',
      value: `${String(i.labCount ?? '').padStart(2, '0')} (each ${i.labSizeSqMtr ?? ''} sq mtr)`,
      type: 'text',
    },
    {
      id: 'internet_facility',
      label: 'INTERNET FACILITY',
      value: i.internetFacility ? 'true' : 'false',
      type: 'boolean',
    },
    {
      id: 'girls_toilets',
      label: 'NO. OF GIRLS TOILETS',
      value: String(i.girlsToilets ?? ''),
      type: 'number',
    },
    {
      id: 'boys_toilets',
      label: 'NO. OF BOYS TOILETS',
      value: String(i.boysToilets ?? ''),
      type: 'number',
    },
  ];
  const teachersList = String(i.teachersListUrl ?? '').trim();
  if (teachersList) {
    fields.push({
      id: 'teachers_list',
      label: 'TEACHERS LIST',
      value: teachersList,
      type: 'url',
    });
  }
  const extra = String(i.additionalFacilities ?? '').trim();
  if (extra) {
    fields.push({
      id: 'additional_facilities',
      label: 'ADDITIONAL FACILITIES (AS APPLICABLE)',
      value: extra,
      type: 'text',
    });
  }
  return { fields, youtube: yt, infraDocLink: doc };
}

function migrateResultsToClasses(results: unknown): MpdResultClass[] {
  if (!results || typeof results !== 'object') {
    return [
      {
        id: 'class_x',
        label: 'RESULT: CLASS X',
        doesNotOffer: true,
        remark: 'NA',
        rows: [{ year: '', registered: 0, passed: 0, remarks: 'NA' }],
      },
      {
        id: 'class_xii',
        label: 'RESULT: CLASS XII',
        doesNotOffer: true,
        remark: 'NA',
        rows: [{ year: '', registered: 0, passed: 0, remarks: 'NA' }],
      },
    ];
  }
  const r = results as Record<string, unknown>;
  const cx = r.classX as Record<string, unknown> | undefined;
  const cxii =
    (r.classXII as Record<string, unknown> | undefined) ||
    (r['class XII'] as Record<string, unknown> | undefined);
  const rowFrom = (o: Record<string, unknown> | undefined, fallback: MpdResultYearRow) => {
    const rows = Array.isArray(o?.rows) ? o.rows : [];
    const first = rows[0] as Record<string, unknown> | undefined;
    return {
      year: String(first?.year ?? fallback.year),
      registered: Number(first?.registered ?? fallback.registered) || 0,
      passed: Number(first?.passed ?? fallback.passed) || 0,
      remarks: String(first?.remarks ?? fallback.remarks),
    };
  };
  return [
    {
      id: 'class_x',
      label: 'RESULT: CLASS X',
      doesNotOffer: Boolean(cx?.doesNotOffer ?? true),
      remark: String(cx?.remark ?? 'NA'),
      rows: [
        rowFrom(cx, { year: '', registered: 0, passed: 0, remarks: 'NA' }),
      ],
    },
    {
      id: 'class_xii',
      label: 'RESULT: CLASS XII',
      doesNotOffer: Boolean(cxii?.doesNotOffer ?? true),
      remark: String(cxii?.remark ?? 'NA'),
      rows: [
        rowFrom(cxii, { year: '', registered: 0, passed: 0, remarks: 'NA' }),
      ],
    },
  ];
}

/** Convert legacy flat Appendix-IX payload (V1) into schemaVersion 2. */
export function migratePayloadV1toV2(v1: Record<string, unknown>): MpdPayloadV2 {
  const documentSecs = normalizeDocumentSections(v1.documentSections);
  const legalDisclaimer = String(v1.legalDisclaimer ?? '').trim()
    ? String(v1.legalDisclaimer)
    : 'Note: THE SCHOOL NEEDS TO UPLOAD SELF-ATTESTED COPIES OF ABOVE LISTED DOCUMENTS BY CHAIRMAN/MANAGER/SECRETARY AND PRINCIPAL. IN CASE IT IS NOTICED AT LATER STAGE THAT UPLOADED DOCUMENTS ARE NOT GENUINE THEN SCHOOL SHALL BE LIABLE FOR ACTION AS PER NORMS.';
  const complianceDeadline = String(v1.complianceDeadline ?? '2026-05-21');
  const directiveReference = String(
    v1.directiveReference ?? 'CBSE/MPD/AFF./2026 dated 06.05.2026',
  );

  const infraSrc =
    v1.infrastructure && typeof v1.infrastructure === 'object'
      ? (v1.infrastructure as Record<string, unknown>)
      : {};
  const { fields: infraFields, youtube, infraDocLink } = infrastructureToFields(infraSrc);

  const staffSrc =
    v1.staff && typeof v1.staff === 'object' ? (v1.staff as Record<string, unknown>) : {};

  const docLists = documentSecs.filter((s) => s.id !== 'infrastructure');
  const teacherListUrl =
    typeof v1.teacherListUrl === 'string'
      ? v1.teacherListUrl
      : String(infraSrc.teachersListUrl ?? '');

  const sections: MpdSection[] = [];
  let order = 1;

  sections.push({
    id: 'general_information',
    letter: 'A',
    title: 'General Information',
    sortOrder: order++,
    type: 'table',
    visible: true,
    fields: migrateSectionARowToFields(v1.sectionA),
  });

  for (const ds of docLists) {
    sections.push({
      id: ds.id,
      letter: ds.letter,
      title: ds.title,
      sortOrder: order++,
      type: 'document_list',
      visible: true,
      segments: ds.segments.map((s) => ({ ...s, keywords: [...s.keywords] })),
    });
  }

  sections.push({
    id: 'staff_teaching',
    letter: 'D',
    title: 'Staff (Teaching)',
    sortOrder: order++,
    type: 'staff_table',
    visible: true,
    staffFields: staffObjectToFields(staffSrc),
    teacherListUrl,
  });

  sections.push({
    id: 'results',
    letter: '',
    title: 'Board exam results (Class X & XII)',
    sortOrder: order++,
    type: 'result_table',
    visible: true,
    classes: migrateResultsToClasses(v1.results),
    supportingDocsCategoryId: 'academic',
  });

  sections.push({
    id: 'infrastructure_numeric',
    letter: 'E',
    title: 'School Infrastructure (parameters)',
    sortOrder: order++,
    type: 'infra_table',
    visible: true,
    infraFields,
    youtubeInspectionUrl: youtube,
    infraDocLink: infraDocLink || '',
  });

  return {
    schemaVersion: 2,
    sections,
    legalDisclaimer,
    complianceDeadline,
    directiveReference,
  };
}

function defaultResultClasses(): MpdResultClass[] {
  return migrateResultsToClasses(null);
}

/** Canonical default V2 payload (RR Greenfield CSV, May 2026). */
export function createDefaultMpdPayloadV2(): MpdPayloadV2 {
  return migratePayloadV1toV2(createRrgreenV1Seed());
}

function normalizeTableRowGroup(g: unknown, idx: number): MpdTableRowGroup {
  if (!g || typeof g !== 'object') {
    return { id: `group_${idx + 1}`, title: 'Group', sortOrder: idx + 1 };
  }
  const o = g as Record<string, unknown>;
  const rawId = String(o.id ?? `group_${idx + 1}`).trim();
  const id = slugifySectionId(rawId) || `group_${idx + 1}`;
  return {
    id,
    title: String(o.title ?? '').trim() || id,
    sortOrder: Number(o.sortOrder ?? idx + 1) || idx + 1,
  };
}

/** Parse and repair `tableGroups` from API/editor input. */
export function normalizeTableGroups(raw: unknown): MpdTableRowGroup[] {
  if (!Array.isArray(raw)) return [];
  const items = raw.map((g, i) => normalizeTableRowGroup(g, i));
  items.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
  const seen = new Set<string>();
  return items.map((g) => {
    let id = g.id;
    if (seen.has(id)) {
      let n = 2;
      let candidate = `${g.id}_${n}`;
      while (seen.has(candidate)) {
        n += 1;
        candidate = `${g.id}_${n}`;
      }
      id = candidate;
    }
    seen.add(id);
    return { ...g, id };
  });
}

export type MpdTableRenderItem =
  | { kind: 'header'; key: string; title: string }
  | { kind: 'row'; field: MpdSectionField; serialNo: number };

/**
 * Expand flat `fields` with optional group headers for public rendering.
 * S.No applies only to `row` items (headers do not consume a serial).
 */
export function buildTableRenderRows(
  fields: MpdSectionField[],
  tableGroups: MpdTableRowGroup[] | undefined,
): MpdTableRenderItem[] {
  const groups = tableGroups ?? [];
  const titleById = new Map(groups.map((g) => [g.id, g.title]));
  const validIds = new Set(titleById.keys());
  const out: MpdTableRenderItem[] = [];
  let prevEffective: string | undefined;
  let serial = 0;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const raw = field.groupId?.trim();
    const effective = raw && validIds.has(raw) ? raw : undefined;

    if (effective && effective !== prevEffective) {
      out.push({
        kind: 'header',
        key: `grp-${effective}-${i}`,
        title: titleById.get(effective) ?? effective,
      });
    }

    serial += 1;
    out.push({ kind: 'row', field, serialNo: serial });
    prevEffective = effective;
  }

  return out;
}

function normalizeSectionField(f: unknown, fallbackId: string): MpdSectionField {
  if (!f || typeof f !== 'object') {
    return { id: fallbackId, label: '', value: '', type: 'text' };
  }
  const r = f as Record<string, unknown>;
  const id = slugifySectionId(String(r.id ?? fallbackId)) || fallbackId;
  const type = (String(r.type ?? 'text') as MpdSectionFieldType) || 'text';
  const allowed: MpdSectionFieldType[] = ['text', 'url', 'email', 'phone', 'address', 'number', 'boolean'];
  const groupRaw = r.groupId !== undefined && r.groupId !== null ? String(r.groupId).trim() : '';
  const groupId = groupRaw ? slugifySectionId(groupRaw) : undefined;
  const base: MpdSectionField = {
    id,
    label: String(r.label ?? '').trim(),
    value: String(r.value ?? ''),
    type: allowed.includes(type) ? type : 'text',
    hint: r.hint !== undefined ? String(r.hint) : undefined,
    linkable: r.linkable === true,
  };
  if (groupId) {
    base.groupId = groupId;
  }
  return base;
}

function normalizeResultClass(c: unknown, idx: number): MpdResultClass {
  if (!c || typeof c !== 'object') {
    return {
      id: `class_${idx}`,
      label: `Class ${idx + 1}`,
      doesNotOffer: false,
      remark: '',
      rows: [{ year: '', registered: 0, passed: 0, remarks: '' }],
    };
  }
  const r = c as Record<string, unknown>;
  const rowsRaw = Array.isArray(r.rows) ? r.rows : [];
  const rows: MpdResultYearRow[] = rowsRaw.map((row, j) => {
    if (!row || typeof row !== 'object') {
      return { year: '', registered: 0, passed: 0, remarks: '' };
    }
    const x = row as Record<string, unknown>;
    return {
      year: String(x.year ?? ''),
      registered: Number(x.registered ?? 0) || 0,
      passed: Number(x.passed ?? 0) || 0,
      remarks: String(x.remarks ?? ''),
    };
  });
  if (!rows.length) rows.push({ year: '', registered: 0, passed: 0, remarks: '' });
  return {
    id: slugifySectionId(String(r.id ?? `class_${idx}`)) || `class_${idx}`,
    label: String(r.label ?? `Class ${idx + 1}`),
    doesNotOffer: Boolean(r.doesNotOffer),
    remark: String(r.remark ?? ''),
    rows,
  };
}

/** Normalize / repair one section record from API or editor. */
export function normalizeMpdSection(sec: unknown, index: number): MpdSection {
  if (!sec || typeof sec !== 'object') {
    return {
      id: `section_${index + 1}`,
      letter: 'A',
      title: 'Section',
      sortOrder: index + 1,
      type: 'freetext',
      visible: true,
      content: '',
    };
  }
  const r = sec as Record<string, unknown>;
  const type = String(r.type ?? 'table') as MpdSectionType;
  const types: MpdSectionType[] = [
    'table',
    'document_list',
    'staff_table',
    'result_table',
    'infra_table',
    'freetext',
  ];
  const id = slugifySectionId(String(r.id ?? `section_${index + 1}`)) || `section_${index + 1}`;
  const base: MpdSection = {
    id,
    letter: String(r.letter ?? '').trim().toUpperCase().slice(0, 3),
    title: String(r.title ?? id).trim(),
    sortOrder: Number(r.sortOrder ?? index + 1),
    type: types.includes(type) ? type : 'table',
    visible: r.visible !== false,
  };
  if (base.type === 'table' && Array.isArray(r.fields)) {
    const tableGroups = normalizeTableGroups(r.tableGroups);
    const valid = new Set(tableGroups.map((g) => g.id));
    if (tableGroups.length) {
      base.tableGroups = tableGroups;
    }
    base.fields = r.fields.map((f, i) => {
      const fld = normalizeSectionField(f, `field_${i + 1}`);
      if (fld.groupId && !valid.has(fld.groupId)) {
        const { groupId, ...rest } = fld;
        return rest;
      }
      return fld;
    });
  }
  if (base.type === 'document_list') {
    const rawSeg = Array.isArray(r.segments) ? r.segments : [];
    const wrapped = normalizeDocumentSections([
      {
        id: base.id,
        letter: base.letter,
        title: base.title,
        sortOrder: base.sortOrder,
        segments: rawSeg as MpdDocumentSegment[],
      },
    ]);
    base.segments = wrapped[0]?.segments ?? [];
  }
  if (base.type === 'staff_table') {
    const teacherUrl = typeof r.teacherListUrl === 'string' ? r.teacherListUrl.trim() : '';
    base.teacherListUrl = teacherUrl || RRGREEN_TEACHER_LIST_URL;
    if (Array.isArray(r.staffFields)) {
      base.staffFields = r.staffFields.map((f, i) => normalizeSectionField(f, `staff_${i + 1}`));
    }
  }
  if (base.type === 'result_table') {
    base.supportingDocsCategoryId =
      typeof r.supportingDocsCategoryId === 'string' ? r.supportingDocsCategoryId : 'academic';
    if (Array.isArray(r.classes)) {
      base.classes = r.classes.map((c, i) => normalizeResultClass(c, i));
    } else {
      base.classes = defaultResultClasses();
    }
  }
  if (base.type === 'infra_table') {
    const yt = typeof r.youtubeInspectionUrl === 'string' ? r.youtubeInspectionUrl.trim() : '';
    base.youtubeInspectionUrl = yt || RRGREEN_YOUTUBE_INSPECTION_URL;
    base.infraDocLink = typeof r.infraDocLink === 'string' ? r.infraDocLink : '';
    if (Array.isArray(r.infraFields)) {
      base.infraFields = r.infraFields.map((f, i) => normalizeSectionField(f, `infra_${i + 1}`));
    }
  }
  if (base.type === 'freetext') {
    base.content = typeof r.content === 'string' ? r.content : '';
  }
  return base;
}

/** Sort sections by sortOrder for public display. */
export function sortMpdSections(sections: MpdSection[]): MpdSection[] {
  return [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Full V2 payload normalization (defaults merged). */
export function normalizeMpdPayloadV2(raw: unknown): MpdPayloadV2 {
  const defaults = createDefaultMpdPayloadV2();
  if (!raw || typeof raw !== 'object') return defaults;
  const o = raw as Record<string, unknown>;
  const sectionsIn = Array.isArray(o.sections) ? o.sections : [];
  const normalizedSections =
    sectionsIn.length > 0
      ? sectionsIn.map((s, i) => normalizeMpdSection(s, i))
      : defaults.sections;
  const sorted = sortMpdSections(normalizedSections).map((s, i) => ({ ...s, sortOrder: i + 1 }));
  return {
    schemaVersion: 2,
    sections: sorted,
    legalDisclaimer:
      typeof o.legalDisclaimer === 'string' && o.legalDisclaimer.trim()
        ? String(o.legalDisclaimer)
        : defaults.legalDisclaimer,
    complianceDeadline:
      typeof o.complianceDeadline === 'string' && o.complianceDeadline.trim()
        ? String(o.complianceDeadline)
        : defaults.complianceDeadline,
    directiveReference:
      typeof o.directiveReference === 'string' && o.directiveReference.trim()
        ? String(o.directiveReference)
        : defaults.directiveReference,
  };
}

/**
 * Accept either V1 or V2 API payload and return normalized V2.
 */
export function normalizeFullMpdPayload(raw: unknown): MpdPayloadV2 {
  if (!raw || typeof raw !== 'object') return createDefaultMpdPayloadV2();
  const o = raw as Record<string, unknown>;
  if (isMpdPayloadV2(o)) {
    return normalizeMpdPayloadV2(o);
  }
  return normalizeMpdPayloadV2(migratePayloadV1toV2(o));
}

/** Map document_list sections to legacy shape for MpdCategoryManager / segment helpers. */
export function documentListSectionsAsDocumentSections(sections: MpdSection[]): MpdDocumentSection[] {
  return sortMpdSections(sections.filter((s) => s.type === 'document_list')).map((s) => ({
    id: s.id,
    letter: s.letter,
    title: s.title,
    sortOrder: s.sortOrder,
    segments: (s.segments ?? []).map((seg) => ({ ...seg, keywords: [...seg.keywords] })),
  }));
}

/** Replace all `document_list` sections (admin “categories” editor) while keeping other section types. */
export function replaceDocumentListSections(
  sections: MpdSection[],
  categories: MpdDocumentSection[],
): MpdSection[] {
  const others = sections.filter((s) => s.type !== 'document_list');
  const docLists: MpdSection[] = categories.map((c) => ({
    id: c.id,
    letter: c.letter,
    title: c.title,
    sortOrder: Number(c.sortOrder) || 1,
    type: 'document_list',
    visible: true,
    segments: c.segments.map((s) => ({ ...s, keywords: [...s.keywords] })),
  }));
  return sortMpdSections([...others, ...docLists]).map((s, i) => ({ ...s, sortOrder: i + 1 }));
}

export function getTeacherListUrlFromSections(sections: MpdSection[]): string {
  const staff = sections.find((s) => s.type === 'staff_table');
  return (staff?.teacherListUrl ?? '').trim();
}

export function setTeacherListUrlInSections(sections: MpdSection[], url: string): MpdSection[] {
  let found = false;
  const next = sections.map((s) => {
    if (s.type !== 'staff_table') return s;
    found = true;
    return { ...s, teacherListUrl: url };
  });
  if (!found) return next;
  return next;
}
