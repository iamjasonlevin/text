import type { Metadata, Viewport } from "next";
import "./globals.css";

const CONTACT_NAME = process.env.NEXT_PUBLIC_CONTACT_NAME || "Notes";

export const metadata: Metadata = {
  title: CONTACT_NAME,
  description: "A public iMessage — notes to myself.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: CONTACT_NAME,
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
