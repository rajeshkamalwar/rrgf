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
        keywords: ['fee', 'calendar', 'result', 'academic'],
      },
    ],
  },
  {
    id: 'infrastructure',
    letter: 'E',
    title: 'School Infrastructure',
    sortOrder: 3,
    segments: [],
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
