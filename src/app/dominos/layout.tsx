import type { Metadata } from "next";
import { DominosCouponModal } from "@/components/DominosCouponModal";
import { dominosStore } from "@/data/dominos";

export const metadata: Metadata = {
  title: `${dominosStore.name} — ${dominosStore.tagline}`,
  description: "Peça online as promoções e o cardápio Domino's. Delivery e retirada.",
};

export default function DominosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="store-dominos">
      {children}
      <DominosCouponModal />
    </div>
  );
}
