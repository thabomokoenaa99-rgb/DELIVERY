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
        <h2>1. Uso de Licença</h2>
        <p>
          É concedida permissão para visualizar os materiais deste site apenas para
          uso pessoal e não comercial.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
