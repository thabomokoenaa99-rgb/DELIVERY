import { NextResponse } from "next/server";
import {
  addressFromViaCep,
  buildAddress,
  digits,
  STATE_LABELS,
  type Address,
  type ViaCep,
} from "@/lib/br-address";

function cityFromNominatim(a: Record<string, string | undefined>): string | null {
  // município first — suburb/district are neighborhoods, not the city
  return a.municipality ?? a.city ?? a.town ?? a.village ?? null;
}

function stateCodeFromNominatim(
  a: Record<string, string | undefined>,
): string | null {
  const iso = a["ISO3166-2-lvl4"];
  if (iso && /^BR-[A-Z]{2}$/i.test(iso)) {
    const code = iso.slice(3).toUpperCase();
    if (STATE_LABELS[code]) return code;
  }

  const found = Object.entries(STATE_LABELS).find(
    ([, label]) => label.toLowerCase() === (a.state ?? "").toLowerCase(),
  );

  return found ? found[0] : null;
}

function isCoordsInBrazil(lat: number, lon: number): boolean {
  return lat >= -35.0 && lat <= 6.0 && lon >= -75.0 && lon <= -34.0;
}

async function lookupCepByStreet(
  state: string,
  city: string,
  street: string,
): Promise<string | null> {
  try {
    const cleanStreet = street
      .replace(/^(rua|av|avenida|travessa|alameda|rodovia|estrada|praça|praca)\.?\s+/i, "")
      .trim();
    if (cleanStreet.length < 3) return null;

    const res = await fetch(
      `https://viacep.com.br/ws/${encodeURIComponent(state)}/${encodeURIComponent(city)}/${encodeURIComponent(cleanStreet)}/json/`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const list = (await res.json()) as ViaCep[];
    if (Array.isArray(list) && list.length > 0 && list[0].cep) {
      const d = digits(list[0].cep);
      if (d.length === 8) return d;
    }
    return null;
  } catch {
    return null;
  }
}

async function locationFromNominatim(
  a: Record<string, string | undefined>,
): Promise<Address | null> {
  // Only accept locations strictly in Brazil
  if (a.country_code?.toLowerCase() !== "br") {
    return null;
  }

  const state = stateCodeFromNominatim(a);
  if (!state || !STATE_LABELS[state]) {
    return null;
  }

  const city = cityFromNominatim(a);
  if (!city) return null;

  const street = a.road ?? a.pedestrian ?? a.footway;
  let zipCode = digits(a.postcode ?? "");
  if (zipCode.length !== 8) {
    zipCode = "";
  }

  // If Nominatim didn't have an 8-digit CEP, try finding it via ViaCEP street search
  if (!zipCode && street) {
    const enriched = await lookupCepByStreet(state, city, street);
    if (enriched) {
      zipCode = enriched;
    }
  }

  return buildAddress({
    city,
    state,
    stateLabel: STATE_LABELS[state] ?? a.state,
    street,
    neighborhood: a.suburb ?? a.neighbourhood ?? a.quarter,
    zipCode: zipCode || undefined,
    number: a.house_number,
  });
}

async function locationFromCoords(
  lat: number,
  lon: number,
): Promise<Address | null> {
  if (!isCoordsInBrazil(lat, lon)) {
    return null;
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "18");
    url.searchParams.set("accept-language", "pt-BR");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "PizzariaBellaNapoli-Delivery/1.0",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      address?: Record<string, string | undefined>;
    };

    const a = data.address;
    if (!a) return null;

    return await locationFromNominatim(a);
  } catch {
    return null;
  }
}

async function locationFromCep(cep: string): Promise<Address | null> {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return addressFromViaCep((await res.json()) as ViaCep);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cep = digits(searchParams.get("cep") ?? "");

  if (cep.length === 8) {
    const detected = await locationFromCep(cep);
    if (!detected) {
      return NextResponse.json({ error: "not_found" }, { status: 422 });
    }
    return NextResponse.json(detected);
  }

  const rawLat = searchParams.get("lat");
  const rawLon = searchParams.get("lon");

  if (!rawLat || !rawLon) {
    return NextResponse.json({ error: "cep_or_coords_required" }, { status: 400 });
  }

  const lat = Number(rawLat);
  const lon = Number(rawLon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "invalid_coords" }, { status: 400 });
  }

  if (!isCoordsInBrazil(lat, lon)) {
    return NextResponse.json(
      { error: "outside_brazil", message: "Localização fora da área de entrega (apenas Brasil)." },
      { status: 422 },
    );
  }

  const detected = await locationFromCoords(lat, lon);
  if (!detected) {
    return NextResponse.json({ error: "not_found" }, { status: 422 });
  }

  return NextResponse.json(detected);
}
