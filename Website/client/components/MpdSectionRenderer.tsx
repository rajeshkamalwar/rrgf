import type { ReactNode } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { MpdDocumentSection, MpdSection, MpdSectionField } from '@/lib/mpdDocumentSections';
import { buildTableRenderRows, groupDocsBySegment, sortDisclosureDocs } from '@/lib/mpdDocumentSections';
import {
  DisclosureDocLink,
  documentHref,
  isMandatoryPortalUploadResolved,
  isYoutubeHttpsInspectionUrlAccepted,
  normalizeYoutubeInspectionUrl,
  passPercent,
  yearDisplay,
} from '@/lib/mpdPublicLinks';
import { RRGREEN_YOUTUBE_INSPECTION_URL } from '@/lib/mpdRrgreenSeed';

export interface MpdDocumentRow {
  id: string;
  category: string;
  segment_id?: string | null;
  sno: string;
  document?: string;
  information?: string;
  link: string;
  status: string;
  sort_order?: number | string;
}

export interface MpdSectionRendererProps {
  section: MpdSection;
  documents: MpdDocumentRow[];
  loading?: boolean;
}

function asDocSection(sec: MpdSection): MpdDocumentSection {
  return {
    id: sec.id,
    letter: sec.letter,
    title: sec.title,
    sortOrder: sec.sortOrder,
    segments: sec.segments ?? [],
  };
}

