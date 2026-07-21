"use client";

import { storeConfig } from "@/data/store";
import { useLocation } from "@/lib/location";

export function InfoPanel() {
  const { displayCity, displayState } = useLocation();

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
      <p>{storeConfig.address}</p>
      <br />
      <h2>Áreas de Entrega</h2>
      <h3>
        {displayCity} - {displayState}
      </h3>
      <p>GRÁTIS (hoje)</p>
    </aside>
  );
}
