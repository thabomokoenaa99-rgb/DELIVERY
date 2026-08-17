export const META_PIXEL_ID = "1623748192690708";

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

function canTrack(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
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

export function trackPageView() {
  trackPixel("PageView");
}

export function trackViewContent(input: {
  contentId: string;
  contentName: string;
  value: number;
}) {
  trackPixel("ViewContent", {
    content_ids: [input.contentId],
    content_name: input.contentName,
    content_type: "product",
    value: input.value,
    currency: "BRL",
  });
}

export function trackAddToCart(input: {
  contentId: string;
  contentName: string;
  value: number;
  quantity?: number;
}) {
  trackPixel("AddToCart", {
    content_ids: [input.contentId],
    content_name: input.contentName,
    content_type: "product",
    value: input.value,
    currency: "BRL",
    contents: [
      {
        id: input.contentId,
        quantity: input.quantity ?? 1,
        item_price: input.value,
      },
    ],
  });
}

export function trackInitiateCheckout(input: {
  value: number;
  numItems: number;
  contents: PixelContent[];
}) {
  trackPixel("InitiateCheckout", {
    value: input.value,
    currency: "BRL",
    num_items: input.numItems,
    content_type: "product",
    contents: input.contents,
    content_ids: input.contents.map((c) => c.id),
  });
}

export function trackAddPaymentInfo(input: {
  value: number;
  numItems: number;
}) {
  trackPixel("AddPaymentInfo", {
    value: input.value,
    currency: "BRL",
    num_items: input.numItems,
    content_type: "product",
  });
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
      value: input.value,
      currency: "BRL",
      num_items: input.numItems,
      content_type: "product",
      contents: input.contents,
      content_ids: input.contents.map((c) => c.id),
      order_id: input.transactionId,
    },
    { eventID: input.transactionId },
  );
}
