import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const imgDir = path.join(root, "public", "images", "dominos");
const promotions = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "dominos-scrape", "promotions.json"), "utf8"),
);
const mapped = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "dominos-scrape", "mapped.json"), "utf8"),
);

function slug(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/®|Ⓡ/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function parsePrice(s) {
  if (!s) return null;
  return Number(s.replace(".", "").replace(",", "."));
}

function hashFile(url) {
  const base = path
    .basename(decodeURIComponent(url.split("?")[0]), ".webp")
    .replace(/[^a-zA-Z0-9_-]/g, "");
  const sq = path.join(imgDir, `promo-sq-${base}.webp`);
  if (fs.existsSync(sq)) return `promo-sq-${base}.webp`;
  return null;
}

const promoRe =
  /\[!\[([^\]]+)\]\((https:\/\/dominos-app\.s3\.amazonaws\.com\/[^)]+)\)(?: A partir de: R\$\s*([0-9.,]+))?\]/g;

const promos = [];
const seen = new Set();
let m;
while ((m = promoRe.exec(promotions.markdown))) {
  const title = m[1].replace(/\s+/g, " ").trim();
  if (/^Caverna 2$/i.test(title)) continue;
  const imageUrl = m[2];
  const file = hashFile(imageUrl);
  if (!file) continue;
  const key = title + file;
  if (seen.has(key)) continue;
  seen.add(key);
  const price = parsePrice(m[3]) ?? 0;
  const lower = title.toLowerCase();
  const pizzaCount = /2 pizzas|em dobro|combo duplo|2 itens/.test(lower)
    ? 2
    : /pizza|combo|borda|sabores|monte sua/.test(lower)
      ? 1
      : 0;
  const drinkCount = /refri|refrigerante/.test(lower) ? 1 : 0;
  const borderMax = /borda/.test(lower) ? 1 : 0;
  const { title: short, subtitle } = splitPromo(title);
  promos.push({
    title: short,
    subtitle,
    price,
    file,
    slug: `${slug(short).slice(0, 32)}-${String(price || promos.length).replace(".", "-")}`,
    pizzaCount,
    drinkCount,
    borderMax,
    simple: pizzaCount === 0,
  });
}

const offer8 = new Set([
  "frango-bacon",
  "queijo-cremoso",
  "queijo",
  "margherita",
  "calabresa",
  "pepperoni",
  "frango-com-requeijao-especial",
  "corn-bacon",
]);

function catSlug(category, title) {
  const c = category.toLowerCase();
  if (c === "pizzas") return "pizza";
  if (c === "acompanhamentos") return "acompanhamento";
  if (c === "molhos") return "molho";
  return slug(c);
}

const extras = mapped.filter(
  (i) =>
    i.image &&
    i.title !== "Caverna do Dragão" &&
    i.title !== "Meio a Meio" &&
    i.title !== "Monte sua pizza",
);

function tsString(s) {
  return JSON.stringify(s);
}

function splitPromo(full) {
  const cleaned = full.replace(/\s+/g, " ").replace(/\bou ou\b/gi, "ou").trim();
  const cuts = [cleaned.indexOf(":"), cleaned.indexOf("–"), cleaned.indexOf("—")].filter(
    (i) => i > 0,
  );
  const cut = cuts.length ? Math.min(...cuts) : -1;
  const rawTitle = cut > 0 ? cleaned.slice(0, cut).trim() : cleaned;
  const rest = cut > 0 ? cleaned.slice(cut + 1).trim() : "";
  const title = rawTitle
    .replace(/\s*R\$\s*[\d.,]+(\s*\/?\s*CADA)?/gi, "")
    .replace(/\s+/g, " ")
    .trim() || rawTitle;
  return { title, subtitle: rest && rest !== title ? rest : "" };
}

const flavorItems = extras.filter((i) => i.category === "Pizzas");
const flavorsTs = flavorItems
  .map(
    (i) => `  {
    id: ${tsString(slug(i.title))},
    name: ${tsString(i.title)},
    description: ${tsString(i.description && i.description !== i.title ? i.description : "")},
  }`,
  )
  .join(",\n");

const offer = promos.find((p) => p.price === 34.9);
if (offer) {
  promos.splice(promos.indexOf(offer), 1);
  promos.unshift(offer);
}

