import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  FileText,
  ExternalLink,
  School,
  Users,
  Building2,
  BookOpen,
  ClipboardList,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface DocumentRow {
  id: string;
  category: 'documents' | 'academic' | 'infrastructure';
  sno: string;
  document?: string;
  information?: string;
  link: string;
  status: string;
}

interface GeneralRow {
  sno: string;
  information: string;
  details: string;
}

interface StaffBlock {
  pgt: number;
  tgt: number;
  prt: number;
  teacherSectionRatio: string;
  specialEducator: number;
  counsellor: number;
}

interface InfrastructureBlock {
  campusAreaSqMtr: number;
  classroomCount: number;
  classroomSizeSqMtr: number;
  labCount: number;
  labSizeSqMtr: number;
  internetFacility: boolean;
  girlsToilets: number;
  boysToilets: number;
  youtubeInspectionUrl: string;
  additionalFacilities: string;
  infrastructureDocLink: string;
}

interface ResultYearRow {
  year: string;
  registered: number;
  passed: number;
  remarks: string;
}

interface ClassOutcome {
  doesNotOffer: boolean;
  remark?: string;
  rows: ResultYearRow[];
}

interface Disclosure {
  sectionA: GeneralRow[];
  staff: StaffBlock;
  teacherListUrl: string;
  infrastructure: InfrastructureBlock;
  results: {
    classX: ClassOutcome;
    classXII: ClassOutcome;
  };
  legalDisclaimer: string;
  complianceDeadline?: string;
  directiveReference?: string;
}

function passPercent(reg: number, pas: number): string {
  if (!reg || reg <= 0) return '—';
  return `${((100 * pas) / reg).toFixed(2)}%`;
}

/** Year placeholders like "0000" treated as undisclosed */
function yearDisplay(year: string | undefined): string {
  const y = String(year ?? '').trim();
  if (!y || y === '0000') return '—';
  return y;
}

/**
 * Repo / hosting often exposes some PDFs at site root (`/fire.pdf`) while portal mapping used
 * `/documents/…` URLs. Map legacy paths before encoding segments.
 */
function applyLegacyPublicPdfAliases(pathSlash: string): string {
  const qIndex = pathSlash.indexOf('?');
  const pathOnly = qIndex >= 0 ? pathSlash.slice(0, qIndex) : pathSlash;
  const qs = qIndex >= 0 ? pathSlash.slice(qIndex) : '';
  const norm = pathOnly.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  const key = norm.toLowerCase();
  const table: Record<string, string> = {
    '/documents/fire.pdf': '/fire.pdf',
    '/documents/infrastructure.pdf': '/INFRASTRUCTURE.pdf',
  };
  const hit = table[key];
  return hit ? `${hit}${qs}` : pathSlash;
}

function documentHref(link: string): string | null {
  if (!link || link === '#') return null;
  if (link.startsWith('http://') || link.startsWith('https://')) return link;
  const normalizedRaw = link.startsWith('/') ? link : `/${link.replace(/^\.\//, '')}`;
  const normalized = applyLegacyPublicPdfAliases(normalizedRaw);
  /** Spaces / unicode in filenames (e.g. "Registration Certificate.pdf") */
  const qIndex = normalized.indexOf('?');
  const rawPath = qIndex >= 0 ? normalized.slice(0, qIndex) : normalized;
  const qs = qIndex >= 0 ? normalized.slice(qIndex) : '';
  const pathOnly = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
  const encoded =
    '/' +
    pathOnly
      .split('/')
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join('/') +
    qs;
  return encoded || '/';
}

function isMandatoryPortalUploadResolved(row: DocumentRow): boolean {
  const st = (row.status ?? '').trim();
  if (st === '✓ Available' || st === 'Available') return true;
  const lk = (row.link ?? '').trim();
  if (!lk || lk === '#') return false;
  const href = documentHref(lk);
  return Boolean(href && href !== '/');
}

function normalizeYoutubeHttpsHref(raw: string | undefined): string {
  const t = typeof raw === 'string' ? raw.trim() : '';
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `https://${t.replace(/^\/+/u, '')}`;
}

