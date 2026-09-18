"use client";

import { useEffect, useState } from "react";
import { isDominosProductId } from "@/data/dominos";

export const DOMINOS_COUPON_KEY = "dominos-first-coupon";
export const DOMINOS_COUPON_CODE = "PRIMEIRA30";
export const DOMINOS_COUPON_OFF = 0.3;

export type CouponStatus = "idle" | "active" | "dismissed" | "used";

const EVENT = "dominos-coupon";

export function applyFirstOrderOff(amount: number) {
  return Math.round(amount * (1 - DOMINOS_COUPON_OFF) * 100) / 100;
}

if (applyFirstOrderOff(100) !== 70 || applyFirstOrderOff(69.8) !== 48.86) {
  throw new Error("desconto primeira compra 30% quebrou");
}

export function getCouponStatus(): CouponStatus {
  if (typeof window === "undefined") return "idle";
  const raw = localStorage.getItem(DOMINOS_COUPON_KEY);
  if (raw === "active" || raw === "dismissed" || raw === "used") return raw;
  return "idle";
}

function writeStatus(status: CouponStatus) {
  localStorage.setItem(DOMINOS_COUPON_KEY, status);
  window.dispatchEvent(new Event(EVENT));
}

export function activateDominosCoupon() {
  writeStatus("active");
}

export function dismissDominosCoupon() {
  writeStatus("dismissed");
}

export function consumeDominosCoupon() {
  if (getCouponStatus() === "active") writeStatus("used");
}

export function useDominosCoupon() {
  const [status, setStatus] = useState<CouponStatus | null>(null);

  useEffect(() => {
    const sync = () => setStatus(getCouponStatus());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const off = status === "active" ? DOMINOS_COUPON_OFF : 0;

  function priceFor(amount: number, productId?: string) {
    if (!off) return amount;
    if (productId === "dom-p1") return amount;
    if (productId && !isDominosProductId(productId)) return amount;
    return applyFirstOrderOff(amount);
  }

  return {
    status,
    off,
    priceFor,
    activate: activateDominosCoupon,
    dismiss: dismissDominosCoupon,
    consume: consumeDominosCoupon,
  };
}
