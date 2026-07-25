import { NextResponse } from "next/server";

const API_BASE = "https://api.blackcatoficial.com/api";

type CreatePaymentBody = {
  amount: number;
  items: Array<{
    title: string;
    unitPrice: number;
    quantity: number;
  }>;
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
  externalRef?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.PAYMENT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "Pagamento indisponível no momento." },
      { status: 503 },
    );
  }

  let body: CreatePaymentBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Dados inválidos." },
      { status: 400 },
    );
  }

  const amountCents = Math.round(body.amount * 100);

  const payload = {
    amount: amountCents,
    currency: "BRL",
    paymentMethod: "pix",
    items: body.items.map((item) => ({
      title: item.title,
      unitPrice: Math.round(item.unitPrice * 100),
      quantity: item.quantity,
      tangible: true,
    })),
    customer: {
      name: body.customer.name,
      email: body.customer.email,
      phone: body.customer.phone.replace(/\D/g, ""),
      document: {
        number: body.customer.document.replace(/\D/g, ""),
        type: "cpf",
      },
    },
    shipping: {
      name: body.shipping.name,
      street: body.shipping.street,
      number: body.shipping.number,
      complement: body.shipping.complement ?? "",
      neighborhood: body.shipping.neighborhood,
      city: body.shipping.city,
      state: body.shipping.state,
      zipCode: body.shipping.zipCode.replace(/\D/g, ""),
    },
    pix: { expiresInDays: 1 },
    externalRef: body.externalRef,
    metadata: JSON.stringify({ store: "Pizzaria Bella Napoli" }),
  };

  try {
    const response = await fetch(`${API_BASE}/sales/create-sale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message ?? "Não foi possível gerar o pagamento.",
        },
        { status: response.status || 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionId: data.data.transactionId,
        status: data.data.status,
        amount: data.data.amount,
        paymentData: (() => {
          const pd = data.data.paymentData ?? {};
          const qrCode =
            pd.qrCode ?? pd.qrcode ?? pd.emv ?? pd.pixCopiaECola ?? null;
          const copyPaste =
            pd.copyPaste ??
            pd.copiaCola ??
            pd.pixCopiaECola ??
            pd.qrCode ??
            pd.qrcode ??
            null;
          const qrCodeBase64 =
            pd.qrCodeBase64 ??
            pd.qrcodeBase64 ??
            pd.encodedImage ??
            pd.imagemQrcode ??
            pd.qrCodeImage ??
            null;

          return {
            qrCode,
            qrCodeBase64,
            copyPaste,
          };
        })(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erro ao processar pagamento." },
      { status: 500 },
    );
  }
}
