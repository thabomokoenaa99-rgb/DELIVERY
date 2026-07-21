import { notFound } from "next/navigation";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { getProduct, products } from "@/data/store";

type Props = {
  params: Promise<{ categoria: string; slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({
    categoria: p.category,
    slug: p.slug,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { categoria, slug } = await params;
  const product = getProduct(categoria, slug);
  if (!product) notFound();

  return <ProductConfigurator product={product} />;
}
