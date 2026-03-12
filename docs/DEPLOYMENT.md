# Deployment Guide

Step-by-step deployment instructions for the Remote Coding Demo.

## Deployment Methods

1. **Automatic:** Push to `main` branch (GitHub Actions)
2. **Manual:** Run deployment script
3. **Manual (step-by-step):** Build and restart manually

## Method 1: Automatic Deployment (Recommended)

### Setup (one-time)

1. **Configure GitHub Secrets:**
   - Go to: GitHub repo → Settings → Secrets and variables → Actions
   - Add `EC2_HOST`: Your EC2 IP address
   - Add `EC2_SSH_KEY`: Your SSH private key

2. **Push to trigger deployment:**

   ```bash
   git add .
   git commit -m "Deploy changes"
   git push origin main
   ```

3. **Monitor deployment:**
   - Go to: GitHub repo → Actions
   - Watch the workflow run

### What happens automatically:

1. GitHub Actions checks out code
2. Builds React app with Vite
3. SSHs to EC2 as `ec2-claude-user`
4. Pulls latest code
5. Installs server dependencies
6. Restarts PM2
7. Verifies API endpoint

## Method 2: Manual Deployment Script

### On EC2:

```bash
cd ~/projects/remote-coding-full-stack-demo
./deploy.sh
```

This script:

1. Installs all dependencies
2. Builds React app
3. Restarts PM2

## Method 3: Step-by-Step Manual Deployment

### 1. Build React app

```bash
cd ~/projects/remote-coding-full-stack-demo/client
npm install
npm run build
```

### 2. Install server dependencies

```bash
cd ../server
npm install --production
```

### 3. Restart PM2

```bash
cd ..
pm2 restart xrp-demo
```

### 4. Verify deployment

```bash
pm2 status
pm2 logs xrp-demo --lines 20
curl http://localhost:3000/api/balance/rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY
```

## Rollback

### To previous version:

```bash
cd ~/projects/remote-coding-full-stack-demo
git log --oneline  # Find commit hash
git reset --hard <commit-hash>
./deploy.sh
```

### From GitHub:

```bash
cd ~/projects/remote-coding-full-stack-demo
git pull origin main
git reset --hard origin/main~1  # Go back 1 commit
./deploy.sh
```

## Zero-Downtime Deployment (Advanced)

### Using PM2 reload:

```bash
pm2 reload ecosystem.config.js
```

This gracefully reloads the app without downtime.

## Deployment Checklist

- [ ] Code committed and pushed to GitHub
- [ ] Tests pass locally
- [ ] React build completes without errors
- [ ] Server dependencies installed
- [ ] PM2 restarts successfully
- [ ] API endpoints respond correctly
- [ ] Frontend loads in browser
- [ ] No errors in PM2 logs
- [ ] Nginx serving correctly

## Common Deployment Issues

### Build fails

**Symptom:** `npm run build` fails

**Solution:**

```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PM2 restart fails

**Symptom:** `pm2 restart xrp-demo` shows error

**Solution:**

```bash
# Check logs
pm2 logs xrp-demo --err

# Kill and restart
pm2 delete xrp-demo
pm2 start ecosystem.config.js
```

### Dependencies missing

**Symptom:** "Cannot find module" errors

**Solution:**

```bash
cd server
npm install
pm2 restart xrp-demo
```

### Port conflict

**Symptom:** "Port 3000 already in use"

**Solution:**

```bash
sudo netstat -tulpn | grep 3000
pm2 delete all
pm2 start ecosystem.config.js
```

### Old build cached

**Symptom:** Changes not visible in browser

**Solution:**

```bash
cd client
rm -rf dist
npm run build
cd ..
pm2 restart xrp-demo
```

## Monitoring Deployment

### Watch PM2 logs during deployment:

```bash
pm2 logs xrp-demo --lines 100 --raw
```

### Monitor GitHub Actions:

1. Go to: GitHub repo → Actions
2. Click on latest workflow run
3. Watch deployment steps in real-time

### Check application health:

```bash
# API health (use a real XRP testnet address)
curl http://localhost:3000/api/balance/$EXAMPLE_XRP_ADDRESS

# Frontend health (use your EC2 IP)
curl -I http://$EC2_HOST
```

## Environment-Specific Deployments

### Testnet (default):

No changes needed. Uses `wss://s.altnet.rippletest.net:51233`

### Mainnet:

Update `server/routes/xrp.js`:

```javascript
const client = new Client("wss://xrplcluster.com");
```

Then deploy:

```bash
./deploy.sh
```

## Post-Deployment Verification

### 1. Check PM2 status:

```bash
pm2 status
```

Expected: `xrp-demo` status `online`

### 2. Test API endpoints:

```bash
curl http://localhost:3000/api/balance/$EXAMPLE_XRP_ADDRESS
```

Expected: JSON with balance

### 3. Test frontend:

```bash
curl http://$EC2_HOST
```

Expected: HTML content

### 4. Test in browser:

Visit: http://$EC2_HOST (use your EC2 IP)
Expected: React app loads with balance and QR code

## Scheduling Deployments

### Deploy at specific time:

Use GitHub Actions schedule trigger:

```yaml
on:
  schedule:
    - cron: "0 2 * * *" # 2 AM daily
```

### Manual trigger from GitHub:

1. Go to: Actions tab
2. Select "Deploy to EC2" workflow
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow"
