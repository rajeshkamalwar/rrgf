import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  ListOrdered,
  Settings2,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MpdCategoryManager } from '@/components/MpdCategoryManager';
import { MpdSectionBuilder } from '@/components/MpdSectionBuilder';
import type { MpdDocumentSection, MpdSection, MpdSectionType } from '@/lib/mpdDocumentSections';
import { sortMpdSections } from '@/lib/mpdDocumentSections';

const TYPE_LABELS: Record<MpdSectionType, string> = {
  table: 'School details',
  document_list: 'PDF list',
  staff_table: 'Staff',
  result_table: 'Exam results',
  infra_table: 'Infrastructure',
  freetext: 'Text',
};

function moveSectionById(sections: MpdSection[], id: string, dir: -1 | 1): MpdSection[] {
  const sorted = sortMpdSections(sections);
  const pos = sorted.findIndex((s) => s.id === id);
  const j = pos + dir;
  if (pos < 0 || j < 0 || j >= sorted.length) return sections;
  const copy = [...sorted];
  [copy[pos], copy[j]] = [copy[j], copy[pos]];
  return copy.map((s, i) => ({ ...s, sortOrder: i + 1 }));
}

function patchSection(
  sections: MpdSection[],
  id: string,
  patch: Partial<MpdSection>,
): MpdSection[] {
  return sections.map((s) => (s.id === id ? { ...s, ...patch } : s));
}

export interface MpdAdvancedPanelProps {
  sections: MpdSection[];
  onSectionsChange: (sections: MpdSection[]) => void;
  docCounts?: Record<string, number>;
  documentCategories: MpdDocumentSection[];
  onCategoriesChange: (categories: MpdDocumentSection[]) => void;
  onSaveCategories: (categories: MpdDocumentSection[]) => void | Promise<void>;
  categoriesSaving?: boolean;
}

export function MpdAdvancedPanel({
  sections,
  onSectionsChange,
  docCounts,
  documentCategories,
  onCategoriesChange,
  onSaveCategories,
  categoriesSaving = false,
}: MpdAdvancedPanelProps) {
  const [expertOpen, setExpertOpen] = useState(false);
  const ordered = sortMpdSections(sections);

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50 text-school-secondary">
        <AlertDescription className="text-sm space-y-1">
          <p className="font-medium">Optional — most schools can skip this</p>
          <p>
            Use the earlier wizard steps for everyday edits. This page is only
            for changing <strong>page order</strong>, <strong>section headings</strong>, or rare technical changes.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ListOrdered className="h-4 w-4" />
            Order on the public page
          </CardTitle>
          <CardDescription>
            Top to bottom matches{' '}
            <span className="font-medium">/mandatory-public-disclosure</span>. Use ↑ ↓ to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {ordered.map((sec, index) => (
            <div
              key={sec.id}
              className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${
                sec.visible ? 'bg-card' : 'bg-muted/40 opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={index === 0}
                  onClick={() => onSectionsChange(moveSectionById(sections, sec.id, -1))}
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={index === ordered.length - 1}
                  onClick={() => onSectionsChange(moveSectionById(sections, sec.id, 1))}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              <Badge variant="default" className="font-mono shrink-0 w-8 justify-center">
                {sec.letter || '—'}
              </Badge>

              <div className="flex-1 min-w-[140px] space-y-1">
                <Input
                  className="h-8 text-sm font-medium"
                  value={sec.title}
                  onChange={(e) =>
                    onSectionsChange(patchSection(sections, sec.id, { title: e.target.value }))
                  }
                  aria-label="Section title"
                />
                <p className="text-xs text-muted-foreground">{TYPE_LABELS[sec.type] ?? sec.type}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  id={`adv-vis-${sec.id}`}
                  checked={sec.visible}
                  onCheckedChange={(v) =>
                    onSectionsChange(patchSection(sections, sec.id, { visible: v }))
                  }
                />
                <Label htmlFor={`adv-vis-${sec.id}`} className="text-xs flex items-center gap-1 cursor-pointer">
                  {sec.visible ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> On site
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hidden
                    </>
                  )}
                </Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PDF section headings (B, C, E…)
          </CardTitle>
          <CardDescription>
            Change the titles of document blocks. Upload files in each section&apos;s own wizard step — not here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MpdCategoryManager
            simplified
            categories={documentCategories}
            onChange={onCategoriesChange}
            onSave={onSaveCategories}
            saving={categoriesSaving}
            docCounts={docCounts}
          />
        </CardContent>
      </Card>

      <Collapsible open={expertOpen} onOpenChange={setExpertOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-6 py-4 text-left hover:bg-muted/40 transition-colors rounded-t-lg"
            >
              <span className="flex items-center gap-2 font-medium text-sm">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                Expert tools (section types, IDs, row groups)
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${expertOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 border-t space-y-4">
              <p className="text-sm text-muted-foreground">
                Only use if CBSE asks for a custom layout. Wrong changes can break the public page.
              </p>
              <MpdSectionBuilder
                sections={sections}
                onChange={onSectionsChange}
                docCounts={docCounts}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
