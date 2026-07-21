"use client";

import { useEffect, useState } from "react";
import {
  brazilianStates,
  citiesByState,
} from "@/data/store";
import { useLocation } from "@/lib/location";

export function LocationModal() {
  const { location, setLocation } = useLocation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"state" | "city">("state");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (!location) setOpen(true);
  }, [location]);

  const cities = state ? (citiesByState[state] ?? ["Capital"]) : [];

  function nextFromState() {
    if (!state) return;
    const detectedCity = cities[0] ?? "Sua Região";
    setCity(detectedCity);
    setStep("city");
  }

  function confirm() {
    if (!state || !city) return;
    const stateLabel =
      brazilianStates.find((s) => s.value === state)?.label ?? state;
    setLocation({ state, stateLabel, city });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Procure a loja mais próxima de você!</h2>
        {step === "state" ? (
          <>
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
            <button type="button" className="btn-primary" onClick={nextFromState}>
              Próximo
            </button>
          </>
        ) : (
          <>
            <p>Escolha sua cidade:</p>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="modal-select"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep("state")}
              >
                Voltar
              </button>
              <button type="button" className="btn-primary" onClick={confirm}>
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