/** Validates host for CBSE appendix inspection video URLs (youtube.com / youtu.be). */
function isYoutubeHttpsInspectionUrlAccepted(raw: string | undefined): boolean {
  const urlStr = normalizeYoutubeHttpsHref(raw);
  if (!urlStr) return false;
  try {
    const u = new URL(urlStr);
    let host = u.hostname.toLowerCase();
    host = host.replace(/^www\./i, '');
    if (host === 'youtu.be') return true;
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) return true;
    return false;
  } catch {
    return false;
  }
}

/** Clickable `<a>` is printable and crawler-friendly versus JS-only buttons */
function DisclosureDocLink(props: {
  label: string;
  link: string;
  variant?: 'primary' | 'accent' | 'green';
}) {
  const href = documentHref(props.link);
  const pal =
    props.variant === 'green'
      ? 'border-school-green text-school-green hover:bg-school-green hover:text-white'
      : props.variant === 'accent'
        ? 'border-school-accent text-school-secondary hover:bg-school-accent hover:text-school-secondary'
        : 'border-school-primary text-school-primary hover:bg-school-primary hover:text-white';

  if (!href || href === '/') {
    return <span className="text-sm text-muted-foreground">Not provided</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${pal}`}
    >
      <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
      {props.label}
    </a>
  );
}

const DEFAULT_DISCLOSURE: Omit<Disclosure, 'results'> & {
  results: Disclosure['results'];
} = {
  sectionA: [
    { sno: '1', information: 'NAME OF THE SCHOOL', details: 'RR GREENFIELD INTERNATIONAL SCHOOL' },
    {
      sno: '2',
      information: 'AFFILIATION NO. (IF APPLICABLE)',
      details: 'As applicable / update from affiliation letter',
    },
    { sno: '3', information: 'SCHOOL CODE (IF APPLICABLE)', details: '21311612021919150645' },
    {
      sno: '4',
      information: 'COMPLETE ADDRESS WITH PIN CODE',
      details: 'New bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar',
    },
    { sno: '5', information: 'NAME OF PRINCIPAL', details: 'Rakesh Ranjan' },
    { sno: '6', information: 'PRINCIPAL QUALIFICATION', details: 'M.A., B.Ed.' },
    { sno: '7', information: 'SCHOOL EMAIL ID', details: 'rrgreenfieldsch@gmail.com' },
    { sno: '8', information: 'CONTACT DETAILS (MOBILE)', details: '7903059909, 8210215818' },
  ],
  staff: {
    pgt: 0,
    tgt: 6,
    prt: 8,
    teacherSectionRatio: '1:1.5',
    specialEducator: 1,
    counsellor: 1,
  },
  teacherListUrl: '',
  infrastructure: {
    campusAreaSqMtr: 6070.28,
    classroomCount: 22,
    classroomSizeSqMtr: 47,
    labCount: 6,
    labSizeSqMtr: 56,
    internetFacility: true,
    girlsToilets: 14,
    boysToilets: 16,
    youtubeInspectionUrl: '',
    additionalFacilities:
      'Library: 112 sq mtr, Sick Room: 33 sq mtr, Sports & Games Room: 119 sq mtr, Arts & Music Room: 32 sq mtr',
    infrastructureDocLink: '/documents/infradoc.jpeg',
  },
  results: {
    classX: { doesNotOffer: true, remark: 'NA', rows: [{ year: '', registered: 0, passed: 0, remarks: 'NA' }] },
    classXII: {
      doesNotOffer: true,
      remark: 'NA',
      rows: [{ year: '', registered: 0, passed: 0, remarks: 'NA' }],
    },
  },
  legalDisclaimer:
    'Note: THE SCHOOL NEEDS TO UPLOAD SELF-ATTESTED COPIES OF ABOVE LISTED DOCUMENTS BY CHAIRMAN/MANAGER/SECRETARY AND PRINCIPAL. IN CASE IT IS NOTICED AT LATER STAGE THAT UPLOADED DOCUMENTS ARE NOT GENUINE THEN SCHOOL SHALL BE LIABLE FOR ACTION AS PER NORMS.',
  complianceDeadline: '2026-05-21',
  directiveReference: 'CBSE/MPD/AFF./2026 dated 06.05.2026',
};

const MandatoryDisclosure = () => {
  const heroAnimation = useScrollAnimation();
  const introAnimation = useScrollAnimation();

  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [disclosure, setDisclosure] = useState<Disclosure | null>(null);
  const [mpdUpdatedAt, setMpdUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMpd();
  }, []);

  const loadMpd = async () => {
    try {
      const response = await fetch('/api/mpd');
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents || []);
        setDisclosure(normalizeDisclosure(data.disclosure ?? {}));
        setMpdUpdatedAt(data.mpdUpdatedAt || null);
      } else {
        setDisclosure(mergeFallbackDisclosure(DEFAULT_DISCLOSURE));
      }
    } catch {
      setDisclosure(mergeFallbackDisclosure(DEFAULT_DISCLOSURE));
    } finally {
      setLoading(false);
    }
  };

  const docsB = documents.filter((d) => d.category === 'documents');
  const docsAcademic = documents.filter((d) => d.category === 'academic');
  const docsInfra = documents.filter((d) => d.category === 'infrastructure');

  const d = disclosure ?? mergeFallbackDisclosure(DEFAULT_DISCLOSURE);

  const totalTeachingStaff = useMemo(() => {
    const s = d.staff;
    return Number(s.pgt ?? 0) + Number(s.tgt ?? 0) + Number(s.prt ?? 0);
  }, [d.staff]);

  const jsonLd = useMemo(() => {
    const schoolName =
      d.sectionA.find((r) => r.information.includes('NAME OF'))?.details ??
      'RR Greenfield International School';
    const address =
      d.sectionA.find((r) => r.information.includes('ADDRESS'))?.details ?? 'Madhepura, Bihar';
    const email =
      d.sectionA.find((r) => r.information.includes('EMAIL'))?.details ?? 'rrgreenfieldsch@gmail.com';
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: schoolName,
      address,
      email,
      url: typeof window !== 'undefined' ? window.location.origin : 'https://rrgreenfieldmadhepura.in',
    });
  }, [d.sectionA]);

  useEffect(() => {
    const id = 'rrgf-mpd-jsonld';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.text = jsonLd;
    return () => {
      /** keep script — updating is enough */
    };
  }, [jsonLd]);

  const classXSupportingDocs = useMemo(
    () =>
      docsAcademic.filter((d) => {
        const t = (d.information ?? '').toLowerCase();
        return t.includes('class x') && !t.includes('xii');
      }),
    [docsAcademic],
  );

  const classXIISupportingDocs = useMemo(
    () =>
      docsAcademic.filter((d) => {
        const t = (d.information ?? '').toLowerCase();
        return (
          /\bclass\s*-?\s*xii\b/.test(t) ||
          /\b12\s*th\b/.test(t) ||
          t.includes('senior secondary')
        );
      }),
    [docsAcademic],
  );

  const pinnedAcademicDocIds = useMemo(() => {
    const s = new Set<string>();
    for (const row of classXSupportingDocs) s.add(row.id);
    for (const row of classXIISupportingDocs) s.add(row.id);
    return s;
  }, [classXSupportingDocs, classXIISupportingDocs]);

  const docsAcademicRemainder = useMemo(
    () => docsAcademic.filter((d) => !pinnedAcademicDocIds.has(d.id)),
    [docsAcademic, pinnedAcademicDocIds],
  );

  const ytHref = useMemo(() => {
    const raw = d.infrastructure.youtubeInspectionUrl?.trim();
    return raw ? normalizeYoutubeHttpsHref(raw) : '';
  }, [d.infrastructure.youtubeInspectionUrl]);

  const ytLooksValid = useMemo(
    () => isYoutubeHttpsInspectionUrlAccepted(d.infrastructure.youtubeInspectionUrl),
    [d.infrastructure.youtubeInspectionUrl],
  );

  const teacherListHref = useMemo(() => documentHref(d.teacherListUrl), [d.teacherListUrl]);

  /** After data hydrates from /api/mpd — hide nag once Section B + teacher list CSV are both resolved. */
  const showMandatoryUploadReminder = useMemo(() => {
    if (loading) return false;
    if (!teacherListHref) return true;
    if (!docsB.length) return true;
    return docsB.some((row) => !isMandatoryPortalUploadResolved(row));
  }, [loading, docsB, teacherListHref]);

  const showYoutubeHeroReminder = useMemo(
    () => !loading && !ytLooksValid,
    [loading, ytLooksValid],
  );

  const infraRows: Array<{
    sno: string;
    information: string;
    detail: string;
    yt?: boolean;
  }> = [
    {
      sno: '1',
      information: 'TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR)',
      detail: `${d.infrastructure.campusAreaSqMtr}`,
    },
    {
      sno: '2',
      information: 'NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)',
      detail: `${d.infrastructure.classroomCount} (each ${d.infrastructure.classroomSizeSqMtr} sq mtr)`,
    },
    {
      sno: '3',
      information: 'NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)',
      detail: `${String(d.infrastructure.labCount).padStart(2, '0')} (each ${d.infrastructure.labSizeSqMtr} sq mtr)`,
    },
    {
      sno: '4',
      information: 'INTERNET FACILITY',
      detail: d.infrastructure.internetFacility ? 'YES' : 'NO',
    },
    { sno: '5', information: 'NO. OF GIRLS TOILETS', detail: String(d.infrastructure.girlsToilets) },
    { sno: '6', information: 'NO. OF BOYS TOILETS', detail: String(d.infrastructure.boysToilets) },
    {
      sno: '7',
      information: 'LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL (INFRASTRUCTURE)',
      detail: '',
      yt: true,
    },
    {
      sno: '8',
      information: 'ADDITIONAL FACILITIES (AS APPLICABLE)',
      detail: d.infrastructure.additionalFacilities || '—',
    },
  ];

  const renderGeneralCellDetails = (row: GeneralRow) => {
    if (row.information.includes('EMAIL')) {
      return (
        <a className="text-school-primary underline" href={`mailto:${row.details}`}>
          {row.details}
        </a>
      );
    }
    if (row.information.includes('CONTACT') || row.information.includes('MOBILE')) {
      const phones = row.details.split(',');
      return (
        <div className="flex flex-wrap gap-2">
          {phones.map((p, idx) => (
            <a key={idx} className="text-school-primary underline" href={`tel:${p.trim()}`}>
              {p.trim()}
            </a>
          ))}
        </div>
      );
    }
    if (row.information.includes('ADDRESS')) {
      const q = encodeURIComponent(row.details);
      return (
        <a
          href={`https://maps.google.com/?q=${q}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-school-primary underline"
        >
          {row.details}
        </a>
      );
    }
    return row.details;
  };

  function renderOutcomeTable(
    title: string,
    outcome: ClassOutcome,
    supportingPortalRows?: DocumentRow[],
  ) {
    const cohortLabel = title.includes('XII') ? 'XII' : 'X';
    return (
      <div className="mt-10">
        <h3 className="text-xl font-bold text-school-secondary mb-4">{title}</h3>

        {supportingPortalRows && supportingPortalRows.length > 0 ? (
          <div className="mb-4 rounded-lg border border-school-green/30 bg-school-green-light/20 p-4">
            <p className="text-sm font-semibold text-school-secondary mb-2">
              Same-page PDF uploads mapped to Class&nbsp;{cohortLabel}
            </p>
            <ul className="space-y-2">
              {supportingPortalRows.map((doc) => (
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
                <th className="px-4 py-3 text-left text-sm font-semibold">REGISTERED</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">PASSED</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">PASS %</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">REMARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {outcome.rows.map((rw, idx) => {
                const reg = Number(rw.registered) || 0;
                const pas = Number(rw.passed) || 0;
                const computed = outcome.doesNotOffer ? 'NA' : passPercent(reg, pas);
                return (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{outcome.doesNotOffer ? '—' : yearDisplay(rw.year)}</td>
                    <td className="px-4 py-3 text-sm">{outcome.doesNotOffer ? '—' : reg || '—'}</td>
                    <td className="px-4 py-3 text-sm">{outcome.doesNotOffer ? '—' : pas || '—'}</td>
                    <td className="px-4 py-3 text-sm font-medium">{computed}</td>
                    <td className="px-4 py-3 text-sm">{rw.remarks || outcome.remark || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mandatory-disclosure-print">
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div ref={heroAnimation.elementRef} className="relative container mx-auto px-4 text-center">
          <Badge className="bg-school-accent text-school-secondary mb-4">Appendix‑IX compliant layout</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Mandatory Public Disclosure</h1>
          <p className="text-xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            RR Greenfield International School · Madhepura, Bihar — structured per CBSE revised Appendix‑IX &
            Directorate communication {d.directiveReference ?? DEFAULT_DISCLOSURE.directiveReference}
          </p>
          <p className="mt-4 text-sm text-white/90 font-medium">
            Last updated (MPD disclosure data){' '}
            {mpdUpdatedAt ? new Date(mpdUpdatedAt).toLocaleString('en-IN') : loading ? '…' : '—'}
          </p>
          {showYoutubeHeroReminder ? (
            <p className="mt-6 inline-flex flex-wrap justify-center gap-2 rounded-md bg-amber-500/95 px-4 py-3 text-school-secondary max-w-2xl mx-auto text-sm shadow">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              <span className="text-left font-medium">
                YouTube inspection link is missing or was rejected (e.g. invalid “wwwyoutubecom”). Please add a
                full https URL on Admin → Appendix‑IX Data.
              </span>
            </p>
          ) : null}
        </div>
      </section>

      <section className="py-10 bg-muted/40 border-b mandatory-disclosure-intro">
        <div ref={introAnimation.elementRef} className="container mx-auto px-4">
          <Card>
            <CardContent className="p-8 space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="h-8 w-8 text-school-primary shrink-0" aria-hidden />
                <div className="text-school-secondary space-y-2">
                  <h2 className="text-lg font-semibold">Public access & SARAS checklist</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    This page follows the hierarchical order A → B → C → D → E used in Appendix‑IX. Downloadable
                    PDFs open in a new tab with rel=&quot;noopener&quot; for security. CBSE examples often use the
                    path /mandatory-public-disclosure — this site serves the same content at that URL and at
                    /mandatory-disclosure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* A — General information */}
      <section className="py-16 bg-school-green-light/10" aria-labelledby="mpd-a">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-school-primary w-12 h-12 rounded-full flex items-center justify-center">
              <School className="h-6 w-6 text-white" aria-hidden />
            </div>
            <h2 id="mpd-a" className="text-3xl font-bold text-school-secondary">
              A — General Information
            </h2>
          </div>
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
                  {d.sectionA.map((row, index) => (
                    <tr key={row.sno} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-school-secondary">{row.sno}</td>
                      <td className="px-6 py-4 text-sm text-school-secondary">{row.information}</td>
                      <td className="px-6 py-4 text-sm text-school-secondary font-medium">
                        {renderGeneralCellDetails(row)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* B — Documents */}
      <section className="py-16 bg-white" aria-labelledby="mpd-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-school-accent w-12 h-12 rounded-full flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-school-secondary" aria-hidden />
            </div>
            <h2 id="mpd-b" className="text-3xl font-bold text-school-secondary">
              B — Documents &amp; Information
            </h2>
          </div>
          {showMandatoryUploadReminder ? (
            <p className="text-school-secondary/70 mb-6 max-w-4xl">
              Self-attested copies (per CBSE letter) should be uploaded for each entry. Use the admin panel to attach
              PDFs.
            </p>
          ) : null}
          <Card>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-school-primary" />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-school-accent text-school-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Documents / Particulars</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">PDF / Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {docsB.map((item, index) => {
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
                              <DisclosureDocLink variant="accent" label="View document" link={item.link} />
                            ) : (
                              <span className="text-sm text-muted-foreground">{item.status}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* C — Staff */}
      <section className="py-16 bg-school-green-light/10" aria-labelledby="mpd-c">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-school-green w-12 h-12 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" aria-hidden />
            </div>
            <h2 id="mpd-c" className="text-3xl font-bold text-school-secondary">
              C — Staff (Teaching / Support)
            </h2>
          </div>

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
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-sm font-medium">1</td>
                    <td className="px-6 py-4 text-sm">PGT</td>
                    <td className="px-6 py-4 text-sm font-medium">{d.staff.pgt}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">2</td>
                    <td className="px-6 py-4 text-sm">TGT</td>
                    <td className="px-6 py-4 text-sm font-medium">{d.staff.tgt}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-sm font-medium">3</td>
                    <td className="px-6 py-4 text-sm">PRT</td>
                    <td className="px-6 py-4 text-sm font-medium">{d.staff.prt}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">—</td>
                    <td className="px-6 py-4 text-sm">Total teachers (computed)</td>
                    <td className="px-6 py-4 text-sm font-medium">{totalTeachingStaff}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-sm font-medium">4</td>
                    <td className="px-6 py-4 text-sm">Teachers Section Ratio</td>
                    <td className="px-6 py-4 text-sm font-medium">{d.staff.teacherSectionRatio}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">5</td>
                    <td className="px-6 py-4 text-sm">Special Educator</td>
                    <td className="px-6 py-4 text-sm font-medium">{d.staff.specialEducator}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 text-sm font-medium">6</td>
                    <td className="px-6 py-4 text-sm">Counsellor / Wellness Teacher</td>
                    <td className="px-6 py-4 text-sm font-medium">{d.staff.counsellor}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">7</td>
                    <td className="px-6 py-4 text-sm">Upload Teacher&apos;s List (Download sample from Admin portal)</td>
                    <td className="px-6 py-4">
                      {teacherListHref ? (
                        <DisclosureDocLink variant="green" label="View teacher list upload" link={d.teacherListUrl} />
                      ) : (
                        <span className="inline-flex items-center gap-2 text-amber-800 text-sm font-medium">
                          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden /> Not uploaded — use Backend →
                          Appendix‑IX Data.
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* D — Infrastructure */}
      <section className="py-16 bg-white" aria-labelledby="mpd-d">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-school-accent w-12 h-12 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-school-secondary" aria-hidden />
            </div>
            <h2 id="mpd-d" className="text-3xl font-bold text-school-secondary">
              D — School Infrastructure
            </h2>
          </div>

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
                  {infraRows.map((row, index) => (
                    <tr key={row.sno} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium">{row.sno}</td>
                      <td className="px-6 py-4 text-sm">{row.information}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {row.yt ? (
                          ytLooksValid ? (
                            <DisclosureDocLink variant="accent" label="Watch YouTube inspection video" link={ytHref} />
                          ) : (
                            <span className="text-amber-800 text-sm">Pending valid YouTube HTTPS URL</span>
                          )
                        ) : (
                          row.detail
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {d.infrastructure.infrastructureDocLink ? (
              <CardContent className="border-t py-6">
                <h3 className="font-semibold text-school-secondary mb-3">Supporting infrastructure document</h3>
                <DisclosureDocLink
                  variant="accent"
                  label="View infrastructure dossier"
                  link={d.infrastructure.infrastructureDocLink}
                />
              </CardContent>
            ) : null}
          </Card>
        </div>
      </section>

      {/* E — Results */}
      <section className="py-16 bg-school-green-light/10" aria-labelledby="mpd-e">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-school-green w-12 h-12 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" aria-hidden />
            </div>
            <h2 id="mpd-e" className="text-3xl font-bold text-school-secondary">
              E — Result (Class&nbsp;X &amp; XII)
            </h2>
          </div>

          <Card className="p-8 overflow-x-auto">
            {renderOutcomeTable('RESULT: CLASS X', d.results.classX, classXSupportingDocs)}
            {renderOutcomeTable('RESULT: CLASS XII', d.results.classXII, classXIISupportingDocs)}

            {(docsAcademicRemainder.length > 0 || docsInfra.length > 0) && (
              <div className="mt-12 space-y-8">
                {docsAcademicRemainder.length > 0 ? (
                  <div>
                    <h3 className="text-xl font-bold text-school-secondary mb-4">
                      Additional academic disclosure uploads (Board results / summaries)
                    </h3>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm">S.No</th>
                            <th className="px-4 py-3 text-left text-sm">Particular</th>
                            <th className="px-4 py-3 text-left text-sm">File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {docsAcademicRemainder.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 text-sm">{item.sno}</td>
                              <td className="px-4 py-3 text-sm">{item.information}</td>
                              <td className="px-4 py-3">
                                <DisclosureDocLink variant="green" label="View" link={item.link} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {docsInfra.length > 0 ? (
                  <div>
                    <h3 className="text-xl font-bold text-school-secondary mb-4">
                      Infrastructure certificates uploaded on portal
                    </h3>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm">S.No</th>
                            <th className="px-4 py-3 text-left text-sm">Certificate</th>
                            <th className="px-4 py-3 text-left text-sm">File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {docsInfra.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 text-sm">{item.sno}</td>
                              <td className="px-4 py-3 text-sm">{item.information}</td>
                              <td className="px-4 py-3">
                                <DisclosureDocLink variant="accent" label="View" link={item.link} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </Card>
        </div>
      </section>

      <section className="py-12 bg-white mandatory-disclaimer">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          {showMandatoryUploadReminder ? (
            <p className="text-sm leading-relaxed text-school-secondary/90 whitespace-pre-wrap border border-amber-200 bg-amber-50/70 p-6 rounded-xl">
              {(d.legalDisclaimer ?? '').trim()
                ? (d.legalDisclaimer ?? '').trim()
                : DEFAULT_DISCLOSURE.legalDisclaimer}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Developed for compliance with Directorate letter No.&nbsp;
            <span className="font-mono">CBSE/MPD/AFF./2026</span> (submission window ends{' '}
            {d.complianceDeadline || DEFAULT_DISCLOSURE.complianceDeadline} — preserve mail evidence to&nbsp;
            <a className="underline" href="mailto:cbse.aff@nic.in">
              cbse.aff@nic.in
            </a>
            ).
          </p>
        </div>
      </section>
    </div>
  );
};

function normalizeDisclosure(raw: Partial<Disclosure>): Disclosure {
  const base = mergeFallbackDisclosure(DEFAULT_DISCLOSURE);

  /** Accept legacy payloads that used spaced keys / alternate casing */
  const rawResults = (raw.results || {}) as Record<string, unknown>;
  const cxii =
    rawResults.classXII ||
    rawResults.classxii ||
    rawResults['class XII'] ||
    rawResults.class_xii ||
    {};

  const sectionA = Array.isArray(raw.sectionA) && raw.sectionA.length ? raw.sectionA : base.sectionA;

  const staff = { ...base.staff, ...(raw.staff || {}) };
  const infrastructure = { ...base.infrastructure, ...(raw.infrastructure || {}) };

  return {
    sectionA,
    staff,
    teacherListUrl: typeof raw.teacherListUrl === 'string' ? raw.teacherListUrl : base.teacherListUrl || '',
    infrastructure,
    results: {
      classX: { ...base.results.classX, ...(raw.results?.classX || {}) },
      classXII: {
        ...base.results.classXII,
        ...(typeof cxii === 'object' && cxii !== null ? (cxii as ClassOutcome) : {}),
      },
    },
    legalDisclaimer: typeof raw.legalDisclaimer === 'string' ? raw.legalDisclaimer : base.legalDisclaimer,
    complianceDeadline:
      typeof raw.complianceDeadline === 'string' ? raw.complianceDeadline : base.complianceDeadline,
    directiveReference:
      typeof raw.directiveReference === 'string' ? raw.directiveReference : base.directiveReference,
  };
}

function mergeFallbackDisclosure(
  defs: Omit<Disclosure, 'results'> & { results: Disclosure['results'] },
): Disclosure {
  return defs as Disclosure;
}

export default MandatoryDisclosure;
