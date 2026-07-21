import { storeConfig } from "@/data/store";

export function InfoPanel() {
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
      <p>
        {storeConfig.city} - {storeConfig.state}
      </p>
      <br />
      <h2>Áreas de Entrega</h2>
      <h3>
        {storeConfig.city} - {storeConfig.state}
      </h3>
      <p>GRÁTIS (hoje)</p>
    </aside>
  );
}
