"use client";

import Link from "next/link";
import { formatBRL, type Product } from "@/data/store";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <div className="product-item">
      <Link
        href={`/produtos/${product.category}/${product.slug}`}
        className={`product-link ${product.featured ? "featured pulsar" : ""}`}
      >
        <div className="product-text">
          {product.badge && (
            <span className="badge-bestseller">
              <b>{product.badge}</b>
            </span>
          )}
          <h3>{product.title}</h3>
          <span className="subtitle">{product.subtitle}</span>
          {product.note && <span className="note-chip">{product.note}</span>}
          <p className="price-line">
            de <span className="price-from">{formatBRL(product.priceFrom)}</span> por
          </p>
          <span className={`price ${product.featured ? "price-highlight" : ""}`}>
            {product.featured ? (
              <b className="price-pill">{formatBRL(product.price)}</b>
            ) : (
              formatBRL(product.price)
            )}
          </span>
          {product.highlight && (
            <span className="highlight">
              <i>{product.highlight}</i>
            </span>
          )}
          {typeof product.stock === "number" && (
            <span className="stock">
              🔥 Apenas{" "}
              <b className="stock-pill">{product.stock} combo(s)</b> com esse preço
              especial
            </span>
          )}
        </div>
        <div className="product-photo">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              width={110}
              height={110}
              alt={product.title}
              loading="lazy"
            />
          </figure>
        </div>
      </Link>
    </div>
  );
}
