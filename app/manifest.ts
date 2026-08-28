import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Pedia",
    short_name: "AI Pedia",
    description:
      "An encyclopedia of artificial intelligence by The AI Society at Arizona State University.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#5b4fb3",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["education"],
    screenshots: [],
  };
}
