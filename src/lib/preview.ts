import type { PublicMessage } from "@/lib/types";

export function makePreviewMessages(now = Date.now()): PublicMessage[] {
  return [
    {
      id: "preview-1",
      text: "public notes to myself.",
      mediaUrl: null,
      mediaKind: null,
      sentAt: new Date(now - 1000 * 60 * 47).toISOString(),
      service: "iMessage",
      replyToId: null,
      sendStyle: null,
    },
    {
      id: "preview-2",
      text: "i text a number. it shows up here. blue bubbles.",
      mediaUrl: null,
      mediaKind: null,
      sentAt: new Date(now - 1000 * 60 * 46).toISOString(),
      service: "iMessage",
      replyToId: null,
      sendStyle: null,
    },
    {
      id: "preview-3",
      text: "like a blog, except it's iMessage.",
      mediaUrl: null,
      mediaKind: null,
      sentAt: new Date(now - 1000 * 60 * 12).toISOString(),
      service: "iMessage",
      replyToId: null,
      sendStyle: null,
    },
    {
      id: "preview-4",
      text: "open.",
      mediaUrl: null,
      mediaKind: null,
      sentAt: new Date(now - 1000 * 60 * 11).toISOString(),
      service: "iMessage",
      replyToId: null,
      sendStyle: null,
    },
  ];
}
