---
name: restart-app
description: Restart the XRP Demo application using PM2
---

# Restart XRP Demo Application

This skill restarts the Express + React application managed by PM2.

## Usage

When the user asks to restart the application, run the deployment script:

```bash
cd ~/projects/remote-coding-full-stack-demo
./deploy.sh
```

This script handles:
- Installing client dependencies
- Installing server dependencies
- Building the React app
- Restarting PM2

## Additional Commands

- **View deployment script:** `cat deploy.sh`
- **View status:** `pm2 status`
- **View logs:** `pm2 logs xrp-demo --lines 50`
- **Stop app:** `pm2 stop xrp-demo`
- **Start app:** `pm2 start ecosystem.config.js`

## Common Scenarios

1. **After code changes (React or Express):**
   ```bash
   cd ~/projects/remote-coding-full-stack-demo
   git pull
   ./deploy.sh
   ```

   The deploy.sh script automatically:
   - Installs/updates all dependencies
   - Rebuilds React app
   - Restarts PM2

2. **Quick restart (server-only changes, no dependencies changed):**
   ```bash
   pm2 restart xrp-demo  # Fast restart, skips install/build
   ```

   ⚠️ **Warning:** Only use this if you're 100% sure:
   - No React code changed
   - No package.json changed
   - Only Express .js files changed

   **When in doubt, use `./deploy.sh` instead!**

3. **Check if running:**
   ```bash
   pm2 status
   curl http://localhost:3000/api/balance/$EXAMPLE_XRP_ADDRESS
   ```

## Troubleshooting

If restart fails:
1. Check logs: `pm2 logs xrp-demo --err`
2. Check server manually: `cd server && node index.js`
3. Verify dependencies: `cd server && npm install`
4. Check port: `netstat -tulpn | grep 3000`
