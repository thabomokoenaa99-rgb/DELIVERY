"use client";

import { useEffect } from "react";
import Link from "next/link";
import { storeConfig } from "@/data/store";
import { flushPendingPurchase } from "@/lib/meta-pixel";

export default function ThankYouPage() {
  useEffect(() => {
    flushPendingPurchase();
  }, []);

  return (
    <div className="checkout-page">
      <div className="payment-success">
        <h1>Pagamento confirmado!</h1>
        <p>Obrigado. Seu pedido foi recebido e já está sendo preparado.</p>
        <p className="delivery-eta">
          Tempo estimado de entrega: <strong>entre 20 e 30 minutos</strong>
        </p>
        <p className="checkout-subtitle">{storeConfig.name}</p>
        <Link href="/" className="btn-primary">
          Voltar ao cardápio
        </Link>
      </div>
    </div>
  );
}
