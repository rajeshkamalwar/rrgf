import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ExternalLink,
  Loader2,
  Upload,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MpdPayloadV2, MpdSection } from '@/lib/mpdDocumentSections';
import { sortMpdSections } from '@/lib/mpdDocumentSections';
import { buildMpdWizardSteps, findSectionById } from '@/lib/mpdWizardSteps';
import { MpdAdvancedPanel } from '@/components/MpdAdvancedPanel';
import { MpdSectionBuilder } from '@/components/MpdSectionBuilder';
import { MpdSectionPreview } from '@/components/MpdSectionPreview';
import type { MpdDocumentSection } from '@/lib/mpdDocumentSections';
import type { MpdDocumentRow } from '@/components/MpdSectionRenderer';

export interface MpdDocumentsPanelOptions {
  /** Show only PDF rows for this document_list section id (matches public page block). */
  categoryId?: string;
  /** Bulk category/segment editor (Advanced step only). */
  includeCategoryManager?: boolean;
}

export interface MpdDisclosureWizardProps {
  mpdDraft: MpdPayloadV2;
  mpdUpdatedAt: string | null;
  mpdSaving: boolean;
  complianceDaysRemaining: number;
  teacherListUrl: string;
  uploadingTeacherList: boolean;
  docCounts?: Record<string, number>;
  /** Documents for live public-page preview (non-hidden). */
  previewDocuments: MpdDocumentRow[];
  onSave: () => void;
  onSectionsChange: (sections: MpdSection[]) => void;
  onLegalChange: (patch: Partial<Pick<MpdPayloadV2, 'legalDisclaimer' | 'complianceDeadline' | 'directiveReference'>>) => void;
  onTeacherListUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTeacherSample: () => void;
  renderDocuments: (options?: MpdDocumentsPanelOptions) => React.ReactNode;
  documentCategories: MpdDocumentSection[];
  onCategoriesChange: (categories: MpdDocumentSection[]) => void;
  onSaveCategories: (categories: MpdDocumentSection[]) => void | Promise<void>;
}

