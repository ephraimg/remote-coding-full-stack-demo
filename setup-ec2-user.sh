#!/bin/bash
set -e

echo "🔧 Adding remote-coding-full-stack-demo to existing EC2 setup..."
echo ""

# This script assumes you already have ec2-claude-user set up from remote-coding-demo
# It just adds the new project to the existing setup

# Check if running as ec2-user
if [ "$USER" != "ec2-user" ]; then
    echo "⚠️  Warning: This script should be run as ec2-user (not ec2-claude-user)"
    echo "Current user: $USER"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if ec2-claude-user exists
if ! id ec2-claude-user &>/dev/null; then
    echo "❌ ec2-claude-user doesn't exist!"
    echo "Please set up ec2-claude-user first using the remote-coding-demo setup script."
    exit 1
fi

echo "✅ ec2-claude-user exists"

# Check if developers group exists
if ! getent group developers &>/dev/null; then
    echo "❌ developers group doesn't exist!"
    echo "Please set up the developers group first."
    exit 1
fi

echo "✅ developers group exists"

# Check if project directory exists
if [ ! -d "/home/ec2-user/projects" ]; then
    echo "📁 Creating /home/ec2-user/projects/ directory..."
    mkdir -p /home/ec2-user/projects
    sudo chown ec2-user:developers /home/ec2-user/projects
    sudo chmod 775 /home/ec2-user/projects
fi

# Clone the repository
REPO_DIR="/home/ec2-user/projects/remote-coding-full-stack-demo"
if [ -d "$REPO_DIR" ]; then
    echo "⚠️  Project already exists at $REPO_DIR"
    echo "Skipping clone. To update, cd there and run 'git pull'"
else
    echo "📦 Cloning repository..."
    read -p "Enter GitHub repo URL: " REPO_URL
    cd /home/ec2-user/projects
    git clone "$REPO_URL" remote-coding-full-stack-demo
fi

# Set proper permissions
echo "🔒 Setting permissions..."
sudo chown -R ec2-user:developers "$REPO_DIR"
sudo chmod -R g+rw "$REPO_DIR"

# Create symlink for ec2-claude-user
SYMLINK="/home/ec2-claude-user/projects/remote-coding-full-stack-demo"
if [ -L "$SYMLINK" ] || [ -d "$SYMLINK" ]; then
    echo "✅ Symlink already exists for ec2-claude-user"
else
    echo "🔗 Creating symlink for ec2-claude-user..."
    sudo -u ec2-claude-user ln -s "$REPO_DIR" "$SYMLINK"
fi

# Make deploy script executable
if [ -f "$REPO_DIR/deploy.sh" ]; then
    chmod +x "$REPO_DIR/deploy.sh"
    echo "✅ deploy.sh is executable"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Switch to ec2-claude-user:"
echo "   sudo su - ec2-claude-user"
echo ""
echo "2. Navigate to project:"
echo "   cd ~/projects/remote-coding-full-stack-demo"
echo ""
echo "3. Deploy the application:"
echo "   ./deploy.sh"
echo ""
echo "4. Verify deployment:"
echo "   pm2 status"
echo "   curl http://localhost:3000/api/balance/\$EXAMPLE_XRP_ADDRESS"
