import { NextResponse } from "next/server";

const API_BASE = "https://api.blackcatoficial.com/api";

type Params = { params: Promise<{ transactionId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const apiKey = process.env.PAYMENT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "Pagamento indisponível." },
      { status: 503 },
    );
  }

  const { transactionId } = await params;

  try {
    const response = await fetch(
      `${API_BASE}/sales/${encodeURIComponent(transactionId)}/status`,
      {
        headers: { "X-API-Key": apiKey },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message ?? "Transação não encontrada." },
        { status: response.status || 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionId: data.data.transactionId,
        status: data.data.status,
        paidAt: data.data.paidAt,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erro ao consultar pagamento." },
      { status: 500 },
    );
  }
}
