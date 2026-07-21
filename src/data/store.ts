export type Flavor = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  priceFrom: number;
  price: number;
  featured?: boolean;
  badge?: string;
  note?: string;
  stock?: number;
  highlight?: string;
  image: string;
  pizzaCount: number;
  drinkCount: number;
  borderMax: number;
};

export const storeConfig = {
  name: "Sua Pizzaria",
  tagline: "Faça seu pedido!",
  minOrder: 10,
  deliveryTime: "30-50",
  deliveryFeeLabel: "Grátis",
  rating: 4.8,
  reviewsRecent: 136,
  reviewsTotal: 1007,
  distance: "1,6km de você",
  city: "Sua Região",
  state: "UF",
  status: "ABERTO" as const,
  themeColor: "#0d7a45",
};

export const flavors: Flavor[] = [
  {
    id: "f1",
    name: "Sabor 01",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "f2",
    name: "Sabor 02",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore.",
  },
  {
    id: "f3",
    name: "Sabor 03",
    description: "Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  {
    id: "f4",
    name: "Sabor 04",
    description: "Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: "f5",
    name: "Sabor 05",
    description: "Excepteur sint occaecat cupidatat non proident.",
  },
  {
    id: "f6",
    name: "Sabor 06",
    description: "Sunt in culpa qui officia deserunt mollit anim.",
  },
  {
    id: "f7",
    name: "Sabor 07",
    description: "Nemo enim ipsam voluptatem quia voluptas sit.",
  },
  {
    id: "f8",
    name: "Sabor 08",
    description: "Neque porro quisquam est qui dolorem ipsum.",
  },
];

export const borders: Flavor[] = [
  {
    id: "b1",
    name: "Borda 01",
    description: "Descrição genérica da borda recheada.",
  },
  {
    id: "b2",
    name: "Borda 02",
    description: "Descrição genérica da borda recheada.",
  },
  {
    id: "b3",
    name: "Borda 03",
    description: "Descrição genérica da borda recheada.",
  },
  {
    id: "b4",
    name: "Borda 04",
    description: "Descrição genérica da borda recheada.",
  },
  {
    id: "b5",
    name: "Borda 05",
    description: "Descrição genérica da borda recheada.",
  },
];

export const drinks: Flavor[] = [
  {
    id: "d1",
    name: "Refrigerante 01 — 2L",
    description: "Bebida genérica para acompanhar o pedido.",
  },
  {
    id: "d2",
    name: "Refrigerante 02 — 2L",
    description: "Bebida genérica para acompanhar o pedido.",
  },
  {
    id: "d3",
    name: "Refrigerante 03 — 2L",
    description: "Bebida genérica para acompanhar o pedido.",
  },
  {
    id: "d4",
    name: "Refrigerante 04 — 2L",
    description: "Bebida genérica para acompanhar o pedido.",
  },
  {
    id: "d5",
    name: "Refrigerante 05 — 2L",
    description: "Bebida genérica para acompanhar o pedido.",
  },
  {
    id: "d6",
    name: "Refrigerante 06 — 2L",
    description: "Bebida genérica para acompanhar o pedido.",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "combo-pp",
    category: "pizza",
    title: "2 Produto PP + 1 Bebida 2 Litros",
    subtitle: "Extra incluso",
    priceFrom: 40,
    price: 32.9,
    image: "/images/placeholder-food.svg",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p2",
    slug: "combo-p",
    category: "pizza",
    title: "2 Produto P + 1 Bebida 2 Litros",
    subtitle: "Extra incluso",
    priceFrom: 63.8,
    price: 42.9,
    image: "/images/placeholder-food.svg",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p3",
    slug: "combo-m",
    category: "pizza",
    title: "2 Produto M + 1 Bebida 2 Litros",
    subtitle: "Extra incluso",
    priceFrom: 73.8,
    price: 55.9,
    featured: true,
    badge: "MAIS VENDIDO",
    note: "Poucas unidades — item em destaque!",
    highlight: "A maioria dos clientes escolhe esse pelo melhor custo-benefício!",
    stock: 8,
    image: "/images/placeholder-food.svg",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p4",
    slug: "combo-g",
    category: "pizza",
    title: "2 Produto G + 1 Bebida 2 Litros",
    subtitle: "Extra incluso",
    priceFrom: 123.8,
    price: 75.9,
    image: "/images/placeholder-food.svg",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p5",
    slug: "combo-gg",
    category: "pizza",
    title: "2 Produto Gigante + 2 Bebidas 2 Litros",
    subtitle: "Extra incluso",
    priceFrom: 159.8,
    price: 98.9,
    featured: true,
    badge: "MAIS VENDIDO",
    note: "Dobro de bebida!",
    highlight: "A maioria dos clientes escolhe esse pelo melhor custo-benefício!",
    stock: 16,
    image: "/images/placeholder-food.svg",
    pizzaCount: 2,
    drinkCount: 2,
    borderMax: 2,
  },
];

export const reviews = [
  {
    id: "r1",
    name: "Cliente A",
    rating: 5,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pedido chegou rápido e bem embalado.",
    image: "/images/placeholder-01.svg",
  },
  {
    id: "r2",
    name: "Cliente B",
    rating: 5,
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    image: "/images/placeholder-02.svg",
  },
  {
    id: "r3",
    name: "Cliente C",
    rating: 5,
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    image: "/images/placeholder-03.svg",
  },
  {
    id: "r4",
    name: "Cliente D",
    rating: 5,
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    image: "/images/placeholder-04.svg",
  },
  {
    id: "r5",
    name: "Cliente E",
    rating: 5,
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    image: "/images/placeholder-05.svg",
  },
  {
    id: "r6",
    name: "Cliente F",
    rating: 5,
    text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    image: "/images/placeholder-06.svg",
  },
  {
    id: "r7",
    name: "Cliente G",
    rating: 5,
    text: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    image: "/images/placeholder-07.svg",
  },
  {
    id: "r8",
    name: "Cliente H",
    rating: 5,
    text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
    image: "/images/placeholder-08.svg",
  },
  {
    id: "r9",
    name: "Cliente I",
    rating: 5,
    text: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.",
    image: "/images/placeholder-09.svg",
  },
];

export const brazilianStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function getProduct(category: string, slug: string) {
  return products.find((p) => p.category === category && p.slug === slug);
}
