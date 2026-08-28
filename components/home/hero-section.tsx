"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/lib/constants";

/** Path under public/ for the hero background illustration; leave empty for the plain paper look. */
const HERO_ART = "/art/map.svg";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function HeroSection() {
  return (
    <section className="relative h-[calc(100svh-3rem)] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Hand-drawn map of the field, printed faintly on the paper; the centre is masked clear for the title. */}
      {HERO_ART && (
        <img
          src={HERO_ART}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover scale-[1.04] pointer-events-none select-none opacity-[0.16] sm:opacity-[0.22]"
          style={{
            maskImage:
              "radial-gradient(ellipse 34% 40% at 50% 52%, transparent 0%, transparent 55%, black 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 34% 40% at 50% 52%, transparent 0%, transparent 55%, black 100%)",
          }}
        />
      )}

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
    </section>
  );
}
