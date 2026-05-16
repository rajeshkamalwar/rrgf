# Fix Hero Image 422 Errors

## Problem
Hero images showing 422 errors because database paths point to `/uploads/hero/` but files are in `/images/hero/`

## Solution

### Option 1: Run SQL Script (Recommended)
1. Go to phpMyAdmin on Hostinger
2. Select your database
3. Go to SQL tab
4. Run: `database/fix-hero-paths-production.sql`

### Option 2: Fix via Admin Panel
1. Login to Admin Panel: `https://yourdomain.com/backend`
2. Go to "Hero Images Management"
3. Remove existing hero images
4. The system will fallback to default images from `/images/hero/`

### Option 3: Update Database Manually
Run this SQL:
```sql
UPDATE hero_images SET image_url = '/images/hero/1.jpg' WHERE `order` = 1;
UPDATE hero_images SET image_url = '/images/hero/2.jpg' WHERE `order` = 2;
UPDATE hero_images SET image_url = '/images/hero/3.jpg' WHERE `order` = 3;
UPDATE hero_images SET image_url = '/images/hero/4.jpg' WHERE `order` = 4;
```

## Verification
After fixing, check:
- Homepage hero slider displays images
- No 422 errors in browser console
- Images load from `/images/hero/1.jpg`, `/images/hero/2.jpg`, etc.

## Files Location
- Hero images are in: `public_html/images/hero/` (1.jpg, 2.jpg, 3.jpg, 4.jpg)
- These are static files included in the deployment package
