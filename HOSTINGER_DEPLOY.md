# Hostinger deployment guide (RRGF)

**Canonical deploy doc for this repo.** Agents and humans must follow this when deploying to production.

- **Site:** https://rrgreenfieldmadhepura.in/
- **Admin:** https://rrgreenfieldmadhepura.in/backend
- **GitHub:** https://github.com/rajeshkamalwar/rrgf.git
- **SSH:** `ssh -p 65002 u791315918@195.35.46.126` (or `u791315918@rrgreenfieldmadhepura.in`)

---

## Critical: two `public_html` paths

Hostinger uses a **live web root** that is not always the same as `~/public_html/`:

| Path | Role |
|------|------|
| `~/domains/rrgreenfieldmadhepura.in/public_html/` | **LIVE** — PHP/Apache serves the school site from here |
| `~/public_html/` | **Other sites on your account** — do **not** rsync this folder to RRGF LIVE |

**Always deploy to LIVE only.** `deploy.sh` rsyncs **only** `DEPLOYMENT_PACKAGE/public_html/` from the git clone into `domains/rrgreenfieldmadhepura.in/public_html/`. It does **not** copy your whole `~/public_html/` (that would pull in `enchanting`, `gandhiasian`, etc.).

If only `api/index.php` is updated on LIVE but `php-backend/services/` is missing, the API returns 500 (`Database.php` not found). Deploy the **full** `public_html` tree, especially all of `php-backend/`.

---

## What to deploy

Source in repo:

```
DEPLOYMENT_PACKAGE/public_html/   → entire tree goes under LIVE public_html
```

Important pieces:

```
public_html/
├── .htaccess              # /api → api/index.php; SPA fallback; php-backend passthrough
├── api/index.php          # 9-line shim → php-backend/api/index.php
├── appentry.php           # SPA shell
├── assets/                # React build
├── php-backend/           # Full PHP API (required)
│   ├── api/index.php      # Must be ~10067 bytes; contains ob_start + register_shutdown
│   ├── services/Database.php
│   ├── config/database.local.php   # SERVER ONLY — never commit
│   └── .htaccess          # RewriteEngine Off (do not route PHP to SPA)
└── ...
```

---

## One-command deploy (SSH on server)

Use the repo script (also run via `deploy.ps1` from Windows):

```bash
bash ~/deploy.sh
```

Or after cloning locally on server:

```bash
cd ~
rm -rf temp_deploy && git clone --depth 1 https://github.com/rajeshkamalwar/rrgf.git temp_deploy
bash temp_deploy/deploy.sh
```

The script:

1. Clones latest `main` from GitHub  
2. **Rsyncs only** `DEPLOYMENT_PACKAGE/public_html/` → `~/domains/rrgreenfieldmadhepura.in/public_html/` (not all of `~/public_html/`)  
4. **Preserves** existing `database.local.php` on LIVE  
5. **Does not overwrite** `php-backend/uploads/` on LIVE (server uploads kept)  
6. **Does not reset MySQL** — deploy only replaces PHP/JS files; your database rows stay in Hostinger MySQL unless you run `schema.sql` / reset scripts yourself  
7. **Preserves** `database.local.php` (credentials file on disk — if missing after deploy, login returns 500 until you recreate it)  
8. Verifies `api/index.php` size and runs login `curl` test  

### Git deploy does NOT wipe your database

| What deploy changes | What deploy does **not** touch |
|---------------------|--------------------------------|
| Files under `domains/rrgreenfieldmadhepura.in/public_html/` | MySQL tables (`documents`, `mpd_disclosure`, `admin_sessions`, etc.) |
| Removes stray folders wrongly copied to LIVE (`--delete` vs package only) | `database.local.php` content if backup existed (script restores it) |
| | `php-backend/uploads/` (protected + excluded) |

If login breaks after deploy with `Access denied for user 'root'`, **`database.local.php` was missing on LIVE** — recreate it in hPanel (see below). That is **not** the same as emptying MySQL.  

---

