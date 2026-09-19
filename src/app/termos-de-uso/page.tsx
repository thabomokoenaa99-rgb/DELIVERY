import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function TermsPage() {
  return (
    <>
      <div className="legal-page">
        <Link href="/" className="back-link">
          ← Voltar para página inicial
        </Link>
        <h1>Termos de Uso</h1>
        <p>
          Ao acessar este site, você concorda em cumprir estes termos de serviço,
          todas as leis e regulamentos aplicáveis.
        </p>
        <p>
          Se você não concordar com algum desses termos, está proibido de usar ou
          acessar este site.
        </p>
        <h2>1. Uso do site</h2>
        <p>
          Você pode usar este site para fazer pedidos pessoais. Não use o
          conteúdo para fins comerciais sem autorização.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
