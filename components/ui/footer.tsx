"use client";

import {
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { footerSections, siteConfig, socialLinks } from "@/lib/constants";

const icons: Record<string, React.ReactNode> = {
  Instagram: <Instagram size={18} />,
  Linkedin: <Linkedin size={18} />,
  Github: <Github size={18} />,
  Youtube: <Youtube size={18} />,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface/60">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="AI Pedia logo"
                className="w-8 h-8 rounded-sm object-cover"
              />
              <div>
                <p className="font-display text-xl leading-none">AI Pedia</p>
                <p className="text-xs text-muted mt-1">by The AI Society</p>
              </div>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed max-w-xs">
              {siteConfig.description}. Interactive learning and visualization
              for students at Arizona State University.
            </p>
            <div className="flex gap-1 -ml-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="w-9 h-9 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                >
                  {typeof link.icon === "string" ? icons[link.icon] : link.icon}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="eyebrow">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ink-2 hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowUpRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-ink-2 hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="eyebrow">Get in touch</h3>
            <div className="space-y-2.5 text-sm text-ink-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail size={15} className="text-purple-deep" />
                {siteConfig.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 text-purple-deep" />
                <span>
                  Arizona State University
                  <br />
                  Tempe, AZ 85281
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rule mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted">
          <p>
            © {currentYear} {siteConfig.author}. All rights reserved.
          </p>
          <p>Built by The AI Society team.</p>
        </div>
      </div>
    </footer>
  );
}
