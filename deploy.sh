#!/bin/bash
# RRGF Hostinger deploy — see HOSTINGER_DEPLOY.md
set -euo pipefail

REPO_URL="${RRGF_REPO_URL:-https://github.com/rajeshkamalwar/rrgf.git}"
LIVE="${RRGF_LIVE_ROOT:-$HOME/domains/rrgreenfieldmadhepura.in/public_html}"
SITE_URL="${RRGF_SITE_URL:-https://rrgreenfieldmadhepura.in}"

# Package root only — NEVER rsync ~/public_html/ (shared account may hold other sites).
PKG=""

echo "=== RRGF deploy ==="
echo "LIVE: $LIVE"
echo ""

cd ~
rm -rf temp_deploy
echo "=== Clone $REPO_URL ==="
git clone --depth 1 "$REPO_URL" temp_deploy

PKG="$HOME/temp_deploy/DEPLOYMENT_PACKAGE/public_html"
if [ ! -d "$PKG" ]; then
  echo "ERROR: $PKG not found"
  exit 1
fi

# Preserve LIVE database credentials before rsync
DB_LOCAL="$LIVE/php-backend/config/database.local.php"
DB_BACKUP=""
if [ -f "$DB_LOCAL" ]; then
  DB_BACKUP="$(mktemp)"
  cp -a "$DB_LOCAL" "$DB_BACKUP"
  echo "Backed up database.local.php"
fi

echo "=== Sync RRGF package only → LIVE ($LIVE) ==="
mkdir -p "$LIVE"
rsync -av --delete \
  --exclude='php-backend/config/database.local.php' \
  --exclude='php-backend/uploads/' \
  "$PKG/" "$LIVE/"

if [ -n "$DB_BACKUP" ] && [ -f "$DB_BACKUP" ]; then
  mkdir -p "$LIVE/php-backend/config"
  cp -a "$DB_BACKUP" "$LIVE/php-backend/config/database.local.php"
  rm -f "$DB_BACKUP"
  echo "Restored database.local.php"
else
  echo "WARN: No database.local.php on LIVE — create per HOSTINGER_DEPLOY.md"
fi

rm -rf temp_deploy

echo ""
echo "=== Verify ==="
API_INDEX="$LIVE/php-backend/api/index.php"
wc -c "$API_INDEX"
grep -c register_shutdown "$API_INDEX" || { echo "ERROR: old api/index.php"; exit 1; }
test -f "$LIVE/php-backend/services/Database.php" || { echo "ERROR: Database.php missing on LIVE"; exit 1; }
test -f "$LIVE/backend/index.php" || echo "WARN: backend/index.php missing (admin /backend may 403)"
echo "Database.php OK"

echo ""
echo "=== Test login ==="
curl -s -X POST "$SITE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -w "\nHTTP:%{http_code}\n"

echo ""
echo "=== Done — only RRGF package synced to LIVE (other sites in ~/public_html untouched) ==="
