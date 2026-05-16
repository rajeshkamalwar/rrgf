# OneDrive Migration Guide

This guide explains how to migrate from Google Drive to OneDrive for gallery image management.

## Database Migration

### Option 1: Fresh Installation
If you're setting up a new installation, the schema already uses OneDrive fields. No migration needed.

### Option 2: Existing Installation Migration

If you have existing Google Drive data, follow these steps:

1. **Backup your database first!**

2. **Run the migration script:**
   ```sql
   -- This will add OneDrive columns while keeping Google Drive columns
   ALTER TABLE `gallery_config`
   ADD COLUMN `onedrive_folder_link` varchar(500) DEFAULT NULL AFTER `google_drive_folder_id`,
   ADD COLUMN `onedrive_folder_id` varchar(100) DEFAULT NULL AFTER `onedrive_folder_link`;
   ```

3. **Migrate existing data (optional):**
   If you want to preserve your existing folder link (though it will need to be converted to OneDrive format):
   ```sql
   -- Note: This is optional - you'll need to manually convert Google Drive links to OneDrive links
   -- The folder structure is different, so automatic conversion isn't possible
   ```

4. **Update your OneDrive folder link in the admin panel:**
   - Go to Admin Panel → Gallery section
   - Enter your OneDrive folder link
   - Click "Save & Auto-Fetch"

5. **After confirming everything works, you can remove Google Drive columns:**
   ```sql
   -- Only run this AFTER confirming OneDrive works correctly!
   ALTER TABLE `gallery_config`
   DROP COLUMN `google_drive_folder_link`,
   DROP COLUMN `google_drive_folder_id`;
   ```

## OneDrive URL Formats

OneDrive uses different URL formats:

### Folder Links:
- Short format: `https://1drv.ms/f/s!FOLDER_ID`
- Long format: `https://onedrive.live.com/?id=ROOT/FOLDER_ID`

### Image/File Links:
- Embed format: `https://onedrive.live.com/embed?cid=CID&resid=RESID&authkey=!AUTHKEY`
- Short format: `https://1drv.ms/i/s!FILE_ID`

## Getting OneDrive Folder Link

1. Open OneDrive in your browser
2. Navigate to the folder you want to use
3. Click "Share" or right-click the folder
4. Choose "Anyone with the link can view"
5. Copy the sharing link

The link will look like:
- `https://1drv.ms/f/s!FOLDER_ID` (short format)
- Or `https://onedrive.live.com/?id=ROOT/FOLDER_ID` (long format)

## Manual Image Addition

Since automatic fetching requires Microsoft Graph API setup (which needs Azure App registration), you can add images manually:

1. Right-click each image in OneDrive
2. Click "Share" → "Anyone with the link can view"
3. Copy the embed link (or use the sharing link)
4. In the admin panel, paste the link in "Image URL or OneDrive Link"
5. Add title, description, and category
6. Click "Add Image"

## Microsoft Graph API Setup (Optional - for automatic fetching)

If you want automatic image fetching from OneDrive folders:

1. Register an Azure App at https://portal.azure.com
2. Create a Client ID and Client Secret
3. Add necessary permissions (Files.Read, Files.Read.All)
4. Set redirect URI
5. Configure environment variables on your server:
   ```
   ONEDRIVE_CLIENT_ID=your_client_id
   ONEDRIVE_CLIENT_SECRET=your_client_secret
   ONEDRIVE_REDIRECT_URI=your_redirect_uri
   ```

Note: The current implementation requires manual image addition. Full Graph API integration can be added if needed.

## Testing

After migration:

1. Clear browser cache
2. Log into admin panel
3. Navigate to Gallery section
4. Check that OneDrive Configuration section appears
5. Test adding a single image with OneDrive link
6. Verify image displays correctly in gallery

## Troubleshooting

### Images not loading:
- Ensure OneDrive links are set to "Anyone with the link can view"
- Check that the URL format is correct
- Try using the embed URL format: `https://onedrive.live.com/embed?cid=...&resid=...`

### Folder link not accepted:
- Use the full sharing link from OneDrive
- Short URLs (1drv.ms) are supported but may need to be expanded
- Ensure folder permissions are set correctly