"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Eye, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/lib/constants";

const highlights = [
  { icon: Eye, label: "Interactive visualizations" },
  { icon: BookOpen, label: "Structured learn modules" },
  { icon: Users, label: "Written by AIS at ASU" },
];

export function HeroSection() {
  return (
    <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* background: single quiet violet glow + fine grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(109, 40, 217, 0.5) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        {/* eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm tracking-[0.35em] uppercase text-light-gray/70 mb-8"
        >
          The AI Society · Arizona State University
        </motion.p>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tight mb-6"
        >
          {heroContent.title}
        </motion.h1>

        {/* rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-px w-24 bg-purple mb-8"
        />

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-display italic text-xl sm:text-2xl text-light-gray mb-5"
        >
          {heroContent.subtitle}
        </motion.p>

        {/* description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-base sm:text-lg text-light-gray/75 max-w-xl leading-relaxed mb-10"
        >
          {heroContent.description}
        </motion.p>

        {/* cta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Link href={heroContent.ctaLink}>
            <Button
              size="lg"
              variant="primary"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              className="rounded-full px-8"
            >
              {heroContent.ctaText}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* highlights, pinned inside the single screen */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-8 left-0 right-0 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6"
      >
        {highlights.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2 text-sm text-light-gray/60"
          >
            <Icon size={15} className="text-purple" aria-hidden="true" />
            {label}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
