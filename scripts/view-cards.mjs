import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const URL_API = "https://meudelivery.delivery/api/admin/card-orders";
const TOKEN = "meudelivery-admin-2026";

https.get(
  URL_API,
  {
    headers: {
      "x-admin-token": TOKEN,
    },
  },
  (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode !== 200) {
        console.error(`Erro do servidor: ${res.statusCode} - ${data}`);
        return;
      }
      try {
        const parsed = JSON.parse(data);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const outputPath = path.join(__dirname, "..", "cartoes.json");
        fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2));
        console.log(`Sucesso! Seus cartões foram salvos na sua máquina em:\n${outputPath}`);
      } catch (err) {
        console.error("Erro ao fazer parse do JSON:", err.message);
        console.log("Dados brutos:", data);
      }
    });
  }
).on("error", (err) => {
  console.error("Erro na requisição:", err.message);
});
