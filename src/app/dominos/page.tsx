"use client";

import Link from "next/link";
import { CookieConsent } from "@/components/CookieConsent";
import { DominosCouponChip } from "@/components/DominosCouponModal";
import { InfoPanel } from "@/components/InfoPanel";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { StoreHeader } from "@/components/StoreHeader";
import {
  dominosCategories,
  dominosProducts,
  dominosStore,
} from "@/data/dominos";
import { useDominosCoupon } from "@/lib/dominos-coupon";
import { useLocation } from "@/lib/location";

function Section({
  id,
  title,
  products,
  off,
}: {
  id: string;
  title: string;
  products: typeof dominosProducts;
  off: number;
}) {
  if (products.length === 0) return null;
  return (
    <section id={id} className="categoria">
      <h2>{title}</h2>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          basePath="/dominos"
          couponOff={off}
        />
      ))}
    </section>
  );
}

export default function DominosPage() {
  const { displayCity } = useLocation();
  const { off } = useDominosCoupon();
  const by = (category: string) =>
    dominosProducts.filter((p) => p.category === category);
  const promos = by("promocao");
  const tiles = promos.slice(0, 8);

  return (
    <>
      <StoreHeader
        store={dominosStore}
        banner="/images/dominos/promo-sq-b3a2cc82edcd6041fc83242a99ce6d78437.webp"
        logo="/images/dominos/logo.svg"
        categories={dominosCategories}
      />

      <main id="lista">
        <div className="container">
          <div className="alert">
            <b>Entrega Grátis</b> para <b>{displayCity}</b>!
          </div>
          <DominosCouponChip />
          <div className="alert alert-promo">
            2 itens por <b>R$ 34,90 cada</b> — 8 sabores, sanduíche ou lasanha
          </div>

          <div className="dominos-tiles">
            {tiles.map((product) => (
              <Link
                key={product.id}
                href={`/dominos/produtos/${product.category}/${product.slug}`}
                className="dominos-tile"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.title} />
              </Link>
            ))}
          </div>

          <Section id="pizzas" title="Pizzas" products={by("pizza")} off={off} />
          <Section
            id="acompanhamentos"
            title="Acompanhamentos"
            products={by("acompanhamento")}
            off={off}
          />
          <Section id="molhos" title="Molhos" products={by("molho")} off={off} />
          <Section id="lasanhas" title="Lasanhas" products={by("lasanha")} off={off} />
          <Section id="calzones" title="Calzones" products={by("calzone")} off={off} />
          <Section
            id="sanduiches"
            title="Sanduíches"
            products={by("sanduiche")}
            off={off}
          />
          <Section
            id="sobremesas"
            title="Sobremesas"
            products={by("sobremesa")}
            off={off}
          />
          <Section id="bebidas" title="Bebidas" products={by("bebida")} off={off} />
          <Section id="promocoes" title="Promoções" products={promos} off={off} />
        </div>
      </main>

      <InfoPanel />
      <SiteFooter name={dominosStore.name} />
      <CookieConsent />
    </>
  );
}
