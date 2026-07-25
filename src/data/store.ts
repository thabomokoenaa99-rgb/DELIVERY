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
  priceFrom?: number;
  price: number;
  featured?: boolean;
  badge?: string;
  note?: string;
  stock?: number;
  highlight?: string;
  image: string;
  /** Combo: choose flavors/drinks. Simple: add-to-cart only (ex: pizza doce). */
  simple?: boolean;
  pizzaCount: number;
  drinkCount: number;
  borderMax: number;
};

export const storeConfig = {
  name: "Pizzaria Bella Napoli",
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
  themeColor: "#3c2a21",
  brandBrown: "#3c2a21",
  brandTan: "#a3968c",
};

export const flavors: Flavor[] = [
  {
    id: "calabresa",
    name: "Calabresa",
    description: "Molho de tomate, mussarela, calabresa e cebola.",
  },
  {
    id: "mussarela",
    name: "Mussarela",
    description: "Molho de tomate e bastante queijo mussarela.",
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    description:
      "Molho de tomate, mussarela, presunto, ovo, cebola, pimentão e azeitona.",
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    description: "Frango desfiado temperado com catupiry.",
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    description: "Molho de tomate, mussarela e pepperoni.",
  },
  {
    id: "quatro-queijos",
    name: "Quatro Queijos",
    description:
      "Mistura de queijos (mussarela, parmesão, provolone e gorgonzola).",
  },
  {
    id: "marguerita",
    name: "Marguerita",
    description: "Molho de tomate, mussarela, tomate e manjericão fresco.",
  },
  {
    id: "bacon",
    name: "Bacon",
    description: "Molho de tomate, mussarela e bastante bacon crocante.",
  },
];

export const borders: Flavor[] = [
  {
    id: "catupiry",
    name: "Catupiry",
    description: "Requeijão cremoso Catupiry original.",
  },
  {
    id: "cheddar",
    name: "Cheddar",
    description: "Queijo cheddar com sabor marcante.",
  },
  {
    id: "mussarela-borda",
    name: "Mussarela",
    description: "Borda recheada com mussarela derretida.",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Chocolate ao leite ou meio amargo.",
  },
  {
    id: "calabresa-moida",
    name: "Calabresa Moída",
    description: "Calabresa triturada com queijo.",
  },
];

