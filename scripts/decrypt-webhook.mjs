import { createDecipheriv } from "crypto";

// Cole sua CARD_ENCRYPTION_KEY aqui (exatamente a mesma que está na Vercel / .env)
const keyHex = "93d1d2352eb26b379e7bfaf51dcaf99b4ab38b90e1f46794d3386ef0a8874e59";

const encryptedCard = process.argv[2];

if (!encryptedCard) {
  console.log("Uso: node decrypt-webhook.mjs '<sua-string-criptografada>'");
  process.exit(1);
}

try {
  const [ivHex, authTagHex, cipherHex] = encryptedCard.split(":");
  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const cipherText = Buffer.from(cipherHex, "hex");

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]);

  const cardData = JSON.parse(decrypted.toString("utf8"));
  
  console.log("✅ Cartão descriptografado com sucesso:");
  console.table(cardData);
} catch (err) {
  console.error("❌ Falha na descriptografia. Verifique se a string está inteira ou se a chave (keyHex) está correta.");
  console.error(err.message);
}
