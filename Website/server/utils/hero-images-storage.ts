import fs from 'fs';
import path from 'path';

export interface HeroImage {
  id: string;
  imageUrl: string;
  order: number;
}

const HERO_IMAGES_FILE = path.join(process.cwd(), 'hero-images-config.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'hero');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize with default hero images
const defaultHeroImages: HeroImage[] = [
  { id: 'hero-1', imageUrl: '/images/hero/1.jpg', order: 0 },
  { id: 'hero-2', imageUrl: '/images/hero/2.jpg', order: 1 },
  { id: 'hero-3', imageUrl: '/images/hero/3.jpg', order: 2 },
  { id: 'hero-4', imageUrl: '/images/hero/4.jpg', order: 3 },
];

export function getHeroImages(): HeroImage[] {
  try {
    if (fs.existsSync(HERO_IMAGES_FILE)) {
      const data = fs.readFileSync(HERO_IMAGES_FILE, 'utf-8');
      const images = JSON.parse(data);
      // Sort by order
      return images.sort((a: HeroImage, b: HeroImage) => a.order - b.order);
    }
    // Initialize with defaults
    saveHeroImages(defaultHeroImages);
    return defaultHeroImages;
  } catch (error) {
    console.error('Error reading hero images:', error);
    return defaultHeroImages;
  }
}

export function saveHeroImages(images: HeroImage[]): void {
  try {
    fs.writeFileSync(HERO_IMAGES_FILE, JSON.stringify(images, null, 2));
  } catch (error) {
    console.error('Error saving hero images:', error);
    throw new Error('Failed to save hero images');
  }
}

export function addHeroImage(imageUrl: string): HeroImage {
  const images = getHeroImages();
  const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.order)) : -1;
  const newImage: HeroImage = {
    id: `hero-${Date.now()}`,
    imageUrl,
    order: maxOrder + 1,
  };
  images.push(newImage);
  saveHeroImages(images);
  return newImage;
}

export function removeHeroImage(id: string): boolean {
  const images = getHeroImages();
  const imageToRemove = images.find(img => img.id === id);
  
  if (!imageToRemove) {
    return false;
  }
  
  // Delete file if it's in uploads directory
  if (imageToRemove.imageUrl.startsWith('/uploads/hero/')) {
    const filePath = path.join(process.cwd(), 'public', imageToRemove.imageUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }
  }
  
  const filtered = images.filter(img => img.id !== id);
  // Reorder remaining images
  filtered.forEach((img, index) => {
    img.order = index;
  });
  saveHeroImages(filtered);
  return true;
}

export function updateHeroImageOrder(images: HeroImage[]): void {
  images.forEach((img, index) => {
    img.order = index;
  });
  saveHeroImages(images);
}

export function getHeroUploadsDirectory(): string {
  return UPLOADS_DIR;
}

