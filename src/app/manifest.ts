import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jason Levin - Notes To A Younger Me",
    short_name: "Notes To A Younger Me",
    description:
      "A public iMessage thread: notes from Jason Levin to a younger him.",
    start_url: "/",
    display: "standalone",
    background_color: "#1982fc",
    theme_color: "#1982FC",
  };
}