## Deploy from Windows

```powershell
cd "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure"
git push origin main   # push fixes first
.\deploy.ps1
```

Requires SSH key at `%USERPROFILE%\.ssh\rrgf_deploy` or enter password when prompted.

---

## Database credentials (one-time / manual)

Create on server only (gitignored):

`php-backend/config/database.local.php`

```php
<?php
return [
    'host'     => 'localhost',
    'dbname'   => 'u791315918_rrgfwebsite',
    'username' => 'u791315918_webadmin',
    'password' => 'YOUR_PASSWORD_FROM_HPANEL',
    'charset'  => 'utf8mb4',
    'options'  => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ],
];
```

- File must start with `<?php` on line 1 (no BOM, no blank lines before).  
- Copy to **both** paths if you use both:

```bash
cp -a "$LIVE/php-backend/config/database.local.php" ~/public_html/php-backend/config/
```

Import schema once in phpMyAdmin: `DEPLOYMENT_PACKAGE/public_html/php-backend/database/schema.sql`

---

## Verify after deploy

```bash
LIVE=~/domains/rrgreenfieldmadhepura.in/public_html

# Correct API router (~10067 bytes)
wc -c "$LIVE/php-backend/api/index.php"
grep -c register_shutdown "$LIVE/php-backend/api/index.php"   # expect 1

# Backend files present on LIVE
test -f "$LIVE/php-backend/services/Database.php" && echo "Database.php OK"

# Login API
curl -s -X POST "https://rrgreenfieldmadhepura.in/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -w "\nHTTP:%{http_code}\n"
```

Expected: JSON with `"success":true,"sessionId":"..."` and `HTTP:200`.

---

## Local development

```powershell
# Terminal 1 — PHP API
cd DEPLOYMENT_PACKAGE\public_html\php-backend
php -S localhost:8000

# Terminal 2 — React
cd Website
npm run dev
```

- Frontend: http://localhost:3000/  
- API: http://localhost:8000/api/  

---

## Troubleshooting

| Symptom | Cause | Fix |
|--------|--------|-----|
| HTML instead of JSON from `/php-backend/*.php` | SPA `.htaccess` caught request | Ensure `php-backend/.htaccess` and `RewriteRule ^php-backend/ - [L]` in root `.htaccess` |
| `Database.php` not found | LIVE missing `php-backend/services/` | `rsync` full `php-backend` to `domains/.../public_html` |
| Empty HTTP 500 on `/api/*` | Old `api/index.php` or BOM in config | Deploy full `index.php` (~10067 bytes); use `ob_start` / `ob_end_clean` |
| `grep ob_start` = 0 on server | Wrong file or wrong path | Edit `domains/.../php-backend/api/index.php`, not only `~/public_html` |
| Login works in CLI, not web | Deployed only to `~/public_html` | Sync to `domains/.../public_html` |
| 500 login, `root` / no password | `database.local.php` missing on LIVE | Create `php-backend/config/database.local.php` on LIVE (hPanel MySQL credentials); redeploy restores if backup exists |
| “Database reset” after git deploy | Usually credentials file lost, not MySQL emptied | Check phpMyAdmin — tables still there; fix `database.local.php` |
| File Manager upload stuck at 9215 bytes | Old file cached / wrong folder | Delete file, re-upload, or use `git clone` + `deploy.sh` |

---

## Security

- Never commit `database.local.php` or passwords to git.  
- Remove diagnostic files after use: `test-api.php`, `web-login.php`, `patch-login.php`.  
- Default admin: `admin` / `admin123` — change via Admin panel after first login.

---

## Related files

| File | Purpose |
|------|---------|
| `deploy.sh` | Server-side deploy script |
| `deploy.ps1` | Windows: upload and run `deploy.sh` |
| `DEPLOYMENT_PACKAGE/HOSTINGER_SPECIFIC_GUIDE.md` | Older checklist (see this doc first) |
| `.cursor/rules/hostinger-deploy.mdc` | Cursor agent rule |
