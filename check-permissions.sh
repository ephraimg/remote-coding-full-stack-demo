#!/bin/bash
# Check if ec2-claude-user has all necessary permissions

echo "🔍 Checking ec2-claude-user permissions..."
echo ""

# Check current user
echo "👤 Current user:"
whoami
echo ""

# Check Node.js and npm
echo "📦 Node.js and npm:"
which node && node --version || echo "❌ Node.js not found"
which npm && npm --version || echo "❌ npm not found"
which pm2 && pm2 --version || echo "❌ PM2 not found"
echo ""

# Check project directory
echo "📁 Project directory:"
if [ -d ~/projects/remote-coding-full-stack-demo ]; then
    echo "✅ Project directory exists"
    ls -la ~/projects/ | grep remote-coding-full-stack-demo

    # Check if it's a symlink (expected for ec2-claude-user)
    if [ -L ~/projects/remote-coding-full-stack-demo ]; then
        echo "✅ Symlink detected (expected for ec2-claude-user)"
        echo "   Target: $(readlink ~/projects/remote-coding-full-stack-demo)"
    fi
else
    echo "❌ Project directory not found: ~/projects/remote-coding-full-stack-demo"
fi
echo ""

# Check deploy script
echo "🚀 Deploy script:"
if [ -f ~/projects/remote-coding-full-stack-demo/deploy.sh ]; then
    ls -la ~/projects/remote-coding-full-stack-demo/deploy.sh
    if [ -x ~/projects/remote-coding-full-stack-demo/deploy.sh ]; then
        echo "✅ deploy.sh is executable"
    else
        echo "❌ deploy.sh is not executable (run: chmod +x deploy.sh)"
    fi
else
    echo "❌ deploy.sh not found"
fi
echo ""

# Check PM2 processes
echo "🔄 PM2 processes:"
pm2 list || echo "❌ No PM2 processes running"
echo ""

# Check if can write to project directory
echo "✍️  Write permissions:"
if [ -w ~/projects/remote-coding-full-stack-demo ]; then
    echo "✅ Can write to project directory"
else
    echo "❌ Cannot write to project directory"
fi
echo ""

# Check npm global directory
echo "🌍 npm global directory:"
npm config get prefix
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary:"
echo ""

ERRORS=0

command -v node &> /dev/null || { echo "❌ Node.js not installed"; ERRORS=$((ERRORS+1)); }
command -v npm &> /dev/null || { echo "❌ npm not installed"; ERRORS=$((ERRORS+1)); }
command -v pm2 &> /dev/null || { echo "❌ PM2 not installed"; ERRORS=$((ERRORS+1)); }
[ -d ~/projects/remote-coding-full-stack-demo ] || { echo "❌ Project directory missing"; ERRORS=$((ERRORS+1)); }
[ -x ~/projects/remote-coding-full-stack-demo/deploy.sh ] || { echo "❌ deploy.sh not executable"; ERRORS=$((ERRORS+1)); }

if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! Ready to deploy."
else
    echo "⚠️  $ERRORS issue(s) found. Run setup-ec2-user.sh to fix."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
