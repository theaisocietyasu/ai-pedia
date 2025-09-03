import { ReactNode } from "react"

// navigation types
export interface NavItem {
  name: string
  link: string
  icon?: ReactNode | string
  description?: string
  external?: boolean
}

// hero section types
export interface HeroContent {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}

// feature types
export interface Feature {
  title: string
  description: string
  icon: ReactNode | string
  gradient?: string
}

// audience types
export interface AudienceSegment {
  title: string
  description: string
  icon: ReactNode | string
  benefits: string[]
}

// vision types
export interface VisionItem {
  title: string
  content: string
  icon?: ReactNode | string
}

// testimonial types
export interface Testimonial {
  quote: string
  author: string
  role: string
  image?: string
}

// footer link types
export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

// footer section types
export interface FooterSection {
  title: string
  links: FooterLink[]
}

// social link types
export interface SocialLink {
  name: string
  href: string
  icon: ReactNode | string
  ariaLabel: string
}

// page metadata types
export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
}

// button variant types
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gradient"
export type ButtonSize = "sm" | "md" | "lg" | "xl"

// animation variant types
export interface AnimationVariant {
  hidden: object
  visible: object
  exit?: object
}