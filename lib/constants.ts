import type { NavItem, Feature, AudienceSegment, VisionItem, FooterSection, SocialLink } from "./types"

// site configuration
export const siteConfig = {
  name: "AI Pedia",
  description: "Learning Website for AI Enthusiasts",
  tagline: "Master the Future of Artificial Intelligence",
  url: "https://ailearninghub.com",
  ogImage: "/og-image.png",
  author: "The AI Society",
  email: "theaisociety@asu.edu",
}

// color scheme
export const colors = {
  background: "#0b0a10",
  purple: "#3a388e",
  pink: "#8d2f6a",
  bluePurple: "#4b4abd",
  darkGray: "#1a1a2e",
  lightGray: "#e0e0e0",
  white: "#ffffff",
  gradients: {
    primary: "linear-gradient(135deg, #3a388e 0%, #8d2f6a 50%, #4b4abd 100%)",
    secondary: "linear-gradient(135deg, #4b4abd 0%, #3a388e 100%)",
    accent: "linear-gradient(135deg, #8d2f6a 0%, #3a388e 100%)",
    dark: "linear-gradient(180deg, #0b0a10 0%, #1a1a2e 100%)",
  }
}

// navigation items
export const navItems: NavItem[] = [
  {
    name: "Home",
    link: "/",
    description: "Back to homepage"
  },
  {
    name: "Learn",
    link: "/learn",
    description: "AI learning resources"
  },
  // {
  //   name: "Blogs",
  //   link: "/blogs",
  //   description: "Read our latest articles"
  // },
]

// hero content
export const heroContent = {
  title: "AI Pedia",
  subtitle: "Learning Website for AI Enthusiasts",
  description: "Embark on your journey to master artificial intelligence with interactive visualizations, hands-on projects, and expert guidance from The AI Society at ASU.",
  ctaText: "Start Learning",
  ctaLink: "/learn",
}

// features
export const features: Feature[] = [
  {
    title: "Interactive Visualizations",
    description: "See AI algorithms come to life with real-time visualizations and interactive demos",
    icon: "Eye",
    gradient: colors.gradients.primary
  },
  {
    title: "Hands-On Projects",
    description: "Build real AI applications with guided tutorials and project-based learning",
    icon: "Code",
    gradient: colors.gradients.secondary
  },
  {
    title: "Expert Mentorship",
    description: "Learn from experienced AI practitioners and researchers at ASU",
    icon: "Brain",
    gradient: colors.gradients.accent
  },
  {
    title: "Progressive Curriculum",
    description: "From fundamentals to advanced topics, master AI at your own pace",
    icon: "Layers",
    gradient: colors.gradients.primary
  },
  {
    title: "Real-World Applications",
    description: "Apply your knowledge to solve real problems in various domains",
    icon: "Rocket",
    gradient: colors.gradients.secondary
  },
  {
    title: "Community Support",
    description: "Join a vibrant community of AI enthusiasts and get help when you need it",
    icon: "Users",
    gradient: colors.gradients.accent
  }
]

// target audience
export const audienceSegments: AudienceSegment[] = [
  {
    title: "Students Who Want to Learn AI",
    description: "Perfect for beginners and intermediate learners ready to dive deep into artificial intelligence",
    icon: "BookOpen",
    benefits: [
      "Structured learning path from basics to advanced",
      "Hands-on coding exercises and projects",
      "Certificate of completion",
      "Career guidance and opportunities"
    ]
  },
  {
    title: "Students Who Want to Visualize AI",
    description: "Ideal for visual learners who want to see AI concepts in action",
    icon: "Eye",
    benefits: [
      "Interactive algorithm visualizations",
      "Real-time model training demos",
      "Visual debugging tools"
    ]
  }
]

// vision items
export const visionItems: VisionItem[] = [
  {
    title: "Our Mission",
    content: "To democratize AI education and make it accessible to every student passionate about technology. We believe that understanding AI is not just about coding, but about visualizing and grasping the fundamental concepts that drive innovation.",
    icon: "Target"
  },
  {
    title: "The Pride of AIS",
    content: "The AI Society at Arizona State University stands at the forefront of AI education and research. Our community of innovators, researchers, and enthusiasts is dedicated to pushing the boundaries of what's possible with artificial intelligence.",
    icon: "Star"
  },
  {
    title: "Your AI Journey",
    content: "Whether you're taking your first steps into machine learning or advancing your expertise in deep learning, we provide the tools, resources, and support you need to succeed in the rapidly evolving field of AI.",
    icon: "Rocket"
  }
]

// footer sections
export const footerSections: FooterSection[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Learn", href: "/learn" },
      { label: "About", href: "/about" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Tutorials", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" }
    ]
  },
  {
    title: "Connect",
    links: [
      { label: "Discord", href: "https://discord.gg/", external: true },
      { label: "Contact Us", href: "mailto:theaisociety@asu.edu" },
      { label: "Sun Devil Central", href: "https://sundevilcentral.asu.edu", external: true }
    ]
  }
]

// social links
export const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/theaisociety.asu/",
    icon: "Instagram",
    ariaLabel: "Follow us on Instagram"
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/theaisocietyasu",
    icon: "Linkedin",
    ariaLabel: "Connect on LinkedIn"
  },
  {
    name: "GitHub",
    href: "https://github.com/theaisocietyasu",
    icon: "Github",
    ariaLabel: "View our GitHub"
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@TheAISocietyASU/",
    icon: "Youtube",
    ariaLabel: "Subscribe on YouTube"
  }
]

// animation configurations
export const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 }
  }
}

// transition configurations
export const transitions = {
  default: { duration: 0.5, ease: "easeOut" },
  spring: { type: "spring", stiffness: 100, damping: 15 },
  smooth: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
  slow: { duration: 1, ease: "easeInOut" }
}