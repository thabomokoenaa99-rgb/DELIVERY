"use client";

import { useEffect, useState } from "react";
import { formatCep, digits, type Address } from "@/lib/br-address";
import { useLocation } from "@/lib/location";

function AddressPreview({ value }: { value: Address }) {
  const hasValidCep = Boolean(value.zipCode && digits(value.zipCode).length === 8);
  return (
    <div className="modal-address">
      {value.street && (
        <p>
          {value.street}
          {value.number ? `, ${value.number}` : ""}
        </p>
      )}
      {value.neighborhood && <p>{value.neighborhood}</p>}
      <p>
        {value.city} - {value.state}
      </p>
      {hasValidCep && <p>CEP {formatCep(value.zipCode!)}</p>}
    </div>
  );
}

export function LocationModal() {
  const {
    confirmed,
    detecting,
    modalOpen,
    closeModal,
    setLocation,
    detectGps,
    lookupCep,
    location,
  } = useLocation();

  const [cep, setCep] = useState("");
  const [preview, setPreview] = useState<Address | null>(null);
  const [gpsFailed, setGpsFailed] = useState(false);
  const [cepFailed, setCepFailed] = useState(false);
  const [via, setVia] = useState<"gps" | "cep" | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    setGpsFailed(false);
    setCepFailed(false);
    setVia(null);
    setPreview(location);
    setCep(formatCep(location?.zipCode ?? ""));
  }, [modalOpen, location]);

  if (!modalOpen) return null;

  async function useGps() {
    setGpsFailed(false);
    setCepFailed(false);
    setVia("gps");
    const result = await detectGps();
    if (!result) {
      setGpsFailed(true);
      return;
    }
    setPreview(result);
    if (result.zipCode && digits(result.zipCode).length === 8) {
      setCep(formatCep(result.zipCode));
    }
  }

  async function searchCep() {
    const raw = digits(cep);
    if (raw.length !== 8) {
      setCepFailed(true);
      return;
    }
    setCepFailed(false);
    setGpsFailed(false);
    setVia("cep");
    const result = await lookupCep(raw);
    if (!result) {
      setCepFailed(true);
      return;
    }
    setPreview(result);
    setCep(formatCep(result.zipCode ?? raw));
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

        <h2>Onde vamos entregar?</h2>

        {detecting ? (
          <p className="modal-detecting">
            {via === "cep"
              ? "Consultando CEP…"
              : "Detectando sua localização… Aceite a permissão no navegador."}
          </p>
        ) : (
          <div className="modal-detected">
            <button type="button" className="btn-primary" onClick={() => void useGps()}>
              Usar minha localização
            </button>
            {gpsFailed && (
              <p className="modal-detecting">
                Não foi possível detectar sua localização no Brasil. Verifique se
                o GPS está permitido ou busque pelo seu CEP.
              </p>
            )}
          </div>
        )}

        <div className="modal-divider">
          <span>ou pesquise o CEP</span>
        </div>

        <div className="modal-field">
          <p>
            <label htmlFor="location-cep">CEP</label>
          </p>
          <input
            id="location-cep"
            className="modal-select"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => {
              setCep(formatCep(e.target.value));
              setCepFailed(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void searchCep();
              }
            }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => void searchCep()}
            disabled={detecting || digits(cep).length !== 8}
          >
            Buscar CEP
          </button>
          {cepFailed && (
            <p className="modal-detecting">
              CEP não encontrado. Confira os 8 dígitos e tente de novo.
            </p>
          )}
        </div>

        {preview && (
          <>
            <AddressPreview value={preview} />
            <button
              type="button"
              className="btn-primary btn-block"
              onClick={() => setLocation(preview)}
              disabled={detecting}
            >
              Confirmar endereço
            </button>
          </>
        )}
      </div>
    </div>
  );
}
