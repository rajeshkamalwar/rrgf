import { Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MpdSectionRenderer, type MpdDocumentRow } from '@/components/MpdSectionRenderer';
import type { MpdSection } from '@/lib/mpdDocumentSections';

export interface MpdSectionPreviewProps {
  section: MpdSection;
  documents: MpdDocumentRow[];
  publicPosition?: number;
  publicTotal?: number;
}

/** Live preview using the same renderer as the public Mandatory Disclosure page. */
export function MpdSectionPreview({
  section,
  documents,
  publicPosition,
  publicTotal,
}: MpdSectionPreviewProps) {
  const heading =
    section.letter && section.title
      ? `${section.letter} — ${section.title}`
      : section.title || section.id;

  return (
    <Card className="border-school-primary/20 bg-gradient-to-b from-school-primary/5 to-background h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-school-primary shrink-0" />
              Public page preview
            </CardTitle>
            <CardDescription className="mt-1">
              This is how visitors see this block on{' '}
              <span className="font-medium">/mandatory-public-disclosure</span>
            </CardDescription>
          </div>
          {publicPosition != null && publicTotal != null ? (
            <Badge variant="outline" className="shrink-0 text-xs">
              Block {publicPosition} of {publicTotal}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-school-secondary mb-3 flex items-center gap-2">
            <Badge className="font-mono">{section.letter || '—'}</Badge>
            {section.title}
          </h3>
          <MpdSectionRenderer section={section} documents={documents} loading={false} />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Heading on site: <span className="font-medium">{heading}</span>
          {section.type === 'document_list' ? (
            <> · PDF rows use category id <code className="text-[11px] bg-muted px-1 rounded">{section.id}</code></>
          ) : null}
        </p>
      </CardContent>
    </Card>
  );
}
