import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
const key = (env.match(/^FIRECRAWL_API_KEY=(.+)$/m) || [])[1]?.trim();

const outDir = path.join(root, "scripts", "dominos-scrape");
const imgDir = path.join(root, "public", "images", "dominos");

async function scrape(name, url) {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      mobile: true,
      onlyMainContent: false,
      waitFor: 8000,
      timeout: 120000,
      location: { country: "BR", languages: ["pt-BR"] },
      actions: [
        { type: "wait", milliseconds: 2500 },
        {
          type: "executeJavascript",
          script: `(() => {
  const nodes = [...document.querySelectorAll("button, a, ion-button, span")];
  nodes.find((el) => /^\\s*[×xX]\\s*$/.test(el.textContent || ""))?.click();
})()`,
        },
        { type: "wait", milliseconds: 4000 },
        { type: "scroll", direction: "down" },
        { type: "wait", milliseconds: 2000 },
        { type: "scroll", direction: "down" },
        { type: "wait", milliseconds: 2000 },
      ],
      formats: ["markdown", "images", "links"],
    }),
  });
  const json = await res.json();
  const slim = {
    success: json.success,
    error: json.error || json.message,
    markdown: String(json.data?.markdown || "").slice(0, 8000),
    images: json.data?.images || [],
    links: json.data?.links || [],
  };
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(slim, null, 2));
  console.log(name, slim.success, "images", slim.images.length, slim.error || "");
  return slim;
}

const jobs = [
  ["promotions", "https://www.dominos.com.br/tabs/promotions"],
  ["promo-737924", "https://www.dominos.com.br/promotion-details/737924"],
  ["promo-718767", "https://www.dominos.com.br/promotion-details/718767"],
  ["promo-718699", "https://www.dominos.com.br/promotion-details/718699"],
  ["promo-718768", "https://www.dominos.com.br/promotion-details/718768"],
];

const extra = [];
for (const [name, url] of jobs) {
  extra.push(await scrape(name, url));
}

const urls = [
  ...new Set(extra.flatMap((r) => r.images || [])),
].filter((u) => /dominos-app\.s3/i.test(u));

for (const [i, url] of urls.entries()) {
  const clean = url.split("?")[0];
  const ext = path.extname(decodeURIComponent(clean)) || ".webp";
  const base = path
    .basename(decodeURIComponent(clean), ext)
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 48);
  const file = `promo-sq-${base || i}${ext}`;
  const dest = path.join(imgDir, file);
  if (fs.existsSync(dest)) continue;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log("dl", file);
  } catch (e) {
    console.error("dl fail", url, e.message);
  }
}
