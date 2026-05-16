# Fix Gallery Images Not Loading

## Problem
Gallery images showing 422 errors or not loading, similar to hero images issue.

## Possible Causes

1. **Database paths pointing to /uploads/** instead of `/gallery/`
2. **Images not in deployment package** (if using local gallery images)
3. **OneDrive/SharePoint URLs** (if using cloud storage - these should work but may need authentication)

## Solution

### Step 1: Check Current Paths

Run this SQL in phpMyAdmin to see current paths:
```sql
SELECT id, image_url, thumbnail_url FROM gallery_images LIMIT 10;
```

### Step 2: Fix Paths (if needed)

If images point to `/uploads/gallery/` instead of `/gallery/`, run:
```sql
-- Fix image URLs
UPDATE gallery_images 
SET image_url = REPLACE(image_url, '/uploads/gallery/', '/gallery/')
WHERE image_url LIKE '%/uploads/gallery/%';

-- Fix thumbnail URLs
UPDATE gallery_images 
SET thumbnail_url = REPLACE(thumbnail_url, '/uploads/gallery/', '/gallery/')
WHERE thumbnail_url LIKE '%/uploads/gallery/%';
```

**Or use the script**: `database/fix-gallery-paths-production.sql`

### Step 3: Verify Images Exist

Gallery images should be in: `public_html/gallery/`

Check that files exist:
- WhatsApp Image 2025-12-13 at 1.42.22 PM.jpeg
- WhatsApp Image 2025-12-13 at 1.42.23 PM (1).jpeg
- etc.

### Step 4: For OneDrive/SharePoint Images

If your gallery images use OneDrive/SharePoint URLs:
- These should work automatically (API converts them)
- If not working, check sharing permissions on OneDrive
- Ensure "Anyone with the link" sharing is enabled

## Verification

After fixing:
- ✅ Gallery page loads images
- ✅ No 422 errors in console
- ✅ Images display correctly
- ✅ Lightbox/modal works when clicking images

## Notes

- Local gallery images use paths like: `/gallery/filename.jpg`
- OneDrive images use full URLs (automatically converted by API)
- The `.htaccess` file should serve `/gallery/` files directly (already configured)
