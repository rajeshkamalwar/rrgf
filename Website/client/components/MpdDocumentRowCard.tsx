import { useRef } from 'react';
import {
  Check,
  EyeOff,
  Loader2,
  Pencil,
  TrashIcon,
  X,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Switch } from '@/components/ui/switch';
import type { MpdDocumentSection } from '@/lib/mpdDocumentSections';
import { segmentLabel } from '@/lib/mpdDocumentSections';

export interface MpdAdminDocumentRow {
  id: string;
  category: string;
  segment_id?: string | null;
  sno: string;
  document?: string;
  information?: string;
  link: string;
  status: string;
  hidden_from_public?: number | boolean | string;
}

export function isMpdDocHidden(doc: MpdAdminDocumentRow): boolean {
  const h = doc.hidden_from_public;
  return h === true || h === 1 || h === '1';
}

export interface MpdDocumentRowCardProps {
  doc: MpdAdminDocumentRow;
  section: MpdDocumentSection;
  docSections: MpdDocumentSection[];
  isExpanded: boolean;
  isEditingTitle: boolean;
  uploadingFile: boolean;
  onToggleExpand: () => void;
  onStartEditTitle: () => void;
  onCancelEditTitle: () => void;
  onSaveTitle: (title: string) => void;
  onToggleHidden: (hidden: boolean) => void;
  onDelete: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLinkBlur: (link: string) => void;
  onSegmentChange: (segmentId: string) => void;
  onAutoMapSegment: () => void;
}

export function MpdDocumentRowCard({
  doc,
  section,
  docSections,
  isExpanded,
  isEditingTitle,
  uploadingFile,
  onToggleExpand,
  onStartEditTitle,
  onCancelEditTitle,
  onSaveTitle,
  onToggleHidden,
  onDelete,
  onFileUpload,
  onLinkBlur,
  onSegmentChange,
  onAutoMapSegment,
}: MpdDocumentRowCardProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const hidden = isMpdDocHidden(doc);
  const titleText = (doc.document || doc.information) ?? '';
  const category = section.id;

  return (
    <div
      className={`border rounded-lg p-3 space-y-3 transition-colors ${
        hidden ? 'opacity-70 bg-muted/30 border-dashed' : 'bg-card'
      }`}
    >
      <div className="flex items-start gap-2 flex-wrap">
        <span className="mt-1 shrink-0 text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
          #{doc.sno}
        </span>

        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                ref={titleRef}
                className="h-8 text-sm"
                defaultValue={titleText}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveTitle((e.target as HTMLInputElement).value);
                  if (e.key === 'Escape') onCancelEditTitle();
                }}
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                type="button"
                onClick={() => onSaveTitle(titleRef.current?.value ?? '')}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                type="button"
                onClick={onCancelEditTitle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium leading-tight">{titleText || 'Untitled'}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 shrink-0"
                type="button"
                title="Rename"
                onClick={onStartEditTitle}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span
              className={`px-1.5 py-0.5 rounded text-xs ${
                doc.status === '✓ Available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {doc.status}
            </span>
            {hidden ? (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-900">
                <EyeOff className="h-3 w-3" /> Hidden
              </span>
            ) : null}
            {doc.link && doc.link !== '#' ? (
              <span className="text-xs text-muted-foreground truncate max-w-[220px]">{doc.link}</span>
            ) : null}
            {section.segments.length > 0 ? (
              <span className="text-xs text-muted-foreground">
                Segment: {segmentLabel(docSections, category, doc.segment_id) || '— unmapped —'}
              </span>
            ) : null}
          </div>

          {section.segments.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Select
                value={doc.segment_id || '_none'}
                onValueChange={(v) => onSegmentChange(v === '_none' ? '' : v)}
              >
                <SelectTrigger className="h-8 w-[200px] text-xs">
                  <SelectValue placeholder="Segment" />
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
              <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={onAutoMapSegment}>
                Auto-map
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end ml-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Show</span>
            <Switch
              id={`show-${doc.id}`}
              checked={!hidden}
              onCheckedChange={(checked) => onToggleHidden(!checked)}
            />
          </div>
          <Button variant="outline" size="sm" type="button" onClick={onToggleExpand}>
            {isExpanded ? 'Close' : 'Upload / link'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                type="button"
                className="h-8 w-8 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete document row?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove &quot;{titleText}&quot; from the disclosure table.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isExpanded ? (
        <div className="border-t pt-3 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Upload PDF</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={onFileUpload}
                disabled={uploadingFile}
                className="flex-1 text-xs"
              />
              {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : null}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Or paste link</Label>
            <Input
              className="text-xs"
              placeholder="/documents/file.pdf or https://…"
              defaultValue={doc.link === '#' ? '' : doc.link}
              onBlur={(e) => onLinkBlur(e.target.value.trim() || '#')}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
