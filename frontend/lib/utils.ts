import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// utility function for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utility function for formatting dates
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// utility function for smooth scrolling to sections
export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

// utility function for generating gradients
export function generateGradient(color1: string, color2: string, angle: number = 45) {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`
}

// utility function to check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}