# Quick Start Guide

Get the app running in 5 minutes.

## Prerequisites

- Node.js 18+
- An XRP testnet address (we'll get one in step 1)

## Setup Steps

### 1. Get an XRP Testnet Address

Visit: https://xrpl.org/xrp-testnet-faucet.html

Click "Generate credentials" and save the address (starts with `r`).

### 2. Configure Environment Variables

```bash
# Server env vars
cp .env.example .env
nano .env
# Set: EXAMPLE_XRP_ADDRESS=rYourAddressFromStep1

# Client env vars (REQUIRED!)
cd client
cp .env.example .env
nano .env
# Set: VITE_EXAMPLE_XRP_ADDRESS=rYourAddressFromStep1
cd ..
```

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
cd ..
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Open Your Browser

Visit: http://localhost:5173

You should see:
- Your XRP balance
- A payment QR code

## ✅ Success!

If you see the app, you're done! 🎉

## ❌ Troubleshooting

### "Missing required environment variable: VITE_EXAMPLE_XRP_ADDRESS"

You forgot step 2! Create `client/.env` with:
```
VITE_EXAMPLE_XRP_ADDRESS=rYourActualAddress
```

Then restart the Vite dev server.

### "Failed to fetch balance"

The server might not be running. Check Terminal 1.

Or the XRP address is invalid. Get a new one from the testnet faucet.

### "Port 3000 already in use"

Something else is using port 3000. Either:
- Stop that process: `lsof -ti:3000 | xargs kill`
- Or change the port in `server/.env`: `PORT=3001`

## Next Steps

- **Deploy to EC2:** See [docs/EC2_SETUP.md](docs/EC2_SETUP.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Understand GitHub Actions:** See [docs/GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md)
- **Learn about secrets:** See [SECRETS.md](SECRETS.md)
