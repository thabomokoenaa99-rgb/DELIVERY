"use client";

import { useState } from "react";
import Link from "next/link";
import { CookieConsent } from "@/components/CookieConsent";
import { Countdown } from "@/components/Countdown";
import { FlavorModal } from "@/components/FlavorModal";
import { InfoPanel } from "@/components/InfoPanel";
import { ProductCard } from "@/components/ProductCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { products, type Product } from "@/data/store";
import { useLocation } from "@/lib/location";

export default function HomePage() {
  const { displayCity } = useLocation();
  const [flavorProduct, setFlavorProduct] = useState<Product | null>(null);
  const combos = products.filter((p) => p.category === "pizza");
  const individuals = products.filter((p) => p.category === "individual");
  const desserts = products.filter((p) => p.category === "sobremesa");

  return (
    <>
      <StoreHeader />

      <main id="lista">
        <div className="container">
          <div className="alert">
            <b>Entrega Grátis</b> para <b>{displayCity}</b>!
          </div>
          <div className="alert alert-promo">
            Aproveite nossa <b>promoção com preços irresistíveis</b> igual Pizza
            💜
          </div>

          <section id="pague-1-leve-2" className="categoria">
            <h2>Pague 1, Leve 2</h2>
            {combos.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <Countdown />
            {combos.slice(3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <Countdown />
          </section>

          <section id="pizza-individual" className="categoria">
            <h2>Pizza Individual</h2>
            {individuals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={() => setFlavorProduct(product)}
              />
            ))}
          </section>

          <section id="sobremesa" className="categoria">
            <h2>Sobremesa — Pizzas Doces</h2>
            {desserts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={() => setFlavorProduct(product)}
              />
            ))}
          </section>

          <ReviewsSection />

          <div className="countdown-alert" style={{ padding: "20px 10px" }}>
            <Countdown />
            <Link href="/#sobremesa" className="cta-secondary">
              Clique Para Ver Pizzas Doces 💜
            </Link>
          </div>
        </div>
      </main>

      {flavorProduct && (
        <FlavorModal
          product={flavorProduct}
          onClose={() => setFlavorProduct(null)}
        />
      )}
      <InfoPanel />
      <SiteFooter />
      <CookieConsent />
    </>
  );
}
