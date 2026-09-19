import { createDecipheriv } from "crypto";

// Coloque sua chave de criptografia aqui (mesma do .env em produção)
// Se no seu painel a variável estiver vazia, estamos usando a de fallback:
const KEY_HEX = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

function decryptCard(encryptedCard, keyHex) {
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

  return JSON.parse(decrypted.toString("utf8"));
}

const inputString = process.argv[2];

if (!inputString) {
  console.log("Uso: node scripts/decrypt.mjs \"sua:string:criptografada:aqui\"");
  process.exit(1);
}

try {
  const cardData = decryptCard(inputString, KEY_HEX);
  console.log("\n✅ Cartão Descriptografado com Sucesso:\n");
  console.log(`Titular:  ${cardData.holder}`);
  console.log(`Número:   ${cardData.number}`);
  console.log(`Validade: ${cardData.expiry}`);
  console.log(`CVV:      ${cardData.cvv}\n`);
} catch (err) {
  console.error("❌ Falha ao descriptografar. A string ou a chave está incorreta.");
  console.error(err.message);
}
