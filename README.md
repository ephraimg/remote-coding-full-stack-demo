# XRP Ledger Full-Stack Demo

A full-stack application demonstrating XRP Ledger integration with React and Express.

## Architecture

- **Frontend:** React + Vite (modern UI development)
- **Backend:** Express (XRP Ledger API endpoints)
- **XRP Integration:** xrpl.js library (blockchain interaction)
- **Process Manager:** PM2 (keep Express running)
- **Reverse Proxy:** Nginx (production deployment)
- **Hosting:** EC2 (direct deployment)
- **CI/CD:** GitHub Actions (auto-deploy on push)

## Features

- View XRP account balance in real-time
- Generate payment QR codes
- Custom UI components recreated from Ripple Design System patterns:
  - **TokenOnChain** - Token with network icon overlay
  - **QRCodeWithIcon** - QR code with centered icon
  - **CornerBrackets** - Camera viewfinder-style corners

## Project Structure

```
remote-coding-full-stack-demo/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   └── App.jsx             # Main app component
│   └── package.json
├── server/                      # Express backend
│   ├── routes/
│   │   └── xrp.js              # XRP Ledger API routes
│   ├── index.js                # Server entry point
│   └── package.json
├── .claude/skills/              # Claude Code skills
│   └── restart-app/SKILL.md    # PM2 restart skill
├── docs/                        # Documentation
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── EC2_SETUP.md            # EC2 setup instructions
│   └── GITHUB_ACTIONS.md       # CI/CD explanation
├── ecosystem.config.js          # PM2 configuration
└── deploy.sh                    # Manual deployment script
```

## Getting Started

**⚡ Quick Start:** See [QUICKSTART.md](QUICKSTART.md) to get running in 5 minutes!

### Prerequisites

- Node.js 18+
- npm or yarn
- PM2 (for production)
- EC2 instance (for deployment)
- XRP testnet address (get from [XRP Testnet Faucet](https://xrpl.org/xrp-testnet-faucet.html))

### ⚠️ Secrets Management

**IMPORTANT:** Never commit secrets to this repository!

See [SECRETS.md](SECRETS.md) for details on managing sensitive information.

**Required setup (or app will fail to start):**
```bash
# 1. Set up server environment variables
cp .env.example .env
nano .env
# Add your values (especially EXAMPLE_XRP_ADDRESS)

# 2. Set up client environment variables
cd client
cp .env.example .env
nano .env
# REQUIRED: Add VITE_EXAMPLE_XRP_ADDRESS (get from https://xrpl.org/xrp-testnet-faucet.html)
```

**📖 More details:** See [SECRETS.md](SECRETS.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Local Development

1. **Install dependencies:**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Start development servers:**
   ```bash
   # Terminal 1: Start Express backend
   cd server
   npm run dev

   # Terminal 2: Start Vite dev server
   cd client
   npm run dev
   ```

3. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

### Production Deployment

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   ```

2. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   ```

3. **Configure Nginx** (on EC2):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## API Endpoints

### GET /api/balance/:address
Get XRP balance for an address.

**Response:**
```json
{
  "address": "rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "balance": "1234.567890",
  "currency": "XRP"
}
```

### GET /api/payment-qr/:address
Generate payment QR code data.

**Query Parameters:**
- `amount` (optional): XRP amount (default: 10)

**Response:**
```json
{
  "uri": "https://xrpl.org/?to=rXXXXXXX...&amount=10",
  "address": "rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "amount": "10"
}
```

## XRP Ledger Integration

This app connects to the XRP Ledger Testnet:
- **Testnet:** `wss://s.altnet.rippletest.net:51233`

To switch to mainnet, update `server/routes/xrp.js`:
```javascript
const client = new Client('wss://xrplcluster.com');
```

## PM2 Commands

```bash
# Start app
pm2 start ecosystem.config.js

# View status
pm2 status

# View logs
pm2 logs xrp-demo

# Restart app
pm2 restart xrp-demo

# Stop app
pm2 stop xrp-demo
```

## GitHub Actions CI/CD

Automated deployment on push to `main` branch:

1. Builds React app in GitHub Actions
2. SSHs to EC2
3. Pulls latest code
4. Installs server dependencies
5. Restarts PM2

**Required GitHub Secrets:**
- `EC2_HOST`: EC2 instance IP (e.g., `12.34.56.78`)
- `EC2_USER`: EC2 username (e.g., `ec2-claude-user`)
- `EC2_SSH_KEY`: SSH private key

## License

MIT
