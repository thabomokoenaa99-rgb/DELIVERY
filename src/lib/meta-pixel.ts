import { products } from "@/data/store";
import {
  identifyTikTok,
  tiktokContents,
  trackTikTok,
  trackTikTokPage,
} from "@/lib/tiktok-pixel";

export const META_PIXEL_ID = "1126611906370348";
export const META_PIXEL_CURRENCY = "BRL";

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded?: boolean;
  version?: string;
  push: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

export type PixelContent = {
  id: string;
  quantity: number;
  item_price: number;
};

export type PixelUserData = {
  email: string;
  phone: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  document?: string;
};

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function money(value: number): number {
  return Math.round(value * 100) / 100;
}

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

function contentsPayload(contents: PixelContent[]) {
  return contents.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    item_price: money(item.item_price),
  }));
}

function categoryFor(contentId: string) {
  return products.find((product) => product.id === contentId)?.category;
}

function sharedCategory(contents: PixelContent[]) {
  const categories = contents.map((item) => categoryFor(item.id));
  if (categories.length === 0 || categories.some((c) => c !== categories[0])) {
    return undefined;
  }
  return categories[0];
}

export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) {
  if (!canTrack()) return;
  try {
    if (options?.eventID) {
      window.fbq!("track", event, params ?? {}, { eventID: options.eventID });
    } else if (params) {
      window.fbq!("track", event, params);
    } else {
      window.fbq!("track", event);
    }
  } catch {
    /* pixel never breaks the app */
  }
}

/** Advanced Matching — hashed automatically by the Meta Pixel. */
export function setPixelUserData(user: PixelUserData) {
  try {
    if (canTrack()) {
      const parts = user.name.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const phoneDigits = digits(user.phone);
      const phone =
        phoneDigits.length >= 10 && !phoneDigits.startsWith("55")
          ? `55${phoneDigits}`
          : phoneDigits;
      const zip = digits(user.zipCode);
      const document = user.document ? digits(user.document) : "";

      window.fbq!("init", META_PIXEL_ID, {
        em: user.email.trim().toLowerCase(),
        ph: phone || undefined,
        fn: parts[0],
        ln: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
        ct: user.city.trim().toLowerCase() || undefined,
        st: user.state.trim().toLowerCase() || undefined,
        zp: zip || undefined,
        country: "br",
        external_id: document || undefined,
      });
    }
  } catch {
    /* pixel never breaks the app */
  }
  return identifyTikTok({
    email: user.email,
    phone: user.phone,
    document: user.document,
  });
}

export function trackPageView() {
  trackPixel("PageView");
  trackTikTokPage();
}

export function trackViewContent(input: {
  contentId: string;
  contentName: string;
  value: number;
  contentCategory?: string;
}) {
  const value = money(input.value);
  trackPixel("ViewContent", {
    content_ids: [input.contentId],
    content_name: input.contentName,
    content_type: "product",
    content_category: input.contentCategory ?? categoryFor(input.contentId),
    value,
    currency: META_PIXEL_CURRENCY,
    contents: [
      {
        id: input.contentId,
        quantity: 1,
        item_price: value,
      },
    ],
  });
  trackTikTok("ViewContent", {
    contents: tiktokContents([
      { id: input.contentId, name: input.contentName, price: value },
    ]),
    value,
  });
}

export function trackAddToCart(input: {
  contentId: string;
  contentName: string;
  value: number;
  quantity?: number;
  contentCategory?: string;
}) {
  const quantity = input.quantity ?? 1;
  const unitPrice = money(input.value);
  trackPixel("AddToCart", {
    content_ids: [input.contentId],
    content_name: input.contentName,
    content_type: "product",
    content_category: input.contentCategory ?? categoryFor(input.contentId),
    value: money(unitPrice * quantity),
    currency: META_PIXEL_CURRENCY,
    num_items: quantity,
    contents: [
      {
        id: input.contentId,
        quantity,
        item_price: unitPrice,
      },
    ],
  });
  trackTikTok("AddToCart", {
    contents: tiktokContents([
      {
        id: input.contentId,
        name: input.contentName,
        quantity,
        price: unitPrice,
      },
    ]),
    value: money(unitPrice * quantity),
  });
}

export function trackInitiateCheckout(input: {
  value: number;
  numItems: number;
  contents: PixelContent[];
}) {
  trackPixel("InitiateCheckout", {
    value: money(input.value),
    currency: META_PIXEL_CURRENCY,
    num_items: input.numItems,
    content_type: "product",
    content_category: sharedCategory(input.contents),
    contents: contentsPayload(input.contents),
    content_ids: input.contents.map((c) => c.id),
  });
  trackTikTok("InitiateCheckout", {
    contents: tiktokContents(input.contents),
    value: input.value,
  });
}

export function trackAddPaymentInfo(input: {
  value: number;
  numItems: number;
  contents: PixelContent[];
}) {
  trackPixel("AddPaymentInfo", {
    value: money(input.value),
    currency: META_PIXEL_CURRENCY,
    num_items: input.numItems,
    content_type: "product",
    content_category: sharedCategory(input.contents),
    contents: contentsPayload(input.contents),
    content_ids: input.contents.map((c) => c.id),
  });
  const contents = tiktokContents(input.contents);
  trackTikTok("AddPaymentInfo", { contents, value: input.value });
  trackTikTok("PlaceAnOrder", { contents, value: input.value });
}

export function trackPurchase(input: {
  value: number;
  numItems: number;
  contents: PixelContent[];
  transactionId: string;
}) {
  trackPixel(
    "Purchase",
    {
      value: money(input.value),
      currency: META_PIXEL_CURRENCY,
      num_items: input.numItems,
      content_type: "product",
      content_category: sharedCategory(input.contents),
      contents: contentsPayload(input.contents),
      content_ids: input.contents.map((c) => c.id),
      order_id: input.transactionId,
    },
    { eventID: input.transactionId },
  );
  trackTikTok("Purchase", {
    contents: tiktokContents(input.contents),
    value: input.value,
    event_id: input.transactionId,
  });
}

const PENDING_PURCHASE_KEY = "pending-purchase";

export type PendingPurchase = {
  value: number;
  numItems: number;
  contents: PixelContent[];
  transactionId: string;
  user: PixelUserData;
};

export function stashPendingPurchase(data: PendingPurchase) {
  try {
    sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(data));
  } catch {
    /* private mode / quota — still redirect */
  }
}

export function consumePendingPurchase(): PendingPurchase | null {
  try {
    const raw = sessionStorage.getItem(PENDING_PURCHASE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingPurchase;
    const doneKey = `purchase-tracked:${data.transactionId}`;
    if (!data.transactionId || sessionStorage.getItem(doneKey)) {
      sessionStorage.removeItem(PENDING_PURCHASE_KEY);
      return null;
    }
    sessionStorage.setItem(doneKey, "1");
    sessionStorage.removeItem(PENDING_PURCHASE_KEY);
    return data;
  } catch {
    return null;
  }
}
