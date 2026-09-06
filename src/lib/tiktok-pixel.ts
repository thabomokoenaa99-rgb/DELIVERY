import { products } from "@/data/store";

export const TIKTOK_PIXEL_ID = "DAEKR63C77UBCVGL39K0";
export const TIKTOK_PIXEL_CURRENCY = "BRL";

type Ttq = {
  identify: (data: Record<string, string>) => void;
  track: (event: string, params?: Record<string, unknown>) => void;
  page: () => void;
};

declare global {
  interface Window {
    ttq?: Ttq;
  }
}

export type TikTokContent = {
  content_id: string;
  content_type: string;
  content_name: string;
};

type TikTokUser = {
  email: string;
  phone: string;
  document?: string;
};

let lastUser: TikTokUser | undefined;

function cookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function clickIds() {
  const fromUrl = new URLSearchParams(window.location.search).get("ttclid");
  if (fromUrl) {
    try {
      sessionStorage.setItem("ttclid", fromUrl);
    } catch {
      /* ignore */
    }
  }
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem("ttclid");
  } catch {
    /* ignore */
  }
  return {
    ttclid: fromUrl || stored || cookie("ttclid") || undefined,
    ttp: cookie("_ttp") || undefined,
  };
}

function sendTikTokServer(payload: {
  event: string;
  event_id: string;
  event_time: number;
  contents: TikTokContent[];
  value: number;
  search_string?: string;
}) {
  if (typeof window === "undefined") return;
  void fetch("/api/tiktok/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      url: window.location.href,
      user: { ...lastUser, ...clickIds() },
    }),
    keepalive: true,
  }).catch(() => {
    /* pixel never breaks the app */
  });
}

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.ttq?.track === "function";
}

function money(value: number): number {
  return Math.round(value * 100) / 100;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

function e164Phone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits.startsWith("55") ? digits : `55${digits}`}`;
}

export function tiktokContents(
  items: { id: string; name?: string }[],
): TikTokContent[] {
  return items.map((item) => ({
    content_id: item.id,
    content_type: "product",
    content_name:
      item.name ?? products.find((p) => p.id === item.id)?.title ?? item.id,
  }));
}

export async function identifyTikTok(user: {
  email: string;
  phone: string;
  document?: string;
}) {
  lastUser = user;
  if (typeof window === "undefined" || typeof window.ttq?.identify !== "function") {
    return;
  }
  try {
    const payload: Record<string, string> = {};
    const email = user.email.trim().toLowerCase();
    const phone = e164Phone(user.phone);
    const externalId = user.document?.replace(/\D/g, "") ?? "";
    if (email) payload.email = await sha256(email);
    if (phone) payload.phone_number = await sha256(phone);
    if (externalId) payload.external_id = await sha256(externalId);
    if (Object.keys(payload).length === 0) return;
    window.ttq.identify(payload);
  } catch {
    /* pixel never breaks the app */
  }
}

export function trackTikTok(
  event: string,
  params: {
    contents: TikTokContent[];
    value: number;
    search_string?: string;
    event_id?: string;
  },
) {
  if (typeof window === "undefined") return;
  const event_id = params.event_id ?? crypto.randomUUID();
  const event_time = Math.floor(Date.now() / 1000);
  const contents = params.contents;
  const first = contents[0];
  const payload: Record<string, unknown> = {
    contents,
    value: money(params.value),
    currency: TIKTOK_PIXEL_CURRENCY,
    content_id:
      contents.length <= 1
        ? first?.content_id
        : contents.map((item) => item.content_id),
    content_type: first?.content_type ?? "product",
    content_name: contents
      .map((item) => item.content_name)
      .filter(Boolean)
      .join(", "),
    event_id,
    event_time,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  };
  if (params.search_string) payload.search_string = params.search_string;
  try {
    if (canTrack()) window.ttq!.track(event, payload);
  } catch {
    /* pixel never breaks the app */
  }
  sendTikTokServer({
    event,
    event_id,
    event_time,
    contents,
    value: params.value,
    search_string: params.search_string,
  });
}

let searchTimer: ReturnType<typeof setTimeout> | undefined;

export function trackTikTokSearch(input: {
  search_string: string;
  contentId: string;
  contentName: string;
  value: number;
}) {
  const search_string = input.search_string.trim();
  clearTimeout(searchTimer);
  if (search_string.length < 2) return;
  searchTimer = setTimeout(() => {
    trackTikTok("Search", {
      contents: tiktokContents([
        { id: input.contentId, name: input.contentName },
      ]),
      value: input.value,
      search_string,
    });
  }, 600);
}

export function trackTikTokPage() {
  if (typeof window === "undefined" || typeof window.ttq?.page !== "function") {
    return;
  }
  try {
    window.ttq.page();
  } catch {
    /* pixel never breaks the app */
  }
}
