import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import "./globals.css";
import "../styles/markdown.css";
import "katex/dist/katex.min.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailearninghub.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ML Visualization | The AI Society at ASU",
    template: "%s | ML Visualization"
  },
  description: "Master artificial intelligence through interactive visualizations and hands-on projects. Join ASU's premier AI learning platform powered by The AI Society.",
  keywords: [
    "AI",
    "Machine Learning",
    "Deep Learning",
    "ASU",
    "Arizona State University",
    "The AI Society",
    "AI Education",
    "AI Visualization",
    "Neural Networks",
    "Computer Vision",
    "Natural Language Processing",
    "AI Tutorials",
    "Interactive Learning"
  ],
  authors: [{ name: "The AI Society", url: "https://www.instagram.com/theaisociety.asu/" }],
  creator: "The AI Society at ASU",
  publisher: "The AI Society at ASU",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "ML Visualization | The AI Society at ASU",
    description: "Master artificial intelligence through interactive visualizations and hands-on projects.",
    url: baseUrl,
    siteName: "ML Visualization",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ML Visualization - Learn AI through Interactive Visualizations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ML Visualization | The AI Society at ASU",
    description: "Master artificial intelligence through interactive visualizations and hands-on projects.",
    images: ["/og-image.png"],
    creator: "@theaisocietyasu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  category: 'education',
  applicationName: 'ML Visualization',
  appleWebApp: {
    capable: true,
    title: 'ML Visualization',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "The AI Society at ASU",
    "alternateName": "ML Visualization",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Master artificial intelligence through interactive visualizations and hands-on projects. Join ASU's premier AI learning platform powered by The AI Society.",
    "sameAs": [
      "https://www.instagram.com/theaisociety.asu/"
    ],
    "parentOrganization": {
      "@type": "CollegeOrUniversity",
      "name": "Arizona State University"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ML Visualization",
    "url": baseUrl,
    "description": "Master artificial intelligence through interactive visualizations and hands-on projects.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/blogs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <ClerkProvider>
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <div style={{ marginTop: '8rem' }}>
          <Footer />
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
