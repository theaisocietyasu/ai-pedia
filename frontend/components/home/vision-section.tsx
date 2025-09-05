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
    <section id="vision" className="my-48 md:my-56 relative overflow-hidden bg-background">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="w-full text-center">
          {/* section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-20 pt-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 pt-8">
              Our <GradientText>Vision</GradientText> for AI Education
            </h2>
            <p className="text-lg text-light-gray/80 max-w-3xl mx-auto" style={{ paddingTop: '3rem', paddingBottom: '4rem', textAlign: 'center', marginLeft: '12rem' }}>
              We believe in making AI education accessible, engaging, and impactful for every student
            </p>
          </motion.div>

          {/* vision items */}
          <div className="grid gap-16 md:gap-20 w-full" style={{ margin: '0 auto', paddingLeft: '32px', paddingRight: '32px' }}>
          {visionItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8 items-center max-w-5xl mx-auto"
              style={{ margin: '0 auto', textAlign: 'center' }}
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
              <div className="flex-1 space-y-6" style={{ textAlign: 'center', margin: '0 32px', paddingLeft: '24px', paddingRight: '24px' }}>
                <h3 className="text-2xl font-bold text-white"
                    style={{ margin: '0 16px', padding: '8px 12px' }}>
                  {item.title}
                </h3>
                <p className="text-light-gray/80 leading-relaxed"
                   style={{ margin: '0 16px 2rem 16px', padding: '8px 12px' }}>
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