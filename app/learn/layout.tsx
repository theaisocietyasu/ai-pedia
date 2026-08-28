import type { Metadata } from "next";
import { Footer } from "@/components/ui/footer";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aipedia.ais-asu.com/";

export const metadata: Metadata = {
  title: "Learn AI & ML",
  description:
    "Explore AI algorithms through interactive tutorials, explanations, and visualizations. Learn Machine Learning, Deep Learning, Computer Vision, NLP, and more with hands-on examples.",
  keywords: [
    "AI learning",
    "machine learning tutorials",
    "deep learning courses",
    "AI algorithms",
    "interactive ML visualizations",
    "computer vision learning",
    "NLP tutorials",
    "AI education",
    "hands-on AI projects",
  ],
  openGraph: {
    title: "Learn AI & ML | Interactive Tutorials and Visualizations",
    description:
      "Explore AI algorithms through interactive tutorials and visualizations. Master ML, Deep Learning, Computer Vision, and NLP.",
    url: `${baseUrl}/learn`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn AI & ML | Interactive Tutorials and Visualizations",
    description:
      "Explore AI algorithms through interactive tutorials and visualizations.",
  },
  alternates: {
    canonical: `${baseUrl}/learn`,
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="mt-32">
        <Footer />
      </div>
    </>
  );
}
