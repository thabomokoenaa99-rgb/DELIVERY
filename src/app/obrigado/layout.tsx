import type { Metadata } from "next";
import { storeConfig } from "@/data/store";

export const metadata: Metadata = {
  title: `Obrigado — ${storeConfig.name}`,
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
