"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  consumePendingPurchase,
  setPixelUserData,
  trackPurchase,
  type PendingPurchase,
} from "@/lib/meta-pixel";
import { isDominosProductId, dominosStore } from "@/data/dominos";
import { storeConfig, formatBRL } from "@/data/store";

export default function ObrigadoPage() {
  const [purchase, setPurchase] = useState<PendingPurchase | null>(null);
  const [isDominos, setIsDominos] = useState(true);

  useEffect(() => {
    const pending = consumePendingPurchase();
    if (pending) {
      setPurchase(pending);
      const dom = pending.contents?.some((c) => isDominosProductId(c.id));
      if (dom !== undefined) {
        setIsDominos(dom);
      }
      void setPixelUserData(pending.user).then(() => {
        trackPurchase({
          value: pending.value,
          numItems: pending.numItems,
          contents: pending.contents,
          transactionId: pending.transactionId,
        });
      });
    } else {
      if (typeof document !== "undefined" && document.referrer.includes("dominos")) {
        setIsDominos(true);
      }
    }
  }, []);

  const store = isDominos ? dominosStore : storeConfig;
  const menuHref = isDominos ? "/dominos" : "/";
  const orderRef = purchase?.transactionId ? purchase.transactionId.slice(-6).toUpperCase() : "";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between text-zinc-800 antialiased selection:bg-red-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="bg-white border-b border-zinc-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <Link href={menuHref} className="flex items-center gap-2.5 active:opacity-75 transition-opacity">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-100 border border-zinc-200">
            <Image
              src={isDominos ? "/images/dominos/logo.svg" : "/images/logo.png"}
              alt={store.name}
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-900">{store.name}</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Confirmado
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full flex flex-col gap-5">
        {/* Success Header */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 mx-auto mb-3.5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm ring-8 ring-emerald-50/80 animate-in fade-in zoom-in duration-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Pagamento Confirmado!
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Seu pedido foi registrado com sucesso e já está sendo preparado com muito carinho.
          </p>
        </div>

        {/* Motoboy Delivery Animated Showcase */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-4 flex flex-col items-center text-center">
          {/* Status Chip */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-100 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5 font-medium text-zinc-700">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Previsão de Entrega</span>
            </div>
            <span className="font-bold text-zinc-900 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[11px]">
              20 a 30 min
            </span>
          </div>

          {/* Motoboy GIF */}
          <div className="relative my-3 w-full flex flex-col items-center justify-center">
            <div className="relative w-56 h-48 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/motoboy.gif"
                alt="Entregador a caminho"
                className="max-w-full max-h-full object-contain filter drop-shadow-sm select-none"
              />
            </div>

            {/* Asphalt motion bar simulation */}
            <div className="w-4/5 h-1.5 bg-zinc-200 rounded-full overflow-hidden mt-1 relative">
              <div className="w-1/3 h-full bg-emerald-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-500 mt-2">
              🏍️ Entregador a caminho da sua casa
            </span>
          </div>

          {/* Steps Timeline */}
          <div className="w-full pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="font-semibold text-zinc-800">Confirmado</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                🔥
              </div>
              <span className="font-semibold text-amber-700">No Forno</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-70">
              <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold">
                🛵
              </div>
              <span className="text-zinc-500">A Caminho</span>
            </div>
          </div>
        </div>

        {/* Order Details Card (When available) */}
        {purchase && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between font-semibold pb-2 border-b border-zinc-100 text-zinc-700">
              <span>Resumo do Pedido</span>
              {orderRef && (
                <span className="font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded text-[11px]">
                  #{orderRef}
                </span>
              )}
            </div>

            <div className="flex justify-between text-zinc-600">
              <span>Itens:</span>
              <span className="font-medium text-zinc-800">{purchase.numItems} item(ns)</span>
            </div>

            <div className="flex justify-between text-zinc-600">
              <span>Total:</span>
              <span className="font-bold text-zinc-900 text-sm">{formatBRL(purchase.value)}</span>
            </div>

            {(purchase.user?.city || purchase.user?.name) && (
              <div className="pt-2 border-t border-zinc-100 text-zinc-500 text-[11px] leading-snug">
                {purchase.user.name && (
                  <span className="font-medium text-zinc-700 block mb-0.5">
                    Cliente: {purchase.user.name}
                  </span>
                )}
                {purchase.user.city && (
                  <span>
                    Entrega em {purchase.user.city}
                    {purchase.user.state ? ` - ${purchase.user.state}` : ""}
                    {purchase.user.zipCode ? ` (CEP ${purchase.user.zipCode})` : ""}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Separated Action Buttons (Optimized Mobile Proportions) */}
        <div className="flex flex-col gap-3 pt-2">
          {/* Apenas Voltar ao Menu */}

          {/* Secondary Action Button: Back to Menu */}
          <Link
            href={menuHref}
            className="w-full h-12 px-5 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.98] transition-all text-zinc-700 font-semibold flex items-center justify-center gap-2 border border-zinc-200 text-xs shadow-2xs"
          >
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar ao Cardápio</span>
          </Link>
        </div>
      </main>

      {/* Footer reassurance */}
      <footer className="px-4 py-4 text-center text-[11px] text-zinc-600 border-t border-zinc-200/60 bg-white">
        Precisa de suporte? Fale com a nossa equipe pelo WhatsApp a qualquer momento.
      </footer>
    </div>
  );
}
