-- Fix gallery image paths if they point to /uploads/ instead of /gallery/
-- Run this on Hostinger database if gallery images are not loading

-- Check current paths first (uncomment to see what needs fixing):
-- SELECT id, image_url FROM gallery_images WHERE image_url LIKE '%/uploads/%' OR image_url LIKE '%uploads/%';

-- Update gallery images that point to /uploads/gallery/ to /gallery/
UPDATE gallery_images 
SET image_url = REPLACE(image_url, '/uploads/gallery/', '/gallery/')
WHERE image_url LIKE '%/uploads/gallery/%';

UPDATE gallery_images 
SET image_url = REPLACE(image_url, 'uploads/gallery/', '/gallery/')
WHERE image_url LIKE '%uploads/gallery/%';

-- Also update thumbnail URLs if they have the same issue
UPDATE gallery_images 
SET thumbnail_url = REPLACE(thumbnail_url, '/uploads/gallery/', '/gallery/')
WHERE thumbnail_url LIKE '%/uploads/gallery/%';

UPDATE gallery_images 
SET thumbnail_url = REPLACE(thumbnail_url, 'uploads/gallery/', '/gallery/')
WHERE thumbnail_url LIKE '%uploads/gallery/%';

-- Verify the fix (run this after to check):
-- SELECT id, image_url, thumbnail_url FROM gallery_images LIMIT 10;
