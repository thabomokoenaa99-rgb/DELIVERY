"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-ok")) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div id="cookie-consent">
      <span>
        Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{" "}
        <Link href="/politica-privacidade">Política de Privacidade</Link>.
      </span>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("cookie-ok", "1");
          setVisible(false);
        }}
      >
        Entendi
      </button>
    </div>
  );
}
