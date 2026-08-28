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

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function HeroSection() {
  return (
    <section className="relative h-[calc(100svh-4rem)] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* a soft lavender wash, top-right, like light through a window */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(198,191,236,0.45) 0%, rgba(250,249,245,0) 65%)",
        }}
      />

      <div className="relative w-full max-w-3xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        <motion.p {...fade(0)} className="eyebrow mb-10">
          The AI Society · Arizona State University
        </motion.p>

        <motion.h1
          {...fade(0.1)}
          className="font-display text-6xl sm:text-7xl md:text-[6.5rem] leading-none mb-8"
        >
          {heroContent.title}
        </motion.h1>

        <motion.div
          {...fade(0.2)}
          className="flex items-center gap-4 mb-8 text-purple"
          aria-hidden="true"
        >
          <span className="h-px w-16 bg-current" />
          <span className="text-xs">✦</span>
          <span className="h-px w-16 bg-current" />
        </motion.div>

        <motion.p
          {...fade(0.25)}
          className="font-display italic text-2xl sm:text-3xl text-ink-2 mb-5"
        >
          {heroContent.subtitle}
        </motion.p>

        <motion.p
          {...fade(0.35)}
          className="text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-10"
        >
          {heroContent.description}
        </motion.p>

        <motion.div {...fade(0.45)}>
          <Link href={heroContent.ctaLink}>
            <Button
              size="lg"
              variant="primary"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              className="rounded-full px-7"
            >
              {heroContent.ctaText}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-8 left-0 right-0 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6"
      >
        {highlights.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2 text-sm text-muted"
          >
            <Icon size={15} className="text-purple-deep" aria-hidden="true" />
            {label}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
