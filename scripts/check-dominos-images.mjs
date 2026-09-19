import fs from "fs";
import { dominosProducts } from "../src/data/dominos.ts";

const missing = dominosProducts.filter(
  (p) => !fs.existsSync("public" + p.image),
);
console.log("n", dominosProducts.length);
console.log("missing", missing.map((p) => p.image));
console.log(dominosProducts[0].title, dominosProducts[0].image);