export const drinks: Flavor[] = [
  {
    id: "coca",
    name: "Coca-Cola 2L",
    description: "Refrigerante clássico, sabor refrescante.",
  },
  {
    id: "fanta",
    name: "Fanta Laranja 2L",
    description: "Sabor cítrico e refrescante.",
  },
  {
    id: "guarana",
    name: "Guaraná Antarctica 2L",
    description: "Refrigerante de guaraná tradicional.",
  },
  {
    id: "sprite",
    name: "Sprite 2L",
    description: "Refrigerante refrescante, sabor limão com gás.",
  },
  {
    id: "pepsi",
    name: "Pepsi 2L",
    description: "Sabor doce e refrescante.",
  },
  {
    id: "schweppes",
    name: "Schweppes Citrus 2L",
    description: "Refresco cítrico levemente amargo.",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "pizza1",
    category: "pizza",
    title: "2 Pizza PP + 1 Refrigerante 2 Litros",
    subtitle: "Borda Recheada Grátis",
    priceFrom: 40,
    price: 32.9,
    image: "/images/pizza.png",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p2",
    slug: "pizza2",
    category: "pizza",
    title: "2 Pizza P + 1 Refrigerante 2 Litros",
    subtitle: "Borda Recheada Grátis",
    priceFrom: 63.8,
    price: 42.9,
    image: "/images/pizza.png",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p3",
    slug: "pizza3",
    category: "pizza",
    title: "2 Pizza M + 1 Refrigerante 2 Litros",
    subtitle: "Borda Recheada Grátis",
    priceFrom: 73.8,
    price: 55.9,
    featured: true,
    badge: "MAIS VENDIDO 💜",
    note: "Poucas Unidades Recheio Extra!",
    highlight:
      "A maioria dos clientes escolhe esse porque é o melhor custo-benefício!",
    stock: 8,
    image: "/images/pizza.png",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p4",
    slug: "pizza4",
    category: "pizza",
    title: "2 Pizza G + 1 Refrigerante 2 Litros",
    subtitle: "Borda Recheada Grátis",
    priceFrom: 123.8,
    price: 75.9,
    image: "/images/pizza.png",
    pizzaCount: 2,
    drinkCount: 1,
    borderMax: 2,
  },
  {
    id: "p5",
    slug: "pizza5",
    category: "pizza",
    title: "2 Pizza Gigante + 2 Refrigerante 2 Litros",
    subtitle: "Borda Recheada Grátis",
    priceFrom: 159.8,
    price: 98.9,
    featured: true,
    badge: "MAIS VENDIDO 💜",
    note: "Dobro de Refrigerante!",
    highlight:
      "A maioria dos clientes escolhe esse porque é o melhor custo-benefício!",
    stock: 16,
    image: "/images/pizza.png",
    pizzaCount: 2,
    drinkCount: 2,
    borderMax: 2,
  },
  {
    id: "d2",
    slug: "banana-com-chocolate",
    category: "sobremesa",
    title: "Banana com Chocolate",
    subtitle: "Banana com cobertura de chocolate",
    price: 22,
    image: "/images/chocolate-com-morango.png",
    simple: true,
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "d3",
    slug: "brigadeiro",
    category: "sobremesa",
    title: "Brigadeiro",
    subtitle: "Chocolate com granulado",
    price: 22,
    image: "/images/chocolate-com-morango.png",
    simple: true,
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "d5",
    slug: "chocolate-com-cereja",
    category: "sobremesa",
    title: "Chocolate com Cereja",
    subtitle: "Chocolate com cerejas",
    price: 29,
    image: "/images/chocolate-com-morango.png",
    simple: true,
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "d6",
    slug: "chocolate-com-morango",
    category: "sobremesa",
    title: "Chocolate com Morango",
    subtitle: "Chocolate com granulado e morango fresco",
    price: 29,
    image: "/images/chocolate-com-morango.png",
    simple: true,
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
  {
    id: "d8",
    slug: "festa",
    category: "sobremesa",
    title: "Festa",
    subtitle: "Chocolate branco e granulado multicores",
    price: 24,
    image: "/images/chocolate-com-morango.png",
    simple: true,
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  },
];

export const reviews = [
  {
    id: "r1",
    name: "Laysa",
    rating: 5,
    text: "Melhor pizzaria da região! Aproveitei a promoção e saí muito satisfeito. Pizza saborosa e ainda ganhei um refrigerante de 2L!",
    image: "/images/prova1.jpg",
  },
  {
    id: "r2",
    name: "Nadia",
    rating: 5,
    text: "Sensacional! Pedi uma pizza e levei duas! A massa é perfeita e o recheio bem caprichado. Cliente fiel a partir de hoje!",
    image: "/images/prova2.jpg",
  },
  {
    id: "r3",
    name: "Aline",
    rating: 5,
    text: "Ótima experiência! Atendimento rápido, pizza deliciosa e ainda ganhei um refri. Super recomendo!",
    image: "/images/prova3.jpg",
  },
  {
    id: "r4",
    name: "Kamilly",
    rating: 5,
    text: "As pizzas são muito bem recheadas e assadas no ponto certo! Promoção incrível, já quero mais!",
    image: "/images/prova4.jpg",
  },
  {
    id: "r5",
    name: "Karol",
    rating: 5,
    text: "Vale muito a pena! Pizza quentinha, bem recheada e ainda veio o refrigerante grátis. Nota 10!",
    image: "/images/prova5.jpg",
  },
  {
    id: "r6",
    name: "Talita",
    rating: 5,
    text: "Nunca vi uma promoção tão boa! A pizza estava deliciosa e ainda levei mais uma. Já virei cliente!",
    image: "/images/prova7.jpg",
  },
  {
    id: "r7",
    name: "Aline",
    rating: 5,
    text: "Recomendo demais! Entrega rápida, pizza saborosa e ainda veio um refri de 2L na faixa. Top!",
    image: "/images/prova8.jpg",
  },
  {
    id: "r8",
    name: "Iana",
    rating: 5,
    text: "Melhor custo-benefício! Pizza de qualidade, entrega no horário e atendimento excelente!",
    image: "/images/prova9.jpg",
  },
  {
    id: "r9",
    name: "Gustavo",
    rating: 5,
    text: "Que delícia! Além de super recheada, a pizza chegou bem quente. A promoção vale muito a pena!",
    image: "/images/prova12.jpg",
  },
];

export const citiesByState: Record<string, string[]> = {
  SP: [
    "São Paulo",
    "Guarulhos",
    "Campinas",
    "São Bernardo do Campo",
    "Santo André",
    "Osasco",
    "Sorocaba",
    "Jardim Maria Estela",
  ],
  RJ: [
    "Rio de Janeiro",
    "Niterói",
    "Duque de Caxias",
    "Nova Iguaçu",
    "São Gonçalo",
  ],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
  DF: ["Brasília", "Taguatinga", "Ceilândia"],
};

export const brazilianStates = [
  { value: "RO", label: "Rondônia" },
  { value: "AC", label: "Acre" },
  { value: "AM", label: "Amazonas" },
  { value: "RR", label: "Roraima" },
  { value: "PA", label: "Pará" },
  { value: "AP", label: "Amapá" },
  { value: "TO", label: "Tocantins" },
  { value: "MA", label: "Maranhão" },
  { value: "PI", label: "Piauí" },
  { value: "CE", label: "Ceará" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "PB", label: "Paraíba" },
  { value: "PE", label: "Pernambuco" },
  { value: "AL", label: "Alagoas" },
  { value: "SE", label: "Sergipe" },
  { value: "BA", label: "Bahia" },
  { value: "MG", label: "Minas Gerais" },
  { value: "ES", label: "Espírito Santo" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "SP", label: "São Paulo" },
  { value: "PR", label: "Paraná" },
  { value: "SC", label: "Santa Catarina" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MT", label: "Mato Grosso" },
  { value: "GO", label: "Goiás" },
  { value: "DF", label: "Distrito Federal" },
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

export function getOptionLabel(
  options: Flavor[],
  ids: string[],
): string {
  return ids
    .map((id) => options.find((o) => o.id === id)?.name ?? id)
    .join(" / ");
}
