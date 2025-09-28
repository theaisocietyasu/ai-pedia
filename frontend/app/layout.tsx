import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import "./globals.css";
import "../styles/markdown.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ML Visualization | The AI Society at ASU",
  description: "Master artificial intelligence through interactive visualizations and hands-on projects. Join ASU's premier AI learning platform powered by The AI Society.",
  keywords: ["AI", "Machine Learning", "Deep Learning", "ASU", "Arizona State University", "The AI Society", "AI Education", "AI Visualization"],
  authors: [{ name: "The AI Society" }],
  openGraph: {
    title: "ML Visualization | The AI Society at ASU",
    description: "Master artificial intelligence through interactive visualizations and hands-on projects.",
    url: "https://ailearninghub.com",
    siteName: "ML Visualization",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ML Visualization",
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
  );
}
