import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredMessage } from "./types";

const overlay = new Map<string, StoredMessage>();

function filePath(): string {
  if (process.env.VERCEL) return "/tmp/messages.json";
  return path.join(process.cwd(), "data", "messages.json");
}

async function readDisk(): Promise<StoredMessage[]> {
  try {
    const raw = await readFile(filePath(), "utf8");
    const parsed = JSON.parse(raw) as StoredMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeDisk(messages: StoredMessage[]): Promise<void> {
  try {
    const file = filePath();
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `${JSON.stringify(messages, null, 2)}\n`);
  } catch {
    // Ephemeral platforms (Vercel) may not persist; memory + Sendblue still work.
  }
}

export async function upsertMessage(message: StoredMessage): Promise<void> {
  overlay.set(message.id, message);
  const disk = await readDisk();
  const next = new Map(disk.map((item) => [item.id, item]));
  next.set(message.id, message);
  const sorted = [...next.values()].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
  );
  await writeDisk(sorted);
}

export async function loadStoredMessages(): Promise<StoredMessage[]> {
  const disk = await readDisk();
  const merged = new Map(disk.map((item) => [item.id, item]));
  for (const item of overlay.values()) merged.set(item.id, item);
  return [...merged.values()];
}
