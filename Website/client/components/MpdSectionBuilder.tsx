import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { MpdCategoryManager } from '@/components/MpdCategoryManager';
import type {
  MpdDocumentSection,
  MpdResultClass,
  MpdSection,
  MpdSectionField,
  MpdSectionFieldType,
  MpdSectionType,
} from '@/lib/mpdDocumentSections';
import {
  slugifySectionId,
  sortMpdSections,
} from '@/lib/mpdDocumentSections';

const SECTION_TYPES: { value: MpdSectionType; label: string }[] = [
  { value: 'table', label: 'Key/value table' },
  { value: 'document_list', label: 'Document list (uploads)' },
  { value: 'staff_table', label: 'Staff (teaching)' },
  { value: 'result_table', label: 'Board results table' },
  { value: 'infra_table', label: 'Infrastructure parameters' },
  { value: 'freetext', label: 'Free text / HTML' },
];

const FIELD_TYPES: { value: MpdSectionFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Address (maps link)' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes/No' },
];

function newId(prefix: string): string {
  return slugifySectionId(`${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
}

function defaultStaffFields(): MpdSectionField[] {
  return [
    { id: 'pgt', label: 'PGT', value: '0', type: 'number' },
    { id: 'tgt', label: 'TGT', value: '0', type: 'number' },
    { id: 'prt', label: 'PRT', value: '0', type: 'number' },
    { id: 'teacherSectionRatio', label: 'Teachers Section Ratio', value: '1:1.5', type: 'text' },
    { id: 'specialEducator', label: 'Special Educator', value: '0', type: 'number' },
    { id: 'counsellor', label: 'Counsellor / Wellness Teacher', value: '0', type: 'number' },
  ];
}

const DEFAULT_INFRA_LABELS: MpdSectionField[] = [
  {
    id: 'campus_area_sq_mtr',
    label: 'TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR)',
    value: '',
    type: 'number',
  },
  {
    id: 'classrooms',
    label: 'NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)',
    value: '',
    type: 'text',
  },
  {
    id: 'labs',
    label: 'NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)',
    value: '',
    type: 'text',
  },
  {
    id: 'internet_facility',
    label: 'INTERNET FACILITY',
    value: 'true',
    type: 'boolean',
  },
  { id: 'girls_toilets', label: 'NO. OF GIRLS TOILETS', value: '0', type: 'number' },
  { id: 'boys_toilets', label: 'NO. OF BOYS TOILETS', value: '0', type: 'number' },
  {
    id: 'additional_facilities',
    label: 'ADDITIONAL FACILITIES (AS APPLICABLE)',
    value: '',
    type: 'text',
  },
];

function defaultClasses(): MpdResultClass[] {
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

function createBlankSection(type: MpdSectionType, index: number): MpdSection {
  const letter = String.fromCharCode(65 + (index % 26));
  const base: MpdSection = {
    id: newId('section'),
    letter,
    title: 'New section',
    sortOrder: index + 1,
    type,
    visible: true,
  };
  switch (type) {
    case 'table':
      return {
        ...base,
        fields: [
          {
            id: newId('field'),
            label: 'New field',
            value: '',
            type: 'text',
          },
        ],
      };
    case 'document_list':
      return { ...base, segments: [] };
    case 'staff_table':
      return {
        ...base,
        staffFields: defaultStaffFields(),
        teacherListUrl: '',
      };
    case 'result_table':
      return {
        ...base,
        classes: defaultClasses(),
        supportingDocsCategoryId: 'academic',
      };
    case 'infra_table':
      return {
        ...base,
        infraFields: DEFAULT_INFRA_LABELS.map((f) => ({ ...f })),
        youtubeInspectionUrl: '',
        infraDocLink: '',
      };
    case 'freetext':
      return { ...base, content: '' };
    default:
      return base;
  }
}

export interface MpdSectionBuilderProps {
  sections: MpdSection[];
  onChange: (sections: MpdSection[]) => void;
  docCounts?: Record<string, number>;
}

export function MpdSectionBuilder({ sections, onChange, docCounts }: MpdSectionBuilderProps) {
  const updateAt = useCallback(
    (idx: number, patch: Partial<MpdSection>) => {
      const next = sections.map((s, i) => (i === idx ? { ...s, ...patch } : s));
      onChange(sortMpdSections(next).map((s, i) => ({ ...s, sortOrder: i + 1 })));
    },
    [sections, onChange],
  );

  const removeAt = useCallback(
    (idx: number) => {
      if (sections.length <= 1) return;
      const next = sections.filter((_, i) => i !== idx);
      onChange(next.map((s, i) => ({ ...s, sortOrder: i + 1 })));
    },
    [sections, onChange],
  );

  const move = useCallback(
    (idx: number, dir: -1 | 1) => {
      const j = idx + dir;
      if (j < 0 || j >= sections.length) return;
      const copy = [...sections];
      [copy[idx], copy[j]] = [copy[j], copy[idx]];
      onChange(copy.map((s, i) => ({ ...s, sortOrder: i + 1 })));
    },
    [sections, onChange],
  );

  const addSection = useCallback(
    (type: MpdSectionType) => {
      const blank = createBlankSection(type, sections.length);
      onChange([...sections, { ...blank, sortOrder: sections.length + 1 }]);
    },
    [sections, onChange],
  );

  const changeType = useCallback(
    (idx: number, type: MpdSectionType) => {
      const old = sections[idx];
      const fresh = createBlankSection(type, idx);
      updateAt(idx, {
        ...fresh,
        id: old.id,
        letter: old.letter,
        title: old.title,
        sortOrder: old.sortOrder,
        visible: old.visible,
      });
    },
    [sections, updateAt],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Section builder</CardTitle>
            <CardDescription>
              Reorder sections, change types, and edit fields. Document uploads stay tied to each
              document-list section&apos;s ID (database category).
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select onValueChange={(v) => addSection(v as MpdSectionType)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Add section…" />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Accordion type="multiple" className="space-y-2">
        {sections.map((sec, idx) => (
          <AccordionItem
            key={`${sec.id}-${idx}`}
            value={`${sec.id}-${idx}`}
            className="rounded-lg border bg-card px-3 shadow-sm border-b"
          >
            <AccordionTrigger className="hover:no-underline py-3 gap-2 [&[data-state=open]]:pb-2">
              <div className="flex flex-1 flex-wrap items-center gap-2 text-left min-w-0">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                <Badge variant="default" className="shrink-0 font-mono">
                  {sec.letter || '?'}
                </Badge>
                <span className="font-semibold truncate">{sec.title}</span>
                <Badge variant="outline">{sec.type}</Badge>
                {!sec.visible ? (
                  <Badge variant="secondary">
                    <span className="sr-only">Hidden on public page</span> Hidden
                  </Badge>
                ) : null}
                {docCounts && docCounts[sec.id] !== undefined ? (
                  <Badge variant="secondary">{docCounts[sec.id]} docs</Badge>
                ) : null}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => move(idx, 1)}
                  disabled={idx >= sections.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => removeAt(idx)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <Label className="text-xs">Section ID (slug — document categories)</Label>
                  <Input
                    value={sec.id}
                    onChange={(e) => updateAt(idx, { id: slugifySectionId(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Letter</Label>
                  <Input
                    value={sec.letter}
                    maxLength={3}
                    onChange={(e) =>
                      updateAt(idx, { letter: e.target.value.toUpperCase().slice(0, 3) })
                    }
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={sec.title}
                    onChange={(e) => updateAt(idx, { title: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={sec.visible}
                    onCheckedChange={(v) => updateAt(idx, { visible: v })}
                  />
                  <Label className="text-sm">Visible on public page</Label>
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                  <Label className="text-xs shrink-0">Type</Label>
                  <Select value={sec.type} onValueChange={(v) => changeType(idx, v as MpdSectionType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTION_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {sec.type === 'table' ? (
                <FieldRowsEditor
                  fields={sec.fields ?? []}
                  onChange={(fields) => updateAt(idx, { fields })}
                />
              ) : null}

              {sec.type === 'document_list' ? (
                <MpdCategoryManager
                  categories={[sectionToDocCategory(sec)]}
                  onChange={(cats) => {
                    const one = cats[0];
                    if (!one) return;
                    updateAt(idx, {
                      id: one.id,
                      letter: one.letter,
                      title: one.title,
                      segments: one.segments.map((s) => ({ ...s, keywords: [...s.keywords] })),
                    });
                  }}
                  showSaveButton={false}
                  docCounts={docCounts ? { [sec.id]: docCounts[sec.id] ?? 0 } : undefined}
                />
              ) : null}

              {sec.type === 'staff_table' ? (
                <div className="space-y-4">
                  <FieldRowsEditor
                    fields={sec.staffFields ?? []}
                    onChange={(staffFields) => updateAt(idx, { staffFields })}
                    valueLabel="Value / number"
                  />
                  <div className="space-y-1">
                    <Label>Teacher list URL (after upload)</Label>
                    <Input
                      readOnly
                      value={sec.teacherListUrl ?? ''}
                      placeholder="Upload via toolbar button (saved automatically)"
                    />
                  </div>
                </div>
              ) : null}

              {sec.type === 'infra_table' ? (
                <div className="space-y-3">
                  <FieldRowsEditor
                    fields={sec.infraFields ?? []}
                    onChange={(infraFields) => updateAt(idx, { infraFields })}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label>YouTube inspection URL</Label>
                      <Input
                        value={sec.youtubeInspectionUrl ?? ''}
                        onChange={(e) => updateAt(idx, { youtubeInspectionUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Infrastructure document link</Label>
                      <Input
                        value={sec.infraDocLink ?? ''}
                        onChange={(e) => updateAt(idx, { infraDocLink: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {sec.type === 'result_table' ? (
                <ResultTableEditor
                  classes={sec.classes ?? defaultClasses()}
                  supportingDocsCategoryId={sec.supportingDocsCategoryId ?? 'academic'}
                  onClassesChange={(classes) => updateAt(idx, { classes })}
                  onSupportCatChange={(supportingDocsCategoryId) => updateAt(idx, { supportingDocsCategoryId })}
                />
              ) : null}

              {sec.type === 'freetext' ? (
                <div className="space-y-1">
                  <Label>Content (plain text or HTML)</Label>
                  <Textarea
                    rows={6}
                    value={sec.content ?? ''}
                    onChange={(e) => updateAt(idx, { content: e.target.value })}
                  />
                </div>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function sectionToDocCategory(sec: MpdSection): MpdDocumentSection {
  return {
    id: sec.id,
    letter: sec.letter,
    title: sec.title,
    sortOrder: sec.sortOrder,
    segments: sec.segments ?? [],
  };
}

function FieldRowsEditor(props: {
  fields: MpdSectionField[];
  onChange: (fields: MpdSectionField[]) => void;
  valueLabel?: string;
}) {
  const { fields, onChange, valueLabel = 'Value' } = props;

  const updateField = (i: number, patch: Partial<MpdSectionField>) => {
    onChange(
      fields.map((f, j) => (j === i ? { ...f, ...patch, id: patch.id !== undefined ? patch.id : f.id } : f)),
    );
  };

  return (
    <div className="space-y-3">
      {fields.map((f, i) => (
        <Card key={f.id} className="border-dashed">
          <CardContent className="pt-4 grid gap-2 sm:grid-cols-12 items-end">
            <div className="sm:col-span-4 space-y-1">
              <Label className="text-xs">Label</Label>
              <Input value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} />
            </div>
            <div className="sm:col-span-3 space-y-1">
              <Label className="text-xs">Field id (slug)</Label>
              <Input
                value={f.id}
                onChange={(e) => updateField(i, { id: slugifySectionId(e.target.value) })}
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs">Type</Label>
              <Select
                value={f.type}
                onValueChange={(v) => updateField(i, { type: v as MpdSectionFieldType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-3 space-y-1">
              <Label className="text-xs">{valueLabel}</Label>
              {f.type === 'boolean' ? (
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={f.value === 'true' || f.value === '1'}
                    onCheckedChange={(c) => updateField(i, { value: c ? 'true' : 'false' })}
                  />
                </div>
              ) : (
                <Input
                  value={f.value}
                  onChange={(e) => updateField(i, { value: e.target.value })}
                  type={f.type === 'number' ? 'number' : 'text'}
                />
              )}
            </div>
            <div className="sm:col-span-12 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(fields.filter((_, j) => j !== i))}
              >
                Remove row
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([
            ...fields,
            { id: newId('field'), label: 'New field', value: '', type: 'text' },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-1" /> Add row
      </Button>
    </div>
  );
}

function ResultTableEditor(props: {
  classes: MpdResultClass[];
  supportingDocsCategoryId: string;
  onClassesChange: (classes: MpdResultClass[]) => void;
  onSupportCatChange: (id: string) => void;
}) {
  const { classes, supportingDocsCategoryId, onClassesChange, onSupportCatChange } = props;

  const updateClass = (ci: number, patch: Partial<MpdResultClass>) => {
    onClassesChange(classes.map((c, i) => (i === ci ? { ...c, ...patch } : c)));
  };

  const updateRow = (ci: number, ri: number, field: string, value: string | number) => {
    const cl = classes[ci];
    const rows = cl.rows.map((r, j) => (j === ri ? { ...r, [field]: value } : r));
    updateClass(ci, { rows });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 max-w-md">
        <Label>Supporting documents category ID (e.g. academic)</Label>
        <Input value={supportingDocsCategoryId} onChange={(e) => onSupportCatChange(e.target.value)} />
      </div>
      {classes.map((cl, ci) => (
        <Card key={cl.id}>
          <CardHeader>
            <CardTitle className="text-base">Cohort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Internal id</Label>
                <Input
                  value={cl.id}
                  onChange={(e) => updateClass(ci, { id: slugifySectionId(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input value={cl.label} onChange={(e) => updateClass(ci, { label: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={cl.doesNotOffer}
                onCheckedChange={(v) => updateClass(ci, { doesNotOffer: Boolean(v) })}
              />
              <Label className="text-sm">Does not offer / placeholder row</Label>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Default remark</Label>
              <Input value={cl.remark} onChange={(e) => updateClass(ci, { remark: e.target.value })} />
            </div>
            {cl.rows.map((rw, ri) => (
              <div key={ri} className="grid gap-2 sm:grid-cols-4 border rounded-md p-3">
                <div className="space-y-1">
                  <Label className="text-xs">Year</Label>
                  <Input
                    value={rw.year}
                    onChange={(e) => updateRow(ci, ri, 'year', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Registered</Label>
                  <Input
                    type="number"
                    value={rw.registered}
                    onChange={(e) => updateRow(ci, ri, 'registered', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Passed</Label>
                  <Input
                    type="number"
                    value={rw.passed}
                    onChange={(e) => updateRow(ci, ri, 'passed', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Remarks</Label>
                  <Input
                    value={rw.remarks}
                    onChange={(e) => updateRow(ci, ri, 'remarks', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onClassesChange(classes.filter((_, i) => i !== ci))}
              disabled={classes.length <= 1}
            >
              Remove cohort
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onClassesChange([
            ...classes,
            {
              id: newId('class'),
              label: 'RESULT: NEW CLASS',
              doesNotOffer: false,
              remark: '',
              rows: [{ year: '', registered: 0, passed: 0, remarks: '' }],
            },
          ])
        }
      >
        <Plus className="h-4 w-4 mr-1" /> Add cohort
      </Button>
    </div>
  );
}
