import fs from 'fs';
import path from 'path';

export interface GalleryImage {
  id: string;
  googleDriveId?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'events' | 'academics' | 'sports' | 'cultural' | 'infrastructure' | 'students';
  title?: string;
  description?: string;
  order: number;
}

export interface GalleryConfig {
  googleDriveFolderId?: string;
  googleDriveFolderLink?: string;
  lastSync?: string;
}

const GALLERY_CONFIG_FILE = path.join(process.cwd(), 'gallery-config.json');
const GALLERY_IMAGES_FILE = path.join(process.cwd(), 'gallery-images.json');

// Load gallery configuration
export const getGalleryConfig = (): GalleryConfig => {
  try {
    if (fs.existsSync(GALLERY_CONFIG_FILE)) {
      const data = fs.readFileSync(GALLERY_CONFIG_FILE, 'utf-8');
      return JSON.parse(data) as GalleryConfig;
    }
  } catch (error) {
    console.error('Error reading gallery config:', error);
  }
  return {};
};

// Save gallery configuration
export const saveGalleryConfig = (config: Partial<GalleryConfig>): GalleryConfig => {
  const currentConfig = getGalleryConfig();
  const newConfig: GalleryConfig = {
    ...currentConfig,
    ...config,
  };

  try {
    fs.writeFileSync(GALLERY_CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
    return newConfig;
  } catch (error) {
    console.error('Error saving gallery config:', error);
    throw new Error('Failed to save gallery configuration');
  }
};

// Extract folder ID from Google Drive link
export const extractFolderId = (link: string): string | null => {
  // Handle different Google Drive link formats
  // https://drive.google.com/drive/folders/FOLDER_ID
  // https://drive.google.com/drive/u/0/folders/FOLDER_ID
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

// Load gallery images
export const getGalleryImages = (): GalleryImage[] => {
  try {
    if (fs.existsSync(GALLERY_IMAGES_FILE)) {
      const data = fs.readFileSync(GALLERY_IMAGES_FILE, 'utf-8');
      const images = JSON.parse(data) as GalleryImage[];
      return images.sort((a, b) => a.order - b.order);
    }
  } catch (error) {
    console.error('Error reading gallery images:', error);
  }
  return [];
};

// Save gallery images
export const saveGalleryImages = (images: GalleryImage[]): void => {
  try {
    // Ensure images have order
    images.forEach((img, index) => {
      if (img.order === undefined) {
        img.order = index;
      }
    });
    fs.writeFileSync(GALLERY_IMAGES_FILE, JSON.stringify(images, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving gallery images:', error);
    throw new Error('Failed to save gallery images');
  }
};

// Add gallery image
export const addGalleryImage = (image: Omit<GalleryImage, 'id' | 'order'>): GalleryImage => {
  const images = getGalleryImages();
  const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.order)) : -1;
  const newImage: GalleryImage = {
    ...image,
    id: `img-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    order: maxOrder + 1,
  };
  images.push(newImage);
  saveGalleryImages(images);
  return newImage;
};

// Update gallery image
export const updateGalleryImage = (id: string, updates: Partial<GalleryImage>): GalleryImage | undefined => {
  const images = getGalleryImages();
  const index = images.findIndex(img => img.id === id);
  if (index !== -1) {
    images[index] = { ...images[index], ...updates };
    saveGalleryImages(images);
    return images[index];
  }
  return undefined;
};

// Delete gallery image
export const deleteGalleryImage = (id: string): boolean => {
  const images = getGalleryImages();
  const filtered = images.filter(img => img.id !== id);
  if (filtered.length !== images.length) {
    // Reorder remaining images
    filtered.forEach((img, index) => {
      img.order = index;
    });
    saveGalleryImages(filtered);
    return true;
  }
  return false;
};

// Reorder gallery images
export const reorderGalleryImages = (newOrder: GalleryImage[]): void => {
  newOrder.forEach((img, index) => {
    img.order = index;
  });
  saveGalleryImages(newOrder);
};

// Get images by category
export const getGalleryImagesByCategory = (category?: string): GalleryImage[] => {
  const images = getGalleryImages();
  if (!category || category === 'all') {
    return images;
  }
  return images.filter(img => img.category === category);
};