function renderTableValue(f: MpdSectionField): ReactNode {
  const v = f.value ?? '';
  switch (f.type) {
    case 'email':
      return (
        <a className="text-school-primary underline" href={`mailto:${v}`}>
          {v}
        </a>
      );
    case 'phone':
      return (
        <div className="flex flex-wrap gap-2">
          {v.split(',').map((p, idx) => (
            <a key={idx} className="text-school-primary underline" href={`tel:${p.trim()}`}>
              {p.trim()}
            </a>
          ))}
        </div>
      );
    case 'address':
      return (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(v)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-school-primary underline"
        >
          {v}
        </a>
      );
    case 'url':
      return v ? (
        <a
          href={v.startsWith('http') ? v : `https://${v}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-school-primary underline break-all"
        >
          {v}
        </a>
      ) : (
        '—'
      );
    case 'boolean':
      return v === 'true' || v === '1' ? 'YES' : v === 'false' || v === '0' ? 'NO' : v || '—';
    default:
      return v || '—';
  }
}

function renderDocumentRows(
  rows: MpdDocumentRow[],
  variant: 'accent' | 'green',
): ReactNode {
  return rows.map((item, index) => {
    const show =
      item.status === '✓ Available' ||
      item.status === 'Available' ||
      (item.link && item.link !== '#');
    const href = documentHref(item.link);
    return (
      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-6 py-4 text-sm font-medium text-school-secondary">{item.sno}</td>
        <td className="px-6 py-4 text-sm text-school-secondary">
          {item.information || item.document}
        </td>
        <td className="px-6 py-4">
          {show && href ? (
            <DisclosureDocLink variant={variant} label="View document" link={item.link} />
          ) : (
            <span className="text-sm text-muted-foreground">{item.status}</span>
          )}
        </td>
      </tr>
    );
  });
}

function renderSectionDocuments(
  sec: MpdSection,
  sectionDocs: MpdDocumentRow[],
  variant: 'accent' | 'green',
) {
  const mds = asDocSection(sec);
  if (sectionDocs.length === 0) return null;
  const groups = groupDocsBySegment(sectionDocs, mds);
  const thead = (
    <thead className={variant === 'green' ? 'bg-school-green text-white' : 'bg-school-accent text-school-secondary'}>
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
        <th className="px-6 py-4 text-left text-sm font-semibold">Documents / Particulars</th>
        <th className="px-6 py-4 text-left text-sm font-semibold">PDF / Record</th>
      </tr>
    </thead>
  );
  if (groups.length === 1 && !groups[0].segmentId) {
    return (
      <table className="w-full">
        {thead}
        <tbody className="divide-y divide-gray-200">{renderDocumentRows(groups[0].docs, variant)}</tbody>
      </table>
    );
  }
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <div key={g.segmentId || 'all'}>
          {g.label ? (
            <h3 className="text-lg font-semibold text-school-secondary mb-3 px-1">{g.label}</h3>
          ) : null}
          <table className="w-full">
            {thead}
            <tbody className="divide-y divide-gray-200">{renderDocumentRows(g.docs, variant)}</tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function filterSupportingDocs(
  docs: MpdDocumentRow[],
  clsId: string,
  classLabel: string,
): MpdDocumentRow[] {
  const id = clsId.toLowerCase();
  return docs.filter((d) => {
    const sid = (d.segment_id ?? '').toString().toLowerCase();
    if (id === 'class_x' && sid === 'class_x') return true;
    if (id === 'class_xii' && sid === 'class_xii') return true;
    if (sid === id) return true;
    const t = (d.information ?? '').toLowerCase();
    if (id.includes('xii') || classLabel.toLowerCase().includes('xii')) {
      return (
        /\bclass\s*-?\s*xii\b/.test(t) ||
        /\b12\s*th\b/.test(t) ||
        t.includes('senior secondary')
      );
    }
    if (id.includes('class_x') || (classLabel.toLowerCase().includes('class x') && !classLabel.toLowerCase().includes('xii'))) {
      return t.includes('class x') && !t.includes('xii');
    }
    return false;
  });
}

export function MpdSectionRenderer({ section, documents, loading }: MpdSectionRendererProps) {
  const variant = section.letter === 'C' || section.id === 'academic' ? 'green' : 'accent';
  const sectionDocs = sortDisclosureDocs(documents.filter((d) => d.category === section.id));

  switch (section.type) {
    case 'table': {
      const fields = section.fields ?? [];
      const tableGroups = section.tableGroups;
      const rows = buildTableRenderRows(fields, tableGroups);
      return (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-school-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Particulars</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((item) =>
                  item.kind === 'header' ? (
                    <tr key={item.key} className="bg-school-primary/10">
                      <td
                        colSpan={3}
                        className="px-6 py-3 text-sm font-semibold text-school-secondary uppercase tracking-wide"
                      >
                        {item.title}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={`${item.field.id}-${item.serialNo}`}
                      className={item.serialNo % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-school-secondary">
                        {item.serialNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-school-secondary">{item.field.label}</td>
                      <td className="px-6 py-4 text-sm text-school-secondary font-medium">
                        {renderTableValue(item.field)}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </Card>
      );
    }
    case 'document_list': {
      if (!sectionDocs.length) return null;
      return (
        <Card>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-school-primary" />
              </div>
            ) : (
              renderSectionDocuments(section, sectionDocs, variant)
            )}
          </div>
        </Card>
      );
    }
    case 'staff_table': {
      const fields = section.staffFields ?? [];
      const teachingCountIds = new Set(['pgt', 'tgt', 'prt']);
      const pgtField = fields.find((f) => f.id === 'pgt');
      const tgtField = fields.find((f) => f.id === 'tgt');
      const prtField = fields.find((f) => f.id === 'prt');
      const pgt = Number(pgtField?.value ?? 0) || 0;
      const tgt = Number(tgtField?.value ?? 0) || 0;
      const prt = Number(prtField?.value ?? 0) || 0;
      const totalTeaching = pgt + tgt + prt;
      const mainFields = fields.filter((f) => !teachingCountIds.has(f.id));
      const principalIdx = mainFields.findIndex((f) => f.id === 'principal');
      const totalBlockAt = principalIdx >= 0 ? principalIdx + 1 : 0;

      type StaffDisplayRow =
        | { kind: 'field'; field: MpdSectionField }
        | { kind: 'total_block' };
      const displayRows: StaffDisplayRow[] = [
        ...mainFields.slice(0, totalBlockAt).map((field) => ({ kind: 'field' as const, field })),
        { kind: 'total_block' },
        ...mainFields.slice(totalBlockAt).map((field) => ({ kind: 'field' as const, field })),
      ];
      const teachingSubRows = [
        { id: 'pgt', label: pgtField?.label ?? 'a) PGT', value: pgt },
        { id: 'tgt', label: tgtField?.label ?? 'b) TGT', value: tgt },
        { id: 'prt', label: prtField?.label ?? 'c) PRT', value: prt },
      ];

      let serial = 0;
      const bodyRows: ReactNode[] = [];
      displayRows.forEach((item) => {
        if (item.kind === 'field') {
          serial += 1;
          const stripe = (serial - 1) % 2 === 0 ? 'bg-white' : 'bg-gray-50';
          bodyRows.push(
            <tr key={item.field.id} className={stripe}>
              <td className="px-6 py-4 text-sm font-medium">{serial}</td>
              <td className="px-6 py-4 text-sm">{item.field.label}</td>
              <td className="px-6 py-4 text-sm font-medium whitespace-pre-line">
                {item.field.value || '—'}
              </td>
            </tr>
          );
          return;
        }
        serial += 1;
        const totalStripe = (serial - 1) % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        bodyRows.push(
          <tr key="total_teachers" className={totalStripe}>
            <td className="px-6 py-4 text-sm font-medium">{serial}</td>
            <td className="px-6 py-4 text-sm font-medium">Total teachers (computed)</td>
            <td className="px-6 py-4 text-sm font-medium">{totalTeaching}</td>
          </tr>
        );
        teachingSubRows.forEach((sub) => {
          bodyRows.push(
            <tr key={sub.id} className="bg-gray-50/80">
              <td className="px-6 py-3 text-sm text-muted-foreground">—</td>
              <td className="px-6 py-3 text-sm pl-10 text-muted-foreground">{sub.label}</td>
              <td className="px-6 py-3 text-sm font-medium">{sub.value}</td>
            </tr>
          );
        });
      });

      return (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-school-green text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Information</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">{bodyRows}</tbody>
            </table>
          </div>
        </Card>
      );
    }
    case 'infra_table': {
      const fields = section.infraFields ?? [];
      return (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-school-accent text-school-secondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Parameter</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fields.map((row, index) => {
                  const isYoutubeRow = row.id === 'youtube_inspection';
                  const ytRaw = isYoutubeRow
                    ? row.value?.trim() || section.youtubeInspectionUrl?.trim() || RRGREEN_YOUTUBE_INSPECTION_URL
                    : '';
                  const ytHref = isYoutubeRow ? normalizeYoutubeInspectionUrl(ytRaw) : '';
                  const ytOk = isYoutubeRow ? isYoutubeHttpsInspectionUrlAccepted(ytRaw) : false;
                  return (
                    <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm">{row.label}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {row.type === 'boolean' ? (
                          row.value === 'true' ? 'YES' : 'NO'
                        ) : isYoutubeRow ? (
                          ytOk ? (
                            <DisclosureDocLink
                              variant="accent"
                              label="Watch YouTube inspection video"
                              link={ytHref}
                            />
                          ) : (
                            <span className="text-amber-800 text-sm">
                              Pending valid YouTube HTTPS URL
                            </span>
                          )
                        ) : row.type === 'url' && row.value ? (
                          <DisclosureDocLink variant="green" label="Open file" link={row.value} />
                        ) : (
                          row.value || '—'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </Card>
      );
    }
    case 'result_table': {
      const cat = section.supportingDocsCategoryId || 'academic';
      const supportPool = sortDisclosureDocs(documents.filter((d) => d.category === cat));
      const classes = section.classes ?? [];
      return (
        <Card className="p-8 overflow-x-auto space-y-10">
          {classes.map((cl) => {
            const supporting = filterSupportingDocs(supportPool, cl.id, cl.label);
            const cohortLabel = cl.label.toUpperCase().includes('XII') ? 'XII' : 'X';
            return (
              <div key={cl.id} className="mt-2">
                <h3 className="text-xl font-bold text-school-secondary mb-4">{cl.label}</h3>

                {supporting.length > 0 ? (
                  <div className="mb-4 rounded-lg border border-school-green/30 bg-school-green-light/20 p-4">
                    <p className="text-sm font-semibold text-school-secondary mb-2">
                      Same-page PDF uploads mapped to Class&nbsp;{cohortLabel}
                    </p>
                    <ul className="space-y-2">
                      {supporting.map((doc) => (
                        <li key={doc.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                          <span className="text-school-secondary">{doc.information}</span>
                          <DisclosureDocLink variant="green" label="Open file" link={doc.link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="overflow-x-auto">
                  <table className="w-full border border-school-secondary/15">
                    <thead className="bg-school-green text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">SL NO.</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">YEAR</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">NO. OF REGISTERED STUDENTS</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">NO. OF STUDENTS PASSED</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">PASS PERCENTAGE</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">REMARKS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {cl.rows.map((rw, idx) => {
                        const reg = Number(rw.registered) || 0;
                        const pas = Number(rw.passed) || 0;
                        const placeholder = cl.doesNotOffer;
                        const computed = placeholder ? '00' : passPercent(reg, pas);
                        return (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm font-medium">{idx + 1}</td>
                            <td className="px-4 py-3 text-sm">{placeholder ? '0000' : yearDisplay(rw.year)}</td>
                            <td className="px-4 py-3 text-sm">{placeholder ? '00' : reg || '00'}</td>
                            <td className="px-4 py-3 text-sm">{placeholder ? '00' : pas || '00'}</td>
                            <td className="px-4 py-3 text-sm font-medium">{computed}</td>
                            <td className="px-4 py-3 text-sm">{rw.remarks || cl.remark || 'NA'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </Card>
      );
    }
    case 'freetext': {
      const c = section.content ?? '';
      const asHtml = /<[a-z][\s\S]*>/i.test(c);
      return (
        <Card className="p-6">
          {asHtml ? (
            <div
              className="prose prose-sm max-w-none text-school-secondary"
              dangerouslySetInnerHTML={{ __html: c }}
            />
          ) : (
            <p className="text-school-secondary whitespace-pre-wrap">{c}</p>
          )}
        </Card>
      );
    }
    default:
      return null;
  }
}

export function useMpdReminderFlags(payload: {
  sections: MpdSection[];
  documents: MpdDocumentRow[];
  loading: boolean;
}) {
  const { sections, documents, loading } = payload;
  const docsB = sortDisclosureDocs(documents.filter((d) => d.category === 'documents'));
  const staff = sections.find((s) => s.type === 'staff_table');
  const teacherHref = documentHref(staff?.teacherListUrl ?? '');
  const infra = sections.find((s) => s.type === 'infra_table');

  const showMandatoryUploadReminder = (() => {
    if (loading) return false;
    if (!teacherHref) return true;
    if (!docsB.length) return true;
    return docsB.some((row) => !isMandatoryPortalUploadResolved(row));
  })();

  const showYoutubeHeroReminder = (() => {
    if (loading) return false;
    return !isYoutubeHttpsInspectionUrlAccepted(infra?.youtubeInspectionUrl);
  })();

  return { showMandatoryUploadReminder, showYoutubeHeroReminder };
}
