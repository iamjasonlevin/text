export function PlusCircle() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden>
      <circle cx="16" cy="16" r="16" className="im-plus-bg" />
      <path
        d="M16 10v12M10 16h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Mic() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        d="M12 3.5a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0v-6a3 3 0 0 0-3-3Z"
        fill="currentColor"
      />
      <path
        d="M7 11.5a5 5 0 0 0 10 0M12 16.5v3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        d="M15.5 4.5 7.5 12l8 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronSmall() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
      <path
        d="M4 2.5 8 6 4 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaceTime() {
  return (
    <svg viewBox="0 0 28 20" width="26" height="18" aria-hidden>
      <rect x="0.75" y="2.5" width="18.5" height="15" rx="4.2" fill="currentColor" />
      <path d="M20.2 7.4 27 4.2v11.6l-6.8-3.2V7.4Z" fill="currentColor" />
    </svg>
  );
}

export function Lock() {
  return (
    <svg viewBox="0 0 12 14" width="12" height="14" aria-hidden>
      <rect x="1" y="6" width="10" height="7.5" rx="2" fill="currentColor" />
      <path
        d="M3.2 6V4.4a2.8 2.8 0 0 1 5.6 0V6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Signal() {
  return (
    <svg viewBox="0 0 18 12" width="18" height="12" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="0.6" fill="currentColor" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="0.6" fill="currentColor" />
      <rect x="10" y="3" width="3" height="9" rx="0.6" fill="currentColor" />
      <rect
        x="15"
        y="0.5"
        width="3"
        height="11.5"
        rx="0.6"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

export function Wifi() {
  return (
    <svg viewBox="0 0 16 12" width="16" height="12" aria-hidden>
      <path
        d="M1.2 4.4C4.6 1.4 11.4 1.4 14.8 4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.6 6.8c2.2-2 6.6-2 8.8 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.1 9.1c1.1-1 2.7-1 3.8 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.1" r="1" fill="currentColor" />
    </svg>
  );
}

export function Battery() {
  return (
    <svg viewBox="0 0 27 13" width="27" height="13" aria-hidden>
      <rect
        x="0.6"
        y="0.6"
        width="22.5"
        height="11.8"
        rx="2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <rect x="2.1" y="2.2" width="18.2" height="8.6" rx="1.4" fill="currentColor" />
      <path
        d="M24.4 4.4c.9.4 1.4 1.1 1.4 2.1s-.5 1.7-1.4 2.1V4.4Z"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

export function BubbleTail() {
  return (
    <svg
      className="im-tail"
      viewBox="0 0 15 13"
      width="15"
      height="13"
      aria-hidden
    >
      <path d="M0 0c.4 7.2 4.2 13 15 13H0V0Z" fill="currentColor" />
    </svg>
  );
}
