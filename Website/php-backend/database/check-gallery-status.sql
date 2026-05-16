-- Check gallery images status in production database
-- Run these queries one by one to diagnose the issue

-- 1. Check if gallery_images table exists and count rows
SELECT COUNT(*) as total_images FROM gallery_images;

-- 2. Check all gallery images (if any exist)
SELECT id, image_url, thumbnail_url, category FROM gallery_images LIMIT 20;

-- 3. Check if images point to /uploads/ paths
SELECT id, image_url FROM gallery_images WHERE image_url LIKE '%/uploads/%' OR image_url LIKE '%uploads/%';

-- 4. Check if images point to /gallery/ paths
SELECT id, image_url FROM gallery_images WHERE image_url LIKE '%/gallery/%';
