"use client";

import Link from "next/link";
import { formatBRL } from "@/data/store";
import { useCart } from "@/lib/cart";

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();

  return (
    <div className="checkout-page">
      <Link href="/" className="back-link">
        VOLTAR
      </Link>
      <h1>Checkout</h1>
      <p>Revise seu pedido antes de finalizar.</p>

      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-line">
              <div>
                <strong>
                  {item.quantity}x {item.title}
                </strong>
                <small>{item.details}</small>
              </div>
              <div>
                <div>{formatBRL(item.price * item.quantity)}</div>
                <button type="button" onClick={() => removeItem(item.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
          <h2>Total: {formatBRL(total)}</h2>
          <p>
            <b>Pagamento:</b> Pix
          </p>
          <p>
            <b>Entrega:</b> Motoboy / Retirada
          </p>
          <button type="button" className="btn-primary" onClick={clear}>
            Confirmar pedido
          </button>
        </>
      )}
    </div>
  );
}
