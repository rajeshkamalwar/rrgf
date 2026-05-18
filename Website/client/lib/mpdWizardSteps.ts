import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Building2,
  ClipboardList,
  FileText,
  School,
  Settings2,
  Users,
} from 'lucide-react';
import type { MpdSection } from '@/lib/mpdDocumentSections';
import { sortMpdSections } from '@/lib/mpdDocumentSections';

export type MpdWizardStepKind = 'overview' | 'section' | 'legal' | 'advanced';

export interface MpdWizardStep {
  id: string;
  kind: MpdWizardStepKind;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** For kind === 'section' */
  sectionId?: string;
}

function iconForSection(sec: MpdSection): LucideIcon {
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
      return FileText;
    default:
      return ClipboardList;
  }
}

function descriptionForSection(sec: MpdSection): string {
  switch (sec.type) {
    case 'table':
      return 'School name, address, contact — Section A table on the public page.';
    case 'document_list':
      return `Add PDF rows here. Each row appears under "${sec.letter} — ${sec.title}" on the public page.`;
    case 'staff_table':
      return 'Staff counts and teacher list file — Section D on the public page.';
    case 'result_table':
      return 'Board exam results grid. Class X/XII PDFs can link from Section C academic uploads.';
    case 'infra_table':
      return 'Building parameters and YouTube inspection link — numeric Section E on the public page.';
    case 'freetext':
      return 'Free text block shown on the public page.';
    default:
      return 'Edit this section.';
  }
}

/** Wizard steps in the same order as visible blocks on the public disclosure page. */
export function buildMpdWizardSteps(sections: MpdSection[]): MpdWizardStep[] {
  const visible = sortMpdSections(sections).filter((s) => s.visible);

  const sectionSteps: MpdWizardStep[] = visible.map((sec) => ({
    id: `sec-${sec.id}`,
    kind: 'section' as const,
    sectionId: sec.id,
    title: sec.title,
    short: sec.letter ? `Sec ${sec.letter}` : sec.id,
    description: descriptionForSection(sec),
    icon: iconForSection(sec),
  }));

  return [
    {
      id: 'overview',
      kind: 'overview',
      title: 'Overview',
      short: 'Start',
      description: 'How this editor matches the public disclosure page.',
      icon: ClipboardList,
    },
    ...sectionSteps,
    {
      id: 'legal',
      kind: 'legal',
      title: 'Legal footer',
      short: 'Footer',
      description: 'Disclaimer and compliance dates at the bottom of the public page.',
      icon: ClipboardList,
    },
    {
      id: 'advanced',
      kind: 'advanced',
      title: 'Optional settings',
      short: 'Optional',
      description: 'Page order, PDF headings, and expert tools — skip if steps above are enough.',
      icon: Settings2,
    },
  ];
}

export function findSectionById(sections: MpdSection[], id: string): MpdSection | undefined {
  return sections.find((s) => s.id === id);
}
