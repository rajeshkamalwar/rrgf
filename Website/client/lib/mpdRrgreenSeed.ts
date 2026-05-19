/**
 * RR Greenfield MPD content from rrgreen - Sheet1.csv (May 2026).
 * Used for defaults and one-shot DB seed scripts.
 */

/** Official school infrastructure inspection video (Section E). */
export const RRGREEN_YOUTUBE_INSPECTION_URL =
  'https://youtu.be/iVS2A1JErCQ?si=_Vq3haCLWnUSJkFV';

/** Teacher list link (Section D — staff table). */
export const RRGREEN_TEACHER_LIST_URL =
  'https://teams.microsoft.com/l/message/19:61637882c7c9415f8d997814ecca0102@thread.v2/1779111399666?context=%7B%22contextType%22%3A%22chat%22%7D';

export const RRGREEN_DOCUMENT_ROWS: Array<{
  category: 'documents' | 'academic';
  sno: string;
  information: string;
  link: string;
  status: string;
  segment_id?: string;
}> = [
  {
    category: 'documents',
    sno: '1',
    information:
      'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any',
    link: '#',
    status: 'Not Applicable',
  },
  {
    category: 'documents',
    sno: '2',
    information: 'Societies/Trust/Company Registration/Renewal Certificate, as applicable',
    link: 'https://drive.google.com/file/d/1_U-6Z0SzHIjsdmbgpCOYw6JG78fdbqEN/view?usp=drive_link',
    status: '✓ Available',
  },
  {
    category: 'documents',
    sno: '3',
    information: 'NOC',
    link: 'https://drive.google.com/file/d/1Obc3UH55OKpTL4kH5lbSjP7qpg5X-9PH/view?usp=drive_link',
    status: '✓ Available',
  },
  {
    category: 'documents',
    sno: '4',
    information: 'Recognition certificate under RTE Act 2009',
    link: 'https://drive.google.com/file/d/1Yoam5ydRykVBdFhWijlDroqwOec3Tymz/view?usp=drive_link',
    status: '✓ Available',
  },
  {
    category: 'documents',
    sno: '5',
    information: 'Building Safety certificate',
    link: 'https://drive.google.com/file/d/1U6yscxWK7zWvXYKYR3g3lYtzHBp_dCxO/view?usp=drive_link',
    status: '✓ Available',
  },
  {
    category: 'documents',
    sno: '6',
    information: 'Fire certificate',
    link: 'https://drive.google.com/file/d/1M3vYQvGBpwrgNfLs0Uw5h1qYBRR8lES0/view?usp=drive_link',
    status: '✓ Available',
  },
  {
    category: 'documents',
    sno: '7',
    information: 'Self Certification',
    link: 'https://drive.google.com/file/d/1hCbN57rVw9TbogUmT6d2BiYVHkzEbonb/view?usp=drive_link',
    status: '✓ Available',
  },
  {
    category: 'documents',
    sno: '8',
    information: 'Water Health & Sanitation certificate',
    link: 'https://drive.google.com/file/d/10fat_7Zt2tYlaHDM7zk8W5gjA0mev6Jg/view?usp=drive_link',
    status: '✓ Available',
  },
  {
    category: 'academic',
    sno: '1',
    information: 'Fees structure',
    link: 'https://drive.google.com/file/d/1yl_zxhoXe0Yap2aNW5i2NNJ-sg4H-DVg/view?usp=drive_link',
    status: '✓ Available',
    segment_id: 'general_academic',
  },
  {
    category: 'academic',
    sno: '2',
    information: 'Annual Academic Calendar',
    link: 'https://drive.google.com/file/d/1uzwqM4WR-vXV1u1Rtc4rBrzsBMoBYxMZ/view?usp=drive_link',
    status: '✓ Available',
    segment_id: 'general_academic',
  },
  {
    category: 'academic',
    sno: '3',
    information: 'SMC List',
    link: 'https://drive.google.com/file/d/1-vKxoy3tJHrGGrHxWz5GUtTAlEOhvfxJ/view?usp=drive_link',
    status: '✓ Available',
    segment_id: 'general_academic',
  },
  {
    category: 'academic',
    sno: '4',
    information: 'PTA',
    link: 'https://drive.google.com/file/d/1SZPc1SI2MtQHFtvgVlRtysI9xLc0NkSL/view?usp=drive_link',
    status: '✓ Available',
    segment_id: 'general_academic',
  },
  {
    category: 'academic',
    sno: '5',
    information: 'Last 3 yrs Result of the board examination as per applicability',
    link: '#',
    status: 'Not Applicable',
    segment_id: 'general_academic',
  },
];

