import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_TITLE = "Jason Levin - Notes To A Younger Me";
const SITE_DESCRIPTION =
  "A public iMessage thread: notes from Jason Levin to a younger him.";
const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://text-lilac-iota.vercel.app",
);

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  authors: [{ name: "Jason Levin" }],
  creator: "Jason Levin",
  publisher: "Jason Levin",
  keywords: [
    "Jason Levin",
    "Notes To A Younger Me",
    "iMessage",
    "public notes",
    "blog",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Notes To A Younger Me",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1982fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a84ff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
