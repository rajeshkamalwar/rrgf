import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getDocuments, saveDocuments, getDocumentById, updateDocument, getUploadsDirectory, type Document } from "../utils/document-storage";
import { verifySession } from "../utils/auth";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = getUploadsDirectory();
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Middleware to require authentication
const requireAuth: RequestHandler = (req, res, next) => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId || !verifySession(sessionId)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Please login first.',
    });
  }
  next();
};

// Get all documents
export const handleGetDocuments: RequestHandler = (req, res) => {
  try {
    const documents = getDocuments();
    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve documents',
    });
  }
};

// Get document by ID
export const handleGetDocument: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const document = getDocumentById(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
      });
    }
    
    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve document',
    });
  }
};

// Update document (with optional file upload)
export const handleUpdateDocument: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const document = getDocumentById(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
      });
    }
    
    const updates: Partial<Document> = {};
    
    // Update text fields if provided
    if (req.body.sno !== undefined) updates.sno = req.body.sno;
    if (req.body.document !== undefined) updates.document = req.body.document;
    if (req.body.information !== undefined) updates.information = req.body.information;
    if (req.body.status !== undefined) updates.status = req.body.status;
    
    // Handle file upload if present
    if (req.file) {
      // Delete old file if it exists and is in uploads directory
      if (document.link && document.link.startsWith('/uploads/')) {
        const oldFilePath = path.join(process.cwd(), 'public', document.link);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      // Set new file link
      updates.link = `/uploads/${req.file.filename}`;
      updates.status = '✓ Available';
    } else if (req.body.link !== undefined) {
      updates.link = req.body.link;
    }
    
    const updated = updateDocument(id, updates);
    
    if (!updated) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update document',
      });
    }
    
    res.json({
      success: true,
      document: updated,
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update document',
    });
  }
};

// Upload middleware
export const uploadMiddleware = upload.single('file');

// Export requireAuth for use in server/index.ts
export { requireAuth as requireDocumentAuth };

