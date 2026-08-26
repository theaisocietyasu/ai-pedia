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

// feature types
export interface Feature {
  title: string;
  description: string;
  icon: ReactNode | string;
  gradient?: string;
}

// audience types
export interface AudienceSegment {
  title: string;
  description: string;
  icon: ReactNode | string;
  benefits: string[];
}

// vision types
export interface VisionItem {
  title: string;
  content: string;
  icon?: ReactNode | string;
}

// testimonial types
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image?: string;
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

// page metadata types
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

// button variant types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "gradient";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

// animation variant types
export interface AnimationVariant {
  hidden: object;
  visible: object;
  exit?: object;
}

// markdown component props
export interface MarkdownRendererProps {
  content: string;
  showTableOfContents?: boolean;
  onTocUpdate?: (toc: TocItem[]) => void;
  visualizationComponents?: Record<string, React.ComponentType>;
  className?: string;
}

// MongoDB blog types (updated to match Ash's requirements)
export interface Author {
  name: string;
  social: string; // Changed from socials array to single social string
}

export interface ActionButton {
  name: string;
  link: string;
}

// New blog post structure matching Ash's schema
export interface BlogPost {
  _id: string;
  title: string;
  content: string; // Raw markdown content
  categories: string; // Single category string (changed from category)
  authors: Author[]; // Changed from author to authors
  actionButtons: ActionButton[]; // New field
  lastUpdated: string; // Changed from updatedAt
  createdAt?: string;
  // Legacy fields for backward compatibility
  excerpt?: string;
  slug?: string;
  tags?: string[];
  featuredImage?: string;
  publishDate?: string;
  readTime?: string;
}

// Legacy blog types (for backward compatibility during migration)
export interface LegacyBlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorImage?: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  content: BlogContent;
  slug: string;
  lastUpdated?: string; // Added for compatibility
}

// Enhanced blog post interface that combines new and legacy structures
export interface EnhancedBlogPost {
  _id: string;
  title: string;
  content: string; // Raw markdown content
  categories: string;
  authors: Author[];
  actionButtons: ActionButton[];
  lastUpdated: string;
  createdAt?: string;
  // Generated fields for display
  excerpt?: string; // Auto-generated from content
  slug?: string; // Auto-generated from title
  tags?: string[]; // Extracted from categories or content
  featuredImage?: string; // Default or extracted from content
  publishDate?: string; // Alias for lastUpdated or createdAt
  readTime?: string; // Auto-calculated from content length
}

export interface BlogContent {
  type: "structured" | "markdown";
  // For structured content (legacy)
  headings?: string[];
  paragraphs?: (string | { [key: string]: string })[];
  images?: string[];
  visualization?: string;
  // For markdown content
  htmlReadMe?: string;
  // New: Raw markdown content
  rawMarkdown?: string;
  // Parsed content metadata
  tableOfContents?: TocItem[];
  extractedImages?: string[];
  visualizationIds?: string[];
}

// Table of contents item for sidebar navigation
export interface TocItem {
  id: string;
  title: string;
  level: number; // 1-6 for h1-h6
  children?: TocItem[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

// Markdown parsing result interface
export interface ParsedMarkdown {
  html: string;
  tableOfContents: TocItem[];
  extractedImages: string[];
  visualizationIds: string[];
  estimatedReadTime: string;
  excerpt: string;
}
