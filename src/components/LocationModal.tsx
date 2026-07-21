"use client";

import { useEffect, useState } from "react";
import { brazilianStates } from "@/data/store";

export function LocationModal() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("delivery-region");
    if (!saved) setOpen(true);
  }, []);

  function confirm() {
    if (!state) return;
    localStorage.setItem("delivery-region", state);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Procure a loja mais próxima de você!</h2>
        <p>Escolha seu estado:</p>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="modal-select"
        >
          <option value="" disabled>
            Escolha seu estado
          </option>
          {brazilianStates.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn-primary" onClick={confirm}>
          Próximo
        </button>
      </div>
    </div>
  );
}
