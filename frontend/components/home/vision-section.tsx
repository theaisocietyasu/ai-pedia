"use client"

import React from "react"
import { motion } from "framer-motion"
import { visionItems } from "@/lib/constants"
import { GradientText } from "@/components/ui/gradient-text"
import { Target, Star, Rocket } from "lucide-react"

export function VisionSection() {
  // helper function to get icon component
  const getIcon = (iconName?: string | React.ReactNode) => {
    if (!iconName) return null
    if (typeof iconName !== 'string') return iconName
    
    const icons: Record<string, React.ReactNode> = {
      Target: <Target size={24} />,
      Star: <Star size={24} />,
      Rocket: <Rocket size={24} />
    }
    
    return icons[iconName] || null
  }

  return (
    <section id="vision" className="pt-64 pb-32 relative overflow-hidden bg-background">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative w-full flex justify-center items-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl w-full text-center">
          {/* section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center w-full mb-32 pt-20 pb-8"
            style={{ paddingTop: '5rem', paddingBottom: '2rem' }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Our <GradientText>Vision</GradientText> for AI Education
            </h2>
            <p className="text-lg text-light-gray/80 max-w-4xl mx-auto text-center"
               style={{ textAlign: 'center', margin: '0 auto', paddingTop: '1rem', paddingBottom: '1rem' }}>
              We believe in making AI education accessible, engaging, and impactful for every student
            </p>
          </motion.div>

          {/* vision items */}
          <div className="grid gap-20 md:gap-24 w-full" style={{ paddingLeft: '5rem', paddingRight: '5rem' }}>
          {visionItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto
                       ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              {/* icon container */}
              <div className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-24 h-24 rounded-2xl gradient-bg flex items-center 
                           justify-center shadow-2xl shadow-purple/30"
                >
                  <span className="text-white">{getIcon(item.icon)}</span>
                </motion.div>
              </div>

              {/* content */}
              <div className="flex-1 text-center md:text-left space-y-8" style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                <h3 className="text-2xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-light-gray/80 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* decorative elements */}
          <div className="mt-32 relative w-full flex justify-center"
               style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative max-w-4xl w-full"
            >
              <div className="glass-effect rounded-2xl p-16 md:p-24 text-center space-y-10">
                <blockquote className="text-xl md:text-2xl font-medium text-white/90 italic">
                  "The future of AI is not just about building intelligent systems, 
                  but about empowering everyone to understand and shape that future."
                </blockquote>
                <cite className="block mt-4 text-light-gray/60 not-italic">
                  — The AI Society Leadership Team
                </cite>
              </div>

              {/* floating decorations */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -left-6 w-12 h-12 rounded-lg bg-purple/20 
                         backdrop-blur-sm border border-purple/30"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -10, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-pink/20 
                         backdrop-blur-sm border border-pink/30"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}