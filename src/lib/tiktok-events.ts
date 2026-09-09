import { createHash } from "node:crypto";
import { TIKTOK_PIXEL_ID, TIKTOK_PIXEL_CURRENCY } from "@/lib/tiktok-pixel";

const ALLOWED = new Set([
  "ViewContent",
  "Search",
  "AddToCart",
  "InitiateCheckout",
  "AddPaymentInfo",
  "PlaceAnOrder",
  "Purchase",
]);

export type TikTokServerEvent = {
  event: string;
  event_id: string;
  event_time?: number;
  url?: string;
  contents?: Array<{
    content_id: string;
    content_type: string;
    content_name: string;
    quantity?: number;
    price?: number;
  }>;
  value?: number;
  search_string?: string;
  user?: {
    email?: string;
    phone?: string;
    document?: string;
    ip?: string;
    user_agent?: string;
    ttclid?: string;
    ttp?: string;
  };
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function e164Phone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits.startsWith("55") ? digits : `55${digits}`}`;
}

export async function sendTikTokEvent(input: TikTokServerEvent) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token || !ALLOWED.has(input.event) || !input.event_id) return;

  const user: Record<string, string> = {};
  const email = input.user?.email?.trim().toLowerCase() ?? "";
  const phone = input.user?.phone ? e164Phone(input.user.phone) : "";
  const externalId = input.user?.document?.replace(/\D/g, "") ?? "";
  if (email) user.email = sha256(email);
  if (phone) user.phone = sha256(phone);
  if (externalId) user.external_id = sha256(externalId);
  if (input.user?.ip) user.ip = input.user.ip;
  if (input.user?.user_agent) user.user_agent = input.user.user_agent;
  if (input.user?.ttclid) user.ttclid = input.user.ttclid;
  if (input.user?.ttp) user.ttp = input.user.ttp;

  const contents = input.contents ?? [];
  const first = contents[0];
  const properties: Record<string, unknown> = {
    currency: TIKTOK_PIXEL_CURRENCY,
  };
  if (typeof input.value === "number") {
    properties.value = Math.round(input.value * 100) / 100;
  }
  if (contents.length > 0) {
    properties.contents = contents;
    properties.content_id =
      contents.length === 1
        ? first.content_id
        : contents.map((item) => item.content_id);
    properties.content_type = first.content_type;
    properties.content_name = contents
      .map((item) => item.content_name)
      .filter(Boolean)
      .join(", ");
  }
  if (input.search_string) properties.search_string = input.search_string;

  try {
    await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_source: "web",
        event_source_id: TIKTOK_PIXEL_ID,
        data: [
          {
            event: input.event,
            event_time: input.event_time ?? Math.floor(Date.now() / 1000),
            event_id: input.event_id,
            user,
            properties,
            page: input.url ? { url: input.url } : undefined,
          },
        ],
      }),
    });
  } catch {
    /* pixel never breaks the app */
  }
}
