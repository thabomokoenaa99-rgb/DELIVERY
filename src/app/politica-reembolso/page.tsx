import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function RefundPage() {
  return (
    <>
      <div className="legal-page">
        <Link href="/" className="back-link">
          ← Voltar para página inicial
        </Link>
        <h1>Política de Reembolso</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Em caso de
          problemas com o seu pedido, entre em contato com o atendimento no momento
          do recebimento.
        </p>
        <p>
          Avaliaremos cada solicitação de forma individual e responderemos no menor
          prazo possível.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
