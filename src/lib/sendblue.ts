import { digitsPhone } from "./format";
import type { SendblueListResponse, SendblueWebhookPayload } from "./types";

const API_BASE = "https://api.sendblue.co";

type CacheEntry = { at: number; messages: SendblueWebhookPayload[] };

let cache: CacheEntry | null = null;
const CACHE_MS = 8_000;

export function clearSendblueCache(): void {
  cache = null;
}

function allowedFrom(): Set<string> | null {
  const raw = process.env.ALLOWED_FROM_NUMBERS;
  if (!raw?.trim()) return null;
  return new Set(
    raw
      .split(",")
      .map((part) => digitsPhone(part.trim()))
      .filter(Boolean),
  );
}

export function isAllowedSender(fromNumber: string | null | undefined): boolean {
  const allowed = allowedFrom();
  if (!allowed) return true;
  if (!fromNumber) return false;
  return allowed.has(digitsPhone(fromNumber));
}

export async function fetchSendblueMessages(): Promise<SendblueWebhookPayload[]> {
  const apiKey = process.env.SENDBLUE_API_KEY;
  const apiSecret = process.env.SENDBLUE_API_SECRET;
  if (!apiKey || !apiSecret) return [];

  if (cache && Date.now() - cache.at < CACHE_MS) return cache.messages;

  const collected: SendblueWebhookPayload[] = [];
  let offset = 0;
  const limit = 100;

  while (offset < 400) {
    const url = new URL(`${API_BASE}/api/v2/messages`);
    url.searchParams.set("is_outbound", "false");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("order_direction", "desc");

    const from = allowedFrom();
    if (from && from.size === 1) {
      url.searchParams.set("from_number", [...from][0]);
    }

    const response = await fetch(url, {
      headers: {
        "sb-api-key-id": apiKey,
        "sb-api-secret-key": apiSecret,
      },
      next: { revalidate: 5, tags: ["messages"] },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Sendblue list failed (${response.status}): ${body}`);
    }

    const json = (await response.json()) as SendblueListResponse;
    const page = json.data ?? [];
    collected.push(...page);

    if (page.length < limit) break;
    if (json.pagination?.hasMore === false) break;
    offset += limit;
  }

  cache = { at: Date.now(), messages: collected };
  return collected;
}
