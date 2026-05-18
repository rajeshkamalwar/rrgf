import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, FolderOpen, Layers, Loader2, Plus, Trash2 as TrashIcon } from 'lucide-react';
import {
  addDocumentCategory,
  addSegmentToCategory,
  removeDocumentCategoryAt,
  removeSegmentAt,
  updateDocumentCategoryAt,
  updateSegmentAt,
  type MpdDocumentSection,
} from '@/lib/mpdDocumentSections';

export interface MpdCategoryManagerProps {
  categories: MpdDocumentSection[];
  onChange: (categories: MpdDocumentSection[]) => void;
  onSave?: (categories: MpdDocumentSection[]) => void | Promise<void>;
  saving?: boolean;
  showSaveButton?: boolean;
  docCounts?: Record<string, number>;
}

function categoryItemValue(cat: MpdDocumentSection, index: number): string {
  return `${cat.id}__${index}`;
}

export function MpdCategoryManager({
  categories,
  onChange,
  onSave,
  saving = false,
  showSaveButton = true,
  docCounts,
}: MpdCategoryManagerProps) {
  const defaultOpen = useMemo(
    () => categories.slice(0, 2).map((cat, i) => categoryItemValue(cat, i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open first items on mount / count change
    [categories.length],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
        <Button type="button" variant="outline" size="sm" onClick={() => onChange(addDocumentCategory(categories))}>
          <Plus className="h-4 w-4 mr-1" /> Add category
        </Button>
        {showSaveButton && onSave ? (
          <Button type="button" size="sm" onClick={() => void onSave?.(categories)} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving…
              </>
            ) : (
              'Save categories'
            )}
          </Button>
        ) : null}
        <p className="text-xs text-muted-foreground w-full sm:w-auto sm:ml-auto">
          {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} · expand to edit
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
          No categories yet. Click &quot;Add category&quot; to create one.
        </p>
      ) : (
        <Accordion type="multiple" defaultValue={defaultOpen} className="w-full space-y-2">
          {categories.map((cat, cIdx) => {
            const itemValue = categoryItemValue(cat, cIdx);
            const docCount = docCounts?.[cat.id];
            return (
              <AccordionItem
                key={itemValue}
                value={itemValue}
                className="rounded-lg border bg-card px-3 shadow-sm border-b"
              >
                <AccordionTrigger className="hover:no-underline py-3 gap-3 [&>svg]:shrink-0">
                  <div className="flex flex-1 flex-wrap items-center gap-2 text-left min-w-0">
                    <Badge variant="default" className="shrink-0 font-mono">
                      {cat.letter || '?'}
                    </Badge>
                    <span className="font-semibold truncate">{cat.title}</span>
                    <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                      {cat.id}
                    </span>
                    {docCount !== undefined ? (
                      <Badge variant="secondary" className="shrink-0">
                        {docCount} doc{docCount === 1 ? '' : 's'}
                      </Badge>
                    ) : null}
                    {cat.segments.length > 0 ? (
                      <Badge variant="outline" className="shrink-0 gap-1">
                        <Layers className="h-3 w-3" />
                        {cat.segments.length} segment{cat.segments.length === 1 ? '' : 's'}
                      </Badge>
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-0 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Category ID (slug, DB)</Label>
                      <Input
                        value={cat.id}
                        onChange={(e) => onChange(updateDocumentCategoryAt(categories, cIdx, { id: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Appendix letter</Label>
                      <Input
                        maxLength={3}
                        value={cat.letter}
                        onChange={(e) =>
                          onChange(updateDocumentCategoryAt(categories, cIdx, { letter: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">Public title</Label>
                      <Input
                        value={cat.title}
                        onChange={(e) =>
                          onChange(updateDocumentCategoryAt(categories, cIdx, { title: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Display order</Label>
                      <Input
                        type="number"
                        min={1}
                        value={cat.sortOrder}
                        onChange={(e) =>
                          onChange(
                            updateDocumentCategoryAt(categories, cIdx, {
                              sortOrder: parseInt(e.target.value, 10) || 1,
                            }),
                          )
                        }
                      />
                    </div>
                  </div>

                  <Collapsible defaultOpen={cat.segments.length > 0}>
                    <div className="rounded-md border">
                      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180">
                        <span className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          Segments &amp; keyword mapping
                          <Badge variant="outline" className="font-normal">
                            {cat.segments.length}
                          </Badge>
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3 pt-1 space-y-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Optional sub-groups on the public page. Keywords auto-map new uploads when enabled.
                        </p>
                        {cat.segments.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">
                            No segments — documents show in one table for this category.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {cat.segments.map((seg, gIdx) => (
                              <div
                                key={`${seg.id}-${gIdx}`}
                                className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] items-center rounded-md bg-muted/30 p-2"
                              >
                                <Input
                                  placeholder="Segment ID"
                                  value={seg.id}
                                  className="h-8 text-sm bg-background"
                                  onChange={(e) =>
                                    onChange(updateSegmentAt(categories, cIdx, gIdx, { id: e.target.value }))
                                  }
                                />
                                <Input
                                  placeholder="Label"
                                  value={seg.label}
                                  className="h-8 text-sm bg-background"
                                  onChange={(e) =>
                                    onChange(updateSegmentAt(categories, cIdx, gIdx, { label: e.target.value }))
                                  }
                                />
                                <Input
                                  placeholder="Keywords (comma-separated)"
                                  value={seg.keywords.join(', ')}
                                  className="h-8 text-sm bg-background"
                                  onChange={(e) =>
                                    onChange(
                                      updateSegmentAt(categories, cIdx, gIdx, {
                                        keywords: e.target.value
                                          .split(',')
                                          .map((k) => k.trim())
                                          .filter(Boolean),
                                      }),
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive shrink-0"
                                  onClick={() => onChange(removeSegmentAt(categories, cIdx, gIdx))}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onChange(addSegmentToCategory(categories, cIdx))}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add segment
                        </Button>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  <div className="flex justify-end pt-1 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      disabled={categories.length <= 1}
                      onClick={() => onChange(removeDocumentCategoryAt(categories, cIdx))}
                    >
                      <TrashIcon className="h-3 w-3 mr-1" /> Remove category
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <p className="text-xs text-muted-foreground flex items-start gap-2">
        <FolderOpen className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>
          Each category ID is stored on document rows as <span className="font-mono">category</span>. Save before
          adding documents to new categories.
        </span>
      </p>
    </div>
  );
}
