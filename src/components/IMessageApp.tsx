"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Battery,
  BubbleTail,
  ChevronLeft,
  ChevronSmall,
  FaceTime,
  Lock,
  Mic,
  PlusCircle,
  Signal,
  Wifi,
} from "@/components/Icons";
import {
  formatStamp,
  formatStatusTime,
  isBigEmoji,
  splitTextAndLinks,
} from "@/lib/format";
import { makePreviewMessages } from "@/lib/preview";
import type { PublicMessage } from "@/lib/types";

const CONTACT_NAME = process.env.NEXT_PUBLIC_CONTACT_NAME || "Notes";

type Clustered = PublicMessage & {
  isFirst: boolean;
  isLast: boolean;
  showStamp: boolean;
};

function cluster(messages: PublicMessage[]): Clustered[] {
  return messages.map((message, index) => {
    const prev = messages[index - 1];
    const next = messages[index + 1];
    const t = new Date(message.sentAt).getTime();
    const prevClose =
      prev && t - new Date(prev.sentAt).getTime() < 2 * 60 * 1000;
    const nextClose =
      next && new Date(next.sentAt).getTime() - t < 2 * 60 * 1000;
    const showStamp =
      !prev || t - new Date(prev.sentAt).getTime() > 45 * 60 * 1000;
    return {
      ...message,
      isFirst: !prevClose,
      isLast: !nextClose,
      showStamp,
    };
  });
}

function MessageBody({ text }: { text: string }) {
  const parts = splitTextAndLinks(text);
  return (
    <>
      {parts.map((part, index) =>
        part.type === "link" ? (
          <a
            key={`${part.value}-${index}`}
            href={part.value}
            target="_blank"
            rel="noreferrer"
            className="im-link"
          >
            {part.value}
          </a>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </>
  );
}

function Bubble({
  message,
  quoted,
  isNew,
}: {
  message: Clustered;
  quoted: PublicMessage | null;
  isNew: boolean;
}) {
  const emojiOnly = isBigEmoji(message.text) && !message.mediaUrl;
  const radius = [
    "18px",
    message.isFirst ? "18px" : "5px",
    message.isLast ? "18px" : "5px",
    "18px",
  ].join(" ");

  return (
    <div
      className={[
        "im-row",
        message.isFirst ? "im-row-first" : "",
        message.isLast ? "im-row-last" : "",
        isNew ? "im-row-new" : "",
      ].join(" ")}
    >
      {message.showStamp ? (
        <div className="im-stamp">{formatStamp(message.sentAt)}</div>
      ) : null}

      {emojiOnly ? (
        <div className="im-emoji-only" aria-label={message.text}>
          {message.text}
        </div>
      ) : (
        <div className="im-stack">
          {message.mediaUrl && message.mediaKind === "image" ? (
            <div
              className={`im-media ${message.isLast && !message.text ? "im-tailed" : ""}`}
              style={{ borderRadius: message.text ? "16px 16px 6px 16px" : radius }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={message.mediaUrl} alt="" />
              {message.isLast && !message.text ? <BubbleTail /> : null}
            </div>
          ) : null}

          {message.mediaUrl && message.mediaKind === "video" ? (
            <div
              className={`im-media ${message.isLast && !message.text ? "im-tailed" : ""}`}
              style={{ borderRadius: radius }}
            >
              <video src={message.mediaUrl} controls playsInline />
              {message.isLast && !message.text ? <BubbleTail /> : null}
            </div>
          ) : null}

          {message.mediaUrl &&
          (message.mediaKind === "audio" || message.mediaKind === "file") &&
          !message.text ? (
            <a
              className={`im-bubble im-tailed`}
              style={{ borderRadius: radius }}
              href={message.mediaUrl}
              target="_blank"
              rel="noreferrer"
            >
              {message.mediaKind === "audio" ? "Voice Note" : "Attachment"}
              <BubbleTail />
            </a>
          ) : null}

          {message.text ? (
            <div
              className={`im-bubble ${message.isLast ? "im-tailed" : ""}`}
              style={{ borderRadius: radius }}
            >
              {quoted ? (
                <div className="im-quote">
                  {quoted.text || (quoted.mediaUrl ? "Attachment" : "")}
                </div>
              ) : null}
              <p>
                <MessageBody text={message.text} />
              </p>
              {message.isLast ? <BubbleTail /> : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function IMessageApp({
  initialMessages,
  preview = false,
}: {
  initialMessages: PublicMessage[];
  preview?: boolean;
}) {
  const [messages, setMessages] = useState<PublicMessage[]>(initialMessages);
  const [now, setNow] = useState("9:41");
  const knownIds = useRef(new Set(initialMessages.map((message) => message.id)));
  const scroller = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  useEffect(() => {
    const tick = () => setNow(formatStatusTime());
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (preview && initialMessages.length === 0) {
      setMessages(makePreviewMessages());
    }
  }, [preview, initialMessages.length]);

  useEffect(() => {
    let cancelled = false;

    async function pull() {
      try {
        const response = await fetch("/api/messages", { cache: "no-store" });
        if (!response.ok) return;
        const json = (await response.json()) as { messages: PublicMessage[] };
        if (cancelled) return;
        if (json.messages.length > 0) {
          setMessages(json.messages);
        } else if (!preview) {
          setMessages([]);
        }
      } catch {
        // Keep showing whatever we already have.
      }
    }

    const id = window.setInterval(pull, 2000);
    const onFocus = () => void pull();
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [preview]);

  useLayoutEffect(() => {
    const node = scroller.current;
    if (!node || !stickToBottom.current) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  const clustered = useMemo(() => cluster(messages), [messages]);
  const byId = useMemo(
    () => new Map(messages.map((message) => [message.id, message])),
    [messages],
  );
  return (
    <div className="im-page">
      <div className="im-phone">
        <div className="im-screen">
          <div className="im-island" />

          <header className="im-status">
            <span className="im-time">{now}</span>
            <span className="im-status-icons">
              <Signal />
              <Wifi />
              <Battery />
            </span>
          </header>

          <nav className="im-nav">
            <div className="im-nav-back" aria-hidden>
              <ChevronLeft />
            </div>
            <div className="im-contact">
              <div className="im-avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/avatar.png" alt={CONTACT_NAME} />
              </div>
              <div className="im-contact-name">
                <span>{CONTACT_NAME}</span>
                <ChevronSmall />
              </div>
            </div>
            <div className="im-facetime" aria-hidden>
              <FaceTime />
            </div>
          </nav>

          <div
            className="im-thread"
            ref={scroller}
            onScroll={() => {
              const node = scroller.current;
              if (!node) return;
              stickToBottom.current =
                node.scrollHeight - node.scrollTop - node.clientHeight < 80;
            }}
          >
            <div className="im-encrypted">
              <Lock />
              <p>
                <strong>iMessage</strong>
                <br />
                Messages are end-to-end encrypted. No one outside of this chat,
                not even Apple, can read or listen to them.
              </p>
            </div>

            {clustered.map((message) => (
              <Bubble
                key={message.id}
                message={message}
                quoted={message.replyToId ? byId.get(message.replyToId) ?? null : null}
                isNew={!knownIds.current.has(message.id)}
              />
            ))}

            {messages.length > 0 ? (
              <div className="im-delivered">Delivered</div>
            ) : null}
          </div>

          <footer className="im-composer">
            <div className="im-plus">
              <PlusCircle />
            </div>
            <div className="im-input">
              <span>iMessage</span>
              <Mic />
            </div>
            <div className="im-home" />
          </footer>
        </div>
      </div>
    </div>
  );
}
