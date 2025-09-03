"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Info, Heart, Trophy, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl 
                     gradient-bg mb-8 shadow-2xl shadow-purple/30"
          >
            <Info size={40} className="text-white" />
          </motion.div>

          {/* title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            About <GradientText>The AI Society</GradientText>
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-light-gray/80 mb-8"
          >
            Our story, mission, and the team behind ASU's premier AI learning platform 
            will be shared here soon. Stay tuned!
          </motion.p>

          {/* value cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-4 mb-10"
          >
            {[
              { icon: <Heart size={20} />, label: "Our Passion", value: "AI Education" },
              { icon: <Trophy size={20} />, label: "Our Goal", value: "Empower Students" },
              { icon: <Target size={20} />, label: "Our Vision", value: "AI for Everyone" }
            ].map((item, index) => (
              <div key={index} className="glass-effect rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-center text-pink mb-2">
                  {item.icon}
                </div>
                <h3 className="text-sm font-medium text-white mb-1">{item.label}</h3>
                <p className="text-xs text-light-gray/60">{item.value}</p>
              </div>
            ))}
          </motion.div>

          {/* message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-effect rounded-xl p-6 mb-8 border border-pink/20"
          >
            <p className="text-sm text-light-gray/80">
              <span className="font-semibold text-white">Coming Soon:</span>
              <br />
              Learn about The AI Society's journey at Arizona State University, 
              meet our leadership team, discover our achievements, and understand 
              our commitment to democratizing AI education. This page is being 
              crafted by our content team to showcase our story and impact.
            </p>
          </motion.div>

          {/* placeholder info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-xs text-light-gray/50 mb-8"
          >
            <p>Page under development • Content team working on this section</p>
          </motion.div>

          {/* cta buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/">
              <Button
                variant="outline"
                icon={<ArrowLeft size={18} />}
                iconPosition="left"
              >
                Back to Home
              </Button>
            </Link>

            <a
              href="https://www.instagram.com/theaisociety.asu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary">
                Follow Us on Instagram
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}