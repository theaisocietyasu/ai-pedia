import type { Metadata } from "next";
import { Footer } from "@/components/ui/footer";
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
  return (
    <>
      {children}
      <div className="mt-32">
        <Footer />
      </div>
    </>
  );
}
