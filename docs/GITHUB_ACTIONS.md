# GitHub Actions Deployment Explained

## How the Workflow Works

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. You push to GitHub                                           │
│    git push origin main                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. GitHub Actions Workflow Triggers                             │
│    (runs on GitHub's ubuntu-latest runner - FREE)              │
│                                                                  │
│    Steps:                                                        │
│    a. Checkout code from repo                                   │
│    b. Install Node.js 18                                        │
│    c. Install client dependencies (npm ci)                      │
│    d. Build React app (npm run build)                           │
│    e. Creates: client/dist/ with production build              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. SSH to Your EC2 Instance                                     │
│    Uses secrets: EC2_HOST, EC2_USER, EC2_SSH_KEY               │
│                                                                  │
│    Runs on YOUR EC2:                                            │
│    a. cd ~/projects/remote-coding-full-stack-demo              │
│    b. git pull origin main                                      │
│    c. cd server && npm install --production                     │
│    d. pm2 restart xrp-demo                                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Verify Deployment                                            │
│    SSH to EC2 again and test:                                   │
│    curl http://localhost:3000/api/balance/...                   │
└─────────────────────────────────────────────────────────────────┘
```

## Important: Two Separate Machines

### GitHub's Runner (ubuntu-latest)
- **Purpose:** Build the React app
- **Location:** GitHub's servers (free tier)
- **OS:** Ubuntu (always Linux, regardless of your EC2)
- **Why here?** Offload build process, save EC2 resources
- **Cost:** FREE for public repos, generous limits for private

### Your EC2 Instance
- **Purpose:** Run the Express server & serve React build
- **Location:** AWS (your account)
- **OS:** Whatever you installed (Amazon Linux, Ubuntu, etc.)
- **Why here?** Host the actual application
- **Cost:** Your EC2 instance charges

## Why This Setup?

### ✅ Benefits

1. **Saves EC2 Resources**
   - Building React app is CPU/memory intensive
   - GitHub does the heavy lifting for free
   - Your EC2 just runs the app

2. **Faster Deployments**
   - GitHub runners are fast
   - Parallel builds possible
   - No impact on live app during build

3. **Works with Any EC2 OS**
   - GitHub runner is always Ubuntu
   - Your EC2 can be Amazon Linux, Ubuntu, etc.
   - SSH works regardless

4. **Free**
   - GitHub Actions is free for public repos
   - 2000 minutes/month for private repos

### ❌ Alternative: Build on EC2

```yaml
# Don't do this - wastes resources
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH and build on EC2
        run: |
          ssh ec2-user@$EC2_HOST "cd app && npm install && npm run build"
```

**Problems:**
- Uses your EC2 CPU/RAM
- Slows down live app
- More expensive (need bigger instance)

## Understanding `runs-on: ubuntu-latest`

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest  # This is GitHub's server, NOT your EC2!
```

### What it means:
- ✅ GitHub provides a free Ubuntu VM
- ✅ Fast, clean environment every time
- ✅ Pre-installed with Node.js, Git, etc.
- ✅ Works regardless of your EC2's OS

### What it does NOT mean:
- ❌ Does NOT affect your EC2 instance
- ❌ Does NOT require your EC2 to be Ubuntu
- ❌ Does NOT run on your EC2 at all (during build)

## Your EC2 OS Doesn't Matter (for builds)

Your EC2 can be:
- ✅ Amazon Linux 2023
- ✅ Ubuntu 22.04
- ✅ CentOS/RHEL
- ✅ Debian

The workflow will work the same because:
1. Build happens on GitHub's Ubuntu runner
2. Only the deployment (SSH commands) touch your EC2
3. SSH commands are OS-agnostic (git pull, npm install, pm2 restart)

## Customizing for Your EC2

If you need to change something based on your EC2's OS, modify the SSH commands:

```yaml
- name: Deploy to EC2
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.EC2_HOST }}
    username: ${{ secrets.EC2_USER }}
    key: ${{ secrets.EC2_SSH_KEY }}
    script: |
      cd ~/projects/remote-coding-full-stack-demo
      git pull origin main

      # If Amazon Linux, you might need:
      # source ~/.nvm/nvm.sh

      # If Ubuntu, you might need:
      # export NVM_DIR="$HOME/.nvm"
      # [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

      cd server
      npm install --production
      cd ..
      pm2 restart xrp-demo
```

## Testing the Workflow

### 1. Set up GitHub Secrets first

Repository → Settings → Secrets and variables → Actions

Add:
- `EC2_HOST` - Your EC2 IP (e.g., `12.34.56.78`)
- `EC2_USER` - Username (e.g., `ec2-claude-user`)
- `EC2_SSH_KEY` - Your SSH private key (entire contents of `~/.ssh/id_rsa`)

### 2. Test SSH locally first

```bash
# Make sure you can SSH to EC2
ssh -i ~/.ssh/your-key $EC2_USER@$EC2_HOST

# Make sure you can run git pull
cd ~/projects/remote-coding-full-stack-demo
git pull
```

### 3. Push to trigger workflow

```bash
git add .
git commit -m "Test deployment"
git push origin main
```

### 4. Watch in GitHub

Go to: Repository → Actions tab

You'll see:
- ✅ Checkout, Setup Node, Build (on GitHub)
- ✅ SSH Deploy (on your EC2)
- ✅ Verify (on your EC2)

## Troubleshooting

### "Host key verification failed"

GitHub can't verify your EC2's SSH key.

**Fix:** Use `ssh-keyscan` in workflow:
```yaml
- name: Add EC2 to known hosts
  run: |
    mkdir -p ~/.ssh
    ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts
```

### "Permission denied (publickey)"

SSH key is wrong or not configured.

**Fix:**
1. Verify key works locally
2. Check GitHub secret is the PRIVATE key (not public)
3. Make sure EC2 has the public key in `~/.ssh/authorized_keys`

### "pm2: command not found"

PM2 not in PATH when running via SSH.

**Fix:** Source NVM in script:
```yaml
script: |
  source ~/.bashrc
  cd ~/projects/remote-coding-full-stack-demo
  # rest of commands...
```

## Cost Comparison

### Our Setup (Build on GitHub, Deploy to EC2)
- GitHub Actions: FREE (2000 min/month)
- EC2: $5-20/month (t2.micro to t2.medium)
- **Total:** $5-20/month

### Alternative (Build on EC2)
- GitHub Actions: Not used
- EC2: $20-40/month (need t2.large for builds)
- **Total:** $20-40/month

**Savings:** 50-75% cheaper! 💰
