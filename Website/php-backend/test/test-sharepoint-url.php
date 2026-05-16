<?php
/**
 * Test SharePoint URL parsing
 */

require_once __DIR__ . '/../utils/OneDriveHelper.php';

$testUrl = "https://neksoftconsultancyservice-my.sharepoint.com/:f:/g/personal/info_neksoftconsultancy_com/IgC32uBo_r1HRqVsroirjJLCAQZB5bklp3cnB9GwhjMtdAs?e=mTVtIs";

echo "=== Testing SharePoint URL Parsing ===\n\n";
echo "Test URL: $testUrl\n\n";

echo "1. Extracting Folder ID:\n";
$folderId = OneDriveHelper::extractFolderId($testUrl);
echo "   Folder ID: " . ($folderId ?? 'NULL') . "\n\n";

echo "2. Extracting SharePoint Details:\n";
$details = OneDriveHelper::extractSharePointDetails($testUrl);
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
$embedUrl = OneDriveHelper::getEmbeddableUrl($testUrl);
echo "   Embed URL: $embedUrl\n\n";

echo "=== Test Complete ===\n";