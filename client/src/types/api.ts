// API response types

export interface BalanceResponse {
  address: string;
  balance: string;
  currency: string;
  network: 'testnet' | 'mainnet';
}

export interface PaymentQRResponse {
  uri: string;
  address: string;
  amount: string;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
  env: string;
}

export interface ErrorResponse {
  error: string;
}
