import { ExternalLink } from 'lucide-react';

/**
 * Repo / hosting often exposes some PDFs at site root (`/fire.pdf`) while portal mapping used
 * `/documents/…` URLs. Map legacy paths before encoding segments.
 */
export function applyLegacyPublicPdfAliases(pathSlash: string): string {
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

export function documentHref(link: string): string | null {
  if (!link || link === '#') return null;
  if (link.startsWith('http://') || link.startsWith('https://')) return link;
  const normalizedRaw = link.startsWith('/') ? link : `/${link.replace(/^\.\//, '')}`;
  const normalized = applyLegacyPublicPdfAliases(normalizedRaw);
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

export function normalizeYoutubeHttpsHref(raw: string | undefined): string {
  const t = typeof raw === 'string' ? raw.trim() : '';
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `https://${t.replace(/^\/+/u, '')}`;
}

/** Host is youtube.com, youtu.be, or a youtube subdomain (m., music., etc.). */
function isYoutubeHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^www\./i, '');
  if (h === 'youtu.be' || h === 'youtube.com') return true;
  return h.endsWith('.youtube.com');
}

/** Prefer https://www.youtube.com/watch?v=… for links; youtu.be short URLs are normalized. */
export function normalizeYoutubeInspectionUrl(raw: string | undefined): string {
  const urlStr = normalizeYoutubeHttpsHref(raw);
  if (!urlStr || !isYoutubeHttpsInspectionUrlAccepted(urlStr)) return '';
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase().replace(/^www\./i, '');
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]?.split('?')[0];
      if (id) return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    }
    return urlStr;
  } catch {
    return urlStr;
  }
}

/** Validates host for CBSE appendix inspection video URLs (youtube.com / youtu.be). */
export function isYoutubeHttpsInspectionUrlAccepted(raw: string | undefined): boolean {
  const urlStr = normalizeYoutubeHttpsHref(raw);
  if (!urlStr) return false;
  try {
    const u = new URL(urlStr);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    return isYoutubeHost(u.hostname);
  } catch {
    return false;
  }
}

export function passPercent(reg: number, pas: number): string {
  if (!reg || reg <= 0) return '—';
  return `${((100 * pas) / reg).toFixed(2)}%`;
}

/** Year placeholders like "0000" treated as undisclosed */
export function yearDisplay(year: string | undefined): string {
  const y = String(year ?? '').trim();
  if (!y || y === '0000') return '—';
  return y;
}

export function isMandatoryPortalUploadResolved(row: {
  status?: string;
  link?: string;
}): boolean {
  const st = (row.status ?? '').trim();
  if (st === '✓ Available' || st === 'Available') return true;
  const lk = (row.link ?? '').trim();
  if (!lk || lk === '#') return false;
  const href = documentHref(lk);
  return Boolean(href && href !== '/');
}

/** Clickable `<a>` is printable and crawler-friendly versus JS-only buttons */
export function DisclosureDocLink(props: {
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
