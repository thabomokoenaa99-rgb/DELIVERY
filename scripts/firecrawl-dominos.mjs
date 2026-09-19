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

const outDir = path.join(root, "public", "images", "dominos");
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  {
    name: "home-mobile",
    url: "https://www.dominos.com.br/tabs/home",
    fullPage: false,
  },
  {
    name: "home-mobile-full",
    url: "https://www.dominos.com.br/tabs/home",
    fullPage: true,
  },
  {
    name: "menu-mobile",
    url: "https://www.dominos.com.br/tabs/menu",
    fullPage: false,
  },
  {
    name: "promos-mobile",
    url: "https://www.dominos.com.br/tabs/promocoes",
    fullPage: true,
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
      waitFor: 5000,
      timeout: 90000,
      location: { country: "BR", languages: ["pt-BR"] },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      },
      formats: [
        {
          type: "screenshot",
          fullPage: job.fullPage,
          quality: 90,
          viewport: { width: 390, height: 844 },
        },
        "images",
        "markdown",
      ],
    }),
  });
  const json = await res.json();
  if (!json.success) {
    console.error(job.name, "fail", json.error || json.message || res.status);
    return json;
  }
  const shot = json.data?.screenshot;
  if (shot && shot.startsWith("http")) {
    const img = await fetch(shot);
    const buf = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync(path.join(outDir, `${job.name}.png`), buf);
    console.log("saved", job.name, buf.length);
  } else {
    console.error(job.name, "no screenshot url");
  }
  fs.writeFileSync(
    path.join(outDir, `${job.name}.json`),
    JSON.stringify(
      {
        images: (json.data?.images || []).slice(0, 40),
        markdown: String(json.data?.markdown || "").slice(0, 2500),
      },
      null,
      2,
    ),
  );
}

for (const job of jobs) {
  try {
    await scrape(job);
  } catch (e) {
    console.error(job.name, e.message);
  }
}
