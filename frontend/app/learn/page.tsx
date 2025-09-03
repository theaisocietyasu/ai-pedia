"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"

export default function LearnPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl text-center"
        >
          {/* icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl 
                     gradient-bg shadow-2xl shadow-purple/30"
            style={{ marginBottom: '2rem' }}
          >
            <BookOpen size={40} className="text-white" />
          </motion.div>

          {/* title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold"
            style={{ marginBottom: '1.5rem' }}
          >
            <GradientText>Learning Content</GradientText> Coming Soon
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-light-gray/80"
            style={{ marginBottom: '2rem' }}
          >
            Our team is working hard to bring you comprehensive AI learning materials, 
            interactive tutorials, and hands-on projects. Check back soon!
          </motion.p>

          {/* status cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-6"
            style={{ marginBottom: '2rem' }}
          >
            {[
              { icon: <BookOpen size={20} />, label: "50+ Courses", status: "In Development" },
              { icon: <Clock size={20} />, label: "Launch Date", status: "Q1 2025" },
              { icon: <Users size={20} />, label: "Early Access", status: "Available Soon" }
            ].map((item, index) => (
              <div key={index} className="glass-effect rounded-lg border border-white/10 text-center" style={{ padding: '1.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <div className="flex items-center justify-center gap-2 text-purple" style={{ marginBottom: '0.5rem' }}>
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <p className="text-xs text-light-gray/60">{item.status}</p>
              </div>
            ))}
          </motion.div>

          {/* message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-effect rounded-xl border border-purple/20"
            style={{ padding: '2rem', marginBottom: '2rem' }}
          >
            <p className="text-sm text-light-gray/80 text-center">
              <span className="font-semibold text-white">Note from the development team:</span>
              <br />
              This page is currently being developed by our content team. 
              We're creating high-quality AI learning materials that will help you 
              master artificial intelligence concepts through interactive visualizations 
              and practical exercises.
            </p>
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
                style={{ padding: '6px 12px', borderRadius: '9999px' }}
              >
                Back to Home
              </Button>
            </Link>

            <Link href="/waitlist">
              <Button 
                variant="primary"
                style={{ padding: '6px 12px', borderRadius: '9999px' }}
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