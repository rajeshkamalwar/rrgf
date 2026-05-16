// Helper functions for Google Drive integration

/**
 * Extract file ID from Google Drive sharing link
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export const extractFileId = (link: string): string | null => {
  // Format: https://drive.google.com/file/d/FILE_ID/view
  let match = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Format: https://drive.google.com/open?id=FILE_ID
  match = link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Format: https://drive.google.com/uc?id=FILE_ID
  match = link.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  return null;
};

/**
 * Convert Google Drive sharing link to direct image URL
 * @param sharingLink - Google Drive sharing link
 * @param thumbnail - If true, returns thumbnail URL (smaller, faster)
 */
export const convertToDirectImageUrl = (sharingLink: string, thumbnail: boolean = false): string | null => {
  const fileId = extractFileId(sharingLink);
  if (!fileId) return null;

  if (thumbnail) {
    // Thumbnail URL (smaller, faster loading)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  } else {
    // Full image URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
};

/**
 * Convert Google Drive folder link to folder ID
 */
export const extractFolderId = (link: string): string | null => {
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

/**
 * Generate Google Drive API folder URL
 * Note: Requires API key or OAuth token
 */
export const getFolderApiUrl = (folderId: string, apiKey?: string): string => {
  const baseUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,thumbnailLink,webViewLink)`;
  if (apiKey) {
    return `${baseUrl}&key=${apiKey}`;
  }
  return baseUrl;
};

