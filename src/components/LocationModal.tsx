"use client";

import { useEffect, useMemo, useState } from "react";
import { brazilianStates, citiesByState } from "@/data/store";
import { useLocation } from "@/lib/location";

export function LocationModal() {
  const {
    confirmed,
    detecting,
    modalOpen,
    closeModal,
    setLocation,
    acceptGps,
    location,
  } = useLocation();

  const [step, setStep] = useState<"state" | "city">("state");
  const [state, setState] = useState("SP");
  const [city, setCity] = useState("");
  const [gpsFailed, setGpsFailed] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;
    setGpsFailed(false);
    if (!location) return;
    setState(location.state);
    setCity(location.city);
    setStep(location.state && location.city ? "city" : "state");
  }, [modalOpen, location]);

  const cities = useMemo(() => {
    const base = state ? [...(citiesByState[state] ?? [])] : [];
    if (city && !base.includes(city)) base.unshift(city);
    if (base.length === 0 && city) return [city];
    return base.length > 0 ? base : ["Capital"];
  }, [state, city]);

  if (!modalOpen) return null;

  function nextFromState() {
    if (!state) return;
    const list = citiesByState[state] ?? [];
    setCity(list.includes(city) ? city : list[0] ?? city || "Capital");
    setStep("city");
  }

  function confirm() {
    if (!state || !city) return;
    const stateLabel =
      brazilianStates.find((s) => s.value === state)?.label ?? state;
    setLocation({ state, stateLabel, city });
  }

  function useGps() {
    setGpsFailed(false);
    void acceptGps().then((ok) => {
      if (!ok) setGpsFailed(true);
    });
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
          <p className="modal-detecting">
            Detectando sua localização… Aceite a permissão no navegador.
          </p>
        ) : (
          <div className="modal-detected">
            <button type="button" className="btn-primary" onClick={useGps}>
              Usar minha localização
            </button>
            {gpsFailed && (
              <p className="modal-detecting">
                Não deu para detectar. Permita o acesso no navegador ou escolha
                abaixo.
              </p>
            )}
          </div>
        )}

        <div className="modal-divider">
          <span>ou escolha manualmente</span>
        </div>

        {step === "state" ? (
          <div className="modal-field">
            <p>Escolha seu estado:</p>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="modal-select"
            >
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
          </div>
        ) : (
          <div className="modal-field">
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
          </div>
        )}
      </div>
    </div>
  );
}
