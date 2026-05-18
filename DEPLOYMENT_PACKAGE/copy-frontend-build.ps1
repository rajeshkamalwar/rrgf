# Copy Hostinger frontend build into DEPLOYMENT_PACKAGE/public_html
# Run from repo root after: cd Website && npm run build:hostinger

$ErrorActionPreference = "Stop"
$websiteRoot = Join-Path $PSScriptRoot "..\Website"
$deployPublic = Join-Path $PSScriptRoot "public_html"
$spaDist = Join-Path $websiteRoot "dist\spa"

if (-not (Test-Path $spaDist)) {
    Write-Host "ERROR: $spaDist not found. Run:" -ForegroundColor Red
    Write-Host "  cd Website" -ForegroundColor Yellow
    Write-Host "  npm run build:hostinger" -ForegroundColor Yellow
    exit 1
}

Write-Host "Copying dist/spa/assets -> public_html/assets ..." -ForegroundColor Cyan
$assetsSrc = Join-Path $spaDist "assets"
$assetsDst = Join-Path $deployPublic "assets"
New-Item -ItemType Directory -Force -Path $assetsDst | Out-Null
Get-ChildItem -Path $assetsSrc -File | Copy-Item -Destination $assetsDst -Force

$builtIndex = Join-Path $spaDist "index.html"
$html = Get-Content -Raw $builtIndex
if ($html -notmatch 'src="([^"]+assets/index-[^"]+\.js)"') {
    Write-Host "ERROR: Could not find JS bundle in $builtIndex" -ForegroundColor Red
    exit 1
}
$jsPath = $Matches[1] -replace '^\./', '/'
if ($html -notmatch 'href="([^"]+assets/index-[^"]+\.css)"') {
    Write-Host "ERROR: Could not find CSS bundle in $builtIndex" -ForegroundColor Red
    exit 1
}
$cssPath = $Matches[1] -replace '^\./', '/'

Write-Host "  JS:  $jsPath" -ForegroundColor Gray
Write-Host "  CSS: $cssPath" -ForegroundColor Gray

foreach ($entry in @("appentry.php", "index.php")) {
    $path = Join-Path $deployPublic $entry
    if (-not (Test-Path $path)) { continue }
    $content = Get-Content -Raw $path
    $content = $content -replace 'src="/assets/index-[^"]+\.js"', "src=`"$jsPath`""
    $content = $content -replace 'href="/assets/index-[^"]+\.css"', "href=`"$cssPath`""
    Set-Content -Path $path -Value $content -NoNewline
    Write-Host "Updated $entry" -ForegroundColor Green
}

# Optional static copies
foreach ($dir in @("documents", "gallery", "images")) {
    $src = Join-Path $websiteRoot "public\$dir"
    if (Test-Path $src) {
        $dst = Join-Path $deployPublic $dir
        New-Item -ItemType Directory -Force -Path $dst | Out-Null
        Copy-Item -Path "$src\*" -Destination $dst -Recurse -Force
        Write-Host "Copied public/$dir" -ForegroundColor Gray
    }
}

Write-Host "Done. Commit DEPLOYMENT_PACKAGE/public_html and run deploy.sh on server." -ForegroundColor Green
