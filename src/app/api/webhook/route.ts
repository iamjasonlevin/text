import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { fromWebhook } from "@/lib/messages";
import { isAllowedSender, clearSendblueCache } from "@/lib/sendblue";
import { upsertMessage } from "@/lib/store";
import type { SendblueWebhookPayload } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function headerSecret(request: Request): string | null {
  const names = [
    "sb-signing-secret",
    "x-webhook-secret",
    "x-sendblue-signature",
    "sb-webhook-secret",
  ];
  for (const name of names) {
    const value = request.headers.get(name);
    if (value) return value;
  }
  return null;
}

function secretsMatch(expected: string, received: string | null): boolean {
  if (!received) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.SENDBLUE_WEBHOOK_SECRET;
  if (expected) {
    if (!secretsMatch(expected, headerSecret(request))) {
      return Response.json({ ok: false }, { status: 401 });
    }
  }

  let payload: SendblueWebhookPayload;
  try {
    payload = (await request.json()) as SendblueWebhookPayload;
  } catch {
    return Response.json({ ok: true });
  }

  if (payload.is_outbound) {
    return Response.json({ ok: true });
  }

  if (!isAllowedSender(payload.from_number || payload.number)) {
    return Response.json({ ok: true });
  }

  const message = fromWebhook(payload);
  if (message) {
    await upsertMessage(message);
    clearSendblueCache();
    revalidateTag("messages", "max");
  }

  return Response.json({ ok: true });
}
