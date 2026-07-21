import Link from "next/link";
import { storeConfig } from "@/data/store";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/politica-privacidade">Privacidade</Link> •{" "}
      <Link href="/politica-reembolso">Reembolso</Link> •{" "}
      <Link href="/termos-de-uso">Termos</Link>
      <br />
      <span>© {new Date().getFullYear()} {storeConfig.name}</span>
    </footer>
  );
}
