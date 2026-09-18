import Image from "next/image";
import Link from "next/link";
import { formatBRL, type Product } from "@/data/store";
import { applyFirstOrderOff } from "@/lib/dominos-coupon";

type Props = {
  product: Product;
  priority?: boolean;
  onOpen?: () => void;
  basePath?: string;
  couponOff?: number;
};

export function ProductCard({
  product,
  priority = false,
  onOpen,
  basePath = "",
  couponOff = 0,
}: Props) {
  const payPrice =
    couponOff > 0 && product.id !== "dom-p1"
      ? applyFirstOrderOff(product.price)
      : product.price;
  const hasDiscount =
    (typeof product.priceFrom === "number" && product.priceFrom > payPrice) ||
    payPrice < product.price;
  const className = `product-link ${product.featured ? "featured pulsar" : ""}`;

  const inner = (
    <>
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
          <span className="price">A partir de {formatBRL(payPrice)}</span>
        ) : hasDiscount ? (
          <>
            <p className="price-line">
              de{" "}
              <span className="price-from">
                {formatBRL(product.priceFrom ?? product.price)}
              </span>{" "}
              por
            </p>
            <span
              className={`price ${product.featured ? "price-highlight" : ""}`}
            >
              {product.featured ? (
                <b className="price-pill">{formatBRL(payPrice)}</b>
              ) : (
                formatBRL(payPrice)
              )}
            </span>
          </>
        ) : (
          <span className="price">{formatBRL(payPrice)}</span>
        )}
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
    </>
  );

  return (
    <div className="product-item">
      {onOpen ? (
        <button type="button" className={className} onClick={onOpen}>
          {inner}
        </button>
      ) : (
        <Link
          href={`${basePath}/produtos/${product.category}/${product.slug}`}
          className={className}
        >
          {inner}
        </Link>
      )}
    </div>
  );
}
