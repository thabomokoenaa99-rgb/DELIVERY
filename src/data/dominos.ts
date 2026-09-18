import type { Flavor, Product } from "@/data/store";

export const dominosStore = {
  name: "Domino's Pizza",
  tagline: "Faça seu pedido!",
  minOrder: 10,
  deliveryTime: "20-30",
  deliveryFeeLabel: "Grátis",
  rating: 4.8,
  reviewsRecent: 136,
  reviewsTotal: 1007,
  distance: "1,6km de você",
  city: "Jardim Maria Estela",
  state: "SP",
  stateName: "São Paulo",
  neighborhood: "Jardim Maria Estela",
  address: "Rua Irmão Pio, 44 - Jardim Maria Estela, São Paulo - SP",
  zipCode: "04181080",
  phone: "(11) 2946-1040",
  whatsapp: "5511998146070",
  status: "ABERTO" as const,
  themeColor: "#006491",
  brandBrown: "#006491",
  brandTan: "#0090E2",
};

export const dominosFlavors: Flavor[] = [
  {
    id: "frango-bacon",
    name: "Frango & Bacon",
    description: "Frango desfiado, bacon, tomate, requeijão e orégano.",
  },
  {
    id: "queijo-cremoso",
    name: "Queijo Cremoso",
    description: "Queijo, creme culinário e orégano.",
  },
  {
    id: "queijo",
    name: "Queijo",
    description: "Queijo e orégano.",
  },
  {
    id: "margherita",
    name: "Margherita",
    description: "Queijo, tomate, orégano e manjericão.",
  },
  {
    id: "calabresa",
    name: "Calabresa",
    description: "Queijo, calabresa e cebola, orégano.",
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    description: "Queijo, orégano e pepperoni.",
  },
  {
    id: "frango-requeijao",
    name: "Frango com Requeijão Especial",
    description: "Frango desfiado, cebola, orégano e requeijão.",
  },
  {
    id: "corn-bacon",
    name: "Corn & Bacon",
    description: "Queijo, bacon, orégano e milho.",
  },
  {
    id: "3-queijos",
    name: "3 Queijos",
    description: "Queijo, requeijão, orégano e parmesão ralado.",
  },
  {
    id: "napolitana",
    name: "Napolitana",
    description: "Queijo, tomate, orégano e parmesão ralado.",
  },
  {
    id: "4-queijos",
    name: "4 Queijos",
    description: "Queijo, requeijão, gorgonzola, orégano e parmesão ralado.",
  },
  {
    id: "catuperoni",
    name: "Catuperoni",
    description: "Queijo, pepperoni, requeijão, orégano e parmesão ralado.",
  },
  {
    id: "frango-caipira",
    name: "Frango Caipira",
    description: "Queijo, frango desfiado, milho, catupiry e orégano.",
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    description:
      "Queijo, presunto, ovo de codorna, azeitona preta, cebola, orégano e pimentão verde.",
  },
  {
    id: "extravaganzza",
    name: "Extravaganzza®",
    description:
      "Queijo, pepperoni, presunto, azeitona preta, champignon, cebola, orégano e pimentão verde.",
  },
  {
    id: "veggie",
    name: "Veggie®",
    description:
      "Queijo, champignon, azeitona preta, cebola, orégano e pimentão verde.",
  },
];

export const dominosDrinks: Flavor[] = [
  {
    id: "coca",
    name: "Coca-Cola 2L",
    description: "Refrigerante clássico.",
  },
  {
    id: "coca-zero",
    name: "Coca-Cola Zero 2L",
    description: "Sem açúcar.",
  },
  {
    id: "fanta",
    name: "Fanta Laranja 2L",
    description: "Sabor cítrico.",
  },
  {
    id: "sprite",
    name: "Sprite 2L",
    description: "Limão com gás.",
  },
  {
    id: "guarana",
    name: "Fanta Guaraná 2L",
    description: "Guaraná.",
  },
];

export const dominosBorders: Flavor[] = [
  {
    id: "catupiry",
    name: "Catupiry®",
    description: "Requeijão cremoso Catupiry® original.",
  },
  {
    id: "cheddar",
    name: "Cheddar",
    description: "Molho sabor queijo cheddar.",
  },
  {
    id: "cream-cheese",
    name: "Cream Cheese",
    description: "Queijo cremoso.",
  },
];

const img = (file: string) => `/images/dominos/${file}`;

