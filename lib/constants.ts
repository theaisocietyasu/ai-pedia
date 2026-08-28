import type { FooterSection, HeroContent, NavItem, SocialLink } from "./types";

// site configuration
export const siteConfig = {
  name: "AI Pedia",
  description: "An interactive encyclopedia of artificial intelligence",
  url: "https://aipedia.ais-asu.com/",
  author: "The AI Society",
  email: "theaisociety@asu.edu",
  repoUrl: "https://github.com/theaisocietyasu/ml-visualization",
};

// palette — mirrors the tokens in app/globals.css (single light theme)
export const colors = {
  background: "#faf9f5",
  surface: "#f3f1ea",
  line: "#e3e0d6",
  foreground: "#191918",
  muted: "#6f6d66",
  purple: "#8f84d6",
  purpleLight: "#c6bfec",
  purpleDeep: "#5b4fb3",
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
