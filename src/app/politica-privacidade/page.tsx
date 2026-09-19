import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function PrivacyPage() {
  return (
    <>
      <div className="legal-page">
        <Link href="/" className="back-link">
          ← Voltar para página inicial
        </Link>
        <h1>Política de Privacidade</h1>
        <p>
          Pedimos nome, telefone, e-mail e endereço só para entregar o pedido e
          confirmar o pagamento.
        </p>
        <p>
          Não vendemos seus dados. Só compartilhamos o necessário com o meio de
          pagamento (Pix) ou quando a lei exigir.
        </p>
        <p>
          Usamos cookies para lembrar preferências e melhorar o site. Ao
          continuar, você concorda com esta política.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
