-- Populate gallery_images table with local gallery images
-- Run this ONLY if the gallery_images table is empty in production
-- This assumes you have 13 gallery images in /gallery/ folder

-- First, check current count:
-- SELECT COUNT(*) FROM gallery_images;

-- If count is 0, insert the local gallery images:
INSERT INTO gallery_images (id, image_url, thumbnail_url, category, `order`, created_at) VALUES
('gallery_001', '/gallery/WhatsApp Image 2025-12-13 at 1.42.22 PM.jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.22 PM.jpeg', 'events', 1, NOW()),
('gallery_002', '/gallery/WhatsApp Image 2025-12-13 at 1.42.23 PM (1).jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.23 PM (1).jpeg', 'events', 2, NOW()),
('gallery_003', '/gallery/WhatsApp Image 2025-12-13 at 1.42.23 PM (2).jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.23 PM (2).jpeg', 'events', 3, NOW()),
('gallery_004', '/gallery/WhatsApp Image 2025-12-13 at 1.42.23 PM.jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.23 PM.jpeg', 'events', 4, NOW()),
('gallery_005', '/gallery/WhatsApp Image 2025-12-13 at 1.42.24 PM (1).jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.24 PM (1).jpeg', 'events', 5, NOW()),
('gallery_006', '/gallery/WhatsApp Image 2025-12-13 at 1.42.24 PM.jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.24 PM.jpeg', 'events', 6, NOW()),
('gallery_007', '/gallery/WhatsApp Image 2025-12-13 at 1.42.25 PM (1).jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.25 PM (1).jpeg', 'events', 7, NOW()),
('gallery_008', '/gallery/WhatsApp Image 2025-12-13 at 1.42.25 PM (2).jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.25 PM (2).jpeg', 'events', 8, NOW()),
('gallery_009', '/gallery/WhatsApp Image 2025-12-13 at 1.42.25 PM.jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.25 PM.jpeg', 'events', 9, NOW()),
('gallery_010', '/gallery/WhatsApp Image 2025-12-13 at 1.42.26 PM.jpeg', '/gallery/WhatsApp Image 2025-12-13 at 1.42.26 PM.jpeg', 'events', 10, NOW()),
('gallery_011', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_278d07ff.jpg', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_278d07ff.jpg', 'events', 11, NOW()),
('gallery_012', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_430dbba7.jpg', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_430dbba7.jpg', 'events', 12, NOW()),
('gallery_013', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_9d45e428.jpg', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_9d45e428.jpg', 'events', 13, NOW())
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), thumbnail_url = VALUES(thumbnail_url);

-- After running, verify:
-- SELECT COUNT(*) FROM gallery_images;
-- SELECT id, image_url FROM gallery_images LIMIT 5;
