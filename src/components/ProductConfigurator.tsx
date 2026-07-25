"use client";

import { useCart } from "@/lib/cart";
import { trackViewContent } from "@/lib/meta-pixel";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  borders,
  drinks,
  flavors,
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
}: {
  title: string;
  hint: string;
  max: number;
  options: { id: string; name: string; description: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="option-group">
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
          `Pizza 1: ${getOptionLabel(flavors, pizza1)}`,
          product.pizzaCount > 1
            ? `Pizza 2: ${getOptionLabel(flavors, pizza2)}`
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
          <OptionGroup
            title="Primeira Pizza — Meio a Meio:"
            hint="Escolha até 2 opções"
            max={2}
            options={flavors}
            selected={pizza1}
            onToggle={(id) => toggle(pizza1, setPizza1, id, 2)}
          />

          {product.pizzaCount > 1 && (
            <OptionGroup
              title="Segunda Pizza — Meio a Meio:"
              hint="Escolha até 2 opções"
              max={2}
              options={flavors}
              selected={pizza2}
              onToggle={(id) => toggle(pizza2, setPizza2, id, 2)}
            />
          )}

          {product.borderMax > 0 && (
            <OptionGroup
              title="Borda Recheada:"
              hint={`Escolha até ${product.borderMax} opções`}
              max={product.borderMax}
              options={borders}
              selected={border}
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
