import { notFound } from "next/navigation";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import {
  dominosBorders,
  dominosDrinks,
  dominosFlavors,
  dominosProducts,
  getDominosProduct,
} from "@/data/dominos";

type Props = {
  params: Promise<{ categoria: string; slug: string }>;
};

export function generateStaticParams() {
  return dominosProducts.map((p) => ({
    categoria: p.category,
    slug: p.slug,
  }));
}

export default async function DominosProductPage({ params }: Props) {
  const { categoria, slug } = await params;
  const product = getDominosProduct(categoria, slug);
  if (!product) notFound();

  return (
    <ProductConfigurator
      product={product}
      flavors={dominosFlavors}
      drinks={dominosDrinks}
      borders={dominosBorders}
      backHref="/dominos"
    />
  );
}
