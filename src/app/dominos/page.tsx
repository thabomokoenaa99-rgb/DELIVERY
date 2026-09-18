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

export default function DominosPage() {
  const { displayCity } = useLocation();
  const { off } = useDominosCoupon();
  const promos = dominosProducts.filter((p) => p.category === "promocao");
  const pizzas = dominosProducts.filter((p) => p.category === "pizza");
  const extras = dominosProducts.filter(
    (p) => p.category === "lasanha" || p.category === "sanduiche",
  );

  return (
    <>
      <StoreHeader
        store={dominosStore}
        banner="/images/dominos/hero-2-medias.png"
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
            2 pizzas médias por <b>R$ 34,90 cada</b> — escolha 8 sabores ou
            incremente a pizza de queijo
          </div>

          <div className="dominos-tiles">
            {promos.slice(1).map((product) => (
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

          <section id="promocoes" className="categoria">
            <h2>Promoções</h2>
            {promos.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                basePath="/dominos"
                couponOff={off}
              />
            ))}
          </section>

          <section id="pizzas" className="categoria">
            <h2>Pizzas</h2>
            {pizzas.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                basePath="/dominos"
                couponOff={off}
              />
            ))}
          </section>

          <section id="lasanhas" className="categoria">
            <h2>Lasanhas e sanduíches</h2>
            {extras.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                basePath="/dominos"
                couponOff={off}
              />
            ))}
          </section>
        </div>
      </main>

      <InfoPanel />
      <SiteFooter name={dominosStore.name} />
      <CookieConsent />
    </>
  );
}
