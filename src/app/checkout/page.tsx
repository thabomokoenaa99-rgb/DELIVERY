"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatBRL, storeConfig } from "@/data/store";
import { useCart } from "@/lib/cart";
import { useLocation } from "@/lib/location";

type PaymentResult = {
  transactionId: string;
  qrCodeBase64?: string;
  copyPaste?: string;
  expiresAt?: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "SP",
  zipCode: "",
};

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();
  const { displayCity, displayState } = useLocation();
  const [form, setForm] = useState<FormData>({
    ...emptyForm,
    city: displayCity,
    state: displayState,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentResult | null>(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      city: displayCity,
      state: displayState,
    }));
  }, [displayCity, displayState]);

  useEffect(() => {
    if (!payment?.transactionId || paid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${payment.transactionId}`);
        const data = await res.json();
        if (data.success && data.data.status === "PAID") {
          setPaid(true);
          clear();
        }
      } catch {
        /* polling silencioso */
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [payment?.transactionId, paid, clear]);

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          items: items.map((item) => ({
            title: `${item.title} — ${item.details}`,
            unitPrice: item.price,
            quantity: item.quantity,
          })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            document: form.cpf,
          },
          shipping: {
            name: form.name,
            street: form.street,
            number: form.number,
            complement: form.complement,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
          },
          externalRef: `BN-${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message ?? "Erro ao gerar pagamento.");
        return;
      }

      setPayment({
        transactionId: data.data.transactionId,
        qrCodeBase64: data.data.paymentData?.qrCodeBase64,
        copyPaste: data.data.paymentData?.copyPaste,
        expiresAt: data.data.paymentData?.expiresAt,
      });
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPix() {
    if (!payment?.copyPaste) return;
    await navigator.clipboard.writeText(payment.copyPaste);
  }

  if (paid) {
    return (
      <div className="checkout-page">
        <div className="payment-success">
          <h1>Pagamento confirmado!</h1>
          <p>Seu pedido foi recebido e já está sendo preparado.</p>
          <Link href="/" className="btn-primary">
            Voltar ao cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Link href="/" className="back-link">
        VOLTAR
      </Link>
      <h1>Finalizar pedido</h1>
      <p className="checkout-subtitle">{storeConfig.name}</p>

      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : !payment ? (
        <>
          <section className="checkout-section">
            <h2>Seu pedido</h2>
            {items.map((item) => (
              <div key={item.id} className="cart-line">
                <div>
                  <strong>
                    {item.quantity}x {item.title}
                  </strong>
                  <small>{item.details}</small>
                </div>
                <div>
                  <div>{formatBRL(item.price * item.quantity)}</div>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <p className="checkout-total">
              Total: <strong>{formatBRL(total)}</strong>
            </p>
          </section>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Dados para entrega</h2>
            <label>
              Nome completo
              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </label>
            <label>
              Telefone
              <input
                required
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </label>
            <label>
              CPF
              <input
                required
                value={form.cpf}
                onChange={(e) => updateField("cpf", e.target.value)}
                placeholder="000.000.000-00"
              />
            </label>
            <label>
              CEP
              <input
                required
                value={form.zipCode}
                onChange={(e) => updateField("zipCode", e.target.value)}
              />
            </label>
            <label>
              Rua
              <input
                required
                value={form.street}
                onChange={(e) => updateField("street", e.target.value)}
              />
            </label>
            <label>
              Número
              <input
                required
                value={form.number}
                onChange={(e) => updateField("number", e.target.value)}
              />
            </label>
            <label>
              Complemento
              <input
                value={form.complement}
                onChange={(e) => updateField("complement", e.target.value)}
              />
            </label>
            <label>
              Bairro
              <input
                required
                value={form.neighborhood}
                onChange={(e) => updateField("neighborhood", e.target.value)}
              />
            </label>
            <label>
              Cidade
              <input
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </label>
            <label>
              UF
              <input
                required
                maxLength={2}
                value={form.state}
                onChange={(e) => updateField("state", e.target.value.toUpperCase())}
              />
            </label>

            <p className="payment-note">
              Pagamento via <strong>Pix</strong>. Após confirmar, você receberá o QR
              Code para pagar.
            </p>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn-primary btn-block" disabled={loading}>
              {loading ? "Gerando Pix..." : `Pagar ${formatBRL(total)} via Pix`}
            </button>
          </form>
        </>
      ) : (
        <section className="pix-panel">
          <h2>Pague com Pix</h2>
          <p>Escaneie o QR Code ou copie o código abaixo.</p>
          {payment.qrCodeBase64 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={payment.qrCodeBase64}
              alt="QR Code Pix"
              className="pix-qr"
            />
          )}
          {payment.copyPaste && (
            <div className="pix-copy">
              <code>{payment.copyPaste}</code>
              <button type="button" className="btn-primary" onClick={copyPix}>
                Copiar código Pix
              </button>
            </div>
          )}
          <p className="pix-wait">
            Aguardando confirmação do pagamento...
          </p>
          {payment.expiresAt && (
            <p className="muted">
              Válido até {new Date(payment.expiresAt).toLocaleString("pt-BR")}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
