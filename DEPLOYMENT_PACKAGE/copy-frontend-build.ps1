# PowerShell script to copy frontend build files to deployment package
# Run this AFTER building the React frontend (npm run build)

$websiteRoot = "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\Website"
$deployRoot = "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\DEPLOYMENT_PACKAGE"

Write-Host "Copying frontend build files..." -ForegroundColor Cyan

# Check if dist folder exists
$distFolder = Join-Path $websiteRoot "dist"
if (-not (Test-Path $distFolder)) {
    Write-Host "ERROR: dist folder not found. Please run 'npm run build' first!" -ForegroundColor Red
    exit 1
}

# Copy dist contents to public_html
Write-Host "Copying dist/ contents to public_html/..." -ForegroundColor Yellow
Get-ChildItem -Path $distFolder | Copy-Item -Destination "$deployRoot\public_html\" -Recurse -Force

# Copy public assets
Write-Host "Copying public/documents/..." -ForegroundColor Yellow
if (Test-Path "$websiteRoot\public\documents") {
    Copy-Item -Path "$websiteRoot\public\documents\*" -Destination "$deployRoot\public_html\documents\" -Recurse -Force
}

Write-Host "Copying public/gallery/..." -ForegroundColor Yellow
if (Test-Path "$websiteRoot\public\gallery") {
    Copy-Item -Path "$websiteRoot\public\gallery\*" -Destination "$deployRoot\public_html\gallery\" -Recurse -Force
}

Write-Host "Copying public/images/..." -ForegroundColor Yellow
if (Test-Path "$websiteRoot\public\images") {
    Copy-Item -Path "$websiteRoot\public\images\*" -Destination "$deployRoot\public_html\images\" -Recurse -Force
}

Write-Host "✅ Frontend build files copied successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update database credentials in php-backend/config/database.php" -ForegroundColor White
Write-Host "  2. Upload files to Hostinger" -ForegroundColor White
Write-Host "  3. Import database schema" -ForegroundColor White
Write-Host "  4. Test deployment" -ForegroundColor White
