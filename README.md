# RRGF Mandatory Disclosure

School website and CBSE mandatory public disclosure — React frontend + PHP API on Hostinger.

## Deploy to production

**[HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md)** — full guide (required for deploys).

Quick:

```powershell
git push origin main
.\deploy.ps1
```

Or on server SSH: `bash deploy.sh`

## Develop locally

See [HOSTINGER_DEPLOY.md § Local development](./HOSTINGER_DEPLOY.md#local-development).

## Repo

| Folder | Description |
|--------|-------------|
| `Website/` | React source |
| `DEPLOYMENT_PACKAGE/public_html/` | Production files for Hostinger |
| `AGENTS.md` | Instructions for Cursor agents |
