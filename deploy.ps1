# See HOSTINGER_DEPLOY.md for full deploy documentation.
$SSH_USER = "u791315918"
$SSH_HOST = "rrgreenfieldmadhepura.in"
$SSH_PORT = "65002"
$KEY_PATH = "$env:USERPROFILE\.ssh\rrgf_deploy"
$SCRIPT   = "c:\Users\ASUS\Desktop\RRGF Mandatory Disclosure\deploy.sh"

# ── One-time SSH key setup ──────────────────────────────────────────────────
if (-not (Test-Path "$KEY_PATH")) {
    Write-Host "Generating SSH key (one-time setup)..." -ForegroundColor Yellow
    ssh-keygen -t ed25519 -f $KEY_PATH -N '""' -q
    $pubKey = Get-Content "$KEY_PATH.pub"
    Write-Host "Adding key to server (enter your SSH password when prompted)..." -ForegroundColor Yellow
    # ssh-copy-id equivalent for Windows
    ssh -p $SSH_PORT "${SSH_USER}@${SSH_HOST}" "mkdir -p ~/.ssh && echo '$pubKey' >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys && echo 'Key added OK'"
    Write-Host "SSH key set up. Future deploys won't ask for a password." -ForegroundColor Green
}

# ── Deploy ──────────────────────────────────────────────────────────────────
Write-Host "Uploading deploy script..." -ForegroundColor Cyan
scp -P $SSH_PORT -i $KEY_PATH $SCRIPT "${SSH_USER}@${SSH_HOST}:~/deploy.sh"

Write-Host "Running deploy on server..." -ForegroundColor Cyan
ssh -p $SSH_PORT -i $KEY_PATH "${SSH_USER}@${SSH_HOST}" "bash ~/deploy.sh && rm ~/deploy.sh"

Write-Host "Deploy complete! Verify login per HOSTINGER_DEPLOY.md" -ForegroundColor Green
