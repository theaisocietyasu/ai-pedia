"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"
import { heroContent } from "@/lib/constants"

export function HeroSection() {
  const scrollToNext = () => {
    const element = document.getElementById("features")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen w-full flex items-start justify-center overflow-hidden pt-40 pb-16 bg-background">
      {/* animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-purple/20 rounded-full blur-3xl"
        />

        {/* grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      <div className="relative w-full flex justify-center items-center px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full
                     bg-white/5 border border-white/10 px-4 py-2 mb-8"
          >
            <Sparkles size={16} className="text-purple" />
            <span className="text-sm text-light-gray">Powered by The AI Society at ASU</span>
          </motion.div>

          {/* main title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8"
          >
            <GradientText animate={false}>
              {heroContent.title}
            </GradientText>
          </motion.h1>

          {/* subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-medium text-light-gray mb-6"
          >
            {heroContent.subtitle}
          </motion.p>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-light-gray/80 max-w-2xl leading-relaxed mb-12"
          >
            {heroContent.description}
          </motion.p>

          {/* cta buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link href={heroContent.ctaLink}>
              <Button
                size="lg"
                variant="primary"
                icon={<ArrowRight size={20} />}
                iconPosition="right"
                className="rounded-full"
              >
                {heroContent.ctaText}
              </Button>
            </Link>

            {heroContent.secondaryCtaText && heroContent.secondaryCtaLink && (
              <Link href={heroContent.secondaryCtaLink}>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                >
                  {heroContent.secondaryCtaText}
                </Button>
              </Link>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  )
}