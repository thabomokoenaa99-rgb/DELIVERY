import Link from "next/link";
import { storeConfig } from "@/data/store";

export function StoreHeader() {
  return (
    <header id="topo">
      <div
        className="cover main"
        style={{ backgroundImage: "url(/images/placeholder-banner.svg)" }}
      >
        <div className="logo">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/placeholder-logo.svg"
              alt={storeConfig.name}
              title={storeConfig.name}
            />
          </figure>
        </div>
        <div className="borda" />
      </div>

      <div className="container">
        <div className="info">
          <div className="icones">
            <a href="#info" title="Info" className="informacoes" aria-label="Informações">
              <InfoIcon />
            </a>
          </div>

          <div className="detalhe">
            <span>
              <CoinsIcon /> Pedido Mínimo <b>{storeConfig.minOrder.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</b>
            </span>
            <div>
              <span>
                <BikeIcon /> <b>{storeConfig.deliveryTime}</b> min
              </span>{" "}
              • <span className="free">{storeConfig.deliveryFeeLabel}</span>
            </div>
          </div>

          <div className="detalhe location">
            <PinIcon />
            <span>
              {storeConfig.city} - {storeConfig.state} • {storeConfig.distance}
            </span>
          </div>

          <div className="detalhe">
            <StarIcon />
            <b>{storeConfig.rating.toFixed(1).replace(".", ",")}</b> ({storeConfig.reviewsRecent} avaliações)
          </div>

          <div className="aberto">
            <span className="btn-pisca" />
            <span>{storeConfig.status}</span>
          </div>
        </div>
      </div>

      <div id="menuCategorias">
        <div className="container">
          <div className="categorias">
            <Link href="/#promocao">Categoria em Destaque — Combo + Bebida</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 192 512" width="14" height="14" aria-hidden>
      <path fill="currentColor" d="M160 448h-32V224c0-17.69-14.33-32-32-32L32 192c-17.67 0-32 14.31-32 32s14.33 31.1 32 31.1h32v192H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32S177.7 448 160 448zM96 128c26.51 0 48-21.49 48-48S122.5 32.01 96 32.01s-48 21.49-48 48S69.49 128 96 128z" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 512 512" width="14" height="14" aria-hidden>
      <path fill="currentColor" d="M512 80c0 44.2-85.96 80-192 80S128 124.2 128 80 213.96 0 320 0s192 35.82 192 80z" />
    </svg>
  );
}

function BikeIcon() {
  return (
    <svg viewBox="0 0 640 512" width="14" height="14" aria-hidden>
      <path fill="currentColor" d="M512 224c70.7 0 128 57.3 128 128s-57.3 128-128 128-128-57.3-128-128c0-40.9 18.4-75.7 48-99.2L384 224c0 88.4-71.6 160-160 160S64 312.4 64 224 135.6 64 224 64h96c13.3 0 24 10.7 24 24s-10.7 24-24 24h-96c-61.9 0-112 50.1-112 112s50.1 112 112 112 112-50.1 112-112V160h64c13.3 0 24 10.7 24 24v40z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 384 512" width="14" height="14" aria-hidden>
      <path fill="currentColor" d="M168.3 499.2C116.1 435 0 279.4 0 192 0 85.96 85.96 0 192 0s192 85.96 192 192c0 87.4-116.1 243-167.7 307.2-12.3 15.3-35.1 15.3-47.4 0zM192 256c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 576 512" width="14" height="14" aria-hidden>
      <path fill="currentColor" d="M381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s.7 24.2-7.9 32.8L438.5 328.1l24.6 146.6c2 12-2.9 24.2-12.9 31.3s-23 8-33.7 2.3L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.9-31.3l24.6-146.6L33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.84-19.9 25.73-21.6L195 150.3 259.4 17.97C264.7 6.95 275.9 0 288.1 0s23.4 6.95 28.7 17.97l64.4 132.33z" />
    </svg>
  );
}
