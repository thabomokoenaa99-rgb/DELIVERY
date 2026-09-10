"use client";

import { useLocation } from "@/lib/location";

export function DeliveryAlert() {
  const { displayCity } = useLocation();

  return (
    <div className="alert">
      <b>Entrega Grátis</b> para <b>{displayCity}</b>!
    </div>
  );
}