let n = 1;
const products = [];

for (const p of promos) {
  const id = n === 1 ? "dom-p1" : `dom-p${n}`;
  const featured = n === 1;
  n += 1;
  products.push(`  {
    id: ${tsString(id)},
    slug: ${tsString(p.slug)},
    category: "promocao",
    title: ${tsString(p.title)},
    subtitle: ${tsString(p.subtitle)},
    price: ${p.price || 34.9},
    ${featured ? 'featured: true,\n    badge: "OFERTA",\n    ' : ""}image: img(${tsString(p.file)}),
    pizzaCount: ${p.pizzaCount},
    drinkCount: ${p.drinkCount},
    borderMax: ${p.borderMax},${p.simple ? "\n    simple: true," : ""}
    startingAt: true,
  }`);
}

const catPrefix = {
  pizza: "s",
  acompanhamento: "a",
  molho: "m",
};
const counters = { s: 1, a: 1, m: 1 };

for (const item of extras) {
  const category = catSlug(item.category, item.title);
  const prefix = catPrefix[category];
  if (!prefix) continue;
  const id = `dom-${prefix}${counters[prefix]++}`;
  const s = slug(item.title);
  const price = category === "molho" ? 6.9 : offer8.has(s) ? 34.9 : category === "pizza" ? 39.9 : 24.9;
  products.push(`  {
    id: ${tsString(id)},
    slug: ${tsString(s)},
    category: ${tsString(category)},
    title: ${tsString(item.title)},
    subtitle: ${tsString(item.description && item.description !== item.title ? item.description : "")},
    price: ${price},
    simple: true,
    startingAt: true,
    image: img(${tsString(path.basename(item.image))}),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  }`);
}

const extraManual = [
  ["l1", "lasanha", "lasanha-3-queijos", "Lasanha 3 Queijos", "Queijo, parmesão, requeijão, creme culinário e orégano. Aprox. 340g.", 34.9, "lasanha.webp"],
  ["l2", "lasanha", "lasanha-frango-bacon", "Lasanha Frango & Bacon", "Frango desfiado, bacon, molho de tomate, creme culinário e orégano. Aprox. 340g.", 34.9, "lasanha.webp"],
  ["l3", "lasanha", "lasanha-queijo-presunto", "Lasanha Queijo & Presunto", "Queijo, presunto, molho de tomate, creme culinário e orégano. Aprox. 340g.", 34.9, "lasanha.webp"],
  ["c1", "calzone", "calzone-queijo-presunto", "Calzone Queijo & Presunto", "Massa recheada de queijo, parmesão, presunto e azeite.", 21.9, "promo-sq-37bbeefb8ebab91a6277921f15414732627.webp"],
  ["c2", "calzone", "calzone-margherita", "Calzone Margherita", "Queijo, parmesão, requeijão, tomate, manjericão e azeite.", 21.9, "promo-sq-37bbeefb8ebab91a6277921f15414732627.webp"],
  ["c3", "calzone", "calzone-3-queijos", "Calzone 3 Queijos", "Queijo, parmesão, requeijão e azeite.", 21.9, "promo-sq-37bbeefb8ebab91a6277921f15414732627.webp"],
  ["c4", "calzone", "calzone-frango-requeijao", "Calzone Frango com Requeijão", "Queijo, parmesão, requeijão, frango desfiado e azeite.", 21.9, "promo-sq-37bbeefb8ebab91a6277921f15414732627.webp"],
  ["w1", "sanduiche", "sanduiche-caprese", "Sanduíche Caprese", "Queijo de búfala e vaca, cebola, tomate, azeitona preta, manjericão e azeite.", 34.9, "promo-sq-6973d09b90a985d3b539b46dfbb0c5f6802.webp"],
  ["w2", "sanduiche", "sanduiche-chicken-bacon", "Sanduíche Chicken & Bacon", "Cream cheese, bacon, frango grelhado, tomate, cebola, parmesão e maionese grill.", 34.9, "promo-sq-6973d09b90a985d3b539b46dfbb0c5f6802.webp"],
  ["w3", "sanduiche", "sanduiche-frango-4-queijos", "Sanduíche Frango com 4 Queijos", "Queijo, cream cheese, frango grelhado, gorgonzola, parmesão e azeite.", 34.9, "promo-sq-6973d09b90a985d3b539b46dfbb0c5f6802.webp"],
  ["w4", "sanduiche", "sanduiche-meat-bacon", "Sanduíche Meat & Bacon", "Cream cheese, pepperoni, presunto, calabresa, bacon e azeite.", 34.9, "promo-sq-6973d09b90a985d3b539b46dfbb0c5f6802.webp"],
  ["d1", "sobremesa", "pizza-biscoff", "Pizza doce Biscoff®", "Doce de leite coberta com pedaços crocantes do biscoito Biscoff®.", 29.9, "BISCOFF-SITE.webp"],
  ["d2", "sobremesa", "pizza-nutella", "Pizza de Nutella®", "Pizza recheada de Nutella®.", 29.9, "Pan20Nutella-94.webp"],
  ["b1", "bebida", "coca-cola-2l", "Coca-Cola 2L", "Refrigerante 2 litros.", 14.9, "fanta20laranja-15.webp"],
  ["b2", "bebida", "heineken", "Heineken", "Cerveja Heineken, lata ou long neck.", 12.9, "heineken.webp"],
];

