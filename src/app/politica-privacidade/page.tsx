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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. É política desta
          loja respeitar a sua privacidade em relação a qualquer informação que
          possamos coletar no site.
        </p>
        <p>
          Solicitamos informações pessoais apenas quando realmente precisamos delas
          para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o
          seu conhecimento e consentimento.
        </p>
        <p>
          Não compartilhamos informações de identificação pessoal publicamente ou
          com terceiros, exceto quando exigido por lei.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
