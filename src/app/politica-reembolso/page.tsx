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
          Se o pedido chegar errado ou com problema, avise no momento da
          entrega ou pelo WhatsApp da loja.
        </p>
        <p>
          Analisamos cada caso. Quando o reembolso for aprovado, o valor volta
          pelo mesmo Pix usado no pagamento.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
