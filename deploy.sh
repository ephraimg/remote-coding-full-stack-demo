#!/bin/bash
set -e

# Ensure we're in the script's directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
cd client && yarn install --frozen-lockfile || { echo "❌ Client yarn install failed"; exit 1; }
cd ../server && yarn install --frozen-lockfile || { echo "❌ Server yarn install failed"; exit 1; }

echo "🔨 Building React app..."
cd ../client && yarn build || { echo "❌ React build failed"; exit 1; }

echo "🔨 Building server..."
cd ../server && yarn build || { echo "❌ Server build failed"; exit 1; }

echo "♻️  Restarting PM2..."
cd ..
pm2 restart xrp-demo || pm2 start ecosystem.config.js || { echo "❌ PM2 restart failed"; exit 1; }

echo "✅ Deployment complete!"
pm2 status
