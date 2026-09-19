import { NextResponse } from "next/server";
import { createCipheriv, randomBytes } from "crypto";
import { writeFile, readFile } from "fs/promises";
import path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  // Cartão criptografado — somente quem tem CARD_ENCRYPTION_KEY decripta
  encryptedCard: string; // formato: iv:authTag:ciphertext (tudo em hex)
  externalRef?: string;
};

type RequestBody = {
  amount: number;
  items: Array<{ title: string; unitPrice: number; quantity: number }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  shipping: {
    name: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  card: {
    holder: string;
    number: string;
    expiry: string;
    cvv: string;
  };
  externalRef?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function encryptCard(
  cardData: { holder: string; number: string; expiry: string; cvv: string },
  keyHex: string,
): string {
  const key = Buffer.from(keyHex, "hex");
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const plain = JSON.stringify(cardData);
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // iv:authTag:ciphertext — tudo hex, separado por ":"
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

async function appendOrder(order: CardOrder): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    // Supabase REST API
    const res = await fetch(`${supabaseUrl}/rest/v1/card_orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        id: order.id,
        order_data: order
      })
    });
    
    if (!res.ok) {
      console.error("Supabase Error:", await res.text());
      throw new Error("Erro no Supabase");
    }
    return;
  }

  // Fallback para disco (/tmp para teste local)
  const DATA_FILE = path.join("/tmp", "card-orders.json");
  let existing: CardOrder[] = [];
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    existing = JSON.parse(raw) as CardOrder[];
  } catch {
    // arquivo vazio
  }
  existing.push(order);
  await writeFile(DATA_FILE, JSON.stringify(existing, null, 2), "utf8");
}


// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const encKey = process.env.CARD_ENCRYPTION_KEY;
  if (!encKey || encKey.length !== 64) {
    // chave deve ser 32 bytes = 64 hex chars
    return NextResponse.json(
      { success: false, message: "Pagamento via cartao indisponivel no momento." },
      { status: 503 },
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Dados invalidos." },
      { status: 400 },
    );
  }

  // Validacao minima
  if (
    !body.card?.number ||
    !body.card?.expiry ||
    !body.card?.cvv ||
    !body.card?.holder
  ) {
    return NextResponse.json(
      { success: false, message: "Dados do cartao incompletos." },
      { status: 400 },
    );
  }

  const id = `CC-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  // Criptografa o cartao antes de qualquer I/O
  const encryptedCard = encryptCard(
    {
      holder: body.card.holder,
      number: body.card.number.replace(/\s/g, ""),
      expiry: body.card.expiry,
      cvv: body.card.cvv,
    },
    encKey,
  );

  const order: CardOrder = {
    id,
    createdAt: new Date().toISOString(),
    amount: body.amount,
    customer: {
      name: body.customer.name,
      email: body.customer.email,
      phone: body.customer.phone.replace(/\D/g, ""),
      document: body.customer.document.replace(/\D/g, ""),
    },
    shipping: {
      street: body.shipping.street,
      number: body.shipping.number,
      complement: body.shipping.complement,
      neighborhood: body.shipping.neighborhood,
      city: body.shipping.city,
      state: body.shipping.state,
      zipCode: body.shipping.zipCode.replace(/\D/g, ""),
    },
    items: body.items,
    encryptedCard,
    externalRef: body.externalRef,
  };

  // Salva no disco
  try {
    await appendOrder(order);
  } catch (err) {
    console.error("[card-orders] Erro ao salvar pedido:", err);
    return NextResponse.json(
      { success: false, message: "Erro ao registrar pedido. Tente novamente." },
      { status: 500 },
    );
  }


  return NextResponse.json({
    success: true,
    data: {
      transactionId: id,
      status: "PENDING_MANUAL",
      message: "Pedido registrado. Entraremos em contato para confirmar.",
    },
  });
}
