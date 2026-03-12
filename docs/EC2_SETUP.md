# EC2 Setup - Adding New Project

This guide covers adding the `remote-coding-full-stack-demo` project to your **existing** EC2 setup with `ec2-claude-user`.

## Assumptions

✅ You already have `ec2-claude-user` set up from the `remote-coding-demo` project
✅ You have Node.js, npm, and PM2 already installed
✅ Projects are stored in `/home/ec2-user/projects/`
✅ Symlinks exist in `/home/ec2-claude-user/projects/`

## Quick Setup (5 minutes)

### 1. Clone the new project (as ec2-user)

```bash
# SSH as ec2-user
ssh -i ~/.ssh/ec2-remote-coding ec2-user@$EC2_IP

# Clone to the real projects directory
cd /home/ec2-user/projects/
git clone <YOUR_REPO_URL> remote-coding-full-stack-demo
```

### 2. Set proper permissions

```bash
# Add to developers group (so ec2-claude-user can access)
sudo chown -R ec2-user:developers remote-coding-full-stack-demo
sudo chmod -R g+rw remote-coding-full-stack-demo
```

### 3. Create symlink for ec2-claude-user

```bash
# Switch to ec2-claude-user
sudo su - ec2-claude-user

# Create symlink
cd ~/projects
ln -s /home/ec2-user/projects/remote-coding-full-stack-demo remote-coding-full-stack-demo

# Verify
ls -la ~/projects/
```

### 4. Install dependencies and deploy

```bash
cd ~/projects/remote-coding-full-stack-demo
chmod +x deploy.sh
./deploy.sh
```

### 5. Set up PM2 to persist on reboot (if not already done)

```bash
# As ec2-claude-user
pm2 startup
# Run the sudo command it outputs

pm2 save
```

## Permission Verification

### Check user permissions

```bash
# Should be ec2-claude-user
whoami

# Should show the project directory
ls -la ~/projects/remote-coding-full-stack-demo

# Should show Node.js version
node --version

# Should show npm version
npm --version

# Should show PM2 version
pm2 --version
```

### Check directory permissions

```bash
# Project directory should be owned by ec2-claude-user
ls -la ~/projects/
# Output: drwxr-xr-x ec2-claude-user ec2-claude-user remote-coding-full-stack-demo

# Deploy script should be executable
ls -la ~/projects/remote-coding-full-stack-demo/deploy.sh
# Output: -rwxr-xr-x ec2-claude-user ec2-claude-user deploy.sh
```

## Troubleshooting

### Permission denied errors

```bash
# Fix ownership of project directory
sudo chown -R ec2-claude-user:ec2-claude-user ~/projects/remote-coding-full-stack-demo

# Fix permissions
chmod -R u+rw ~/projects/remote-coding-full-stack-demo
chmod +x ~/projects/remote-coding-full-stack-demo/deploy.sh
```

### PM2 command not found

```bash
# Check if PM2 is installed
which pm2

# If not found, install it
npm install -g pm2

# Check npm global bin path
npm bin -g
# Add to PATH if needed: export PATH=$PATH:$(npm bin -g)
```

### npm install fails

```bash
# Check npm permissions
npm config get prefix
# Should be /home/ec2-claude-user/.nvm/versions/node/v18.x.x

# Fix npm permissions (if using system Node.js)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Git clone fails (private repo)

```bash
# Set up SSH key for GitHub
ssh-keygen -t ed25519 -C "ec2-claude-user@ec2"
cat ~/.ssh/id_ed25519.pub
# Copy this public key to GitHub: Settings → SSH and GPG keys → New SSH key

# Test GitHub connection
ssh -T git@github.com
```

## Security Notes

1. **Never run PM2 as root** - Always run as ec2-claude-user
2. **SSH key security** - Keep private keys secure, only public keys on EC2
3. **File permissions** - Use 644 for files, 755 for directories, 600 for secrets
4. **No sudo needed** - ec2-claude-user should not need sudo for normal operations

## Quick Setup Script

Save this as `setup-ec2-user.sh` and run once:

```bash
#!/bin/bash
set -e

echo "🔧 Setting up ec2-claude-user..."

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js
nvm install 18
nvm use 18
nvm alias default 18

# Install PM2
npm install -g pm2

# Create projects directory
mkdir -p ~/projects

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to ~/projects/remote-coding-full-stack-demo"
echo "2. Run: cd ~/projects/remote-coding-full-stack-demo && ./deploy.sh"
echo "3. Run: pm2 startup (and run the command it outputs with sudo)"
echo "4. Run: pm2 save"
```
