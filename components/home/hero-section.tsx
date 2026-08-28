"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/lib/constants";

/** Path under public/ for the hero background illustration; leave empty for the plain paper look. */
const HERO_ART = "/art/map.svg";

export function HeroSection() {
  return (
    <section className="relative h-[calc(100svh-3rem)] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Hand-drawn map of the field, printed faintly on the paper; the centre is masked clear for the title. */}
      {HERO_ART && (
        <img
          src={HERO_ART}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover scale-[1.08] pointer-events-none select-none opacity-[0.16] sm:opacity-[0.22]"
          style={{
            maskImage:
              "radial-gradient(ellipse 34% 40% at 50% 52%, transparent 0%, transparent 55%, black 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 34% 40% at 50% 52%, transparent 0%, transparent 55%, black 100%)",
          }}
        />
      )}

      <div className="relative w-full max-w-3xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        <p className="eyebrow mb-10">
          The AI Society · Arizona State University
        </p>

        <h1 className="font-display text-6xl sm:text-7xl md:text-[6.5rem] leading-none mb-8">
          {heroContent.title}
        </h1>

        <div
          className="flex items-center gap-4 mb-8 text-purple"
          aria-hidden="true"
        >
          <span className="h-px w-16 bg-current" />
          <span className="text-xs">✦</span>
          <span className="h-px w-16 bg-current" />
        </div>

        <p className="font-display italic text-2xl sm:text-3xl text-ink-2 mb-5">
          {heroContent.subtitle}
        </p>

        <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-10">
          {heroContent.description}
        </p>

        <div>
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
        </div>
      </div>
    </section>
  );
}
