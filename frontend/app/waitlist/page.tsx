"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Mail, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // placeholder for form submission
    if (email) {
      setIsSubmitted(true)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl text-center"
        >
          {!isSubmitted ? (
            <>
              {/* icon */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl 
                         gradient-bg shadow-2xl shadow-purple/30"
                style={{ marginBottom: '1.3rem' }}
              >
                <Users size={40} className="text-white" />
              </motion.div>

              {/* title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-5xl font-bold"
                style={{ marginBottom: '1.2rem' }}
              >
                Join the <GradientText>Waitlist</GradientText>
              </motion.h1>

              {/* description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-light-gray/80"
                style={{ marginBottom: '1.3rem' }}
              >
                Be the first to know when we launch our comprehensive AI learning platform. 
                Get early access and exclusive benefits!
              </motion.p>

              {/* benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid sm:grid-cols-3 gap-6"
                style={{ marginBottom: '1.3rem' }}
              >
                {[
                  "Early Access",
                  "Exclusive Content",
                  "Founding Member Status"
                ].map((benefit, index) => (
                  <div key={index} className="glass-effect rounded-lg border border-white/10 text-center" style={{ padding: '1.25rem', marginTop: '1rem', marginBottom: '1rem' }}>
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles size={16} className="text-purple" />
                      <span className="text-sm font-medium text-white">{benefit}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onSubmit={handleSubmit}
                className="w-full"
                style={{ marginBottom: '1.3rem' }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full text-white placeholder-light-gray/50 focus:outline-none 
                               focus:border-purple transition-colors bg-white/5 border border-white/10"
                      style={{ padding: '12px 16px', borderRadius: '9999px', height: '48px' }}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="gradient" 
                    size="lg"
                    style={{ padding: '12px 24px', borderRadius: '9999px', height: '48px' }}
                  >
                    Join Waitlist
                  </Button>
                </div>
              </motion.form>

              {/* message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass-effect rounded-xl border border-purple/20"
                style={{ padding: '2rem', marginBottom: '1.3rem' }}
              >
                <p className="text-sm text-light-gray/80 text-center">
                  <span className="font-semibold text-white">Development Note:</span>
                  <br />
                  This waitlist form is currently a placeholder. The backend integration 
                  for collecting emails will be implemented by our development team soon. 
                  For now, you can follow us on social media to stay updated!
                </p>
              </motion.div>

              {/* back button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
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
              </motion.div>
            </>
          ) : (
            <>
              {/* success state */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                             bg-green-500/20" style={{ marginBottom: '1.5rem' }}>
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                
                <h2 className="text-3xl font-bold" style={{ marginBottom: '2rem' }}>
                  <GradientText>You're on the list!</GradientText>
                </h2>
                
                <p className="text-light-gray/80" style={{ marginBottom: '3rem' }}>
                  Thanks for joining! We'll notify you at <span className="font-semibold text-white">{email}</span> when we launch.
                </p>

                <div className="glass-effect rounded-xl border border-green-500/20" style={{ padding: '2rem', marginBottom: '3rem' }}>
                  <p className="text-sm text-light-gray/80 text-center">
                    <span className="font-semibold text-white">What's next?</span>
                    <br />
                    Follow us on social media for updates, sneak peeks, and AI learning tips 
                    while we prepare something amazing for you!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/">
                    <Button 
                      variant="primary"
                      style={{ padding: '6px 12px', borderRadius: '9999px' }}
                    >
                      Return to Home
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                    style={{ padding: '6px 12px', borderRadius: '9999px' }}
                  >
                    Add Another Email
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </main>
  )
}