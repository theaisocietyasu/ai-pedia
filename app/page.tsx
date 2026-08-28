import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aipedia.ais-asu.com/";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Interactive explanations of the algorithms behind modern AI, written by The AI Society at Arizona State University.",
  keywords: [
    "AI learning platform",
    "machine learning tutorials",
    "interactive AI visualizations",
    "ASU AI Society",
    "learn artificial intelligence",
    "AI education",
    "deep learning courses",
    "computer vision tutorials",
    "NLP learning",
  ],
  openGraph: {
    title: "AI Pedia",
    description: "Interactive explanations of the algorithms behind modern AI.",
    url: baseUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Pedia",
    description: "Interactive explanations of the algorithms behind modern AI.",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function Home() {
  return (
    <main className="h-[calc(100svh-3rem)] overflow-hidden bg-background">
      <HeroSection />
    </main>
  );
}
