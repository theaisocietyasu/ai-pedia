import { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipedia.ais-asu.com/'

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description: "Be the first to know when we launch our comprehensive AI learning platform. Get early access, exclusive content, and founding member status. Join The AI Society waitlist today.",
  keywords: [
    "AI learning platform waitlist",
    "early access AI education",
    "ML learning beta",
    "AI course early access",
    "exclusive AI content"
  ],
  openGraph: {
    title: "Join the AI Pedia Waitlist",
    description: "Be the first to know when we launch. Get early access, exclusive content, and founding member status.",
    url: `${baseUrl}/waitlist`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Join the AI Pedia Waitlist"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the AI Pedia Waitlist",
    description: "Be the first to know when we launch. Get early access and exclusive content.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: `${baseUrl}/waitlist`
  }
}

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
