import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  getHeroImages, 
  addHeroImage, 
  removeHeroImage, 
  updateHeroImageOrder,
  getHeroUploadsDirectory,
  type HeroImage 
} from "../utils/hero-images-storage";
import { verifySession } from "../utils/auth";

// Configure multer for hero image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = getHeroUploadsDirectory();
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `hero-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
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

// Get all hero images (public)
export const handleGetHeroImages: RequestHandler = (req, res) => {
  try {
    const images = getHeroImages();
    res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('Error getting hero images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve hero images',
    });
  }
};

// Add hero image (admin)
export const handleAddHeroImage: RequestHandler = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided',
      });
    }
    
    const imageUrl = `/uploads/hero/${req.file.filename}`;
    const newImage = addHeroImage(imageUrl);
    
    res.json({
      success: true,
      image: newImage,
    });
  } catch (error) {
    console.error('Error adding hero image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add hero image',
    });
  }
};

// Remove hero image (admin)
export const handleRemoveHeroImage: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const success = removeHeroImage(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Hero image not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Hero image removed successfully',
    });
  } catch (error) {
    console.error('Error removing hero image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove hero image',
    });
  }
};

// Update hero images order (admin)
export const handleUpdateHeroImagesOrder: RequestHandler = (req, res) => {
  try {
    const { images } = req.body;
    
    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid images array',
      });
    }
    
    updateHeroImageOrder(images);
    
    res.json({
      success: true,
      images: getHeroImages(),
    });
  } catch (error) {
    console.error('Error updating hero images order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update hero images order',
    });
  }
};

// Upload middleware
export const uploadMiddleware = upload.single('image');

// Export requireAuth for use in server/index.ts
export { requireAuth as requireHeroImageAuth };

