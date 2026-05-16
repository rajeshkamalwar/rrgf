# Microsoft Graph API Setup for OneDrive/SharePoint Auto-Fetch

To enable automatic image fetching from SharePoint/OneDrive folders, you need to configure Microsoft Graph API credentials.

## Step 1: Register an Azure Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: RRGF Gallery API (or any name)
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Leave blank for now
5. Click **Register**

## Step 2: Create Client Secret

1. In your app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: "Gallery API Secret"
4. Choose expiration (24 months recommended)
5. Click **Add**
6. **Important**: Copy the **Value** immediately (you won't see it again!)

## Step 3: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Application permissions** (not Delegated)
5. Add these permissions:
   - `Files.Read.All` - Read all files that the app can access
   - `Sites.Read.All` - Read items in all site collections (if needed)
6. Click **Add permissions**
7. Click **Grant admin consent** (important!)

## Step 4: Get Your Credentials

From your app registration:

1. **Application (client) ID**: Found on the **Overview** page
2. **Directory (tenant) ID**: Found on the **Overview** page  
3. **Client secret value**: The value you copied in Step 2

## Step 5: Configure Environment Variables

Add these to your server environment (or `.env` file on local development):

```bash
ONEDRIVE_CLIENT_ID=your-client-id-here
ONEDRIVE_CLIENT_SECRET=your-client-secret-here
ONEDRIVE_TENANT_ID=your-tenant-id-here
```

### For Local Development (XAMPP/PHP built-in server)

Create a `.env` file in `php-backend/` directory:

```env
ONEDRIVE_CLIENT_ID=your-client-id-here
ONEDRIVE_CLIENT_SECRET=your-client-secret-here
ONEDRIVE_TENANT_ID=your-tenant-id-here
```

Then update `config/app.php` or create a helper to load these values using `getenv()`.

### For Production (Hostinger Shared Hosting)

1. Log into your Hostinger control panel
2. Find "Environment Variables" or ".env" section
3. Add the three variables above

Or, if you can't set environment variables, you can modify `php-backend/services/SharePointService.php` directly (not recommended for security):

```php
private $clientId = 'your-client-id';
private $clientSecret = 'your-client-secret';
private $tenantId = 'your-tenant-id';
```

## Step 6: Test the Configuration

1. Restart your PHP server
2. Go to Admin Panel → Gallery section
3. Click "Fetch Images from OneDrive"
4. If configured correctly, images should be fetched automatically

## Troubleshooting

### "Credentials not configured" error
- Check that all three environment variables are set
- Restart your PHP server after setting variables
- Verify variable names are exactly: `ONEDRIVE_CLIENT_ID`, `ONEDRIVE_CLIENT_SECRET`, `ONEDRIVE_TENANT_ID`

### "Failed to get access token" error
- Verify your Client ID and Client Secret are correct
- Check that admin consent was granted for API permissions
- Ensure your Tenant ID is correct

### "Graph API request failed" error
- Verify API permissions are granted and consented
- Check that the folder link is correct
- Ensure the folder is accessible by the app

### Images not appearing
- Check that folder permissions allow the app to read files
- Verify images are actually in the folder
- Check PHP error logs for detailed error messages

## Security Notes

⚠️ **Never commit credentials to version control!**
- Add `.env` to `.gitignore`
- Use environment variables on production
- Rotate secrets if they're ever exposed

## Alternative: Manual Image Addition

If you don't want to set up Graph API, you can continue adding images manually:
1. Open each image in SharePoint
2. Right-click → Copy link
3. Paste the link in "Add Image" section in admin panel

This works without any API setup!