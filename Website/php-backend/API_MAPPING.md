# API Endpoint Mapping: Node.js → PHP

This document maps all API endpoints from the original Node.js backend to the new PHP backend.

## Public Endpoints

| Method | Endpoint | Description | Response Format |
|--------|----------|-------------|-----------------|
| POST | `/api/enquiry` | Submit enquiry form | `{success: true, message: string}` |
| POST | `/api/contact` | Submit contact form | `{success: true, message: string}` |
| POST | `/api/admissions` | Submit admission application | `{success: true, message: string}` |
| POST | `/api/visit-schedule` | Schedule school visit | `{success: true, message: string}` |
| GET | `/api/documents` | Get mandatory disclosure documents | `{success: true, documents: Array}` |
| GET | `/api/hero-images` | Get hero slider images | `{success: true, images: Array}` |
| GET | `/api/gallery` | Get gallery images | `{success: true, images: Array}` |

## Admin Endpoints (Require `x-session-id` header)

### Authentication

| Method | Endpoint | Description | Response Format |
|--------|----------|-------------|-----------------|
| POST | `/api/admin/login` | Admin login | `{success: true, sessionId: string}` |
| GET | `/api/admin/check-auth` | Check authentication status | `{success: true, authenticated: boolean}` |
| POST | `/api/admin/logout` | Admin logout | `{success: true, message: string}` |

### SMTP Configuration

| Method | Endpoint | Description | Response Format |
|--------|----------|-------------|-----------------|
| GET | `/api/admin/smtp` | Get SMTP configuration | `{success: true, config: Object}` |
| PUT | `/api/admin/smtp` | Update SMTP configuration | `{success: true, config: Object}` |
| POST | `/api/admin/smtp/test-connection` | Test SMTP connection | `{success: true, message: string}` |
| POST | `/api/admin/smtp/test-email` | Send test email | `{success: true, message: string}` |

### Documents Management

| Method | Endpoint | Description | Response Format |
|--------|----------|-------------|-----------------|
| PUT | `/api/admin/documents/:id` | Update document (file upload or link) | `{success: true, document: Object}` |

**Note:** Supports both file upload (multipart/form-data with `file` field) and JSON update (`{link: string}`).

### Hero Images Management

| Method | Endpoint | Description | Response Format |
|--------|----------|-------------|-----------------|
| GET | `/api/admin/hero-images` | Get all hero images | `{success: true, images: Array}` |
| POST | `/api/admin/hero-images` | Upload hero image | `{success: true, image: Object}` |
| DELETE | `/api/admin/hero-images/:id` | Delete hero image | `{success: true, message: string}` |
| PUT | `/api/admin/hero-images/order` | Update hero image order | `{success: true, images: Array}` |

### Gallery Management

| Method | Endpoint | Description | Response Format |
|--------|----------|-------------|-----------------|
| GET | `/api/admin/gallery/config` | Get gallery configuration | `{success: true, config: Object}` |
| PUT | `/api/admin/gallery/config` | Update gallery configuration | `{success: true, config: Object, imagesAdded?: number}` |
| POST | `/api/admin/gallery/fetch-drive` | Fetch images from Google Drive | `{success: true, imagesAdded: number}` |
| GET | `/api/admin/gallery/images` | Get all gallery images | `{success: true, images: Array}` |
| POST | `/api/admin/gallery/images` | Add gallery image | `{success: true, image: Object}` |
| PUT | `/api/admin/gallery/images/:id` | Update gallery image | `{success: true, image: Object}` |
| DELETE | `/api/admin/gallery/images/:id` | Delete gallery image | `{success: true, message: string}` |

## Response Format

All endpoints return JSON with this structure:

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "errors": [] // Optional validation errors
}
```

## Authentication

Admin endpoints require authentication via session token:

1. Login via `POST /api/admin/login` with `{username, password}`
2. Receive `sessionId` in response
3. Include `x-session-id` header in subsequent requests:
   ```
   x-session-id: abc123def456...
   ```
4. Session expires after 24 hours (configurable in `config/app.php`)

## CORS

All endpoints support CORS with:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, x-session-id`

## File Uploads

File uploads are supported for:
- Hero images: `POST /api/admin/hero-images` (multipart/form-data, field: `image`)
- Documents: `PUT /api/admin/documents/:id` (multipart/form-data, field: `file`)

Uploaded files are stored in:
- Hero images: `/uploads/hero/`
- Documents: `/uploads/documents/`

## Database Schema

All data is stored in MySQL tables:
- `enquiries` - Enquiry form submissions
- `contacts` - Contact form submissions
- `admissions` - Admission applications
- `visit_schedules` - Visit schedule requests
- `documents` - Mandatory disclosure documents
- `hero_images` - Hero slider images
- `gallery_images` - Gallery images
- `gallery_config` - Gallery configuration
- `smtp_config` - SMTP email configuration
- `admin_sessions` - Admin session tokens

## Notes

1. **No Frontend Changes Required:** All endpoints match the original Node.js API exactly
2. **Same JSON Structure:** Response formats are identical
3. **Session-based Auth:** Uses session tokens instead of JWT (compatible with React localStorage)
4. **File Storage:** Files stored in filesystem (uploads/) instead of cloud storage
5. **Email:** Uses PHP `mail()` function with optional PHPMailer support

## Migration Compatibility

✅ All API endpoints implemented
✅ Same request/response formats
✅ Same authentication mechanism (session tokens)
✅ Same file upload handling
✅ Same error responses
✅ Same CORS headers

The React frontend will work without any modifications!