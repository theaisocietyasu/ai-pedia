"use client"

import React from "react"
import { motion } from "framer-motion"
import { features } from "@/lib/constants"
import { GradientText } from "@/components/ui/gradient-text"
import { Eye, Code, Brain, Layers, Rocket, Users } from "lucide-react"

export function FeaturesGrid() {
  // helper function to get icon component
  const getIcon = (iconName?: string | React.ReactNode) => {
    if (!iconName) return null
    if (typeof iconName !== 'string') return iconName
    
    const icons: Record<string, React.ReactNode> = {
      Eye: <Eye size={24} />,
      Code: <Code size={24} />,
      Brain: <Brain size={24} />,
      Layers: <Layers size={24} />,
      Rocket: <Rocket size={24} />,
      Users: <Users size={24} />
    }
    
    return icons[iconName] || null
  }

  return (
    <section id="features" className="my-48 md:my-56 relative overflow-hidden bg-background">
      {/* animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(138, 43, 226, 0.1) 50%, transparent 70%)`,
            backgroundSize: "200% 200%"
          }}
        />
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
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Everything You Need to <GradientText>Master AI</GradientText>
            </h2>
            <p className="text-lg text-light-gray/80 max-w-3xl mx-auto">
              Comprehensive tools and resources designed to accelerate your AI learning journey
            </p>
          </motion.div>

          {/* features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group h-full relative"
              >
                {/* card background with gradient border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                           transition-opacity duration-500"
                  style={{ background: feature.gradient }}
                >
                  <div className="absolute inset-[1px] rounded-2xl bg-background" />
                </div>

                {/* card content */}
                <div className="relative h-full glass-effect rounded-2xl p-8
                              border border-white/10 group-hover:border-transparent
                              transition-all duration-300 space-y-6">
                  {/* icon */}
                  <div className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{ background: feature.gradient }}
                    >
                      <span className="text-white">{getIcon(feature.icon)}</span>
                    </motion.div>
                  </div>

                  {/* title */}
                  <h3 className="text-xl font-semibold text-white text-center
                               group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* description */}
                  <p className="text-light-gray/80 text-base leading-relaxed text-center">
                    {feature.description}
                  </p>

                  {/* hover effect decoration */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 w-2 h-2 rounded-full"
                    style={{ background: feature.gradient }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        </div>
      </div>
    </section>
  )
}