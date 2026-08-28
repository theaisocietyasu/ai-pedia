import type { Metadata } from "next";
import { EB_Garamond, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import { PageActionsProvider } from "@/components/ui/page-actions";
import { getSearchIndex } from "@/lib/content";
import {
  SITE_URL as baseUrl,
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_SHORT,
} from "@/lib/site";
import "./globals.css";
import "../styles/markdown.css";
import "katex/dist/katex.min.css";

const displayFont = EB_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AI Pedia",
    template: "%s · AI Pedia",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "statistics",
    "encyclopedia",
    "The AI Society",
    "Arizona State University",
  ],
  authors: [{ name: "The AI Society at ASU", url: "https://www.ais-asu.com/" }],
  creator: "The AI Society at ASU",
  publisher: "The AI Society at ASU",
  alternates: { canonical: baseUrl },
  openGraph: {
    title: "AI Pedia",
    description: SITE_DESCRIPTION_SHORT,
    url: baseUrl,
    siteName: "AI Pedia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Pedia",
    description: SITE_DESCRIPTION_SHORT,
    creator: "@theaisocietyasu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/logo.png", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  category: "education",
  applicationName: "AI Pedia",
  appleWebApp: { capable: true, title: "AI Pedia", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "The AI Society at ASU",
    url: "https://www.ais-asu.com/",
    logo: `${baseUrl}/logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://www.instagram.com/theaisociety.asu/",
      "https://www.linkedin.com/company/theaisocietyasu",
      "https://github.com/theaisocietyasu",
    ],
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Arizona State University",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Pedia",
    url: baseUrl,
    description: SITE_DESCRIPTION_SHORT,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/learn?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data serialized via JSON.stringify, not user HTML
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data serialized via JSON.stringify, not user HTML
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased">
        <PageActionsProvider>
          <Navbar searchIndex={getSearchIndex()} />
          {children}
        </PageActionsProvider>
      </body>
    </html>
  );
}
