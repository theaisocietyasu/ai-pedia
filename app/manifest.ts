import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Pedia | The AI Society at ASU",
    short_name: "AI Pedia",
    description:
      "Interactive explanations of the algorithms behind modern AI, written by The AI Society at Arizona State University.",
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
        src: "/logo.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["education", "productivity", "utilities"],
    screenshots: [],
  };
}
