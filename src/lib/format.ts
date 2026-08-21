const IMAGE_EXT = /\.(png|jpe?g|gif|webp|heic|heif|bmp|tiff?)($|\?)/i;
const VIDEO_EXT = /\.(mp4|mov|m4v|webm|quicktime)($|\?)/i;
const AUDIO_EXT = /\.(caf|m4a|mp3|wav|aac|ogg)($|\?)/i;

export function mediaKind(
  url: string | null,
): "image" | "video" | "audio" | "file" | null {
  if (!url) return null;
  if (IMAGE_EXT.test(url) || url.includes("/image")) return "image";
  if (VIDEO_EXT.test(url) || url.includes("/video")) return "video";
  if (AUDIO_EXT.test(url) || url.includes("/audio")) return "audio";
  return "file";
}

export function digitsPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (value.startsWith("+")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

const EMOJI_ONLY =
  /^(?:[\p{Extended_Pictographic}\u200d\ufe0f\u20e3\uFE0F\s])+$/u;

export function isBigEmoji(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || !EMOJI_ONLY.test(trimmed)) return false;
  const glyphs = trimmed.replace(/\s/g, "");
  return [...glyphs].length > 0 && [...glyphs].length <= 3;
}

export function formatStamp(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfThat = new Date(date);
  startOfThat.setHours(0, 0, 0, 0);
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfThat.getTime()) / 86_400_000,
  );

  if (dayDiff === 0) return `Today ${time}`;
  if (dayDiff === 1) return `Yesterday ${time}`;
  if (dayDiff < 7) {
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    return `${weekday} ${time}`;
  }
  if (date.getFullYear() === now.getFullYear()) {
    const md = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${md} at ${time}`;
  }
  const full = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${full} ${time}`;
}

export function formatStatusTime(now = new Date()): string {
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const URL_RE = /(https?:\/\/[^\s<]+[^.,:;!?)\s])/g;

export function splitTextAndLinks(
  text: string,
): Array<{ type: "text" | "link"; value: string }> {
  const parts: Array<{ type: "text" | "link"; value: string }> = [];
  let last = 0;
  for (const match of text.matchAll(URL_RE)) {
    const index = match.index ?? 0;
    if (index > last) {
      parts.push({ type: "text", value: text.slice(last, index) });
    }
    parts.push({ type: "link", value: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  return parts;
}
