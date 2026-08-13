"use client";

import { useCart } from "@/lib/cart";
import { trackViewContent } from "@/lib/meta-pixel";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { individualFlavors } from "@/data/individual-flavors";
import {
  borders,
  drinks,
  formatBRL,
  getOptionLabel,
  type Product,
} from "@/data/store";

type Props = { product: Product };

function OptionGroup({
  title,
  hint,
  max,
  options,
  selected,
  onToggle,
  strong,
  ref,
}: {
  title: string;
  hint: string;
  max: number;
  options: { id: string; name: string; description: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  strong?: boolean;
  ref?: React.Ref<HTMLElement>;
}) {
  return (
    <section
      ref={ref}
      className={`option-group${strong ? " option-group-strong" : ""}`}
    >
      <h3>{title}</h3>
      <p className="option-hint">
        {hint}{" "}
        <span>
          {selected.length}/{max}
        </span>
      </p>
      <div className="option-list">
        {options.map((opt) => {
          const checked = selected.includes(opt.id);
          const disabled = !checked && selected.length >= max;
          return (
            <label
              key={opt.id}
              className={`option-row ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(opt.id)}
              />
              <div>
                <strong>{opt.name}</strong>
                <span>{opt.description}</span>
              </div>
              <em>0,00</em>
            </label>
          );
        })}
      </div>
    </section>
  );
}

export function ProductConfigurator({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [pizza1, setPizza1] = useState<string[]>([]);
  const [pizza2, setPizza2] = useState<string[]>([]);
  const [border, setBorder] = useState<string[]>([]);
  const [drink, setDrink] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [flavorQuery, setFlavorQuery] = useState("");
  const pizza2Ref = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLElement>(null);

  function scrollTo(el: HTMLElement | null) {
    requestAnimationFrame(() =>
      el?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  const savoryFlavors = useMemo(() => {
    const q = flavorQuery.trim().toLowerCase();
    if (!q) return individualFlavors;
    return individualFlavors.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q),
    );
  }, [flavorQuery]);

  const isSimple = Boolean(product.simple);
  const hasDiscount =
    typeof product.priceFrom === "number" && product.priceFrom > product.price;

  useEffect(() => {
    trackViewContent({
      contentId: product.id,
      contentName: product.title,
      value: product.price,
    });
  }, [product.id, product.title, product.price]);

  const ready = useMemo(() => {
    if (isSimple) return true;
    const pizzasOk =
      pizza1.length > 0 && (product.pizzaCount < 2 || pizza2.length > 0);
    const drinksOk = drink.length >= Math.min(product.drinkCount, 1);
    return pizzasOk && drinksOk;
  }, [
    isSimple,
    pizza1,
    pizza2,
    drink,
    product.pizzaCount,
    product.drinkCount,
  ]);

  function toggle(
    list: string[],
    setList: (v: string[]) => void,
    id: string,
    max: number,
  ) {
    if (list.includes(id)) setList(list.filter((x) => x !== id));
    else if (list.length < max) setList([...list, id]);
  }

  function finish() {
    if (!ready) return;

    const details = isSimple
      ? [product.subtitle, note ? `Obs: ${note}` : null]
          .filter(Boolean)
          .join(" | ")
      : [
          `Pizza 1: ${getOptionLabel(individualFlavors, pizza1)}`,
          product.pizzaCount > 1
            ? `Pizza 2: ${getOptionLabel(individualFlavors, pizza2)}`
            : null,
          border.length ? `Borda: ${getOptionLabel(borders, border)}` : null,
          `Bebida: ${getOptionLabel(drinks, drink)}`,
          note ? `Obs: ${note}` : null,
        ]
          .filter(Boolean)
          .join(" | ");

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      details,
    });
    router.push("/checkout");
  }

  return (
    <div className="product-page">
      <Link href="/" className="back-link">
        VOLTAR
      </Link>

      <div className="product-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} />
        <h2>{product.title}</h2>
        <p>{product.subtitle}</p>
        {hasDiscount ? (
          <p className="price-line">
            de <span className="price-from">{formatBRL(product.priceFrom!)}</span>{" "}
            por <b className="price-pill">{formatBRL(product.price)}</b>
          </p>
        ) : (
          <p className="price-line">
            <b className="price-pill">{formatBRL(product.price)}</b>
          </p>
        )}
        {product.stock != null && (
          <p className="stock-inline">
            🔥 Apenas {product.stock} combo(s) com esse preço especial
          </p>
        )}
      </div>

      {!isSimple && (
        <>
          <label className="flavor-search">
            Buscar sabor
            <input
              type="search"
              value={flavorQuery}
              onChange={(e) => setFlavorQuery(e.target.value)}
              placeholder="Ex: calabresa, frango, quatro queijos"
            />
          </label>

          <OptionGroup
            title="Primeira Pizza — Meio a Meio:"
            hint="Escolha até 2 opções"
            max={2}
            options={savoryFlavors}
            selected={pizza1}
            strong
            onToggle={(id) => {
              const addingFirst = !pizza1.includes(id) && pizza1.length === 0;
              toggle(pizza1, setPizza1, id, 2);
              if (addingFirst && product.pizzaCount > 1) scrollTo(pizza2Ref.current);
            }}
          />

          {product.pizzaCount > 1 && (
            <OptionGroup
              ref={pizza2Ref}
              title="Segunda Pizza — Meio a Meio:"
              hint="Escolha até 2 opções"
              max={2}
              options={savoryFlavors}
              selected={pizza2}
              strong
              onToggle={(id) => {
                const addingFirst = !pizza2.includes(id) && pizza2.length === 0;
                toggle(pizza2, setPizza2, id, 2);
                if (addingFirst && product.borderMax > 0) scrollTo(borderRef.current);
              }}
            />
          )}

          {product.borderMax > 0 && (
            <OptionGroup
              ref={borderRef}
              title="Borda Recheada:"
              hint={`Escolha até ${product.borderMax} opções`}
              max={product.borderMax}
              options={borders}
              selected={border}
              strong
              onToggle={(id) =>
                toggle(border, setBorder, id, product.borderMax)
              }
            />
          )}

          {product.drinkCount > 0 && (
            <OptionGroup
              title="Escolha seu refrigerante:"
              hint={`Escolha até ${Math.min(product.drinkCount, 1)} opção`}
              max={Math.min(product.drinkCount, 1) || 1}
              options={drinks}
              selected={drink}
              onToggle={(id) =>
                toggle(
                  drink,
                  setDrink,
                  id,
                  Math.min(product.drinkCount, 1) || 1,
                )
              }
            />
          )}
        </>
      )}

      <label className="note-field">
        Adicionar algum detalhe?
        <textarea
          maxLength={140}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Observação do pedido"
        />
        <small>{note.length}/140</small>
      </label>

      <div className="sticky-bar">
        <span>{formatBRL(ready ? product.price : 0)}</span>
        <button type="button" disabled={!ready} onClick={finish}>
          FINALIZAR PEDIDO
        </button>
      </div>
    </div>
  );
}