for (const [id, category, s, title, subtitle, price, file] of extraManual) {
  const exists =
    fs.existsSync(path.join(imgDir, file)) ||
    fs.existsSync(path.join(imgDir, "scrape-" + file));
  const image = fs.existsSync(path.join(imgDir, file))
    ? file
    : fs.existsSync(path.join(imgDir, "scrape-" + file))
      ? "scrape-" + file
      : "lasanha.webp";
  products.push(`  {
    id: ${tsString("dom-" + id)},
    slug: ${tsString(s)},
    category: ${tsString(category)},
    title: ${tsString(title)},
    subtitle: ${tsString(subtitle)},
    price: ${price},
    simple: true,
    startingAt: true,
    image: img(${tsString(image)}),
    pizzaCount: 0,
    drinkCount: 0,
    borderMax: 0,
  }`);
}

const out = `import type { Flavor, Product } from "@/data/store";

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
${flavorsTs},
];

export const dominosDrinks: Flavor[] = [
  { id: "coca", name: "Coca-Cola 2L", description: "Refrigerante clássico." },
  { id: "coca-zero", name: "Coca-Cola Zero 2L", description: "Sem açúcar." },
  { id: "fanta", name: "Fanta Laranja 2L", description: "Sabor cítrico." },
  { id: "sprite", name: "Sprite 2L", description: "Limão com gás." },
  { id: "guarana", name: "Fanta Guaraná 2L", description: "Guaraná." },
];

export const dominosBorders: Flavor[] = [
  { id: "catupiry", name: "Catupiry®", description: "Requeijão cremoso Catupiry® original." },
  { id: "cheddar", name: "Cheddar", description: "Molho sabor queijo cheddar." },
  { id: "cream-cheese", name: "Cream Cheese", description: "Queijo cremoso." },
];

const img = (file: string) => \`/images/dominos/\${file}\`;

export const dominosProducts: Product[] = [
${products.join(",\n")}
];

export const dominosCategories = [
  { href: "/dominos#promocoes", label: "Promoções" },
  { href: "/dominos#pizzas", label: "Pizzas" },
  { href: "/dominos#acompanhamentos", label: "Acompanhamentos" },
  { href: "/dominos#lasanhas", label: "Lasanhas" },
  { href: "/dominos#calzones", label: "Calzones" },
  { href: "/dominos#sanduiches", label: "Sanduíches" },
  { href: "/dominos#sobremesas", label: "Sobremesas" },
  { href: "/dominos#bebidas", label: "Bebidas" },
];

export function getDominosProduct(category: string, slug: string) {
  return dominosProducts.find((p) => p.category === category && p.slug === slug);
}

export function isDominosProductId(id: string) {
  return id.startsWith("dom-");
}

const slugs = new Set(dominosProducts.map((p) => \`\${p.category}/\${p.slug}\`));
if (slugs.size !== dominosProducts.length) {
  throw new Error("slug duplicado no cardápio Domino's");
}
`;

fs.writeFileSync(path.join(root, "src", "data", "dominos.ts"), out);
console.log("promos", promos.length, "products", products.length);
