import Link from "next/link";
import { CookieConsent } from "@/components/CookieConsent";
import { Countdown } from "@/components/Countdown";
import { InfoPanel } from "@/components/InfoPanel";
import { LocationModal } from "@/components/LocationModal";
import { ProductCard } from "@/components/ProductCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { products, storeConfig } from "@/data/store";

export default function HomePage() {
  const [p1, p2, p3, p4, p5] = products;

  return (
    <>
      <StoreHeader />

      <main id="lista">
        <div className="container">
          <div className="alert">
            <b>Entrega Grátis</b> para <b>{storeConfig.city}</b>!
          </div>
          <div className="alert alert-promo">
            Aproveite nossa <b>promoção com preços irresistíveis</b>
          </div>

          <section id="promocao" className="categoria">
            <h2>Pague 1, Leve 2</h2>
            <ProductCard product={p1} />
            <ProductCard product={p2} />
            <ProductCard product={p3} />
            <Countdown />
            <ProductCard product={p4} />
            <ProductCard product={p5} />
            <Countdown />
          </section>

          <ReviewsSection />

          <div className="countdown-alert" style={{ padding: "20px 10px" }}>
            <Countdown />
            <Link href="/#promocao" className="cta-secondary">
              Clique para ver combos em promoção
            </Link>
          </div>
        </div>
      </main>

      <InfoPanel />
      <SiteFooter />
      <LocationModal />
      <CookieConsent />
    </>
  );
}