export function MpdDisclosureWizard({
  mpdDraft,
  mpdUpdatedAt,
  mpdSaving,
  complianceDaysRemaining,
  teacherListUrl,
  uploadingTeacherList,
  docCounts,
  previewDocuments,
  onSave,
  onSectionsChange,
  onLegalChange,
  onTeacherListUpload,
  onDownloadTeacherSample,
  renderDocuments,
  documentCategories,
  onCategoriesChange,
  onSaveCategories,
}: MpdDisclosureWizardProps) {
  const steps = useMemo(() => buildMpdWizardSteps(mpdDraft.sections), [mpdDraft.sections]);
  const publicSections = useMemo(
    () => sortMpdSections(mpdDraft.sections).filter((s) => s.visible),
    [mpdDraft.sections],
  );

  const [step, setStep] = useState(0);
  const current = steps[step] ?? steps[0];
  const activeSection =
    current?.kind === 'section' && current.sectionId
      ? findSectionById(mpdDraft.sections, current.sectionId)
      : undefined;

  const publicPosition =
    activeSection != null
      ? publicSections.findIndex((s) => s.id === activeSection.id) + 1
      : undefined;

  const go = (n: number) => setStep(Math.max(0, Math.min(steps.length - 1, n)));

  const previewPanel =
    activeSection != null ? (
      <MpdSectionPreview
        section={activeSection}
        documents={previewDocuments}
        publicPosition={publicPosition && publicPosition > 0 ? publicPosition : undefined}
        publicTotal={publicSections.length}
      />
    ) : null;

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-red-200 bg-red-50 text-school-secondary">
        <AlertDescription className="space-y-1">
          <div className="font-semibold">Mandatory public disclosure — WYSIWYG editor</div>
          <p className="text-sm">
            Each step matches <strong>one block on the public page</strong>, in the same order visitors
            see. Edit on the left; preview updates on the right. Click{' '}
            <strong>Save disclosure data</strong> after changes. Deadline:{' '}
            <span className="font-mono">{mpdDraft.complianceDeadline}</span>
            {complianceDaysRemaining >= 0
              ? ` (${complianceDaysRemaining} day(s) left)`
              : ` (${Math.abs(complianceDaysRemaining)} day(s) overdue)`}
            .
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-3 sm:hidden">
            Swipe steps — same order as the public page
          </p>
          <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-0 sm:divide-x sm:divide-border max-h-[280px] sm:max-h-none overflow-y-auto sm:overflow-visible">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = i === step;
              const done = i < step;
              return (
                <li key={s.id} className="flex-1 min-w-[100px]">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    className={`w-full flex sm:flex-col items-center gap-2 sm:gap-1 px-2 py-2 text-left sm:text-center rounded-md transition-colors ${
                      active
                        ? 'bg-school-primary/10 text-school-primary'
                        : 'hover:bg-muted/60 text-muted-foreground'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 shrink-0">
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : active ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-school-primary text-white text-xs font-bold">
                          {i + 1}
                        </span>
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <Icon className="h-4 w-4 hidden lg:block" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-wide truncate">
                        {s.short}
                      </span>
                      <span className={`block text-xs sm:text-sm truncate ${active ? 'font-semibold' : ''}`}>
                        {s.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle>
              Step {step + 1} of {steps.length}: {current.title}
              {activeSection?.letter ? (
                <span className="text-muted-foreground font-normal text-base ml-2">
                  (Section {activeSection.letter})
                </span>
              ) : null}
            </CardTitle>
            <CardDescription>{current.description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link to="/mandatory-public-disclosure" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Open public page
              </Link>
            </Button>
            <Button size="sm" onClick={() => void onSave()} disabled={mpdSaving}>
              {mpdSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Save disclosure data
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {current.kind === 'overview' && (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                The public page shows these blocks in order. Last saved:{' '}
                {mpdUpdatedAt ? new Date(mpdUpdatedAt).toLocaleString('en-IN') : 'not yet'}.
              </p>
              <ul className="space-y-2">
                {publicSections.map((sec, i) => (
                  <li
                    key={sec.id}
                    className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-school-primary text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">
                        {sec.letter} — {sec.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {sec.type === 'document_list'
                          ? 'Add PDFs in this section’s step'
                          : sec.type === 'result_table'
                            ? 'Results table + linked PDFs'
                            : sec.type === 'staff_table'
                              ? 'Staff table + teacher list file'
                              : sec.type === 'infra_table'
                                ? 'Infrastructure numbers + YouTube'
                                : 'Edit fields in this section’s step'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button onClick={() => go(1)}>
                Start with {publicSections[0]?.letter ? `Section ${publicSections[0].letter}` : 'first block'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {current.kind === 'section' && activeSection && (
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-4 min-w-0">
                {activeSection.type === 'document_list' ? (
                  renderDocuments({ categoryId: activeSection.id })
                ) : activeSection.type === 'staff_table' ? (
                  <>
                    <MpdSectionBuilder
                      sections={mpdDraft.sections}
                      onChange={onSectionsChange}
                      docCounts={docCounts}
                      sectionFilter={(s) => s.id === activeSection.id}
                      simpleMode
                    />
                    <Card className="border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Teacher list file</CardTitle>
                        <CardDescription>
                          Shown inside Section D on the public page.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Current:{' '}
                          <span className="font-mono text-xs">{teacherListUrl || 'Not uploaded'}</span>
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Button variant="outline" size="sm" type="button" onClick={onDownloadTeacherSample}>
                            Download sample CSV
                          </Button>
                          <Input
                            type="file"
                            accept=".pdf,.csv,.xlsx,.xls"
                            className="max-w-xs"
                            onChange={onTeacherListUpload}
                            disabled={uploadingTeacherList}
                          />
                          {uploadingTeacherList ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : activeSection.type === 'result_table' ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Enter pass percentages below. Class X / XII PDFs use the same row editor — pick
                      segment <em>Class X</em> or <em>Class XII</em>; they show above the results on
                      the public page.
                    </p>
                    <MpdSectionBuilder
                      sections={mpdDraft.sections}
                      onChange={onSectionsChange}
                      docCounts={docCounts}
                      sectionFilter={(s) => s.id === activeSection.id}
                      simpleMode
                    />
                    {renderDocuments({
                      categoryId: activeSection.supportingDocsCategoryId || 'academic',
                    })}
                  </>
                ) : (
                  <MpdSectionBuilder
                    sections={mpdDraft.sections}
                    onChange={onSectionsChange}
                    docCounts={docCounts}
                    sectionFilter={(s) => s.id === activeSection.id}
                    simpleMode
                  />
                )}
              </div>
              <div className="min-w-0 xl:sticky xl:top-4 xl:self-start">{previewPanel}</div>
            </div>
          )}

          {current.kind === 'legal' && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Legal footer &amp; compliance</CardTitle>
                  <CardDescription>Bottom of the public disclosure page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label>Legal disclaimer</Label>
                    <textarea
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[100px]"
                      value={mpdDraft.legalDisclaimer}
                      onChange={(e) => onLegalChange({ legalDisclaimer: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label>Compliance deadline</Label>
                      <Input
                        type="date"
                        value={mpdDraft.complianceDeadline}
                        onChange={(e) => onLegalChange({ complianceDeadline: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Directive reference</Label>
                      <Input
                        value={mpdDraft.directiveReference}
                        onChange={(e) => onLegalChange({ directiveReference: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base text-sm">Preview note</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  The disclaimer and dates render below all sections on{' '}
                  <code className="text-xs bg-muted px-1 rounded">/mandatory-public-disclosure</code>.
                </CardContent>
              </Card>
            </div>
          )}

          {current.kind === 'advanced' && (
            <MpdAdvancedPanel
              sections={mpdDraft.sections}
              onSectionsChange={onSectionsChange}
              docCounts={docCounts}
              documentCategories={documentCategories}
              onCategoriesChange={onCategoriesChange}
              onSaveCategories={onSaveCategories}
              categoriesSaving={mpdSaving}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-gray-50/95 backdrop-blur py-3 border-t -mx-1 px-1">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => go(step - 1)}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <span className="text-sm text-muted-foreground text-center">
          {current.short} · {step + 1}/{steps.length}
        </span>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => go(step + 1)}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={() => void onSave()} disabled={mpdSaving}>
            {mpdSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Save &amp; finish
          </Button>
        )}
      </div>
    </div>
  );
}
