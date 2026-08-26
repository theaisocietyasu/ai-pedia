import type { ReactNode } from "react";

// navigation types
export interface NavItem {
  name: string;
  link: string;
  icon?: ReactNode | string;
  description?: string;
  external?: boolean;
}

// hero section types
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

// footer link types
export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

// footer section types
export interface FooterSection {
  title: string;
  links: FooterLink[];
}

// social link types
export interface SocialLink {
  name: string;
  href: string;
  icon: ReactNode | string;
  ariaLabel: string;
}

// button variant types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "gradient";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

// table of contents item for sidebar navigation
export interface TocItem {
  id: string;
  title: string;
  level: number; // 1-6 for h1-h6
  children?: TocItem[];
}

// markdown component props
export interface MarkdownRendererProps {
  content: string;
  showTableOfContents?: boolean;
  onTocUpdate?: (toc: TocItem[]) => void;
  visualizationComponents?: Record<string, React.ComponentType>;
  className?: string;
}
