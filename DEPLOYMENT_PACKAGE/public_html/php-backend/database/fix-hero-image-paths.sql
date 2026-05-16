-- Fix hero image paths to match deployment package structure
-- Update paths from /uploads/hero/ to /images/hero/

UPDATE hero_images SET image_url = '/images/hero/1.jpg' WHERE `order` = 1;
UPDATE hero_images SET image_url = '/images/hero/2.jpg' WHERE `order` = 2;
UPDATE hero_images SET image_url = '/images/hero/3.jpg' WHERE `order` = 3;
UPDATE hero_images SET image_url = '/images/hero/4.jpg' WHERE `order` = 4;
