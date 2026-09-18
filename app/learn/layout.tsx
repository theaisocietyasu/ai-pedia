import type { Metadata } from "next";
import { SITE_URL as baseUrl } from "@/lib/site";

const description =
  "Articles on machine learning, statistics, and artificial intelligence, organized by topic.";

export const metadata: Metadata = {
  title: { default: "Learn", template: "%s · AI Pedia" },
  description,
  alternates: { canonical: `${baseUrl}/learn` },
  openGraph: {
    title: "Learn · AI Pedia",
    description,
    url: `${baseUrl}/learn`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn · AI Pedia",
    description,
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The footer lives on the category and article layouts; /learn itself is the
  // full-viewport map and has nothing to scroll past.
  return <>{children}</>;
}
