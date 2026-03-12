// XRP Ledger types

export interface AccountInfoResponse {
  result: {
    account_data: {
      Account: string;
      Balance: string;
      Flags: number;
      LedgerEntryType: string;
      OwnerCount: number;
      PreviousTxnID: string;
      PreviousTxnLgrSeq: number;
      Sequence: number;
    };
    ledger_index: number;
    validated: boolean;
  };
}

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

export interface ErrorResponse {
  error: string;
}
