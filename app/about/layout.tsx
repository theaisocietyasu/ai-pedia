import { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipedia.ais-asu.com/'

export const metadata: Metadata = {
  title: "About The AI Society",
  description: "Learn about The AI Society at Arizona State University. Our mission is to democratize AI education through interactive learning experiences and make artificial intelligence accessible to everyone.",
  keywords: [
    "The AI Society",
    "ASU AI Society",
    "Arizona State University AI",
    "AI education organization",
    "student AI club",
    "AI learning community",
    "ASU technology clubs"
  ],
  openGraph: {
    title: "About The AI Society at ASU",
    description: "Learn about The AI Society at Arizona State University and our mission to democratize AI education.",
    url: `${baseUrl}/about`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About The AI Society at ASU"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About The AI Society at ASU",
    description: "Learn about The AI Society at Arizona State University and our mission to democratize AI education.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: `${baseUrl}/about`
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