/** V1-shaped payload for migratePayloadV1toV2 — matches CSV section order. */
export function createRrgreenV1Seed(): Record<string, unknown> {
  return {
    documentSections: [
      {
        id: 'documents',
        letter: 'B',
        title: 'Documents and Information',
        sortOrder: 1,
        segments: [
          {
            id: 'compliance',
            label: 'Compliance & certificates',
            sortOrder: 1,
            keywords: ['fire', 'building', 'sanitary', 'trust', 'affidavit', 'recognition', 'noc'],
          },
          {
            id: 'governance',
            label: 'Governance & committees',
            sortOrder: 2,
            keywords: ['smc', 'pta', 'management committee', 'self certification'],
          },
        ],
      },
      {
        id: 'academic',
        letter: 'C',
        title: 'Result and Academics',
        sortOrder: 2,
        segments: [
          { id: 'class_x', label: 'Class X', sortOrder: 1, keywords: ['class x', 'class-x', '10th'] },
          {
            id: 'class_xii',
            label: 'Class XII',
            sortOrder: 2,
            keywords: ['class xii', 'class 12', '12th', 'senior secondary'],
          },
          {
            id: 'general_academic',
            label: 'General academic',
            sortOrder: 3,
            keywords: ['fee', 'calendar', 'result', 'academic', 'smc', 'pta'],
          },
        ],
      },
    ],
    sectionA: [
      { sno: '1', information: 'NAME OF THE SCHOOL', details: 'RR GREENFIELD INTERNATIONAL SCHOOL' },
      { sno: '2', information: 'AFFILIATION NO. (IF APPLICABLE)', details: '331348' },
      { sno: '3', information: 'SCHOOL CODE (IF APPLICABLE)', details: '67201' },
      {
        sno: '4',
        information: 'COMPLETE ADDRESS WITH PIN CODE',
        details: 'West bypass, Sahugadh Road, Ward No. 2, Madhepura - 852113, Bihar',
      },
      { sno: '5', information: 'NAME OF PRINCIPAL', details: 'Rakesh Ranjan' },
      { sno: '6', information: 'PRINCIPAL QUALIFICATION', details: 'M.A., B.Ed.' },
      { sno: '7', information: 'SCHOOL EMAIL ID', details: 'rrgreenfieldsch@gmail.com' },
      { sno: '8', information: 'CONTACT DETAILS (MOBILE)', details: '8210215818, 7903059909' },
    ],
    staff: {
      principal: 'Rakesh Ranjan',
      pgt: 0,
      tgt: 6,
      prt: 12,
      totalTeachers: 21,
      teacherSectionRatio: '1:1.5',
      specialEducator: 1,
      specialEducatorDetails:
        'REENA VISHVAKARMA — D.el.ed (VI), B.ed (special education), MA (social studies) pursuing, CTET qualified, MOB: 6296960455, VI Diploma in visual impairment',
      counsellor: 1,
      counsellorDetails: 'PAWAN KUMAR RAJ — PG IN PSYCHOLOGY, MOB: 8603119206',
      librarian: 1,
    },
    teacherListUrl: RRGREEN_TEACHER_LIST_URL,
    infrastructure: {
      campusAreaSqMtr: 6070.28,
      classroomCount: 22,
      classroomSizeSqMtr: 47,
      labCount: 6,
      labSizeSqMtr: 56,
      internetFacility: true,
      girlsToilets: 14,
      boysToilets: 16,
      youtubeInspectionUrl: RRGREEN_YOUTUBE_INSPECTION_URL,
      teachersListUrl:
        'https://drive.google.com/file/d/1Fp_vaPgAbnS6Xrw_BH3Ndb-LDdQFzZnd/view?usp=drive_link',
      infrastructureDocLink: '',
    },
    results: {
      classX: {
        doesNotOffer: true,
        remark: 'NA',
        rows: [{ year: '', registered: 0, passed: 0, remarks: 'NA' }],
      },
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
}
