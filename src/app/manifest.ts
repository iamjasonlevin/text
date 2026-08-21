import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const name = process.env.NEXT_PUBLIC_CONTACT_NAME || "Notes";
  return {
    name,
    short_name: name,
    description: "A public iMessage — notes to myself.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1982FC",
  };
}
