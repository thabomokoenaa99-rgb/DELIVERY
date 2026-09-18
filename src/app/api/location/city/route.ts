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
  if (iso && /^BR-[A-Z]{2}$/i.test(iso)) return iso.slice(3).toUpperCase();

  return (
    Object.entries(STATE_LABELS).find(
      ([, label]) => label.toLowerCase() === (a.state ?? "").toLowerCase(),
    )?.[0] ?? null
  );
}

function locationFromNominatim(
  a: Record<string, string | undefined>,
): Address | null {
  return buildAddress({
    city: cityFromNominatim(a),
    state: stateCodeFromNominatim(a),
    stateLabel: a.state,
    street: a.road ?? a.pedestrian ?? a.footway,
    neighborhood: a.suburb ?? a.neighbourhood ?? a.quarter,
    zipCode: a.postcode,
    number: a.house_number,
  });
}

async function locationFromCoords(
  lat: number,
  lon: number,
): Promise<Address | null> {
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

    return locationFromNominatim(a);
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

  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "cep_or_coords_required" }, { status: 400 });
  }

  const detected = await locationFromCoords(lat, lon);
  if (!detected) {
    return NextResponse.json({ error: "not_found" }, { status: 422 });
  }

  return NextResponse.json(detected);
}
