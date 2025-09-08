"use client"
import ReactMarkdown from "react-markdown";


import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"
import { desc } from "framer-motion/client"

import { categories } from "./categories"


export default function LearnPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-3 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl text-center gap-5 flex flex-col"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-20 h-20 rounded-2xl gradient-bg shadow-2xl shadow-purple/30 flex items-center justify-center"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <BookOpen size={40} className="text-white" />
          </motion.div>


          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold"
          >
            <GradientText>Learn, Visualize, & Conquer</GradientText> AI
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-light-gray/80"
          >
            Explore AI algorithms through interactive tutorials, explanations, and visualizations.
          </motion.p>

          {/* Category Headings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-8 w-full items-center"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                className="flex flex-col items-center text-center group w-full max-w-2xl"
              >
                <Link href={`/learn/${cat.title.toLowerCase().replace(/\s+/g, "-")}`} className="w-full">
                  <h2 className="text-2xl sm:text-3xl font-semibold transition-colors 
                                group-hover:bg-dark-gray border-2 border-light-gray 
                                w-full p-5 cursor-pointer">
                    {cat.title}
                  </h2>
                </Link>
                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out 
                            max-h-0 opacity-0 group-hover:max-h-fit group-hover:opacity-100 
                            w-full p-3 border-2 border-light-gray"
                >
                  <div className="text-base sm:text-lg text-light-gray/70">
                    <ReactMarkdown>
                      {cat.description || "Explore algorithms in this category"}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>


            ))}
          </motion.div>


          {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-10"
            >
              <Link href="/">
                <Button
                  variant="outline"
                  icon={<ArrowLeft size={18} />}
                  iconPosition="left"
                  style={{ padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer' }}
                >
                  Back to Home
                </Button>
              </Link>

              <Link href="/waitlist">
                <Button
                  variant="primary"
                  style={{ padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer' }}
                >
                  Join the Waitlist
                </Button>
              </Link>
            </motion.div>

        </motion.div>
      </div>
    </main>
  )
}