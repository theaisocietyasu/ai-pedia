"use client"
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"
import { desc } from "framer-motion/client"

import { getCategories } from "./categories"


export default function LearnPage() {
  const [categories, setCategories] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        // console.log('Loaded categories:', categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load learning categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Skeleton component for loading state
  const SkeletonCard = ({ index }: { index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
      className="w-full max-w-2xl"
    >
      <div className="glass-effect rounded-2xl p-6 border border-purple/20">
        <div className="h-8 bg-dark-gray/50 rounded-lg mb-4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-dark-gray/30 rounded animate-pulse"></div>
          <div className="h-4 bg-dark-gray/30 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );

  if (error) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="relative min-h-screen flex flex-col items-center justify-center px-3 sm:px-8 lg:px-12">
          <div className="w-full max-w-4xl text-center">
            <div className="w-20 h-20 rounded-2xl gradient-bg shadow-2xl shadow-purple/30 flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <GradientText>Error Loading Content</GradientText>
            </h1>
            <p className="text-lg text-light-gray/80 mb-6">{error}</p>
            <Link href="/">
              <Button
                variant="outline"
                icon={<ArrowLeft size={18} />}
                iconPosition="left"
                className="rounded-full"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))
            ) : (
              // Show actual categories when loaded
              Object.entries(categories).map(([key, cat], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                  className="w-full max-w-2xl"
                >
                  <Link href={`/learn/${key}`} className="block">
                    <div className="glass-effect rounded-2xl p-6 hover-glow cursor-pointer transition-all duration-300 border border-purple/20 hover:border-purple/40">
                      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 capitalize gradient-text">
                        {key.replace('-', ' ') + " Learning"}
                      </h2>
                      <div className="text-base sm:text-lg text-light-gray/80">
                        <ReactMarkdown>
                          {cat.description || "Explore algorithms in this category"}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>



        </motion.div>
      </div>
    </main>
  )
}