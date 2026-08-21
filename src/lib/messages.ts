import { mediaKind } from "./format";
import { fetchSendblueMessages, isAllowedSender } from "./sendblue";
import { loadStoredMessages } from "./store";
import type { PublicMessage, SendblueWebhookPayload, StoredMessage } from "./types";

function normalizeMedia(url: string | null | undefined): string | null {
  if (!url || !url.trim() || url === "null") return null;
  return url.trim();
}

export function fromWebhook(payload: SendblueWebhookPayload): StoredMessage | null {
  const id = payload.message_handle?.trim();
  if (!id) return null;

  const text = payload.content?.trim() ?? "";
  const mediaUrl = normalizeMedia(payload.media_url);
  if (!text && !mediaUrl) return null;

  return {
    id,
    text,
    mediaUrl,
    sentAt: payload.date_sent || payload.date_updated || new Date().toISOString(),
    service: payload.service || "iMessage",
    replyToId: payload.reply_to?.message_handle?.trim() || null,
    sendStyle: payload.send_style?.trim() || null,
  };
}

function toPublic(message: StoredMessage): PublicMessage {
  return {
    ...message,
    mediaKind: mediaKind(message.mediaUrl),
  };
}

export async function getPublicMessages(): Promise<PublicMessage[]> {
  const merged = new Map<string, StoredMessage>();

  for (const item of await loadStoredMessages()) {
    merged.set(item.id, item);
  }

  try {
    const remote = await fetchSendblueMessages();
    for (const payload of remote) {
      if (payload.is_outbound) continue;
      if (!isAllowedSender(payload.from_number || payload.number)) continue;
      const message = fromWebhook(payload);
      if (message) merged.set(message.id, message);
    }
  } catch (error) {
    console.error("Sendblue backfill failed", error);
  }

  return [...merged.values()]
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
    .map(toPublic);
}
