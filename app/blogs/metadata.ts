import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aipedia.ais-asu.com/";

export const blogsMetadata: Metadata = {
  title: "AI & ML Blog",
  description:
    "Explore the latest insights, tutorials, and research in artificial intelligence and machine learning. From fundamentals to cutting-edge developments in AI, Deep Learning, Computer Vision, and NLP.",
  keywords: [
    "AI blog",
    "machine learning articles",
    "deep learning tutorials",
    "AI research",
    "ML fundamentals",
    "computer vision blog",
    "NLP articles",
    "AI tutorials",
    "machine learning insights",
  ],
  openGraph: {
    title: "AI & ML Blog | Latest Insights and Tutorials",
    description:
      "Explore cutting-edge AI research, tutorials, and insights. From fundamentals to advanced topics in Machine Learning, Deep Learning, and Computer Vision.",
    url: `${baseUrl}/blogs`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI & ML Blog - Latest Insights and Tutorials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & ML Blog | Latest Insights and Tutorials",
    description: "Explore cutting-edge AI research, tutorials, and insights.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${baseUrl}/blogs`,
  },
};
