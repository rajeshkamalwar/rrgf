<?php
/**
 * Test SharePoint Image URL conversion
 */

require_once __DIR__ . '/../utils/OneDriveHelper.php';

$testImageUrl = "https://neksoftconsultancyservice-my.sharepoint.com/:i:/g/personal/info_neksoftconsultancy_com/IQBg9wFcCVfdTLXM-IlAfBwQAU13WSZtU-KBiTu8R_CIAYA?e=NNSLhH";

echo "=== Testing SharePoint Image URL ===\n\n";
echo "Original URL: $testImageUrl\n\n";

echo "1. Extracting File ID:\n";
$fileId = OneDriveHelper::extractFileId($testImageUrl);
echo "   File ID: " . ($fileId ?? 'NULL') . "\n\n";

echo "2. Extracting SharePoint Details:\n";
$details = OneDriveHelper::extractSharePointDetails($testImageUrl);
if ($details) {
    echo "   Tenant: " . $details['tenant'] . "\n";
    echo "   User: " . $details['user'] . "\n";
    echo "   Folder ID: " . $details['folderId'] . "\n";
    echo "   Base URL: " . $details['baseUrl'] . "\n";
} else {
    echo "   Failed to extract details\n";
}
echo "\n";

echo "3. Getting Embeddable URL:\n";
$embedUrl = OneDriveHelper::getEmbeddableUrl($testImageUrl);
echo "   Embed URL: $embedUrl\n\n";

echo "4. Getting Thumbnail URL:\n";
$thumbUrl = OneDriveHelper::getThumbnailUrl($testImageUrl, 800);
echo "   Thumbnail URL: $thumbUrl\n\n";

echo "=== Test Complete ===\n";