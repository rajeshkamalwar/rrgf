import fs from 'fs';
import path from 'path';

export interface Document {
  id: string;
  category: 'documents' | 'academic' | 'infrastructure';
  sno: string;
  document?: string;
  information?: string;
  link: string;
  status: string;
}

const DOCUMENTS_FILE = path.join(process.cwd(), 'documents-config.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize with default documents from public folder
const defaultDocuments: Document[] = [
  // B - Documents
  { id: 'doc-1', category: 'documents', sno: '1', document: 'Affiliation/Upgradation Letter and Recent Extension of Affiliation, if any', link: '#', status: 'Not Applicable' },
  { id: 'doc-2', category: 'documents', sno: '2', document: 'Societies/Trust/Company Registration/Renewal Certificate, as applicable', link: '/trustdeed.pdf', status: '✓ Available' },
  { id: 'doc-3', category: 'documents', sno: '3', document: 'No Objection Certificate (NOC) issued by the State Govt./UT, if applicable', link: '/NOC.pdf', status: '✓ Available' },
  { id: 'doc-4', category: 'documents', sno: '4', document: 'Recognition Certificate under RTE Act, 2009, and its renewal if applicable', link: '/RTE.pdf', status: '✓ Available' },
  { id: 'doc-5', category: 'documents', sno: '5', document: 'Valid Building Safety Certificate as per the National Building Code', link: '/Building safty certificate.pdf', status: '✓ Available' },
  { id: 'doc-6', category: 'documents', sno: '6', document: 'Valid Fire Safety Certificate issued by the Competent Authority', link: '/fire.pdf', status: '✓ Available' },
  { id: 'doc-7', category: 'documents', sno: '7', document: 'Self-Certification by the School for Affiliation/Upgradation/Extension of Affiliation', link: '/Self Certification proforma.pdf', status: '✓ Available' },
  { id: 'doc-8', category: 'documents', sno: '8', document: 'Valid Water, Health and Sanitation Certificates', link: '/Drinking water Sanitation certificate.pdf', status: '✓ Available' },
  { id: 'doc-9', category: 'documents', sno: '9', document: 'Land Certificate', link: '/land.pdf', status: '✓ Available' },
  { id: 'doc-10', category: 'documents', sno: '10', document: 'Water Testing Report', link: '/Water testing report.pdf', status: '✓ Available' },
  { id: 'doc-11', category: 'documents', sno: '11', document: 'Registration Certificate', link: '/Registration Certificate.pdf', status: '✓ Available' },
  
  // C - Academic
  { id: 'acad-1', category: 'academic', sno: '1', information: 'FEE STRUCTURE OF THE SCHOOL', link: '/Fees structure.pdf', status: '✓ Available' },
  { id: 'acad-2', category: 'academic', sno: '2', information: 'ANNUAL ACADEMIC CALENDAR', link: '/Calander.pdf', status: '✓ Available' },
  { id: 'acad-3', category: 'academic', sno: '3', information: 'LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)', link: '/SMC_List.pdf', status: '✓ Available' },
  { id: 'acad-4', category: 'academic', sno: '4', information: 'LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS', link: '/PTA.pdf', status: '✓ Available' },
  { id: 'acad-5', category: 'academic', sno: '5', information: 'LAST THREE YEAR RESULT OF THE BOARD EXAMINATION AS APPLICABLE', link: '#', status: 'Not Applicable' },
  
  // E - Infrastructure
  { id: 'infra-8', category: 'infrastructure', sno: '8', information: 'INFRASTRUCTURE DETAILS DOCUMENT', link: '/INFRASTRUCTURE.pdf', status: '✓ Available' },
];

export function getDocuments(): Document[] {
  try {
    if (fs.existsSync(DOCUMENTS_FILE)) {
      const data = fs.readFileSync(DOCUMENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    // Initialize with defaults
    saveDocuments(defaultDocuments);
    return defaultDocuments;
  } catch (error) {
    console.error('Error reading documents:', error);
    return defaultDocuments;
  }
}

export function saveDocuments(documents: Document[]): void {
  try {
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));
  } catch (error) {
    console.error('Error saving documents:', error);
    throw new Error('Failed to save documents');
  }
}

export function getDocumentById(id: string): Document | undefined {
  const documents = getDocuments();
  return documents.find(doc => doc.id === id);
}

export function updateDocument(id: string, updates: Partial<Document>): Document | null {
  const documents = getDocuments();
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index === -1) {
    return null;
  }
  
  documents[index] = { ...documents[index], ...updates };
  saveDocuments(documents);
  return documents[index];
}

export function getUploadsDirectory(): string {
  return UPLOADS_DIR;
}

