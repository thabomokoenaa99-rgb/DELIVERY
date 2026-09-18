"use client";

import { useDominosCoupon, DOMINOS_COUPON_CODE } from "@/lib/dominos-coupon";

export function DominosCouponModal() {
  const { status, activate, dismiss } = useDominosCoupon();
  if (status !== "idle") return null;

  return (
    <div className="modal-backdrop dominos-coupon-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card dominos-coupon-card">
        <button
          type="button"
          className="modal-close"
          onClick={dismiss}
          aria-label="Fechar"
        >
          ×
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="dominos-coupon-logo"
          src="/images/dominos/logo.svg"
          alt="Domino's Pizza"
        />
        <p className="dominos-coupon-kicker">Cupom de primeira compra</p>
        <h2>30% OFF no primeiro pedido</h2>
        <p className="dominos-coupon-copy">
          Ative agora e ganhe desconto em todo o cardápio. Válido só na primeira
          compra.
        </p>
        <p className="dominos-coupon-code">{DOMINOS_COUPON_CODE}</p>
        <button type="button" className="btn-primary" onClick={activate}>
          Ativar
        </button>
      </div>
    </div>
  );
}

export function DominosCouponChip() {
  const { status, off } = useDominosCoupon();
  if (status !== "active") return null;
  return (
    <div className="alert alert-promo">
      Cupom <b>{DOMINOS_COUPON_CODE}</b> ativo — <b>{Math.round(off * 100)}% OFF</b> no
      primeiro pedido
    </div>
  );
}
