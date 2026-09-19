import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
const key = (env.match(/^FIRECRAWL_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!key) {
  console.error("missing FIRECRAWL_API_KEY");
  process.exit(1);
}

const outDir = path.join(root, "scripts", "dominos-scrape");
const imgDir = path.join(root, "public", "images", "dominos");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(imgDir, { recursive: true });

const dismissAndScroll = [
  {
    type: "wait",
    milliseconds: 2500,
  },
  {
    type: "executeJavascript",
    script: `(() => {
  const nodes = [...document.querySelectorAll("button, a, ion-button, ion-icon, [role=button], span")];
  nodes.find((el) => /^\\s*[×xX]\\s*$/.test(el.textContent || ""))?.click();
  nodes.find((el) => /aceitar|concordar|continuar|ok/i.test(el.textContent || ""))?.click();
})()`,
  },
  { type: "wait", milliseconds: 4000 },
  { type: "scroll", direction: "down" },
  { type: "wait", milliseconds: 1500 },
  { type: "scroll", direction: "down" },
  { type: "wait", milliseconds: 1500 },
];

const dumpMenuTabs = {
  type: "executeJavascript",
  script: `(async () => {
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const clickNamed = (name) => {
    const el = [...document.querySelectorAll("ion-segment-button, button, ion-button, [role=tab], a")]
      .find((n) => (n.textContent || "").includes(name));
    el?.click();
  };
  const chunks = [];
  for (const name of ["Pizzas", "Acompanhamentos", "Molhos"]) {
    clickNamed(name);
    await pause(2200);
    chunks.push("## " + name + "\\n" + (document.body.innerText || ""));
  }
  const pre = document.createElement("pre");
  pre.id = "dominos-dump";
  pre.textContent = chunks.join("\\n\\n");
  document.body.prepend(pre);
})()`,
};

const catalogSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          price: { type: "string" },
          category: { type: "string" },
          imageUrl: { type: "string" },
        },
      },
    },
  },
};

const jobs = [
  {
    name: "promotions",
    url: "https://www.dominos.com.br/tabs/promotions",
    prompt:
      "Extract every Domino's promotion visible: title, description, price text, and the full-resolution square (1:1) product/promo image URL. Ignore cookies.",
    extraActions: [
      { type: "screenshot", fullPage: true },
    ],
  },
  {
    name: "menu",
    url: "https://www.dominos.com.br/tabs/menu",
    prompt:
      "Extract every menu item from Pizzas, Acompanhamentos and Molhos: title, ingredients/description, price if shown, category, and image URL. Include Meio a Meio.",
    extraActions: [dumpMenuTabs, { type: "wait", milliseconds: 8000 }],
  },
  {
    name: "home",
    url: "https://www.dominos.com.br/tabs/home",
    prompt:
      "Extract homepage promotions and tiles with titles, prices and square image URLs.",
    extraActions: [],
  },
];

async function scrape(job) {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: job.url,
      mobile: true,
      onlyMainContent: false,
      waitFor: 6000,
      timeout: 120000,
      location: { country: "BR", languages: ["pt-BR"] },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      },
      actions: [...dismissAndScroll, ...job.extraActions],
      formats: [
        "markdown",
        "images",
        "links",
        {
          type: "json",
          schema: catalogSchema,
          prompt: job.prompt,
        },
      ],
    }),
  });
  const json = await res.json();
  const slim = {
    success: json.success,
    error: json.error || json.message,
    markdown: String(json.data?.markdown || "").slice(0, 12000),
    images: json.data?.images || [],
    links: (json.data?.links || []).slice(0, 80),
    catalog: json.data?.json || null,
  };
  fs.writeFileSync(
    path.join(outDir, `${job.name}.json`),
    JSON.stringify(slim, null, 2),
  );
  const shot = json.data?.actions?.screenshots?.[0] || json.data?.screenshot;
  if (shot && String(shot).startsWith("http")) {
    const img = await fetch(shot);
    fs.writeFileSync(
      path.join(outDir, `${job.name}.png`),
      Buffer.from(await img.arrayBuffer()),
    );
  }
  console.log(
    job.name,
    json.success ? "ok" : "fail",
    "images",
    slim.images.length,
    "items",
    slim.catalog?.items?.length ?? 0,
    "md",
    slim.markdown.length,
  );
  return slim;
}

function slugFile(url, i) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean) || ".webp";
  const base = path.basename(clean, ext).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  return `${base || "img"}-${i}${ext}`;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const results = [];
for (const job of jobs) {
  try {
    results.push(await scrape(job));
  } catch (e) {
    console.error(job.name, e.message);
  }
}

const urls = [
  ...new Set(
    results.flatMap((r) => [
      ...(r.images || []),
      ...((r.catalog?.items || []).map((i) => i.imageUrl).filter(Boolean)),
    ]),
  ),
].filter((u) =>
  /dominos-app\.s3|amazonaws\.com|dominos\.com\.br\/.*\.(webp|png|jpg|jpeg)/i.test(
    u,
  ),
);

const manifest = [];
for (const [i, url] of urls.entries()) {
  const file = slugFile(url, i);
  const dest = path.join(imgDir, `scrape-${file}`);
  try {
    await download(url, dest);
    manifest.push({ url, file: `/images/dominos/scrape-${file}` });
    console.log("dl", file);
  } catch (e) {
    console.error("dl fail", url, e.message);
  }
}
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("done", manifest.length, "files");
