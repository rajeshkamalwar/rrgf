# RRGF Mandatory Disclosure — agent instructions

## Deployment (required reading)

**Before any Hostinger/production deploy**, read and follow:

**[HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md)**

Key points agents must not skip:

1. Production web root is `~/domains/rrgreenfieldmadhepura.in/public_html/` — not only `~/public_html/`.
2. Deploy the full `DEPLOYMENT_PACKAGE/public_html/` tree (especially all of `php-backend/`).
3. Never commit `database.local.php` or credentials.
4. Verify with `wc -c` on `php-backend/api/index.php` (~10067) and `curl` login test after deploy.

Use `deploy.sh` / `deploy.ps1` from repo root when deploying.

## Repo layout

| Path | Purpose |
|------|---------|
| `Website/` | React + Vite source (`npm run dev`, `npm run build:hostinger`) |
| `DEPLOYMENT_PACKAGE/public_html/` | Production build + PHP backend for Hostinger |
| `HOSTINGER_DEPLOY.md` | Canonical production deploy guide |

## Local dev

See **Local development** section in [HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md).
