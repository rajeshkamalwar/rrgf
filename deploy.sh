#!/bin/bash
# RRGF Hostinger deploy — see HOSTINGER_DEPLOY.md
set -euo pipefail

REPO_URL="${RRGF_REPO_URL:-https://github.com/rajeshkamalwar/rrgf.git}"
LIVE="${RRGF_LIVE_ROOT:-$HOME/domains/rrgreenfieldmadhepura.in/public_html}"
STAGING="${RRGF_STAGING_ROOT:-$HOME/public_html}"
SITE_URL="${RRGF_SITE_URL:-https://rrgreenfieldmadhepura.in}"

echo "=== RRGF deploy ==="
echo "LIVE:    $LIVE"
echo "STAGING: $STAGING"
echo ""

cd ~
rm -rf temp_deploy
echo "=== Clone $REPO_URL ==="
git clone --depth 1 "$REPO_URL" temp_deploy

echo "=== Copy to staging ($STAGING) ==="
mkdir -p "$STAGING"
cp -rf temp_deploy/DEPLOYMENT_PACKAGE/public_html/. "$STAGING/"

# Preserve LIVE database credentials before rsync
DB_LOCAL="$LIVE/php-backend/config/database.local.php"
DB_BACKUP=""
if [ -f "$DB_LOCAL" ]; then
  DB_BACKUP="$(mktemp)"
  cp -a "$DB_LOCAL" "$DB_BACKUP"
  echo "Backed up database.local.php"
fi

echo "=== Sync staging → LIVE ($LIVE) ==="
mkdir -p "$LIVE"
rsync -av \
  --exclude='php-backend/config/database.local.php' \
  --exclude='php-backend/uploads/' \
  "$STAGING/" "$LIVE/"

if [ -n "$DB_BACKUP" ] && [ -f "$DB_BACKUP" ]; then
  mkdir -p "$LIVE/php-backend/config"
  cp -a "$DB_BACKUP" "$LIVE/php-backend/config/database.local.php"
  cp -a "$DB_BACKUP" "$STAGING/php-backend/config/database.local.php"
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
echo "Database.php OK"

echo ""
echo "=== Test login ==="
curl -s -X POST "$SITE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -w "\nHTTP:%{http_code}\n"

echo ""
echo "=== Done — see HOSTINGER_DEPLOY.md ==="
