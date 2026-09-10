"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { trackViewContent } from "@/lib/meta-pixel";
import { trackTikTokSearch } from "@/lib/tiktok-pixel";
import { beerBottles1L, beerCans350, wines } from "@/data/beverages";
import { dessertFlavors, dessertPreferences } from "@/data/dessert-flavors";
import { individualFlavors } from "@/data/individual-flavors";
import { formatBRL, type Product } from "@/data/store";

type Props = {
  product: Product;
  onClose?: () => void;
};

function catalog(category: string) {
  if (category === "sobremesa") {
    return {
      searchPlaceholder: "Ex: brigadeiro, oreo, banana",
      searchLabel: "Buscar sabor",
      preference: {
        title: "Escolha sua preferência",
        hint: "Escolha pelo menos 1 e no máximo 1 opção.",
        options: dessertPreferences,
      },
      flavorTitle: "Escolha os sabores",
      flavorHint: "Escolha pelo menos 1 e no máximo 2 opções.",
      flavorMax: 2,
      flavors: dessertFlavors,
      itemLabel: "Sabor",
    };
  }
  if (category === "cerveja-lata") {
    return {
      searchPlaceholder: "Ex: heineken, skol, brahma",
      searchLabel: "Buscar marca",
      preference: null,
      flavorTitle: "Cerveja variada — 350ml",
      flavorHint: "Escolha 1 opção",
      flavorMax: 1,
      flavors: beerCans350,
      itemLabel: "Marca",
    };
  }
  if (category === "cerveja-litro") {
    return {
      searchPlaceholder: "Ex: original, brahma, heineken",
      searchLabel: "Buscar marca",
      preference: null,
      flavorTitle: "Cerveja variada — 1 litro",
      flavorHint: "Escolha 1 opção",
      flavorMax: 1,
      flavors: beerBottles1L,
      itemLabel: "Marca",
    };
  }
  if (category === "vinho") {
    return {
      searchPlaceholder: "Ex: pérgola, almadén, casillero",
      searchLabel: "Buscar vinho",
      preference: null,
      flavorTitle: "Escolha o vinho",
      flavorHint: "Escolha 1 opção",
      flavorMax: 1,
      flavors: wines,
      itemLabel: "Vinho",
    };
  }
  return {
    searchPlaceholder: "Ex: calabresa, frango, quatro queijos",
    searchLabel: "Buscar sabor",
    preference: null,
    flavorTitle: "Escolha o sabor:",
    flavorHint: "Escolha 1 opção",
    flavorMax: 1,
    flavors: individualFlavors,
    itemLabel: "Sabor",
  };
}

export function FlavorModal({ product, onClose }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const cfg = catalog(product.category);
  const [query, setQuery] = useState("");
  const [prefId, setPrefId] = useState("");
  const [flavorIds, setFlavorIds] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    trackViewContent({
      contentId: product.id,
      contentName: product.title,
      value: product.price,
      contentCategory: product.category,
    });
  }, [product.id, product.title, product.price, product.category]);

  useEffect(() => {
    trackTikTokSearch({
      search_string: query,
      contentId: product.id,
      contentName: product.title,
      value: product.price,
    });
  }, [query, product.id, product.title, product.price]);

  const flavors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cfg.flavors;
    return cfg.flavors.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q),
    );
  }, [cfg.flavors, query]);

  const selectedFlavors = flavorIds
    .map((id) => cfg.flavors.find((f) => f.id === id))
    .filter((f) => f != null);
  const pref = cfg.preference?.options.find((o) => o.id === prefId);
  const price = selectedFlavors.length
    ? Math.max(...selectedFlavors.map((f) => f.price))
    : 0;
  const ready =
    (!cfg.preference || Boolean(prefId)) &&
    flavorIds.length >= 1 &&
    flavorIds.length <= cfg.flavorMax;

  function close() {
    if (onClose) onClose();
    else router.push("/");
  }

  function toggleFlavor(id: string) {
    setFlavorIds((prev) => {
      if (cfg.flavorMax === 1) return [id];
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= cfg.flavorMax) return prev;
      return [...prev, id];
    });
  }

  function add() {
    if (!ready) return;
    addItem({
      productId: product.id,
      title: `${product.title} — ${selectedFlavors.map((f) => f.name).join(" / ")}`,
      price,
      quantity: 1,
      details: [
        pref ? `Preferência: ${pref.name}` : null,
        `${cfg.itemLabel}: ${selectedFlavors.map((f) => f.name).join(" / ")}`,
        `Preço: ${formatBRL(price)}`,
        note ? `Obs: ${note}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
    });
    router.push("/checkout");
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card flavor-modal">
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="flavor-modal-scroll">
          <div className="flavor-modal-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className={product.imageContain ? "photo-contain" : undefined}
            />
            <h2>{product.title}</h2>
            <p>{product.subtitle}</p>
          </div>

          {cfg.preference && (
            <section className="option-group">
              <h3>{cfg.preference.title}</h3>
              <p className="option-hint">
                {cfg.preference.hint} <span>{prefId ? 1 : 0}/1</span>
              </p>
              <div className="option-list">
                {cfg.preference.options.map((opt) => {
                  const checked = opt.id === prefId;
                  return (
                    <label
                      key={opt.id}
                      className={`option-row ${checked ? "checked" : ""}`}
                    >
                      <input
                        type="radio"
                        name="preference"
                        checked={checked}
                        onChange={() => setPrefId(opt.id)}
                      />
                      <div>
                        <strong>{opt.name}</strong>
                        <span>{opt.description}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          )}

          <label className="flavor-search">
            {cfg.searchLabel}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={cfg.searchPlaceholder}
            />
          </label>

          <section className="option-group">
            <h3>{cfg.flavorTitle}</h3>
            <p className="option-hint">
              {cfg.flavorHint}{" "}
              <span>
                {flavorIds.length}/{cfg.flavorMax}
              </span>
            </p>
            <div className="option-list">
              {flavors.map((opt) => {
                const checked = flavorIds.includes(opt.id);
                const disabled =
                  !checked && flavorIds.length >= cfg.flavorMax && cfg.flavorMax > 1;
                return (
                  <label
                    key={opt.id}
                    className={`option-row ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}`}
                  >
                    <input
                      type={cfg.flavorMax === 1 ? "radio" : "checkbox"}
                      name="flavors"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleFlavor(opt.id)}
                    />
                    <div>
                      <strong>{opt.name}</strong>
                      <span>{opt.description}</span>
                    </div>
                    <em>{formatBRL(opt.price)}</em>
                  </label>
                );
              })}
              {flavors.length === 0 && (
                <p className="muted">Nenhuma opção encontrada.</p>
              )}
            </div>
          </section>

          <label className="note-field">
            Observações do item
            <textarea
              maxLength={140}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Observação do pedido"
            />
            <small>{note.length}/140</small>
          </label>
        </div>

        <div className="flavor-modal-footer">
          <span>{formatBRL(ready ? price : 0)}</span>
          <button type="button" disabled={!ready} onClick={add}>
            ADICIONAR • {formatBRL(ready ? price : 0)}
          </button>
        </div>
      </div>
    </div>
  );
}
