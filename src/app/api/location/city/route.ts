import { NextResponse } from "next/server";

type DetectedLocation = {
  state: string;
  stateLabel: string;
  city: string;
};

const DEFAULT: DetectedLocation = {
  state: "SP",
  stateLabel: "São Paulo",
  city: "São Paulo",
};

const STATE_LABELS: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

function normalizeCity(city: string): string {
  const trimmed = city.trim();
  if (!trimmed) return DEFAULT.city;
  if (/^sao paulo$/i.test(trimmed)) return "São Paulo";
  if (/^rio de janeiro$/i.test(trimmed)) return "Rio de Janeiro";
  return trimmed;
}

function buildLocation(
  city?: string | null,
  stateCode?: string | null,
  stateLabel?: string | null,
): DetectedLocation | null {
  const cityName = city?.trim();
  if (!cityName) return null;

  const code = (stateCode ?? "SP").toUpperCase();
  return {
    state: STATE_LABELS[code] ? code : "SP",
    stateLabel:
      STATE_LABELS[code] ??
      stateLabel?.trim() ??
      DEFAULT.stateLabel,
    city: normalizeCity(cityName),
  };
}

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

async function locationFromCoords(
  lat: number,
  lon: number,
): Promise<DetectedLocation | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "10");
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

    return buildLocation(cityFromNominatim(a), stateCodeFromNominatim(a), a.state);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "coords_required" }, { status: 400 });
  }

  const detected = await locationFromCoords(lat, lon);
  if (!detected) {
    return NextResponse.json({ error: "not_found" }, { status: 422 });
  }

  return NextResponse.json(detected);
}
