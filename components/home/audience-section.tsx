"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check, BookOpen, Eye } from "lucide-react"
import { audienceSegments } from "@/lib/constants"
import { GradientText } from "@/components/ui/gradient-text"

export function AudienceSection() {
  // helper function to get icon component
  const getIcon = (iconName?: string | React.ReactNode) => {
    if (!iconName) return null
    if (typeof iconName !== 'string') return iconName
    
    const icons: Record<string, React.ReactNode> = {
      BookOpen: <BookOpen size={32} />,
      Eye: <Eye size={32} />
    }
    
    return icons[iconName] || null
  }

  return (
    <section id="audience" className="my-48 md:my-56 relative overflow-hidden bg-background">
      {/* background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="w-full">
          {/* section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20 pt-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Built for <GradientText>AI Enthusiasts</GradientText>
            </h2>
            <p className="text-lg text-light-gray/80 max-w-3xl mx-auto">
              Whether you want to learn the fundamentals or visualize complex algorithms,
              we've got you covered
            </p>
          </motion.div>

          {/* audience segments */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {audienceSegments.map((segment, index) => (
            <motion.div
              key={segment.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full glass-effect rounded-2xl p-8 hover:shadow-2xl
                         hover:shadow-purple/20 transition-all duration-300
                         border border-white/10 hover:border-purple/30 space-y-6"
              >
                {/* icon */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-xl gradient-bg flex items-center
                             justify-center shadow-lg shadow-purple/30"
                  >
                    <span className="text-white">{getIcon(segment.icon)}</span>
                  </motion.div>
                </div>

                {/* title and description */}
                <h3 className="text-2xl font-bold text-white">
                  {segment.title}
                </h3>
                <p className="text-light-gray/80">
                  {segment.description}
                </p>

                {/* benefits list */}
                <ul className="space-y-4">
                  {segment.benefits.map((benefit, benefitIndex) => (
                    <motion.li
                      key={benefitIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.2 + benefitIndex * 0.1
                      }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple/20
                                     flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-purple" />
                      </span>
                      <span className="text-sm text-light-gray/80">
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>

        </div>
      </div>
    </section>
  )
}