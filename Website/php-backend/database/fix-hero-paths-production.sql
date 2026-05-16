-- Fix hero image paths for production deployment
-- Converts /uploads/hero/ paths to /images/hero/ paths
-- Run this on Hostinger database after deployment if you see 422 errors for hero images

-- Update hero images to use static image paths
UPDATE hero_images SET image_url = '/images/hero/1.jpg' WHERE `order` = 1 AND image_url LIKE '%/uploads/hero/%';
UPDATE hero_images SET image_url = '/images/hero/2.jpg' WHERE `order` = 2 AND image_url LIKE '%/uploads/hero/%';
UPDATE hero_images SET image_url = '/images/hero/3.jpg' WHERE `order` = 3 AND image_url LIKE '%/uploads/hero/%';
UPDATE hero_images SET image_url = '/images/hero/4.jpg' WHERE `order` = 4 AND image_url LIKE '%/uploads/hero/%';

-- Or update all hero images to correct paths regardless of current path
-- Uncomment if you want to reset all paths:
-- UPDATE hero_images SET image_url = '/images/hero/1.jpg' WHERE `order` = 1;
-- UPDATE hero_images SET image_url = '/images/hero/2.jpg' WHERE `order` = 2;
-- UPDATE hero_images SET image_url = '/images/hero/3.jpg' WHERE `order` = 3;
-- UPDATE hero_images SET image_url = '/images/hero/4.jpg' WHERE `order` = 4;
