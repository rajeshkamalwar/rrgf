import { useMemo } from 'react';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MpdDocumentDragList } from '@/components/MpdDocumentDragList';
import { MpdDocumentRowCard, type MpdAdminDocumentRow } from '@/components/MpdDocumentRowCard';
import type { MpdDocumentSection } from '@/lib/mpdDocumentSections';

export interface NewDocumentDraft {
  information: string;
  segment_id: string;
  link: string;
  auto_map_segment: boolean;
}

export interface MpdDocumentSectionEditorProps {
  section: MpdDocumentSection;
  documents: MpdAdminDocumentRow[];
  docSections: MpdDocumentSection[];
  draft: NewDocumentDraft;
  onDraftChange: (patch: Partial<NewDocumentDraft>) => void;
  onCreateRow: (override?: Partial<NewDocumentDraft>) => void | Promise<void>;
  onAutoGenerateSegments?: () => void | Promise<void>;
  autoGenerateBusy?: boolean;
  createBusy?: boolean;
  onReorder: (fromId: string, toId: string) => void;
  expandedDocId: string | null;
  onExpandDoc: (docId: string | null) => void;
  editingTitleId: string | null;
  onEditingTitleId: (id: string | null) => void;
  uploadingFile: boolean;
  onSaveTitle: (docId: string, title: string) => void;
  onToggleHidden: (doc: MpdAdminDocumentRow, hidden: boolean) => void;
  onDelete: (doc: MpdAdminDocumentRow) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, docId: string) => void;
  onLinkBlur: (docId: string, link: string) => void;
  onSegmentChange: (docId: string, segmentId: string) => void;
  onAutoMapSegment: (doc: MpdAdminDocumentRow) => void;
}

function sortDocs(docs: MpdAdminDocumentRow[]): MpdAdminDocumentRow[] {
  return [...docs].sort((a, b) => {
    const ao = Number(a.sno ?? 0);
    const bo = Number(b.sno ?? 0);
    if (ao !== bo) return ao - bo;
    return String(a.sno).localeCompare(String(b.sno), undefined, { numeric: true });
  });
}

export function MpdDocumentSectionEditor({
  section,
  documents,
  docSections,
  draft,
  onDraftChange,
  onCreateRow,
  onAutoGenerateSegments,
  autoGenerateBusy = false,
  createBusy = false,
  onReorder,
  expandedDocId,
  onExpandDoc,
  editingTitleId,
  onEditingTitleId,
  uploadingFile,
  onSaveTitle,
  onToggleHidden,
  onDelete,
  onFileUpload,
  onLinkBlur,
  onSegmentChange,
  onAutoMapSegment,
}: MpdDocumentSectionEditorProps) {
  const sectionDocs = useMemo(
    () => sortDocs(documents.filter((d) => d.category === section.id)),
    [documents, section.id],
  );

  const missingSegments = useMemo(() => {
    if (!section.segments.length) return [];
    return section.segments.filter(
      (seg) => !sectionDocs.some((d) => (d.segment_id || '') === seg.id),
    );
  }, [section.segments, sectionDocs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Each row is one PDF on the public page under{' '}
          <strong>
            {section.letter} — {section.title}
          </strong>
          . Drag ⠿ to reorder · expand a row to upload.
        </p>
        {onAutoGenerateSegments && missingSegments.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={autoGenerateBusy}
            onClick={() => void onAutoGenerateSegments()}
          >
            {autoGenerateBusy ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            Add {missingSegments.length} suggested row{missingSegments.length === 1 ? '' : 's'}
          </Button>
        ) : null}
      </div>

      {missingSegments.length > 0 ? (
        <ul className="space-y-2">
          {missingSegments.map((seg) => (
            <li
              key={seg.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-sm"
            >
              <span>
                Suggested slot: <strong>{seg.label}</strong>
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  void onCreateRow({ information: seg.label, segment_id: seg.id })
                }
              >
                <Plus className="h-3 w-3 mr-1" /> Add row
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <MpdDocumentDragList
        items={sectionDocs}
        onReorder={onReorder}
        renderItem={(doc) => (
          <MpdDocumentRowCard
            doc={doc}
            section={section}
            docSections={docSections}
            isExpanded={expandedDocId === doc.id}
            isEditingTitle={editingTitleId === doc.id}
            uploadingFile={uploadingFile && expandedDocId === doc.id}
            onToggleExpand={() => onExpandDoc(expandedDocId === doc.id ? null : doc.id)}
            onStartEditTitle={() => onEditingTitleId(doc.id)}
            onCancelEditTitle={() => onEditingTitleId(null)}
            onSaveTitle={(title) => {
              void onSaveTitle(doc.id, title);
              onEditingTitleId(null);
            }}
            onToggleHidden={(hidden) => onToggleHidden(doc, hidden)}
            onDelete={() => onDelete(doc)}
            onFileUpload={(e) => onFileUpload(e, doc.id)}
            onLinkBlur={(link) => onLinkBlur(doc.id, link)}
            onSegmentChange={(segId) => onSegmentChange(doc.id, segId)}
            onAutoMapSegment={() => onAutoMapSegment(doc)}
          />
        )}
      />

      <div className="border rounded-lg p-3 space-y-3 border-dashed bg-muted/20">
        <p className="text-sm font-medium">Add new document row</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Document title</Label>
            <Input
              placeholder="e.g. Fire Safety Certificate"
              value={draft.information}
              onChange={(e) => onDraftChange({ information: e.target.value })}
            />
          </div>
          {section.segments.length > 0 ? (
            <div className="space-y-1">
              <Label className="text-xs">Sub-section (optional)</Label>
              <Select
                value={draft.segment_id || '_none'}
                onValueChange={(v) => onDraftChange({ segment_id: v === '_none' ? '' : v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Pick sub-section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">— None —</SelectItem>
                  {section.segments.map((seg) => (
                    <SelectItem key={seg.id} value={seg.id}>
                      {seg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Link (optional — or upload after saving)</Label>
            <Input
              placeholder="/documents/file.pdf"
              value={draft.link}
              onChange={(e) => onDraftChange({ link: e.target.value })}
            />
          </div>
        </div>
        <Button type="button" size="sm" disabled={createBusy} onClick={() => void onCreateRow()}>
          {createBusy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
          Add row
        </Button>
      </div>
    </div>
  );
}
