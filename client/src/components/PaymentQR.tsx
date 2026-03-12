import { useState, useEffect } from "react";
import QRCodeWithIcon from "./QRCodeWithIcon";
import type { PaymentQRResponse } from "../types/api";

interface PaymentQRProps {
  address: string;
  amount: string;
}

export default function PaymentQR({ address, amount }: PaymentQRProps) {
  const [paymentUri, setPaymentUri] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaymentUri() {
      try {
        const response = await fetch(
          `/api/payment-qr/${address}?amount=${amount}`,
        );
        const data: PaymentQRResponse = await response.json();
        setPaymentUri(data.uri);
      } catch (err) {
        console.error("Failed to generate payment URI:", err);
      } finally {
        setLoading(false);
      }
    }

    if (address) {
      fetchPaymentUri();
    }
  }, [address, amount]);

  if (loading) return <div className="qr-card">Generating QR code...</div>;

  return (
    <div className="qr-card">
      <QRCodeWithIcon value={paymentUri} size={200} />
    </div>
  );
}
