import { useState, useEffect, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  FileText,
  School,
  Users,
  Building2,
  BookOpen,
  ClipboardList,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  MpdSectionRenderer,
  useMpdReminderFlags,
  type MpdDocumentRow,
} from '@/components/MpdSectionRenderer';
import {
  createDefaultMpdPayloadV2,
  normalizeFullMpdPayload,
  sortMpdSections,
  type MpdSection,
  type MpdPayloadV2,
} from '@/lib/mpdDocumentSections';

const DEFAULT_PAYLOAD = createDefaultMpdPayloadV2();

function pickSectionIcon(sec: MpdSection): LucideIcon {
  switch (sec.type) {
    case 'table':
      return School;
    case 'staff_table':
      return Users;
    case 'infra_table':
      return Building2;
    case 'result_table':
      return BookOpen;
    case 'document_list':
      return sec.id === 'academic' || sec.letter === 'C' ? BookOpen : ClipboardList;
    case 'freetext':
      return FileText;
    default:
      return ClipboardList;
  }
}

/** Hide empty document lists / blank free-text blocks to match legacy public layout. */
function sectionHasPublicContent(sec: MpdSection, documents: MpdDocumentRow[]): boolean {
  if (sec.type === 'document_list') {
    return documents.some((d) => d.category === sec.id);
  }
  if (sec.type === 'freetext') {
    return Boolean((sec.content ?? '').trim());
  }
  return true;
}

const MandatoryDisclosure = () => {
  const heroAnimation = useScrollAnimation();
  const introAnimation = useScrollAnimation();

  const [documents, setDocuments] = useState<MpdDocumentRow[]>([]);
  const [disclosure, setDisclosure] = useState<MpdPayloadV2 | null>(null);
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
        setDisclosure(normalizeFullMpdPayload(data.disclosure ?? {}));
        setMpdUpdatedAt(data.mpdUpdatedAt || null);
      } else {
        setDisclosure(DEFAULT_PAYLOAD);
      }
    } catch {
      setDisclosure(DEFAULT_PAYLOAD);
    } finally {
      setLoading(false);
    }
  };

  const payload = disclosure ?? DEFAULT_PAYLOAD;

  const sortedVisible = useMemo(
    () => sortMpdSections(payload.sections).filter((s) => s.visible),
    [payload.sections],
  );

  const { showMandatoryUploadReminder, showYoutubeHeroReminder } = useMpdReminderFlags({
    sections: payload.sections,
    documents,
    loading,
  });

  const jsonLd = useMemo(() => {
    const tableSec = payload.sections.find((s) => s.type === 'table');
    const fields = tableSec?.fields ?? [];
    const findVal = (needle: string) =>
      fields.find((f) => f.label.toUpperCase().includes(needle.toUpperCase()))?.value ?? '';
    const schoolName = findVal('NAME OF THE SCHOOL') || 'RR Greenfield International School';
    const address = findVal('ADDRESS') || 'Madhepura, Bihar';
    const email = findVal('EMAIL') || 'rrgreenfieldsch@gmail.com';
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: schoolName,
      address,
      email,
      url: typeof window !== 'undefined' ? window.location.origin : 'https://rrgreenfieldmadhepura.in',
    });
  }, [payload.sections]);

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

  return (
    <div className="min-h-screen mandatory-disclosure-print">
      <section className="relative bg-gradient-to-br from-school-primary via-school-primary-light to-school-green text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div ref={heroAnimation.elementRef} className="relative container mx-auto px-4 text-center">
          <Badge className="bg-school-accent text-school-secondary mb-4">Appendix‑IX compliant layout</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Mandatory Public Disclosure</h1>
          <p className="text-xl text-white/95 max-w-4xl mx-auto leading-relaxed">
            RR Greenfield International School · Madhepura, Bihar — structured per CBSE revised Appendix‑IX &
            Directorate communication {payload.directiveReference ?? DEFAULT_PAYLOAD.directiveReference}
          </p>
          <p className="mt-4 text-sm text-white/90 font-medium">
            Last updated (MPD disclosure data){' '}
            {mpdUpdatedAt ? new Date(mpdUpdatedAt).toLocaleString('en-IN') : loading ? '…' : '—'}
          </p>
          {showYoutubeHeroReminder ? (
            <p className="mt-6 inline-flex flex-wrap justify-center gap-2 rounded-md bg-amber-500/95 px-4 py-3 text-school-secondary max-w-2xl mx-auto text-sm shadow">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              <span className="text-left font-medium">
                YouTube inspection link is missing or was rejected (e.g. invalid “wwwyoutubecom”). Please add a full
                https URL on Admin → Appendix‑IX Data.
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
                    Sections below follow the order configured in Admin → Appendix‑IX (schema V2). Downloadable PDFs
                    open in a new tab with rel=&quot;noopener&quot; for security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {sortedVisible
        .filter((sec) => sectionHasPublicContent(sec, documents))
        .map((sec, secIndex) => {
          const SectionIcon = pickSectionIcon(sec);
          const isAcademic =
            sec.id === 'academic' || sec.type === 'result_table' || sec.letter === 'C';
          const bgClass = secIndex % 2 === 0 ? 'bg-white' : 'bg-school-green-light/10';
          const iconWrap = isAcademic ? 'bg-school-green' : 'bg-school-accent';
          const iconCls = isAcademic ? 'text-white' : 'text-school-secondary';

          return (
            <section
              key={sec.id}
              className={`py-16 ${bgClass}`}
              aria-labelledby={`mpd-${sec.id}`}
            >
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`${iconWrap} w-12 h-12 rounded-full flex items-center justify-center`}>
                    <SectionIcon className={`h-6 w-6 ${iconCls}`} aria-hidden />
                  </div>
                  <h2 id={`mpd-${sec.id}`} className="text-3xl font-bold text-school-secondary">
                    {sec.letter} — {sec.title}
                  </h2>
                </div>
                {sec.id === 'documents' && showMandatoryUploadReminder ? (
                  <p className="text-school-secondary/70 mb-6 max-w-4xl">
                    Self-attested copies (per CBSE letter) should be uploaded for each entry. Use the admin panel to
                    attach PDFs.
                  </p>
                ) : null}
                <MpdSectionRenderer section={sec} documents={documents} loading={loading} />
              </div>
            </section>
          );
        })}

      <section className="py-12 bg-white mandatory-disclaimer">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          {showMandatoryUploadReminder ? (
            <p className="text-sm leading-relaxed text-school-secondary/90 whitespace-pre-wrap border border-amber-200 bg-amber-50/70 p-6 rounded-xl">
              {(payload.legalDisclaimer ?? '').trim()
                ? (payload.legalDisclaimer ?? '').trim()
                : DEFAULT_PAYLOAD.legalDisclaimer}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Developed for compliance with Directorate letter No.&nbsp;
            <span className="font-mono">CBSE/MPD/AFF./2026</span> (submission window ends{' '}
            {payload.complianceDeadline || DEFAULT_PAYLOAD.complianceDeadline} — preserve mail evidence to&nbsp;
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

export default MandatoryDisclosure;
