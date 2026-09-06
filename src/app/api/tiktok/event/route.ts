import { NextResponse } from "next/server";
import { sendTikTokEvent, type TikTokServerEvent } from "@/lib/tiktok-events";

export async function POST(request: Request) {
  let body: TikTokServerEvent;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    undefined;

  await sendTikTokEvent({
    ...body,
    user: {
      ...body.user,
      ip,
      user_agent: request.headers.get("user-agent") || undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
