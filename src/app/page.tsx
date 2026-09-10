import Link from "next/link";
import { CookieConsent } from "@/components/CookieConsent";
import { Countdown } from "@/components/Countdown";
import { DeliveryAlert } from "@/components/DeliveryAlert";
import { InfoPanel } from "@/components/InfoPanel";
import { ProductCard } from "@/components/ProductCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { products } from "@/data/store";

export default function HomePage() {
  const combos = products.filter((p) => p.category === "pizza");
  const individuals = products.filter((p) => p.category === "individual");
  const desserts = products.filter((p) => p.category === "sobremesa");
  const beers = products.filter(
    (p) =>
      p.category === "cerveja-lata" ||
      p.category === "cerveja-litro" ||
      p.category === "refri-lata" ||
      p.category === "refri-2l",
  );
  const wineItems = products.filter((p) => p.category === "vinho");

  return (
    <>
      <StoreHeader />

      <main id="lista">
        <div className="container">
          <DeliveryAlert />
          <div className="alert alert-promo">
            Aproveite nossa <b>promoção com preços irresistíveis</b> igual Pizza
            💜
          </div>

          <section id="pague-1-leve-2" className="categoria">
            <h2>Pague 1, Leve 2</h2>
            {combos.slice(0, 3).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
              />
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
              <ProductCard key={product.id} product={product} />
            ))}
          </section>

          <section id="sobremesa" className="categoria">
            <h2>Sobremesa — Pizzas Doces</h2>
            {desserts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>

          <section id="bebidas" className="categoria">
            <h2>Bebidas</h2>
            {beers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>

          <section id="vinhos" className="categoria">
            <h2>Vinhos</h2>
            {wineItems.map((product) => (
              <ProductCard key={product.id} product={product} />
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

      <InfoPanel />
      <SiteFooter />
      <CookieConsent />
    </>
  );
}
