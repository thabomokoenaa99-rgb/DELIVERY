import type { PricedFlavor } from "./individual-flavors";

const RAW = [
  { id: "banana", name: "Banana", description: "Banana, canela com açúcar e leite condensado", from: 59 },
  { id: "banana-com-chocolate", name: "Banana com Chocolate", description: "Banana coberta com chocolate", from: 59 },
  { id: "brigadeiro", name: "Brigadeiro", description: "Chocolate com granulado", from: 59 },
  { id: "california", name: "Califórnia", description: "Presunto com pêssego, figo, abacaxi e mussarela", from: 69 },
  { id: "chocolate-com-cereja", name: "Chocolate com Cereja", description: "Chocolate com cereja", from: 69 },
  { id: "chocolate-com-morango", name: "Chocolate com Morango", description: "Chocolate com morango", from: 69 },
  { id: "churros", name: "Churros", description: "Doce de leite, açúcar e canela", from: 59 },
  { id: "festa", name: "Festa", description: "Chocolate branco e granulado multicores", from: 59 },
  { id: "magnifica", name: "Magnífica", description: "Chocolate ao leite e chocolate branco", from: 59 },
  { id: "oreo", name: "Oreo", description: "Chocolate ao leite cremoso com biscoitos Oreo picados", from: 64 },
  { id: "ovomaltine", name: "Ovomaltine", description: "Creme de Ovomaltine com Ovomaltine crocante", from: 64 },
  { id: "prestigio", name: "Prestígio", description: "Chocolate com coco ralado", from: 59 },
  { id: "romeu-e-julieta", name: "Romeu e Julieta", description: "Goiabada cremosa com mussarela", from: 59 },
  { id: "romeu-e-julieta-especial", name: "Romeu e Julieta Especial", description: "Goiabada com cream cheese", from: 59 },
] as const;

export const dessertFlavors: PricedFlavor[] = RAW.map(({ from, ...f }) => ({
  ...f,
  price: from * 0.5,
}));

export const dessertPreferences = [
  { id: "massa-tradicional", name: "Massa Tradicional", description: "Massa clássica da casa" },
  { id: "borda-doce-de-leite", name: "Borda Recheada com Doce de Leite", description: "Borda recheada" },
];
