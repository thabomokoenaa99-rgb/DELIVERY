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
  params: { contents: TikTokContent[]; value: number },
) {
  if (!canTrack()) return;
  try {
    window.ttq!.track(event, {
      contents: params.contents,
      value: money(params.value),
      currency: TIKTOK_PIXEL_CURRENCY,
    });
  } catch {
    /* pixel never breaks the app */
  }
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
