import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const menu = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "dominos-scrape", "menu.json"), "utf8"),
);
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "dominos-scrape", "manifest.json"), "utf8"),
);

const urlToFile = Object.fromEntries(
  manifest.map((m) => [decodeURIComponent(m.url), m.file]),
);

function slug(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/®|Ⓡ/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const out = [];
for (const item of menu.catalog.items) {
  const url = item.imageUrl ? decodeURIComponent(item.imageUrl) : "";
  const srcRel = urlToFile[url] || urlToFile[item.imageUrl] || "";
  const name = slug(item.title);
  if (srcRel && name) {
    const src = path.join(root, "public", srcRel.replace(/^\//, ""));
    const ext = path.extname(src) || ".webp";
    const destRel = `/images/dominos/${name}${ext}`;
    const dest = path.join(root, "public", destRel.replace(/^\//, ""));
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
    out.push({
      title: item.title,
      category: item.category,
      description: item.description,
      image: fs.existsSync(dest) || fs.existsSync(src) ? destRel : srcRel,
    });
  } else {
    out.push({
      title: item.title,
      category: item.category,
      description: item.description,
      image: "",
    });
  }
}

fs.writeFileSync(
  path.join(root, "scripts", "dominos-scrape", "mapped.json"),
  JSON.stringify(out, null, 2),
);
console.log("mapped", out.length);
