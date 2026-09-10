import Image from "next/image";
import Link from "next/link";
import { formatBRL, type Product } from "@/data/store";

type Props = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: Props) {
  const hasDiscount =
    typeof product.priceFrom === "number" && product.priceFrom > product.price;
  const className = `product-link ${product.featured ? "featured pulsar" : ""}`;

  return (
    <div className="product-item">
      <Link
        href={`/produtos/${product.category}/${product.slug}`}
        className={className}
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
          {product.startingAt ? (
            <span className="price">A partir de {formatBRL(product.price)}</span>
          ) : hasDiscount ? (
            <>
              <p className="price-line">
                de{" "}
                <span className="price-from">
                  {formatBRL(product.priceFrom!)}
                </span>{" "}
                por
              </p>
              <span
                className={`price ${product.featured ? "price-highlight" : ""}`}
              >
                {product.featured ? (
                  <b className="price-pill">{formatBRL(product.price)}</b>
                ) : (
                  formatBRL(product.price)
                )}
              </span>
            </>
          ) : (
            <span className="price">{formatBRL(product.price)}</span>
          )}
          {product.highlight && (
            <span className="highlight">
              <i>{product.highlight}</i>
            </span>
          )}
          {typeof product.stock === "number" && (
            <span className="stock">
              🔥 Apenas{" "}
              <b className="stock-pill">{product.stock} combo(s)</b> com esse
              preço especial
            </span>
          )}
        </div>
        <div className="product-photo">
          <figure>
            <Image
              src={product.image}
              width={220}
              height={220}
              alt={product.title}
              sizes="110px"
              quality={65}
              preload={priority}
              loading={priority ? "eager" : "lazy"}
              className={product.imageContain ? "photo-contain" : undefined}
            />
          </figure>
        </div>
      </Link>
    </div>
  );
}
