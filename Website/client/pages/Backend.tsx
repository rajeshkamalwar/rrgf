import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Server, 
  Lock, 
  Send, 
  CheckCircle, 
  XCircle, 
  Loader2,
  LogOut,
  Settings,
  TestTube,
  FileText,
  Upload,
  Menu,
  X,
  Image,
  Images,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RefreshCw,
  Edit2,
  ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  from: string;
  to: string;
  hasPassword?: boolean;
}

interface Document {
  id: string;
  category: 'documents' | 'academic' | 'infrastructure';
  sno: string;
  document?: string;
  information?: string;
  link: string;
  status: string;
}

type View = 'smtp' | 'mpd-appendix' | 'documents' | 'hero-images' | 'gallery' | 'graph-api';

interface MpdSectionRow {
  sno: string;
  information: string;
  details: string;
}

interface MpdStaff {
  pgt: number;
  tgt: number;
  prt: number;
  teacherSectionRatio: string;
  specialEducator: number;
  counsellor: number;
}

interface MpdInfrastructure {
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

interface MpdResultYearRow {
  year: string;
  registered: number;
  passed: number;
  remarks: string;
}

interface MpdClassOutcome {
  doesNotOffer: boolean;
  remark: string;
  rows: MpdResultYearRow[];
}

interface MpdPayload {
  sectionA: MpdSectionRow[];
  staff: MpdStaff;
  teacherListUrl: string;
  infrastructure: MpdInfrastructure;
  results: { classX: MpdClassOutcome; classXII: MpdClassOutcome };
  legalDisclaimer: string;
  complianceDeadline: string;
  directiveReference: string;
}

interface HeroImage {
  id: string;
  imageUrl: string;
  order: number;
}

interface GalleryImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'events' | 'academics' | 'sports' | 'cultural' | 'infrastructure' | 'students';
  title?: string;
  description?: string;
  order: number;
  folderId?: number;
  folderName?: string;
}

interface GalleryConfig {
  oneDriveFolderLink?: string;
  oneDriveFolderId?: string;
  lastSync?: string;
}