export const dominosProducts: Product[] = [
  {
    id: "dom-p1",
    slug: "2-pizzas-medias",
    category: "promocao",
    title: "2 Pizzas Médias",
    subtitle:
      "R$ 34,90 cada. 8 sabores ou incremente a pizza de queijo com +2 ingredientes.",
    priceFrom: 99.8,
    price: 34.9,
    featured: true,
    badge: "R$ 34,90 CADA",
    highlight: "Oferta principal da loja — duas médias no mesmo pedido.",
    image: img("hero-2-medias.png"),
    pizzaCount: 2,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-p2",
    slug: "dominos-em-dobro-grande",
    category: "promocao",
    title: "Domino's em Dobro — Grande",
    subtitle: "2 pizzas grandes. Até 40% off.",
    priceFrom: 149.8,
    // ponytail: 89.9 until the store CEP returns the live grande-em-dobro price
    price: 89.9,
    badge: "ATÉ 40% OFF",
    image: img("tile-em-dobro.png"),
    pizzaCount: 2,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-p3",
    slug: "grande-borda-catupiry-refri",
    category: "promocao",
    title: "Pizza Grande + Borda Catupiry® + Refri 2L",
    subtitle: "Borda recheada + 2 ingredientes + refrigerante 2L.",
    priceFrom: 119.8,
    price: 79.9,
    note: "Borda Catupiry® inclusa",
    image: img("tile-borda.png"),
    pizzaCount: 1,
    drinkCount: 1,
    borderMax: 1,
  },
  {
    id: "dom-p4",
    slug: "combo-duplo-grandes-refri",
    category: "promocao",
    title: "2 Pizzas Grandes + Refri 2L",
    subtitle: "Combo duplo das mais pedidas, com refrigerante 2L.",
    priceFrom: 159.8,
    price: 116.9,
    featured: true,
    badge: "COMBO DUPLO",
    image: img("tile-combo.png"),
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 0,
  },
  {
    id: "dom-s1",
    slug: "calabresa",
    category: "pizza",
    title: "Calabresa",
    subtitle: "Queijo, calabresa e cebola, orégano. Pizza média.",
    price: 34.9,
    simple: true,
    image: img("calabresa.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-s2",
    slug: "pepperoni",
    category: "pizza",
    title: "Pepperoni",
    subtitle: "Queijo, orégano e pepperoni. Pizza média.",
    price: 34.9,
    simple: true,
    image: img("pepperoni.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-s3",
    slug: "frango-bacon",
    category: "pizza",
    title: "Frango & Bacon",
    subtitle: "Frango desfiado, bacon, tomate, requeijão e orégano.",
    price: 34.9,
    simple: true,
    image: img("frango-bacon.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-s4",
    slug: "margherita",
    category: "pizza",
    title: "Margherita",
    subtitle: "Queijo, tomate, orégano e manjericão.",
    price: 34.9,
    simple: true,
    image: img("margherita.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-s5",
    slug: "frango-requeijao",
    category: "pizza",
    title: "Frango com Requeijão Especial",
    subtitle: "Frango desfiado, cebola, orégano e requeijão.",
    price: 34.9,
    simple: true,
    image: img("frango-requeijao.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-s6",
    slug: "4-queijos",
    category: "pizza",
    title: "4 Queijos",
    subtitle: "Queijo, requeijão, gorgonzola, orégano e parmesão ralado.",
    price: 34.9,
    simple: true,
    image: img("4-queijos.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-s7",
    slug: "extravaganzza",
    category: "pizza",
    title: "Extravaganzza®",
    subtitle:
      "Pepperoni, presunto, azeitona preta, champignon, cebola e pimentão verde.",
    price: 39.9,
    simple: true,
    image: img("extravaganzza.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-s8",
    slug: "portuguesa",
    category: "pizza",
    title: "Portuguesa",
    subtitle:
      "Presunto, ovo de codorna, azeitona preta, cebola e pimentão verde.",
    price: 39.9,
    simple: true,
    image: img("portuguesa.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-l1",
    slug: "lasanha-queijo-presunto",
    category: "lasanha",
    title: "Lasanha Queijo & Presunto",
    subtitle:
      "Queijo, presunto, molho de tomate, creme culinário e orégano. Aprox. 340g.",
    price: 34.9,
    note: "Entra na oferta de R$ 34,90",
    simple: true,
    image: img("lasanha.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "dom-w1",
    slug: "sanduiche-chicken-bacon",
    category: "sanduiche",
    title: "Sanduíche Chicken & Bacon",
    subtitle:
      "Cream cheese, bacon, frango grelhado, tomate, cebola, parmesão, maionese grill e azeite.",
    price: 34.9,
    note: "Receita nova da oferta principal",
    simple: true,
    image: img("frango-bacon.webp"),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
];

export const dominosCategories = [
  { href: "/dominos#promocoes", label: "Promoções" },
  { href: "/dominos#pizzas", label: "Pizzas" },
  { href: "/dominos#lasanhas", label: "Lasanhas e sanduíches" },
];

export function getDominosProduct(category: string, slug: string) {
  return dominosProducts.find((p) => p.category === category && p.slug === slug);
}

export function isDominosProductId(id: string) {
  return id.startsWith("dom-");
}

const slugs = new Set(dominosProducts.map((p) => `${p.category}/${p.slug}`));
if (slugs.size !== dominosProducts.length) {
  throw new Error("slug duplicado no cardápio Domino's");
}
