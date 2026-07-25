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

function clientIp(request: Request): string | null {
  const headers = [
    "cf-connecting-ip",
    "x-real-ip",
    "x-forwarded-for",
    "x-vercel-forwarded-for",
  ];

  for (const name of headers) {
    const raw = request.headers.get(name);
    if (!raw) continue;
    const ip = raw.split(",")[0]?.trim();
    if (!ip) continue;
    if (ip === "::1" || ip === "127.0.0.1") continue;
    return ip;
  }

  return null;
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

    const city =
      a.city ??
      a.town ??
      a.municipality ??
      a.village ??
      a.suburb ??
      a.city_district ??
      null;

    const stateCode =
      Object.entries(STATE_LABELS).find(
        ([, label]) =>
          label.toLowerCase() === (a.state ?? "").toLowerCase(),
      )?.[0] ?? null;

    return buildLocation(city, stateCode, a.state);
  } catch {
    return null;
  }
}

async function locationFromIpWhoIs(
  ip: string | null,
): Promise<DetectedLocation | null> {
  try {
    const url = ip
      ? `https://ipwho.is/${encodeURIComponent(ip)}`
      : "https://ipwho.is/";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      success?: boolean;
      city?: string;
      region_code?: string;
      region?: string;
      country_code?: string;
    };

    if (data.success === false) return null;
    if (data.country_code && data.country_code !== "BR") {
      return buildLocation(data.city ?? DEFAULT.city, "SP", DEFAULT.stateLabel);
    }

    return buildLocation(data.city, data.region_code, data.region);
  } catch {
    return null;
  }
}

async function locationFromIpApi(
  ip: string | null,
): Promise<DetectedLocation | null> {
  try {
    const url = ip
      ? `https://ipapi.co/${encodeURIComponent(ip)}/json/`
      : "https://ipapi.co/json/";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      city?: string;
      region_code?: string;
      region?: string;
      country_code?: string;
      error?: boolean;
    };

    if (data.error) return null;
    if (data.country_code && data.country_code !== "BR") {
      return buildLocation(data.city ?? DEFAULT.city, "SP", DEFAULT.stateLabel);
    }

    return buildLocation(data.city, data.region_code, data.region);
  } catch {
    return null;
  }
}

async function locationFromIp(
  request: Request,
): Promise<DetectedLocation | null> {
  const ip = clientIp(request);
  return (
    (await locationFromIpWhoIs(ip)) ?? (await locationFromIpApi(ip))
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  let detected: DetectedLocation | null = null;

  if (latParam && lonParam) {
    const lat = Number(latParam);
    const lon = Number(lonParam);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      detected = await locationFromCoords(lat, lon);
    }
  }

  if (!detected) {
    detected = await locationFromIp(request);
  }

  return NextResponse.json(detected ?? DEFAULT);
}