interface OneDriveFolder {
  id: number;
  name: string;
  folderLink: string;
  folderId?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  imageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

const Backend = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [currentView, setCurrentView] = useState<View>('smtp');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // SMTP state
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    host: '',
    port: 587,
    user: '',
    from: '',
    to: '',
  });
  const [smtpPassword, setSmtpPassword] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  
  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Hero images state
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  
  // Gallery state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryConfig, setGalleryConfig] = useState<GalleryConfig>({});
  const [onedriveFolders, setOnedriveFolders] = useState<OneDriveFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [filterFolderId, setFilterFolderId] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<'events' | 'academics' | 'sports' | 'cultural' | 'infrastructure' | 'students'>('events');
  const [newImageFolderId, setNewImageFolderId] = useState<number | null>(null);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageDescription, setNewImageDescription] = useState('');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editingFolder, setEditingFolder] = useState<OneDriveFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderLink, setNewFolderLink] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');

  // Graph API state
  const [graphApiConfig, setGraphApiConfig] = useState({
    clientId: '',
    tenantId: '',
    isActive: false,
    hasSecret: false,
  });
  const [graphApiClientSecret, setGraphApiClientSecret] = useState('');

  /** CBSE Appendix-IX snapshot (persisted via /api/admin/mpd) */
  const [mpdDraft, setMpdDraft] = useState<MpdPayload | null>(null);
  const [mpdUpdatedAt, setMpdUpdatedAt] = useState<string | null>(null);
  const [mpdSaving, setMpdSaving] = useState(false);
  const [uploadingTeacherList, setUploadingTeacherList] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (sessionId) {
      checkAuth(sessionId);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Load documents when authenticated and on documents view
  useEffect(() => {
    if (isAuthenticated && currentView === 'documents') {
      loadDocuments();
    }
  }, [isAuthenticated, currentView]);

  // Load hero images when authenticated and on hero-images view
  useEffect(() => {
    if (isAuthenticated && currentView === 'hero-images') {
      loadHeroImages();
    }
  }, [isAuthenticated, currentView]);

  // Load gallery when authenticated and on gallery view
  useEffect(() => {
    if (isAuthenticated && currentView === 'gallery') {
      loadGallery();
    }
  }, [isAuthenticated, currentView]);

  // Load Graph API config when authenticated and on graph-api view
  useEffect(() => {
    if (isAuthenticated && currentView === 'graph-api') {
      loadGraphApiConfig();
    }
  }, [isAuthenticated, currentView]);

  useEffect(() => {
    if (isAuthenticated && currentView === 'mpd-appendix') {
      loadMpdAdminPayload();
    }
  }, [isAuthenticated, currentView]);

  const checkAuth = async (sessionId: string) => {
    try {
      // Use dedicated auth check endpoint to avoid 401 console errors
      const response = await fetch('/api/admin/check-auth', {
        headers: {
          'x-session-id': sessionId,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.authenticated) {
          setIsAuthenticated(true);
          loadSMTPConfig(sessionId);
        } else {
          // Session invalid or expired - silently clear it
          localStorage.removeItem('adminSessionId');
          setIsAuthenticated(false);
        }
      } else {
        // Session invalid or expired - silently clear it
        localStorage.removeItem('adminSessionId');
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Network error or other issue - silently clear session
      localStorage.removeItem('adminSessionId');
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success && data.sessionId) {
        localStorage.setItem('adminSessionId', data.sessionId);
        setIsAuthenticated(true);
        toast.success('Login successful');
        loadSMTPConfig(data.sessionId);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (sessionId) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
      });
    }
    localStorage.removeItem('adminSessionId');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const loadSMTPConfig = async (sessionId: string) => {
    try {
      const response = await fetch('/api/admin/smtp', {
        headers: {
          'x-session-id': sessionId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.config) {
          setSmtpConfig(data.config);
        } else {
          // If no config exists, keep default empty values
          setSmtpConfig({
            host: '',
            port: 587,
            user: '',
            from: '',
            to: '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading SMTP config:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const normalizeMpdPayload = (incoming: Partial<MpdPayload>): MpdPayload => {
    const empty: MpdPayload = {
      sectionA: [],
      staff: { pgt: 0, tgt: 6, prt: 8, teacherSectionRatio: '1:1.5', specialEducator: 1, counsellor: 1 },
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
        additionalFacilities: '',
        infrastructureDocLink: '/documents/infradoc.jpeg',
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
    const rawR = (incoming.results || {}) as Partial<MpdPayload['results']> &
      Record<'class XII' | 'classXII' | 'classX', MpdClassOutcome | undefined>;

    const cxiiSrc =
      rawR.classXII ||
      rawR['class XII'];
    const classXIIOut = cxiiSrc ? { ...empty.results.classXII, ...cxiiSrc } : empty.results.classXII;

    return {
      sectionA: incoming.sectionA?.length ? incoming.sectionA : empty.sectionA,
      staff: { ...empty.staff, ...incoming.staff },
      teacherListUrl: incoming.teacherListUrl ?? '',
      infrastructure: { ...empty.infrastructure, ...incoming.infrastructure },
      results: {
        classX: { ...empty.results.classX, ...(rawR.classX || {}) },
        classXII: classXIIOut,
      },
      legalDisclaimer: incoming.legalDisclaimer || empty.legalDisclaimer,
      complianceDeadline: incoming.complianceDeadline || empty.complianceDeadline,
      directiveReference: incoming.directiveReference || empty.directiveReference,
    };
  };

  const loadMpdAdminPayload = async () => {
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      if (!sessionId) return;
      const response = await fetch('/api/admin/mpd', {
        headers: { 'x-session-id': sessionId },
      });
      const data = await response.json();
      if (data.success && data.disclosure) {
        setMpdDraft(normalizeMpdPayload(data.disclosure));
        setMpdUpdatedAt(data.mpdUpdatedAt ?? null);
      } else if (!response.ok) {
        toast.error(data.error || 'Failed to load MPD data — run mpd migration on database');
      }
    } catch {
      toast.error('Failed to load Appendix-IX disclosure');
    }
  };

  const saveMpdAdminPayload = async () => {
    if (!mpdDraft) return;
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired');
      return;
    }
    setMpdSaving(true);
    try {
      const response = await fetch('/api/admin/mpd', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ disclosure: mpdDraft }),
      });
      const data = await response.json();
      if (data.success && data.disclosure) {
        setMpdDraft(normalizeMpdPayload(data.disclosure));
        setMpdUpdatedAt(data.mpdUpdatedAt ?? null);
        toast.success('MPD Appendix-IX data saved');
      } else {
        toast.error(data.error || 'Save failed');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setMpdSaving(false);
    }
  };

  const downloadTeacherSampleCsv = async () => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) return;
    try {
      const response = await fetch('/api/admin/mpd/sample-teachers', {
        headers: { 'x-session-id': sessionId },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cbse-teacher-list-sample.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Could not download sample CSV');
    }
  };

  const handleTeacherListUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) return;
    setUploadingTeacherList(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const response = await fetch('/api/admin/mpd/teacher-list', {
        method: 'POST',
        headers: { 'x-session-id': sessionId },
        body: fd,
      });
      const data = await response.json();
      if (data.success && data.disclosure) {
        setMpdDraft(normalizeMpdPayload(data.disclosure));
        setMpdUpdatedAt(data.mpdUpdatedAt ?? null);
        toast.success('Teacher list uploaded');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingTeacherList(false);
    }
  };

  const appendixDaysRemaining = (isoDate: string) => {
    const end = new Date(isoDate + 'T23:59:59');
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const loadHeroImages = async () => {
    try {
      const response = await fetch('/api/hero-images');
      const data = await response.json();
      if (data.success) {
        setHeroImages(data.images);
      }
    } catch (error) {
      console.error('Error loading hero images:', error);
      toast.error('Failed to load hero images');
    }
  };

  const handleSaveSMTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const configToSave: any = {
        ...(smtpConfig || {}),
      };

      if (smtpPassword) {
        configToSave.password = smtpPassword;
      }

      const response = await fetch('/api/admin/smtp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify(configToSave),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('SMTP configuration saved successfully');
        setSmtpConfig(data.config);
        setSmtpPassword('');
        setConnectionStatus('idle');
        setConnectionMessage('');
      } else {
        toast.error(data.error || 'Failed to save SMTP configuration');
      }
    } catch (error) {
      toast.error('Failed to save SMTP configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionMessage('');

    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/smtp/test-connection', {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();

      if (data.success) {
        setConnectionStatus('success');
        setConnectionMessage('SMTP connection successful!');
        toast.success('Connection test successful');
      } else {
        setConnectionStatus('error');
        setConnectionMessage(data.error || 'Connection test failed');
        toast.error(data.error || 'Connection test failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage('Failed to test connection');
      toast.error('Failed to test connection');
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    setIsLoading(true);
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/smtp/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Test email sent successfully!');
        setTestEmail('');
      } else {
        toast.error(data.error || 'Failed to send test email');
      }
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    setUploadingFile(true);
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'x-session-id': sessionId,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Document uploaded successfully');
        loadDocuments();
        setSelectedDocument(null);
      } else {
        toast.error(data.error || 'Failed to upload document');
      }
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploadingFile(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleUpdateDocumentLink = async (documentId: string, link: string) => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ link }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Document link updated successfully');
        loadDocuments();
        setSelectedDocument(null);
      } else {
        toast.error(data.error || 'Failed to update document');
      }
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files (jpeg, jpg, png, webp) are allowed');
      return;
    }

    setUploadingHeroImage(true);
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/hero-images', {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hero image uploaded successfully');
        loadHeroImages();
      } else {
        toast.error(data.error || 'Failed to upload hero image');
      }
    } catch (error) {
      toast.error('Failed to upload hero image');
    } finally {
      setUploadingHeroImage(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleRemoveHeroImage = async (id: string) => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    if (!confirm('Are you sure you want to remove this hero image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/hero-images/${id}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hero image removed successfully');
        loadHeroImages();
      } else {
        toast.error(data.error || 'Failed to remove hero image');
      }
    } catch (error) {
      toast.error('Failed to remove hero image');
    }
  };

  const handleReorderHeroImages = async (newOrder: HeroImage[]) => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/hero-images/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ images: newOrder }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hero images order updated successfully');
        setHeroImages(data.images);
      } else {
        toast.error(data.error || 'Failed to update hero images order');
      }
    } catch (error) {
      toast.error('Failed to update hero images order');
    }
  };

  const loadGallery = async () => {
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      if (!sessionId) return;

      // Load folders
      await loadFolders();

      // Load config (backward compatibility)
      const configResponse = await fetch('/api/admin/gallery/config', {
        headers: { 'x-session-id': sessionId },
      });
      const configData = await configResponse.json();
      if (configData.success) {
        setGalleryConfig(configData.config);
      }

      // Load images (with optional folder filter)
      const imagesUrl = filterFolderId 
        ? `/api/admin/gallery/images?folderId=${filterFolderId}`
        : '/api/admin/gallery/images';
      const imagesResponse = await fetch(imagesUrl, {
        headers: { 'x-session-id': sessionId },
      });
      const imagesData = await imagesResponse.json();
      if (imagesData.success) {
        setGalleryImages(imagesData.images);
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error('Failed to load gallery');
    }
  };

  const loadFolders = async () => {
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      if (!sessionId) return;

      const response = await fetch('/api/admin/folders', {
        headers: { 'x-session-id': sessionId },
      });
      const data = await response.json();
      if (data.success) {
        setOnedriveFolders(data.folders);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName || !newFolderLink) {
      toast.error('Folder name and link are required');
      return;
    }

    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          name: newFolderName,
          folderLink: newFolderLink,
          description: newFolderDescription || undefined,
          isActive: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Folder created successfully');
        setNewFolderName('');
        setNewFolderLink('');
        setNewFolderDescription('');
        loadFolders();
      } else {
        toast.error(data.error || 'Failed to create folder');
      }
    } catch (error) {
      toast.error('Failed to create folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFolder = async (folder: OneDriveFolder) => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/folders/${folder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify(folder),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Folder updated successfully');
        setEditingFolder(null);
        loadFolders();
      } else {
        toast.error(data.error || 'Failed to update folder');
      }
    } catch (error) {
      toast.error('Failed to update folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm('Are you sure you want to delete this folder? Images will be unlinked but not deleted.')) {
      return;
    }

    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/folders/${id}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Folder deleted successfully');
        loadFolders();
        loadGallery();
      } else {
        toast.error(data.error || 'Failed to delete folder');
      }
    } catch (error) {
      toast.error('Failed to delete folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchFolderImages = async (folderId: number) => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/folders/${folderId}/fetch`, {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();

      // Check response status first
      if (!response.ok || !data.success) {
        // Check for Graph API not configured error (501 or error message)
        if (response.status === 501 || data.error?.includes('Graph API') || data.error?.includes('credentials not configured')) {
          toast.error(
            'Microsoft Graph API not configured. Automatic fetching requires Graph API setup. ' +
            'Please add images manually by copying SharePoint image URLs and pasting them in the "Add Image" section below.',
            { duration: 10000 }
          );
        } else if (response.status === 401 || data.error?.includes('401') || data.error?.includes('Unauthorized')) {
          // Authentication/Authorization error
          toast.error(
            'Graph API authentication failed. This usually means: ' +
            '1) The sharing link is set to "Organization only" (change it to "Anyone with the link"), ' +
            '2) API permissions need admin consent, or ' +
            '3) The app cannot access this folder. ' +
            'You can still add images manually using individual image URLs.',
            { duration: 12000 }
          );
        } else if (response.status === 404 || data.error?.includes('404') || data.error?.includes('not found')) {
          toast.error(
            'Folder not found via Graph API. The sharing link format may not be supported. ' +
            'Please add images manually using individual image URLs from your SharePoint folder.',
            { duration: 10000 }
          );
        } else {
          toast.warning(data.error || data.message || 'Unable to fetch images', { duration: 8000 });
        }
        return;
      }

      // Success case
      toast.success(data.message || `Successfully fetched ${data.imagesAdded || 0} images`);
      loadGallery();
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch images from folder. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGalleryConfig = async (oneDriveLink: string, autoFetch: boolean = true) => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/gallery/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ 
          oneDriveFolderLink: oneDriveLink,
          autoFetch: autoFetch,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.imagesAdded !== undefined) {
          toast.success(`Gallery configured! ${data.imagesAdded} images automatically added.`);
        } else {
          toast.success('Gallery configuration updated successfully. Click "Fetch Images" to load images.');
        }
        setGalleryConfig(data.config);
        if (data.imagesAdded > 0) {
          loadGallery(); // Reload gallery to show new images
        }
      } else {
        toast.error(data.error || 'Failed to update gallery configuration');
      }
    } catch (error) {
      toast.error('Failed to update gallery configuration');
    }
  };

  const handleFetchOneDriveImages = async () => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/gallery/fetch-drive', {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully fetched ${data.imagesAdded || 0} images from OneDrive`);
        loadGallery(); // Reload gallery to show new images
      } else {
        toast.warning(data.message || data.error || 'Unable to fetch images automatically');
      }
    } catch (error) {
      toast.error('Failed to fetch images from OneDrive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGalleryImage = async () => {
    if (!newImageUrl || !newImageCategory) {
      toast.error('Image URL and category are required');
      return;
    }

    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      // OneDrive URLs are already in embeddable format or can be used directly
      let imageUrl = newImageUrl;
      let thumbnailUrl = newImageUrl;
      
      // OneDrive links are typically already embeddable or will be handled by the backend

      const response = await fetch('/api/admin/gallery/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          imageUrl,
          thumbnailUrl,
          category: newImageCategory,
          title: newImageTitle || undefined,
          description: newImageDescription || undefined,
          folderId: newImageFolderId || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Gallery image added successfully');
        setNewImageUrl('');
        setNewImageTitle('');
        setNewImageDescription('');
        setNewImageFolderId(null);
        loadGallery();
      } else {
        toast.error(data.error || 'Failed to add gallery image');
      }
    } catch (error) {
      toast.error('Failed to add gallery image');
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/images/${id}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Gallery image deleted successfully');
        loadGallery();
      } else {
        toast.error(data.error || 'Failed to delete gallery image');
      }
    } catch (error) {
      toast.error('Failed to delete gallery image');
    }
  };

  const handleDeleteAllGalleryImages = async () => {
    if (galleryImages.length === 0) {
      toast.info('No images to delete');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ALL ${galleryImages.length} gallery images? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/gallery/images', {
        method: 'DELETE',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`All ${data.deleted || galleryImages.length} gallery images deleted successfully`);
        loadGallery();
      } else {
        toast.error(data.error || 'Failed to delete all gallery images');
      }
    } catch (error) {
      toast.error('Failed to delete all gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGraphApiConfig = async () => {
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      if (!sessionId) return;

      const response = await fetch('/api/admin/graph-api/config', {
        headers: { 'x-session-id': sessionId },
      });
      const data = await response.json();
      if (data.success) {
        setGraphApiConfig(data.config || {
          clientId: '',
          tenantId: '',
          isActive: false,
          hasSecret: false,
        });
      }
    } catch (error) {
      console.error('Error loading Graph API config:', error);
    }
  };

  const handleSaveGraphApiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      if (!sessionId) {
        toast.error('Session expired. Please login again.');
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('/api/admin/graph-api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          clientId: graphApiConfig.clientId,
          tenantId: graphApiConfig.tenantId,
          clientSecret: graphApiClientSecret || undefined, // Only send if provided
          isActive: graphApiConfig.isActive,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Graph API configuration saved successfully');
        setGraphApiClientSecret(''); // Clear secret field after saving
        // Update state with returned config if available
        if (data.config) {
          setGraphApiConfig(data.config);
        } else {
          // Fallback: reload config
          loadGraphApiConfig();
        }
      } else {
        toast.error(data.error || 'Failed to save Graph API configuration');
      }
    } catch (error) {
      toast.error('Failed to save Graph API configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGraphApi = async () => {
    setIsLoading(true);
    try {
      const sessionId = localStorage.getItem('adminSessionId');
      if (!sessionId) {
        toast.error('Session expired. Please login again.');
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('/api/admin/graph-api/test', {
        method: 'POST',
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message || 'Graph API connection test successful!');
      } else {
        toast.error(data.error || 'Graph API connection test failed');
      }
    } catch (error) {
      toast.error('Failed to test Graph API connection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGalleryImage = async (id: string, updates: Partial<GalleryImage>) => {
    const sessionId = localStorage.getItem('adminSessionId');
    if (!sessionId) {
      toast.error('Session expired. Please login again.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Gallery image updated successfully');
        setEditingImage(null);
        loadGallery();
      } else {
        toast.error(data.error || 'Failed to update gallery image');
      }
    } catch (error) {
      toast.error('Failed to update gallery image');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-school-primary via-school-primary-light to-school-green flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Backend Admin</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  placeholder="Enter password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === 'smtp') {
      return (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>SMTP Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your SMTP settings for sending enquiry emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSMTP} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host" className="flex items-center space-x-2">
                      <Server className="h-4 w-4" />
                      <span>SMTP Host *</span>
                    </Label>
                    <Input
                      id="host"
                      type="text"
                      value={smtpConfig?.host || ''}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                      placeholder="smtp.gmail.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="port">SMTP Port *</Label>
                    <Input
                      id="port"
                      type="number"
                      value={smtpConfig?.port || 587}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, port: parseInt(e.target.value) || 587 })}
                      placeholder="587"
                      min="1"
                      max="65535"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>SMTP Username *</span>
                    </Label>
                    <Input
                      id="user"
                      type="text"
                      value={smtpConfig?.user || ''}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                      placeholder="your-email@gmail.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>SMTP Password {smtpConfig?.hasPassword ? '(leave blank to keep current)' : '*'}</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder={smtpConfig?.hasPassword ? 'Enter new password' : 'Enter password'}
                      required={!smtpConfig?.hasPassword}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From Email Address *</Label>
                    <Input
                      id="from"
                      type="email"
                      value={smtpConfig?.from || ''}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, from: e.target.value })}
                      placeholder="sender@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To Email Address (Recipient) *</Label>
                    <Input
                      id="to"
                      type="text"
                      value={smtpConfig?.to || ''}
                      onChange={(e) => setSmtpConfig({ ...smtpConfig, to: e.target.value })}
                      placeholder="email1@gmail.com, email2@gmail.com"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      For multiple recipients, separate emails with commas (e.g., email1@gmail.com, email2@gmail.com)
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={connectionStatus === 'testing'}
                    className="flex-1"
                  >
                    {connectionStatus === 'testing' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>

                {connectionMessage && (
                  <Alert className={connectionStatus === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                    <div className="flex items-center space-x-2">
                      {connectionStatus === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={connectionStatus === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {connectionMessage}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Send Test Email</span>
              </CardTitle>
              <CardDescription>
                Send a test email to verify your SMTP configuration is working
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testEmail">Test Email Address</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                <Button
                  onClick={handleSendTestEmail}
                  disabled={isLoading || !testEmail}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      );
    }

    if (currentView === 'mpd-appendix') {
      if (!mpdDraft) {
        return (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
          </div>
        );
      }
      const dl = appendixDaysRemaining(mpdDraft.complianceDeadline);

      const updateOutcomeRow =
        (
          key: 'classX' | 'classXII',
          field: keyof MpdResultYearRow,
          value: string | number,
        ) => {
          setMpdDraft((prev) => {
            if (!prev) return prev;
            const outcome = prev.results[key];
            const rows = [...outcome.rows];
            rows[0] = { ...rows[0], [field]: value };
            return {
              ...prev,
              results: {
                ...prev.results,
                [key]: { ...outcome, rows },
              },
            };
          });
        };

      return (
        <div className="space-y-6">
          <Alert variant="default" className="border-red-200 bg-red-50 text-school-secondary">
            <AlertDescription className="space-y-1">
              <div className="font-semibold">CBSE MPD restoration — Appendix-IX</div>
              <div className="text-sm">
                Target deadline:{' '}
                <span className="font-mono">{mpdDraft.complianceDeadline}</span> (
                {dl >= 0 ? `${dl} day(s) remaining` : `${Math.abs(dl)} day(s) past — update urgently`}). Submit mail
                pack to{' '}
                <a href="mailto:cbse.aff@nic.in" className="underline font-medium">
                  cbse.aff@nic.in
                </a>
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" /> Appendix‑IX structured data
                </CardTitle>
                <CardDescription>
                  Public page loads from /api/mpd · Last saved:{' '}
                  {mpdUpdatedAt ? new Date(mpdUpdatedAt).toLocaleString('en-IN') : '—'} · Matches hierarchy A→E on
                  the site
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/mandatory-public-disclosure" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Preview public URL
                  </Link>
                </Button>
                <Button onClick={saveMpdAdminPayload} disabled={mpdSaving}>
                  {mpdSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" /> SAVE DATA
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section A — General information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mpdDraft.sectionA.map((row, idx) => (
                <div key={row.sno} className="grid gap-2 md:grid-cols-3 md:items-center border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">{row.information}</div>
                  <div className="md:col-span-2">
                    <Input
                      value={row.details}
                      onChange={(e) => {
                        const v = e.target.value;
                        setMpdDraft((p) =>
                          !p
                            ? p
                            : {
                                ...p,
                                sectionA: p.sectionA.map((r, i) =>
                                  i === idx ? { ...r, details: v } : r,
                                ),
                              },
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section C — Staff</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [['pgt', 'PGT'], ['tgt', 'TGT'], ['prt', 'PRT'], ['specialEducator', 'Special educator'], ['counsellor', 'Counsellor']] as const
              ).map(([field, label]) => (
                <div key={field} className="space-y-1">
                  <Label>{label}</Label>
                  <Input
                    type="number"
                    value={Number(mpdDraft.staff[field as keyof MpdStaff])}
                    onChange={(e) =>
                      setMpdDraft((p) =>
                        !p
                          ? p
                          : {
                              ...p,
                              staff: {
                                ...p.staff,
                                [field]: parseInt(e.target.value, 10) || 0,
                              },
                            },
                      )
                    }
                  />
                </div>
              ))}
              <div className="space-y-1 sm:col-span-2 lg:col-span-2">
                <Label>Teachers : Section ratio</Label>
                <Input
                  value={mpdDraft.staff.teacherSectionRatio}
                  onChange={(e) =>
                    setMpdDraft((p) => (!p ? p : { ...p, staff: { ...p.staff, teacherSectionRatio: e.target.value } }))
                  }
                  placeholder="1:1.5"
                />
              </div>
              <div className="space-y-2 rounded-lg border p-4 sm:col-span-2 lg:col-span-3">
                <div className="font-medium">Teacher list upload (Appendix‑IX field 8)</div>
                <p className="text-sm text-muted-foreground">
                  Current file:{' '}
                  <span className="font-mono text-xs">{mpdDraft.teacherListUrl || 'Not uploaded'}</span>
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button variant="outline" size="sm" type="button" onClick={downloadTeacherSampleCsv}>
                    Download sample CSV
                  </Button>
                  <Input type="file" accept=".pdf,.csv,.xlsx,.xls" className="max-w-xs" onChange={handleTeacherListUpload} disabled={uploadingTeacherList} />
                  {uploadingTeacherList ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section D — Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ['campusAreaSqMtr', 'Campus area (sq mtr)'],
                  ['classroomCount', 'No. classrooms'],
                  ['classroomSizeSqMtr', 'Size per classroom (sq mtr)'],
                  ['labCount', 'No. labs'],
                  ['labSizeSqMtr', 'Size per lab (sq mtr)'],
                  ['girlsToilets', 'Girls toilets'],
                  ['boysToilets', 'Boys toilets'],
                ] as const
              ).map(([k, label]) => (
                <div key={k} className="space-y-1">
                  <Label>{label}</Label>
                  <Input
                    type="number"
                    step="any"
                    value={mpdDraft.infrastructure[k]}
                    onChange={(e) =>
                      setMpdDraft((p) =>
                        !p
                          ? p
                          : {
                              ...p,
                              infrastructure: {
                                ...p.infrastructure,
                                [k]: parseFloat(e.target.value) || 0,
                              },
                            },
                      )
                    }
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 sm:col-span-3">
                <Checkbox
                  id="inet"
                  checked={mpdDraft.infrastructure.internetFacility}
                  onCheckedChange={(checked) =>
                    setMpdDraft((p) =>
                      !p
                        ? p
                        : {
                            ...p,
                            infrastructure: {
                              ...p.infrastructure,
                              internetFacility: Boolean(checked),
                            },
                          },
                    )
                  }
                />
                <Label htmlFor="inet">Internet facility</Label>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <Label>YouTube inspection video (full https URL — fixes bad wwwyoutubecom paste)</Label>
                <Input
                  value={mpdDraft.infrastructure.youtubeInspectionUrl}
                  onChange={(e) =>
                    setMpdDraft((p) =>
                      !p
                        ? p
                        : {
                            ...p,
                            infrastructure: {
                              ...p.infrastructure,
                              youtubeInspectionUrl: e.target.value,
                            },
                          },
                    )
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-1 sm:col-span-3">
                <Label>Additional facilities (text)</Label>
                <Input
                  value={mpdDraft.infrastructure.additionalFacilities}
                  onChange={(e) =>
                    setMpdDraft((p) =>
                      !p
                        ? p
                        : {
                            ...p,
                            infrastructure: {
                              ...p.infrastructure,
                              additionalFacilities: e.target.value,
                            },
                          },
                    )
                  }
                />
              </div>
              <div className="space-y-1 sm:col-span-3">
                <Label>Infrastructure supporting document URL</Label>
                <Input
                  value={mpdDraft.infrastructure.infrastructureDocLink}
                  onChange={(e) =>
                    setMpdDraft((p) =>
                      !p
                        ? p
                        : {
                            ...p,
                            infrastructure: {
                              ...p.infrastructure,
                              infrastructureDocLink: e.target.value,
                            },
                          },
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section E — Results (Classes X / XII)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {(['classX', 'classXII'] as const).map((gk) => {
                const outcome = mpdDraft.results[gk];
                const title = gk === 'classX' ? 'Class X' : 'Class XII';
                return (
                  <div key={gk} className="rounded-lg border p-4 space-y-4">
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="font-semibold">{title}</div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`dnf-${gk}`}
                          checked={outcome.doesNotOffer}
                          onCheckedChange={(checked) =>
                            setMpdDraft((p) =>
                              !p
                                ? p
                                : {
                                    ...p,
                                    results: {
                                      ...p.results,
                                      [gk]: { ...outcome, doesNotOffer: Boolean(checked) },
                                    },
                                  },
                            )
                          }
                        />
                        <Label htmlFor={`dnf-${gk}`}>School does not offer / no data yet (hides placeholders)</Label>
                      </div>
                    </div>
                    {!outcome.doesNotOffer ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <Label>Year (4 digits)</Label>
                          <Input
                            value={outcome.rows[0]?.year ?? ''}
                            onChange={(e) => updateOutcomeRow(gk, 'year', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Registered</Label>
                          <Input
                            type="number"
                            value={outcome.rows[0]?.registered ?? 0}
                            onChange={(e) =>
                              updateOutcomeRow(gk, 'registered', parseInt(e.target.value, 10) || 0)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Passed</Label>
                          <Input
                            type="number"
                            value={outcome.rows[0]?.passed ?? 0}
                            onChange={(e) => updateOutcomeRow(gk, 'passed', parseInt(e.target.value, 10) || 0)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Remarks</Label>
                          <Input
                            value={outcome.rows[0]?.remarks ?? ''}
                            onChange={(e) => updateOutcomeRow(gk, 'remarks', e.target.value)}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
              <div className="space-y-1">
                <Label>Legal disclaimer footer (see CBSE Annex note)</Label>
                <textarea
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[100px]"
                  value={mpdDraft.legalDisclaimer}
                  onChange={(e) => setMpdDraft((p) => (!p ? p : { ...p, legalDisclaimer: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Compliance deadline (YYYY-MM-DD)</Label>
                  <Input
                    value={mpdDraft.complianceDeadline}
                    onChange={(e) => setMpdDraft((p) => (!p ? p : { ...p, complianceDeadline: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Directive reference (display)</Label>
                  <Input
                    value={mpdDraft.directiveReference}
                    onChange={(e) => setMpdDraft((p) => (!p ? p : { ...p, directiveReference: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentView === 'documents') {
      const documentsByCategory = {
        documents: documents.filter(d => d.category === 'documents'),
        academic: documents.filter(d => d.category === 'academic'),
        infrastructure: documents.filter(d => d.category === 'infrastructure'),
      };

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Mandatory Disclosure Documents</span>
              </CardTitle>
              <CardDescription>
                Manage PDF documents for the mandatory disclosure page
              </CardDescription>
            </CardHeader>
          </Card>

          {/* B - Documents */}
          <Card>
            <CardHeader>
              <CardTitle>B - Documents and Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentsByCategory.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-sm">S.No: {doc.sno}</span>
                          <span className={`px-2 py-1 rounded text-xs ${doc.status === '✓ Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {doc.document || doc.information}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Current: {doc.link === '#' ? 'Not set' : doc.link}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDocument(selectedDocument?.id === doc.id ? null : doc)}
                      >
                        {selectedDocument?.id === doc.id ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    {selectedDocument?.id === doc.id && (
                      <div className="border-t pt-4 space-y-3">
                        <div className="space-y-2">
                          <Label>Upload New PDF</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, doc.id)}
                              disabled={uploadingFile}
                              className="flex-1"
                            />
                            {uploadingFile && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Or Enter Link</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="text"
                              placeholder="/path/to/file.pdf"
                              defaultValue={doc.link}
                              onBlur={(e) => {
                                if (e.target.value !== doc.link) {
                                  handleUpdateDocumentLink(doc.id, e.target.value);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* C - Academic */}
          <Card>
            <CardHeader>
              <CardTitle>C - Result and Academics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentsByCategory.academic.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-sm">S.No: {doc.sno}</span>
                          <span className={`px-2 py-1 rounded text-xs ${doc.status === '✓ Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {doc.information}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Current: {doc.link === '#' ? 'Not set' : doc.link}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDocument(selectedDocument?.id === doc.id ? null : doc)}
                      >
                        {selectedDocument?.id === doc.id ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    {selectedDocument?.id === doc.id && (
                      <div className="border-t pt-4 space-y-3">
                        <div className="space-y-2">
                          <Label>Upload New PDF</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, doc.id)}
                              disabled={uploadingFile}
                              className="flex-1"
                            />
                            {uploadingFile && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Or Enter Link</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="text"
                              placeholder="/path/to/file.pdf"
                              defaultValue={doc.link}
                              onBlur={(e) => {
                                if (e.target.value !== doc.link) {
                                  handleUpdateDocumentLink(doc.id, e.target.value);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* E - Infrastructure */}
          <Card>
            <CardHeader>
              <CardTitle>E - School Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentsByCategory.infrastructure.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-sm">S.No: {doc.sno}</span>
                          <span className={`px-2 py-1 rounded text-xs ${doc.status === '✓ Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {doc.information}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Current: {doc.link === '#' ? 'Not set' : doc.link}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDocument(selectedDocument?.id === doc.id ? null : doc)}
                      >
                        {selectedDocument?.id === doc.id ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    {selectedDocument?.id === doc.id && (
                      <div className="border-t pt-4 space-y-3">
                        <div className="space-y-2">
                          <Label>Upload New PDF</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload(e, doc.id)}
                              disabled={uploadingFile}
                              className="flex-1"
                            />
                            {uploadingFile && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Or Enter Link</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="text"
                              placeholder="/path/to/file.pdf"
                              defaultValue={doc.link}
                              onBlur={(e) => {
                                if (e.target.value !== doc.link) {
                                  handleUpdateDocumentLink(doc.id, e.target.value);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentView === 'hero-images') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Hero Images Management</span>
              </CardTitle>
              <CardDescription>
                Manage hero slider images for the home page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Image */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="text-base font-semibold mb-2 block">Add New Hero Image</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleHeroImageUpload}
                      disabled={uploadingHeroImage}
                      className="flex-1"
                    />
                    {uploadingHeroImage && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: JPEG, JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>

                {/* Existing Images */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Current Hero Images ({heroImages.length})</Label>
                  {heroImages.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hero images added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {heroImages.map((image, index) => (
                        <div key={image.id} className="border rounded-lg p-4 flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={image.imageUrl}
                              alt={`Hero ${index + 1}`}
                              className="w-24 h-16 object-cover rounded border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Slide {index + 1}</p>
                            <p className="text-xs text-muted-foreground truncate">{image.imageUrl}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                if (index > 0) {
                                  const newOrder = [...heroImages];
                                  [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                                  handleReorderHeroImages(newOrder);
                                }
                              }}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                if (index < heroImages.length - 1) {
                                  const newOrder = [...heroImages];
                                  [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                  handleReorderHeroImages(newOrder);
                                }
                              }}
                              disabled={index === heroImages.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveHeroImage(image.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentView === 'gallery') {
      const categories = [
        { id: 'events', name: 'Events' },
        { id: 'academics', name: 'Academics' },
        { id: 'sports', name: 'Sports' },
        { id: 'cultural', name: 'Cultural' },
        { id: 'infrastructure', name: 'Infrastructure' },
        { id: 'students', name: 'Student Life' },
      ];

      return (
        <div className="space-y-6">
          {/* Folder Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>OneDrive Folder Management</span>
              </CardTitle>
              <CardDescription>
                Manage multiple OneDrive/SharePoint folders for your gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Folder */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="text-base font-semibold mb-3 block">Add New Folder</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Folder Name *</Label>
                      <Input
                        type="text"
                        placeholder="e.g., Events 2024"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Folder Link *</Label>
                      <Input
                        type="text"
                        placeholder="SharePoint/OneDrive folder link"
                        value={newFolderLink}
                        onChange={(e) => setNewFolderLink(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Input
                        type="text"
                        placeholder="Folder description"
                        value={newFolderDescription}
                        onChange={(e) => setNewFolderDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleCreateFolder} 
                    className="mt-3"
                    disabled={!newFolderName || !newFolderLink || isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Add Folder
                  </Button>
                </div>

                {/* Folders List */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Managed Folders ({onedriveFolders.length})</Label>
                  {onedriveFolders.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
                      No folders added yet. Add a folder above to get started.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {onedriveFolders.map((folder) => (
                        <div key={folder.id} className="border rounded-lg p-4">
                          {editingFolder?.id === folder.id ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-2">
                                  <Label>Folder Name</Label>
                                  <Input
                                    type="text"
                                    defaultValue={folder.name}
                                    onBlur={(e) => {
                                      if (e.target.value !== folder.name) {
                                        handleUpdateFolder({ ...folder, name: e.target.value });
                                      }
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Folder Link</Label>
                                  <Input
                                    type="text"
                                    defaultValue={folder.folderLink}
                                    onBlur={(e) => {
                                      if (e.target.value !== folder.folderLink) {
                                        handleUpdateFolder({ ...folder, folderLink: e.target.value });
                                      }
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Input
                                    type="text"
                                    defaultValue={folder.description || ''}
                                    onBlur={(e) => {
                                      if (e.target.value !== (folder.description || '')) {
                                        handleUpdateFolder({ ...folder, description: e.target.value || undefined });
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingFolder(null)}
                                >
                                  Done Editing
                                </Button>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={folder.isActive}
                                    onChange={(e) => {
                                      handleUpdateFolder({ ...folder, isActive: e.target.checked });
                                    }}
                                  />
                                  <span className="text-sm">Active</span>
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="font-semibold">{folder.name}</p>
                                  <span className={`px-2 py-1 rounded text-xs ${folder.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {folder.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({folder.imageCount || 0} images)
                                  </span>
                                </div>
                                {folder.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{folder.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1 truncate">{folder.folderLink}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleFetchFolderImages(folder.id)}
                                  disabled={isLoading}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Fetch
                                </Button>
                                <label className="flex items-center space-x-2 cursor-pointer px-2 py-1 border rounded hover:bg-gray-50">
                                  <input
                                    type="checkbox"
                                    checked={folder.isActive ?? true}
                                    onChange={(e) => {
                                      handleUpdateFolder({ ...folder, isActive: e.target.checked });
                                    }}
                                    disabled={isLoading}
                                  />
                                  <span className="text-xs">Active</span>
                                </label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingFolder(folder)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteFolder(folder.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add New Image */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Gallery Image</CardTitle>
              <CardDescription>
                Add images from OneDrive/SharePoint or any direct image URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Image URL or OneDrive Link *</Label>
                    <Input
                      type="text"
                      placeholder="SharePoint/OneDrive image URL or direct image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newImageCategory}
                      onChange={(e) => setNewImageCategory(e.target.value as any)}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Folder (Optional)</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newImageFolderId || ''}
                      onChange={(e) => setNewImageFolderId(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">No Folder</option>
                      {onedriveFolders.filter(f => f.isActive).map(folder => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title (Optional)</Label>
                  <Input
                    type="text"
                    placeholder="Image title"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input
                    type="text"
                    placeholder="Image description"
                    value={newImageDescription}
                    onChange={(e) => setNewImageDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddGalleryImage} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gallery Images ({galleryImages.length})</CardTitle>
                <div className="flex items-center space-x-2">
                  <select
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={filterFolderId || ''}
                    onChange={(e) => {
                      const folderId = e.target.value ? parseInt(e.target.value) : null;
                      setFilterFolderId(folderId);
                      loadGallery(); // Reload with filter
                    }}
                  >
                    <option value="">All Folders</option>
                    {onedriveFolders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name} ({folder.imageCount || 0})</option>
                    ))}
                  </select>
                  {galleryImages.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAllGalleryImages}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete All
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {galleryImages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No images added yet.</p>
              ) : (
                <div className="space-y-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="border rounded-lg p-4 flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={image.thumbnailUrl || image.imageUrl}
                          alt={image.title || 'Gallery image'}
                          className="w-24 h-24 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        {editingImage?.id === image.id ? (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Title"
                                defaultValue={image.title || ''}
                                onBlur={(e) => {
                                  if (e.target.value !== image.title) {
                                    handleUpdateGalleryImage(image.id, { title: e.target.value || undefined });
                                  }
                                }}
                              />
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                defaultValue={image.category}
                                onChange={(e) => {
                                  handleUpdateGalleryImage(image.id, { category: e.target.value as any });
                                }}
                              >
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            </div>
                            <Input
                              placeholder="Description"
                              defaultValue={image.description || ''}
                              onBlur={(e) => {
                                if (e.target.value !== image.description) {
                                  handleUpdateGalleryImage(image.id, { description: e.target.value || undefined });
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingImage(null)}
                            >
                              Done Editing
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div>
                                {image.description && (
                                  <p className="text-sm text-muted-foreground">{image.description}</p>
                                )}
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-muted-foreground">
                                    Category: {categories.find(c => c.id === image.category)?.name}
                                  </p>
                                  {image.folderName && (
                                    <>
                                      <span className="text-xs text-muted-foreground">•</span>
                                      <p className="text-xs text-blue-600 font-medium">
                                        Folder: {image.folderName}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingImage(image)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteGalleryImage(image.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentView === 'graph-api') {
      return (
        <div className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>Microsoft Graph API Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure Microsoft Graph API credentials to enable automatic image fetching from SharePoint/OneDrive folders.
                These credentials are required for the "Fetch" button to work in the Gallery section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGraphApiConfig} className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <div className="space-y-3">
                      <div>
                        <strong className="text-base">Step-by-Step Guide: Creating Azure App Registration (For Beginners)</strong>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4 space-y-2">
                        <div>
                          <strong className="text-sm">Step 1: Sign in to Azure Portal</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            Go to <a href="https://portal.azure.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">https://portal.azure.com/</a> and sign in with your Microsoft account (the one that has access to your SharePoint/OneDrive).
                          </p>
                        </div>

                        <div>
                          <strong className="text-sm">Step 2: Find App Registrations</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            In the search bar at the top, type "Azure Active Directory" and click on it. 
                            Then, in the left sidebar, click on <strong>"App registrations"</strong>.
                          </p>
                        </div>

                        <div>
                          <strong className="text-sm">Step 3: Create New App Registration</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            Click the blue <strong>"+ New registration"</strong> button at the top.
                            <br />
                            • <strong>Name:</strong> Enter any name (e.g., "RRGF Gallery API" or "My School Gallery")
                            <br />
                            • <strong>Supported account types:</strong> Select "Accounts in this organizational directory only"
                            <br />
                            • <strong>Redirect URI:</strong> Leave blank (we don't need it)
                            <br />
                            Click <strong>"Register"</strong> button at the bottom.
                          </p>
                        </div>

                        <div>
                          <strong className="text-sm">Step 4: Copy Your Credentials</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            After registration, you'll be on the "Overview" page. Copy these two values:
                            <br />
                            • <strong>Application (client) ID</strong> — Click the copy icon next to it
                            <br />
                            • <strong>Directory (tenant) ID</strong> — Click the copy icon next to it
                            <br />
                            <strong>Paste them into the form below.</strong>
                          </p>
                        </div>

                        <div>
                          <strong className="text-sm">Step 5: Create Client Secret</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            In the left sidebar, click <strong>"Certificates & secrets"</strong>.
                            <br />
                            Under "Client secrets", click <strong>"+ New client secret"</strong>.
                            <br />
                            • <strong>Description:</strong> Enter any description (e.g., "Gallery API Secret")
                            <br />
                            • <strong>Expires:</strong> Choose "24 months" (or your preference)
                            <br />
                            Click <strong>"Add"</strong>.
                            <br />
                            <strong className="text-red-600">⚠️ IMPORTANT:</strong> Copy the <strong>"Value"</strong> immediately (you'll only see it once!). 
                            It looks like: <code className="bg-gray-100 px-1 rounded text-xs">xxxx~xxxxxxxxxxxxxxxxxxxxxxxxx</code>
                            <br />
                            <strong>Paste this value into "Client Secret" field below.</strong>
                          </p>
                        </div>

                        <div>
                          <strong className="text-sm">Step 6: Add API Permissions</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            In the left sidebar, click <strong>"API permissions"</strong>.
                            <br />
                            Click <strong>"+ Add a permission"</strong>.
                            <br />
                            Select <strong>"Microsoft Graph"</strong> → <strong>"Application permissions"</strong> (NOT Delegated).
                            <br />
                            Search for and add these two permissions:
                            <br />
                            • <strong>Files.Read.All</strong> — "Read all files that the app can access"
                            <br />
                            • <strong>Sites.Read.All</strong> — "Read items in all site collections"
                            <br />
                            Click <strong>"Add permissions"</strong>.
                          </p>
                        </div>

                        <div>
                          <strong className="text-sm">Step 7: Grant Admin Consent</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            After adding permissions, you'll see a yellow warning. 
                            Click the blue <strong>"Grant admin consent for [Your Organization]"</strong> button.
                            <br />
                            Confirm by clicking <strong>"Yes"</strong>.
                            <br />
                            The status should change to green checkmarks with "Granted for [Your Organization]".
                          </p>
                        </div>

                        <div>
                          <strong className="text-sm">Step 8: Fill Form and Test</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            Now come back here and fill in the three fields below:
                            <br />
                            • Application (Client) ID — from Step 4
                            <br />
                            • Directory (Tenant) ID — from Step 4
                            <br />
                            • Client Secret — from Step 5
                            <br />
                            Click <strong>"Test Connection"</strong> to verify everything works, then click <strong>"Save Configuration"</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs">
                          <strong>💡 Tip:</strong> If you get stuck, the detailed guide is in <code className="bg-white px-1 rounded">php-backend/GRAPH_API_SETUP.md</code>
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="graph-client-id">
                      Application (Client) ID *
                    </Label>
                    <Input
                      id="graph-client-id"
                      type="text"
                      value={graphApiConfig.clientId}
                      onChange={(e) => setGraphApiConfig({ ...graphApiConfig, clientId: e.target.value })}
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graph-tenant-id">
                      Directory (Tenant) ID *
                    </Label>
                    <Input
                      id="graph-tenant-id"
                      type="text"
                      value={graphApiConfig.tenantId}
                      onChange={(e) => setGraphApiConfig({ ...graphApiConfig, tenantId: e.target.value })}
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graph-client-secret">
                    Client Secret {graphApiConfig.hasSecret ? '(leave blank to keep current)' : '*'}
                  </Label>
                  <Input
                    id="graph-client-secret"
                    type="password"
                    value={graphApiClientSecret}
                    onChange={(e) => setGraphApiClientSecret(e.target.value)}
                    placeholder={graphApiConfig.hasSecret ? 'Enter new secret to update' : 'Enter client secret value'}
                    required={!graphApiConfig.hasSecret}
                  />
                  {graphApiConfig.hasSecret && (
                    <p className="text-xs text-muted-foreground">
                      A secret is already configured. Enter a new value only if you want to update it.
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="graph-api-active"
                    checked={graphApiConfig.isActive ?? false}
                    onChange={(e) => setGraphApiConfig({ ...graphApiConfig, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="graph-api-active" className="cursor-pointer">
                    <strong>Enable Graph API</strong> (required for automatic fetching - must be checked to use the "Fetch" button)
                  </Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Configuration'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestGraphApi}
                    disabled={isLoading || !graphApiConfig.clientId || !graphApiConfig.tenantId}
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Configuration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Configuration Status:</span>
                  <span className={`text-sm font-semibold ${graphApiConfig.isActive && graphApiConfig.clientId ? 'text-green-600' : 'text-gray-500'}`}>
                    {graphApiConfig.isActive && graphApiConfig.clientId ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Client ID:</span>
                  <span className="text-sm text-muted-foreground">
                    {graphApiConfig.clientId ? '✓ Configured' : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tenant ID:</span>
                  <span className="text-sm text-muted-foreground">
                    {graphApiConfig.tenantId ? '✓ Configured' : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Client Secret:</span>
                  <span className="text-sm text-muted-foreground">
                    {graphApiConfig.hasSecret ? '✓ Configured' : 'Not set'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0 flex flex-col sticky top-0 h-screen`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-lg text-school-secondary">Admin Panel</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <Button
            variant={currentView === 'smtp' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('smtp')}
          >
            <Settings className="mr-2 h-4 w-4" />
            SMTP Settings
          </Button>
          <Button
            variant={currentView === 'mpd-appendix' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('mpd-appendix')}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Appendix‑IX MPD Data
          </Button>
          <Button
            variant={currentView === 'documents' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('documents')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button
            variant={currentView === 'hero-images' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('hero-images')}
          >
            <Image className="mr-2 h-4 w-4" />
            Hero Images
          </Button>
          <Button
            variant={currentView === 'gallery' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('gallery')}
          >
            <Images className="mr-2 h-4 w-4" />
            Gallery
          </Button>
          <Button
            variant={currentView === 'graph-api' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentView('graph-api')}
          >
            <Server className="mr-2 h-4 w-4" />
            Graph API
          </Button>
        </nav>
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-school-secondary">
                {currentView === 'smtp'
                  ? 'SMTP Configuration'
                  : currentView === 'mpd-appendix'
                    ? 'CBSE Appendix‑IX MPD'
                    : currentView === 'documents'
                      ? 'Document Management'
                      : currentView === 'hero-images'
                        ? 'Hero Images Management'
                        : currentView === 'gallery'
                          ? 'Gallery Management'
                          : currentView === 'graph-api'
                            ? 'Graph API Configuration'
                            : 'Admin Panel'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentView === 'smtp'
                  ? 'Manage email settings'
                  : currentView === 'mpd-appendix'
                    ? 'General info, staff, infrastructure, Class X/XII results — drives /mandatory-public-disclosure'
                    : currentView === 'documents'
                      ? 'Upload PDF rows for Annex B supporting documents'
                      : currentView === 'hero-images'
                        ? 'Manage hero slider images for the home page'
                        : currentView === 'gallery'
                          ? 'Manage gallery images from OneDrive'
                          : currentView === 'graph-api'
                            ? 'Configure Microsoft Graph API for automatic image fetching'
                            : 'Admin Panel'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={async () => {
                try {
                  // Clear browser cache (Service Worker cache)
                  if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(
                      cacheNames.map((cacheName) => caches.delete(cacheName))
                    );
                  }
                  
                  // Clear localStorage cache (keep session)
                  const sessionId = localStorage.getItem('adminSessionId');
                  localStorage.clear();
                  if (sessionId) {
                    localStorage.setItem('adminSessionId', sessionId);
                  }
                  
                  // Clear sessionStorage
                  sessionStorage.clear();
                  
                  // Force hard reload to clear browser cache
                  // This ensures all cached assets are refreshed
                  toast.success('Cache cleared! Reloading page...', {
                    duration: 2000,
                  });
                  
                  // Small delay to show the toast, then reload
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                } catch (error) {
                  console.error('Error clearing cache:', error);
                  toast.error('Error clearing cache. Please try manually refreshing the page.');
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear Cache</span>
            </Button>
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Visit Site</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Backend;
