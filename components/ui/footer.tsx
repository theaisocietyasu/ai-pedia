"use client";

import {
  Github,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { footerSections, siteConfig, socialLinks } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // helper function to get icon component
  const getIcon = (iconName?: string | React.ReactNode) => {
    if (!iconName) return null;
    if (typeof iconName !== "string") return iconName;

    const icons: Record<string, React.ReactNode> = {
      Instagram: <Instagram size={20} />,
      Linkedin: <Linkedin size={20} />,
      Github: <Github size={20} />,
      Youtube: <Youtube size={20} />,
    };

    return icons[iconName] || null;
  };

  return (
    <footer className="relative  mt-0">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl py-20">
        <div className="w-full">
          {/* main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* brand section with social links */}
            <div className="space-y-6 lg:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="AI Pedia Logo"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-bold text-lg text-white">AI Pedia</h2>
                  <p className="text-xs text-light-gray/60">
                    by The AI Society
                  </p>
                </div>
              </div>
              <p className="text-sm text-light-gray/80 leading-relaxed">
                {siteConfig.description}. Empowering students to master AI
                through interactive learning and visualization at Arizona State
                University.
              </p>
              {/* social links */}
              <div className="flex gap-3 pt-2">
                {socialLinks.map((link) => {
                  const icon = getIcon(link.icon);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.ariaLabel}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-purple/20 
                             flex items-center justify-center transition-all duration-300
                             hover:scale-110 group"
                    >
                      <span className="text-light-gray/60 group-hover:text-white transition-colors">
                        {icon}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* footer sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="font-semibold text-white">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-light-gray/60 hover:text-white 
                                 transition-colors inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-light-gray/60 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* contact section */}
            <div className="space-y-6">
              <h3 className="font-semibold text-white">Get in Touch</h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-sm text-light-gray/60 
                         hover:text-white transition-colors group"
                >
                  <Mail
                    size={16}
                    className="group-hover:text-purple transition-colors"
                  />
                  {siteConfig.email}
                </a>
                <div className="flex items-start gap-2 text-sm text-light-gray/60">
                  <MapPin size={16} className="mt-0.5 text-purple" />
                  <span>
                    Arizona State University
                    <br />
                    Tempe, AZ 85281
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-light-gray/60 pb-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>
                © {currentYear} {siteConfig.author}. All rights reserved.
              </p>
              <span className="hidden md:inline">•</span>
            </div>
            <p className="flex items-center gap-1">
              Built with <Heart size={14} className="text-pink animate-pulse" />{" "}
              by The AI Society team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
