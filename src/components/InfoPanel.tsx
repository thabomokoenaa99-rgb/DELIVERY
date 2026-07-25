"use client";

import { useLocation } from "@/lib/location";

export function InfoPanel() {
  const { displayCity, displayState, address, openModal } = useLocation();

  return (
    <aside id="info" className="info-panel">
      <a className="fechar" href="#fechar" aria-label="Fechar">
        ×
      </a>
      <h2>Tipos de Entrega</h2>
      <p>Entrega Motoboy</p>
      <p>Retirada</p>
      <br />
      <h2>Formas de Pagamento</h2>
      <p>Pix</p>
      <br />
      <h2>Endereço</h2>
      <p>{address}</p>
      <button type="button" className="btn-secondary location-change" onClick={openModal}>
        Alterar localização
      </button>
      <br />
      <h2>Áreas de Entrega</h2>
      <h3>
        {displayCity} - {displayState}
      </h3>
      <p>GRÁTIS (hoje)</p>
    </aside>
  );
}
