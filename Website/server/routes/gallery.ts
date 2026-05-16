import { RequestHandler } from "express";
import { 
  getGalleryConfig, 
  saveGalleryConfig, 
  getGalleryImages, 
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
  getGalleryImagesByCategory,
  extractFolderId,
  type GalleryImage,
  type GalleryConfig
} from "../utils/gallery-storage";
import { verifySession } from "../utils/auth";

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

// Get gallery images (public)
export const handleGetGalleryImages: RequestHandler = (req, res) => {
  try {
    const { category } = req.query;
    const images = getGalleryImagesByCategory(category as string);
    res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error('Error getting gallery images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve gallery images',
    });
  }
};

// Get gallery configuration (admin)
export const handleGetGalleryConfig: RequestHandler = (req, res) => {
  try {
    const config = getGalleryConfig();
    res.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error('Error getting gallery config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve gallery configuration',
    });
  }
};

// Update gallery configuration (admin)
export const handleUpdateGalleryConfig: RequestHandler = async (req, res) => {
  try {
    const { googleDriveFolderLink, autoFetch } = req.body;
    
    if (!googleDriveFolderLink) {
      return res.status(400).json({
        success: false,
        error: 'Google Drive folder link is required',
      });
    }

    const folderId = extractFolderId(googleDriveFolderLink);
    if (!folderId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Google Drive folder link. Please provide a valid folder link.',
      });
    }

    const config = saveGalleryConfig({
      googleDriveFolderLink,
      googleDriveFolderId: folderId,
      lastSync: new Date().toISOString(),
    });

    // If autoFetch is true, automatically fetch images
    if (autoFetch) {
      try {
        const folderId = config.googleDriveFolderId!;
        const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,thumbnailLink,webViewLink,mimeType)&key=${process.env.GOOGLE_DRIVE_API_KEY || ''}`;
        
        const driveResponse = await fetch(apiUrl);
        
        if (driveResponse.ok) {
          const driveData = await driveResponse.json();
          
          if (driveData.files && driveData.files.length > 0) {
            const existingImages = getGalleryImages();
            const existingDriveIds = new Set(
              existingImages
                .filter(img => img.googleDriveId)
                .map(img => img.googleDriveId)
            );

            const newImages: any[] = [];
            for (const file of driveData.files) {
              if (existingDriveIds.has(file.id)) {
                continue;
              }

              const imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
              const thumbnailUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;

              const newImage = addGalleryImage({
                imageUrl,
                thumbnailUrl,
                category: 'events', // Default category
                title: file.name.replace(/\.[^/.]+$/, ''),
                googleDriveId: file.id,
              });

              newImages.push(newImage);
            }

            return res.json({
              success: true,
              config,
              message: `Gallery configured and ${newImages.length} images automatically added`,
              imagesAdded: newImages.length,
            });
          }
        }
      } catch (fetchError) {
        // Continue even if auto-fetch fails - config is still saved
        console.log('Auto-fetch failed, but config saved:', fetchError);
      }
    }

    res.json({
      success: true,
      config,
      message: 'Gallery configuration updated successfully. Use "Fetch Images" button to load images.',
    });
  } catch (error) {
    console.error('Error updating gallery config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update gallery configuration',
    });
  }
};

// Fetch images from Google Drive folder (admin)
export const handleFetchGoogleDriveImages: RequestHandler = async (req, res) => {
  try {
    const config = getGalleryConfig();
    
    if (!config.googleDriveFolderId) {
      return res.status(400).json({
        success: false,
        error: 'Google Drive folder is not configured. Please configure it first.',
      });
    }

    const folderId = config.googleDriveFolderId;
    
    // Fetch images from Google Drive folder using public API
    // Note: This works for folders shared publicly with "Anyone with the link can view"
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,thumbnailLink,webViewLink,mimeType)&key=${process.env.GOOGLE_DRIVE_API_KEY || ''}`;
    
    let driveResponse;
    try {
      driveResponse = await fetch(apiUrl);
      
      if (!driveResponse.ok) {
        // If API key is not set or folder is not public, try alternative method
        if (driveResponse.status === 403 || driveResponse.status === 401) {
          return res.json({
            success: false,
            message: 'Google Drive API key not configured or folder is not publicly accessible. Please use manual image upload, or configure GOOGLE_DRIVE_API_KEY in environment variables.',
            note: 'For automatic fetching, you need to: 1) Set GOOGLE_DRIVE_API_KEY in .env, 2) Make sure the folder is set to "Anyone with the link can view"',
          });
        }
        throw new Error(`Google Drive API error: ${driveResponse.status}`);
      }
    } catch (fetchError: any) {
      // If fetch fails (CORS, network, etc.), try alternative parsing method
      return res.json({
        success: false,
        message: 'Unable to fetch from Google Drive API. Please use manual image upload by copying individual image links from the folder.',
        note: 'To enable automatic fetching, configure GOOGLE_DRIVE_API_KEY in environment variables and ensure the folder is publicly accessible.',
      });
    }

    const driveData = await driveResponse.json();
    
    if (!driveData.files || driveData.files.length === 0) {
      return res.json({
        success: true,
        message: 'No images found in the Google Drive folder.',
        imagesAdded: 0,
      });
    }

    // Get existing images to avoid duplicates
    const existingImages = getGalleryImages();
    const existingDriveIds = new Set(
      existingImages
        .filter(img => img.googleDriveId)
        .map(img => img.googleDriveId)
    );

    // Convert Google Drive files to gallery images
    const newImages: any[] = [];
    for (const file of driveData.files) {
      // Skip if already exists
      if (existingDriveIds.has(file.id)) {
        continue;
      }

      // Create direct image URLs
      const imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
      const thumbnailUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;

      // Default category (can be changed later in admin)
      const defaultCategory: 'events' | 'academics' | 'sports' | 'cultural' | 'infrastructure' | 'students' = 'events';

      const newImage = addGalleryImage({
        imageUrl,
        thumbnailUrl,
        category: defaultCategory,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        googleDriveId: file.id,
      });

      newImages.push(newImage);
    }

    // Update last sync time
    saveGalleryConfig({
      ...config,
      lastSync: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Successfully fetched ${newImages.length} images from Google Drive`,
      imagesAdded: newImages.length,
      images: newImages,
    });
  } catch (error: any) {
    console.error('Error fetching Google Drive images:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch images from Google Drive',
    });
  }
};

// Add gallery image (admin)
export const handleAddGalleryImage: RequestHandler = (req, res) => {
  try {
    const { imageUrl, thumbnailUrl, category, title, description, googleDriveId } = req.body;

    if (!imageUrl || !category) {
      return res.status(400).json({
        success: false,
        error: 'Image URL and category are required',
      });
    }

    const validCategories = ['events', 'academics', 'sports', 'cultural', 'infrastructure', 'students'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category',
      });
    }

    const newImage = addGalleryImage({
      imageUrl,
      thumbnailUrl,
      category,
      title,
      description,
      googleDriveId,
    });

    res.json({
      success: true,
      image: newImage,
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add gallery image',
    });
  }
};

// Update gallery image (admin)
export const handleUpdateGalleryImage: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedImage = updateGalleryImage(id, updates);
    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        error: 'Gallery image not found',
      });
    }

    res.json({
      success: true,
      image: updatedImage,
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update gallery image',
    });
  }
};

// Delete gallery image (admin)
export const handleDeleteGalleryImage: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const success = deleteGalleryImage(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Gallery image not found',
      });
    }

    res.json({
      success: true,
      message: 'Gallery image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete gallery image',
    });
  }
};

// Reorder gallery images (admin)
export const handleReorderGalleryImages: RequestHandler = (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid images array',
      });
    }

    reorderGalleryImages(images);
    res.json({
      success: true,
      images: getGalleryImages(),
    });
  } catch (error) {
    console.error('Error reordering gallery images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder gallery images',
    });
  }
};

// Export requireAuth for use in server/index.ts
export { requireAuth as requireGalleryAuth };

