# Gallery Images - Empty Database Fix

## Problem
Gallery images table is empty in production database (MySQL returned empty result set).

## Diagnosis Steps

### Step 1: Check if table exists and count rows
Run this SQL in phpMyAdmin:
```sql
SELECT COUNT(*) as total_images FROM gallery_images;
```

**If result is 0**: The table is empty - you need to populate it.

**If result is > 0**: Check the actual data with:
```sql
SELECT id, image_url FROM gallery_images LIMIT 10;
```

### Step 2: Populate Gallery Images (if table is empty)

If the count is 0, run the population script:
- File: `database/populate-gallery-from-local-files.sql`
- This inserts 13 gallery images that match the files in `public_html/gallery/`

**Run this SQL:**
```sql
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
('gallery_013', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_9d45e428.jpg', '/gallery/WhatsApp Image 2025-12-13 at 13.42.24_9d45e428.jpg', 'events', 13, NOW());
```

### Step 3: Verify
After populating, check:
```sql
SELECT COUNT(*) FROM gallery_images;
-- Should return 13

SELECT id, image_url FROM gallery_images LIMIT 5;
-- Should show the gallery image paths
```

## Important Notes

1. **Files must exist**: Make sure the actual image files are in `public_html/gallery/` on Hostinger
2. **Paths are correct**: All paths use `/gallery/` which matches the deployment package structure
3. **Category**: All images are set to 'events' category (you can change this later via admin panel)

## Alternative: Import from Local Database

If you want to import all gallery images from your local database:

1. Export gallery_images table from local database
2. Import into production database
3. Or use phpMyAdmin's "Import" feature

## Files Available

- `database/check-gallery-status.sql` - Diagnostic queries
- `database/populate-gallery-from-local-files.sql` - Full population script
