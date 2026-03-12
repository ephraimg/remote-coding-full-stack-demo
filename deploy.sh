#!/bin/bash
set -e

# Ensure we're in the script's directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
cd client && npm install || { echo "❌ Client npm install failed"; exit 1; }
cd ../server && npm install || { echo "❌ Server npm install failed"; exit 1; }

echo "🔨 Building React app..."
cd ../client && npm run build || { echo "❌ React build failed"; exit 1; }

echo "🔨 Building server..."
cd ../server && npm run build || { echo "❌ Server build failed"; exit 1; }

echo "♻️  Restarting PM2..."
cd ..
pm2 restart xrp-demo || pm2 start ecosystem.config.js || { echo "❌ PM2 restart failed"; exit 1; }

echo "✅ Deployment complete!"
pm2 status
