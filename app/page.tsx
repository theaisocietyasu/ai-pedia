import { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesGrid } from "@/components/home/features-grid"
import { VisionSection } from "@/components/home/vision-section"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailearninghub.com'

export const metadata: Metadata = {
  title: "Home",
  description: "Master artificial intelligence through interactive visualizations and hands-on projects. Learn ML, Deep Learning, Computer Vision, and NLP with The AI Society at ASU.",
  keywords: [
    "AI learning platform",
    "machine learning tutorials",
    "interactive AI visualizations",
    "ASU AI Society",
    "learn artificial intelligence",
    "AI education",
    "deep learning courses",
    "computer vision tutorials",
    "NLP learning"
  ],
  openGraph: {
    title: "ML Visualization | Interactive AI Learning Platform",
    description: "Master artificial intelligence through interactive visualizations and hands-on projects. Learn ML, Deep Learning, Computer Vision, and NLP.",
    url: baseUrl,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ML Visualization - Interactive AI Learning Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ML Visualization | Interactive AI Learning Platform",
    description: "Master artificial intelligence through interactive visualizations and hands-on projects.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: baseUrl
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesGrid />
      <VisionSection />
    </main>
  );
}
