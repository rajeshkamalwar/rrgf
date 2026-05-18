import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  ExternalLink,
  FileText,
  Loader2,
  School,
  Settings2,
  Upload,
  Users,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MpdPayloadV2, MpdSection } from '@/lib/mpdDocumentSections';
import { MpdSectionBuilder } from '@/components/MpdSectionBuilder';

const STEPS = [
  {
    id: 'overview',
    title: 'Overview',
    short: 'Start',
    description: 'What to do and when to save',
    icon: ClipboardList,
  },
  {
    id: 'school',
    title: 'School information',
    short: 'Section A',
    description: 'Name, address, contact details',
    icon: School,
  },
  {
    id: 'documents',
    title: 'Upload PDFs',
    short: 'Documents',
    description: 'Certificates and mandatory files',
    icon: FileText,
  },
  {
    id: 'tables',
    title: 'Staff & infrastructure',
    short: 'B–E tables',
    description: 'Staff counts, results, building details',
    icon: Users,
  },
  {
    id: 'legal',
    title: 'Legal & teacher list',
    short: 'Finish',
    description: 'Disclaimer, deadline, teacher file',
    icon: CheckCircle2,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    short: 'Optional',
    description: 'Reorder sections, add groups, expert options',
    icon: Settings2,
  },
] as const;

export interface MpdDisclosureWizardProps {
  mpdDraft: MpdPayloadV2;
  mpdUpdatedAt: string | null;
  mpdSaving: boolean;
  complianceDaysRemaining: number;
  teacherListUrl: string;
  uploadingTeacherList: boolean;
  docCounts?: Record<string, number>;
  onSave: () => void;
  onSectionsChange: (sections: MpdSection[]) => void;
  onLegalChange: (patch: Partial<Pick<MpdPayloadV2, 'legalDisclaimer' | 'complianceDeadline' | 'directiveReference'>>) => void;
  onTeacherListUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTeacherSample: () => void;
  renderDocuments: () => React.ReactNode;
}

export function MpdDisclosureWizard({
  mpdDraft,
  mpdUpdatedAt,
  mpdSaving,
  complianceDaysRemaining,
  teacherListUrl,
  uploadingTeacherList,
  docCounts,
  onSave,
  onSectionsChange,
  onLegalChange,
  onTeacherListUpload,
  onDownloadTeacherSample,
  renderDocuments,
}: MpdDisclosureWizardProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const generalSection = useMemo(
    () =>
      mpdDraft.sections.find((s) => s.id === 'general_information' && s.type === 'table') ??
      mpdDraft.sections.find((s) => s.type === 'table'),
    [mpdDraft.sections],
  );

  const tableSectionFilter = (s: MpdSection) =>
    s.type === 'staff_table' || s.type === 'result_table' || s.type === 'infra_table';

  const go = (n: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, n)));

  return (
    <div className="space-y-6">
      <Alert variant="default" className="border-red-200 bg-red-50 text-school-secondary">
        <AlertDescription className="space-y-1">
          <div className="font-semibold">Mandatory public disclosure (CBSE Appendix‑IX)</div>
          <p className="text-sm">
            Work through the steps below. Click <strong>Save disclosure data</strong> after each step
            (or at the end). Deadline:{' '}
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
          <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-0 sm:divide-x sm:divide-border">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = i === step;
              const done = i < step;
              return (
                <li key={s.id} className="flex-1 min-w-[120px]">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    className={`w-full flex sm:flex-col items-center gap-2 sm:gap-1 px-3 py-2 text-left sm:text-center rounded-md transition-colors ${
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
                      <Icon className="h-4 w-4 hidden sm:block" />
                    </span>
                    <span>
                      <span className="block text-xs font-medium uppercase tracking-wide">{s.short}</span>
                      <span className={`block text-sm ${active ? 'font-semibold' : ''}`}>{s.title}</span>
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
              Step {step + 1} of {STEPS.length}: {current.title}
            </CardTitle>
            <CardDescription>{current.description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link to="/mandatory-public-disclosure" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Preview site
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
          {step === 0 && (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Follow these steps in order. You can jump between steps using the bar above. Last
                saved: {mpdUpdatedAt ? new Date(mpdUpdatedAt).toLocaleString('en-IN') : 'not yet'}.
              </p>
              <ul className="space-y-3">
                {STEPS.slice(1, -1).map((s, i) => (
                  <li
                    key={s.id}
                    className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-school-primary text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-muted-foreground">{s.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button onClick={() => go(1)}>
                Start with school information
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Edit the particulars shown in <strong>Section A</strong> on the public page (school
                name, address, phone, email, etc.). Use one row per line item.
              </p>
              {generalSection ? (
                <MpdSectionBuilder
                  sections={mpdDraft.sections}
                  onChange={onSectionsChange}
                  docCounts={docCounts}
                  sectionFilter={(s) => s.id === generalSection.id}
                  simpleMode
                />
              ) : (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3">
                  No general information section found. Use the Advanced step to add a key/value
                  table section.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add each required PDF as a row, upload the file, and keep <strong>Show</strong>{' '}
                turned on for items that should appear on the website. Categories match CBSE
                sections (B, C, E, etc.).
              </p>
              {renderDocuments()}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fill in staff numbers, board exam results, and infrastructure parameters. Open each
                block below to edit values.
              </p>
              <MpdSectionBuilder
                sections={mpdDraft.sections}
                onChange={onSectionsChange}
                docCounts={docCounts}
                sectionFilter={tableSectionFilter}
                simpleMode
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Teacher list file</CardTitle>
                  <CardDescription>
                    Upload the staff list PDF or spreadsheet required under Appendix‑IX.
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Legal footer &amp; compliance dates</CardTitle>
                  <CardDescription>Shown at the bottom of the public disclosure page.</CardDescription>
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
                      <Label>Directive reference (display text)</Label>
                      <Input
                        value={mpdDraft.directiveReference}
                        onChange={(e) => onLegalChange({ directiveReference: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For power users: reorder appendix sections, add row groups under Section A, change
                section types, or manage document categories in bulk. Most schools only need steps
                1–5.
              </p>
              <MpdSectionBuilder
                sections={mpdDraft.sections}
                onChange={onSectionsChange}
                docCounts={docCounts}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-gray-50/95 backdrop-blur py-3 border-t -mx-1 px-1">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => go(step - 1)}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <span className="text-sm text-muted-foreground">
          {current.title} · Step {step + 1}/{STEPS.length}
        </span>
        {step < STEPS.length - 1 ? (
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
