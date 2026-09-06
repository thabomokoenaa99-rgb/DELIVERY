import Link from "next/link";

export default function ObrigadoPage() {
  return (
    <div className="checkout-page">
      <div className="payment-success">
        <h1>Pagamento confirmado!</h1>
        <p>Seu pedido foi recebido e já está sendo preparado.</p>
        <p className="delivery-eta">
          Tempo estimado de entrega: <strong>entre 20 e 30 minutos</strong>
        </p>
        <Link href="/" className="btn-primary">
          Voltar ao cardápio
        </Link>
      </div>
    </div>
  );
}
