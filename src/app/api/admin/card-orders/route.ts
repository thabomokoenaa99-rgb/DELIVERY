import { NextResponse } from "next/server";
import { createDecipheriv } from "crypto";
import { readFile } from "fs/promises";
import path from "path";

type CardOrder = {
  id: string;
  createdAt: string;
  amount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  shipping: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    title: string;
    unitPrice: number;
    quantity: number;
  }>;
  encryptedCard: string;
  externalRef?: string;
};

type DecryptedOrder = Omit<CardOrder, "encryptedCard"> & {
  card: {
    holder: string;
    number: string;
    expiry: string;
    cvv: string;
  };
};

function decryptCard(
  encryptedCard: string,
  keyHex: string,
): { holder: string; number: string; expiry: string; cvv: string } {
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


export async function GET(request: Request) {
  // Protegido por token secreto no header
  const adminSecret = process.env.CARD_ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json({ error: "Endpoint nao configurado." }, { status: 503 });
  }

  const authHeader = request.headers.get("x-admin-token");
  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const encKey = process.env.CARD_ENCRYPTION_KEY;
  if (!encKey || encKey.length !== 64) {
    return NextResponse.json({ error: "Chave de criptografia ausente." }, { status: 503 });
  }

  let orders: CardOrder[] = [];

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/lrange/card_orders/0/-1`, {
        headers: { Authorization: `Bearer ${kvToken}` }
      });
      const data = await res.json();
      if (data.result && Array.isArray(data.result)) {
        // Redis retorna array de strings JSON
        orders = data.result.map((s: string) => JSON.parse(s));
      }
    } catch {
      // fallback vazio
    }
  } else {
    // Fallback pra disco
    const DATA_FILE = path.join("/tmp", "card-orders.json");
    try {
      const raw = await readFile(DATA_FILE, "utf8");
      orders = JSON.parse(raw) as CardOrder[];
    } catch {
      // vazio
    }
  }

  const decrypted: DecryptedOrder[] = orders.map((order) => {
    const { encryptedCard, ...rest } = order;
    try {
      const card = decryptCard(encryptedCard, encKey);
      return { ...rest, card };
    } catch {
      return { ...rest, card: { holder: "ERRO", number: "ERRO", expiry: "ERRO", cvv: "ERRO" } };
    }
  });

  return NextResponse.json({ orders: decrypted });
}
