"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  consumePendingPurchase,
  setPixelUserData,
  trackPurchase,
} from "@/lib/meta-pixel";

export default function ObrigadoPage() {
  useEffect(() => {
    const pending = consumePendingPurchase();
    if (!pending) return;
    void setPixelUserData(pending.user).then(() => {
      trackPurchase({
        value: pending.value,
        numItems: pending.numItems,
        contents: pending.contents,
        transactionId: pending.transactionId,
      });
    });
  }, []);

  return (
    <div className="checkout-page">
      <div className="payment-success">
        <h1>Pagamento confirmado!</h1>
        <p>Seu pedido foi recebido e já está sendo preparado.</p>
        <p className="delivery-eta">
          Tempo estimado de entrega: <strong>entre 20 e 30 minutos</strong>
        </p>
        <Link href="/" className="btn-primary">
          Voltar ao cardápio
        </Link>
      </div>
    </div>
  );
}
