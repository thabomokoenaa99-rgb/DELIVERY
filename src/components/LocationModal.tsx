"use client";

import { useEffect, useMemo, useState } from "react";
import { brazilianStates, citiesByState } from "@/data/store";
import { useLocation } from "@/lib/location";

export function LocationModal() {
  const {
    confirmed,
    detecting,
    detected,
    modalOpen,
    closeModal,
    setLocation,
    location,
  } = useLocation();

  const [step, setStep] = useState<"state" | "city">("state");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  // Prefill from auto-detect or current selection
  useEffect(() => {
    if (!modalOpen) return;

    const source = detected ?? location;
    if (!source) return;

    setState(source.state);
    setCity(source.city);
    setStep(source.state && source.city ? "city" : "state");
  }, [modalOpen, detected, location]);

  const cities = useMemo(() => {
    const base = state ? [...(citiesByState[state] ?? [])] : [];
    if (city && !base.includes(city)) base.unshift(city);
    if (detected?.state === state && detected.city && !base.includes(detected.city)) {
      base.unshift(detected.city);
    }
    if (base.length === 0 && city) return [city];
    return base.length > 0 ? base : ["Capital"];
  }, [state, city, detected]);

  if (!modalOpen) return null;

  function nextFromState() {
    if (!state) return;
    const list = citiesByState[state] ?? [];
    const preferred =
      detected?.state === state
        ? detected.city
        : list[0] ?? (city || "Capital");
    setCity(preferred);
    setStep("city");
  }

  function confirm() {
    if (!state || !city) return;
    const stateLabel =
      brazilianStates.find((s) => s.value === state)?.label ?? state;
    setLocation({ state, stateLabel, city });
  }

  function useDetected() {
    if (!detected) return;
    setLocation(detected);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        {confirmed && (
          <button
            type="button"
            className="modal-close"
            onClick={closeModal}
            aria-label="Fechar"
          >
            ×
          </button>
        )}

        <h2>Procure a loja mais próxima de você!</h2>

        {detecting ? (
          <p className="modal-detecting">Detectando sua localização…</p>
        ) : detected ? (
          <div className="modal-detected">
            <p>
              Localização detectada:{" "}
              <b>
                {detected.city} - {detected.state}
              </b>
            </p>
            <button type="button" className="btn-primary" onClick={useDetected}>
              Usar esta localização
            </button>
          </div>
        ) : (
          <p className="modal-detecting">
            Não foi possível detectar automaticamente. Escolha manualmente:
          </p>
        )}

        <div className="modal-divider">
          <span>ou escolha manualmente</span>
        </div>

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
            <button
              type="button"
              className="btn-primary"
              onClick={nextFromState}
              disabled={!state}
            >
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
              <button
                type="button"
                className="btn-primary"
                onClick={confirm}
                disabled={!state || !city}
              >
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
