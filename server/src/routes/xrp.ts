import express, { Request, Response, Router } from 'express';
import { Client } from 'xrpl';
import type { AccountInfoResponse, BalanceResponse, PaymentQRResponse, ErrorResponse } from '../types/xrp';

const router: Router = express.Router();

// XRP Ledger network URL from environment
const XRP_NETWORK: string = process.env.XRP_NETWORK || 'wss://s.altnet.rippletest.net:51233';

// Singleton client instance - reuse connection
let client: Client | null = null;

async function getXRPClient(): Promise<Client> {
  if (!client) {
    client = new Client(XRP_NETWORK);
    await client.connect();
    console.log(`✅ Connected to XRP Ledger: ${XRP_NETWORK}`);
  }
  return client;
}

// Validate XRP address format
function isValidXRPAddress(address: string): boolean {
  return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address);
}

// GET /api/balance/:address
router.get('/balance/:address', async (req: Request, res: Response) => {
  const { address } = req.params;

  // Validate address format
  if (!isValidXRPAddress(address)) {
    const errorResponse: ErrorResponse = {
      error: 'Invalid XRP address format. Must start with "r" and be 25-34 characters.'
    };
    return res.status(400).json(errorResponse);
  }

  try {
    const xrpClient = await getXRPClient();

    const response = await xrpClient.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
    }) as AccountInfoResponse;

    const balance = response.result.account_data.Balance;
    const xrpBalance = (parseInt(balance) / 1000000).toFixed(6); // Convert drops to XRP

    const balanceResponse: BalanceResponse = {
      address,
      balance: xrpBalance,
      currency: 'XRP',
      network: XRP_NETWORK.includes('altnet') ? 'testnet' : 'mainnet'
    };

    return res.json(balanceResponse);
  } catch (error) {
    console.error('Balance fetch error:', error instanceof Error ? error.message : error);
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    return res.status(500).json(errorResponse);
  }
});

// GET /api/payment-qr/:address
router.get('/payment-qr/:address', (req: Request, res: Response) => {
  const { address } = req.params;
  const amount = (req.query.amount as string) || '10'; // Default 10 XRP

  // XRP URI format for wallet apps (Xaman, etc.)
  // Standard format: xrp:ADDRESS?amount=AMOUNT
  // This opens directly in XRP wallet apps when scanned
  const paymentUri = `xrp:${address}?amount=${amount}`;

  const response: PaymentQRResponse = {
    uri: paymentUri,
    address,
    amount
  };

  res.json(response);
});

export default router;
