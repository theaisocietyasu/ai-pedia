import type { FooterSection, HeroContent, NavItem, SocialLink } from "./types";

// site configuration
export const siteConfig = {
  name: "AI Pedia",
  description: "Learning Website for AI Enthusiasts",
  tagline: "Master the Future of Artificial Intelligence",
  url: "https://aipedia.ais-asu.com/",
  ogImage: "/og-image.png",
  author: "The AI Society",
  email: "theaisociety@asu.edu",
};

// color scheme — black, white, violet only (mirrors app/globals.css tokens)
export const colors = {
  background: "#09090b",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  purpleDeep: "#6d28d9",
  darkGray: "#131316",
  lightGray: "#d4d4d8",
  white: "#ffffff",
  gradients: {
    primary: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #6d28d9 100%)",
    secondary: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    accent: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
    dark: "linear-gradient(180deg, #09090b 0%, #131316 100%)",
  },
};

// navigation items
export const navItems: NavItem[] = [
  {
    name: "Home",
    link: "/",
    description: "Back to homepage",
  },
  {
    name: "Learn",
    link: "/learn",
    description: "AI learning resources",
  },
];

// hero content
export const heroContent: HeroContent = {
  title: "AI Pedia",
  subtitle: "An interactive encyclopedia of artificial intelligence",
  description:
    "Rigorous, visual explanations of the algorithms shaping modern AI — written and maintained by The AI Society at Arizona State University.",
  ctaText: "Start Learning",
  ctaLink: "/learn",
};

// footer sections
export const footerSections: FooterSection[] = [
  {
    title: "Connect",
    links: [
      { label: "Website", href: "https://www.ais-asu.com/", external: true },
      {
        label: "Discord",
        href: "https://discord.gg/fXWXwz6fEG",
        external: true,
      },
      { label: "Contact Us", href: "mailto:theaisociety.asu@gmail.com" },
    ],
  },
];

// social links
export const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/theaisociety.asu/",
    icon: "Instagram",
    ariaLabel: "Follow us on Instagram",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/theaisocietyasu",
    icon: "Linkedin",
    ariaLabel: "Connect on LinkedIn",
  },
  {
    name: "GitHub",
    href: "https://github.com/theaisocietyasu",
    icon: "Github",
    ariaLabel: "View our GitHub",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@TheAISocietyASU/",
    icon: "Youtube",
    ariaLabel: "Subscribe on YouTube",
  },
];
