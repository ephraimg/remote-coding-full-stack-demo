# Claude Code Project Instructions

This is a full-stack XRP Ledger application with React + Express.

## Application Management

This project uses PM2 to manage the Express server.

Use the `/restart-app` skill to restart the application.

## Development Workflow

### Local Development

1. **Start backend:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   cd client
   npm run dev
   ```

### Production Deployment

The app auto-deploys via GitHub Actions when you push to `main`.

**Manual deployment:**
```bash
./deploy.sh
```

## Project Structure

- `client/` - React + Vite frontend
- `server/` - Express backend with XRP routes
- `skills/` - Claude Code skills (restart-app)
- `ecosystem.config.js` - PM2 configuration

## Key Technologies

- **Frontend:** React, Vite, custom RDS-inspired components
- **Backend:** Express, xrpl.js
- **Process Manager:** PM2
- **Deployment:** GitHub Actions → EC2

## Common Tasks

### Add a new API endpoint

1. Add route in `server/routes/xrp.js`
2. Test locally with `npm run dev`
3. Push to GitHub (auto-deploys)

### Add a new React component

1. Create component in `client/src/components/`
2. Import in `App.jsx`
3. Test with Vite dev server
4. Build with `npm run build`

### Restart the application

Use the skill:
```
/restart-app
```

Or manually:
```bash
pm2 restart xrp-demo
```

## Testing

### Test API endpoints

```bash
# Balance
curl http://localhost:3000/api/balance/rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY

# Payment QR
curl http://localhost:3000/api/payment-qr/rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY?amount=10
```

### Test in browser

- **Local:** http://localhost:5173
- **Production:** http://$EC2_HOST (use your EC2 IP)

## Deployment Notes

- PM2 runs as `ec2-claude-user`
- Express serves on port 3000
- Nginx proxies port 80 → 3000
- React build is served by Express in production
