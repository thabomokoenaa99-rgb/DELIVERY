"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown({ minutes = 59 }: { minutes?: number }) {
  const [remaining, setRemaining] = useState(minutes * 60);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((s) => (s <= 0 ? minutes * 60 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [minutes]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <div className="countdown-alert">
      <b>A promoção vai acabar em:</b>
      <div className="countdown">
        <div className="box">
          <span>{pad(m)}</span>
          <p>Minutos</p>
        </div>
        <div className="box">
          <span>{pad(s)}</span>
          <p>Segundos</p>
        </div>
      </div>
    </div>
  );
}
