"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";

import { getCategories, type LearnCategoryUI } from "./categories";

export default function LearnPage() {
  const [categories, setCategories] = useState<Record<string, LearnCategoryUI>>(
    {},
  );
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
        console.error("Error loading categories:", err);
        setError("Failed to load learning categories. Please try again later.");
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
    <main className="min-h-screen relative overflow-hidden ">
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
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
              delay: 1,
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-pink/30 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            {/* badge */}

            {/* title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8"
            >
              <GradientText animate={false}>Learn</GradientText>
            </motion.h1>

            {/* subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-light-gray/80 max-w-3xl mx-auto leading-relaxed"
            >
              Explore the beginner and deep dive tutorials in artificial
              intelligence.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Category Headings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col mt-12 gap-8 w-full items-center"
      >
        {loading
          ? // Show skeleton cards while loading
            Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static skeleton placeholders
              <SkeletonCard key={i} index={i} />
            ))
          : // Show actual categories when loaded
            Object.entries(categories).map(([key, cat], i) => (
              <motion.div
                key={key}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                className="w-full max-w-2xl"
              >
                <Link href={`/learn/${key}`} className="block">
                  <div className="glass-effect rounded-2xl p-6 hover-glow cursor-pointer transition-all duration-300 border border-purple/20 hover:border-purple/40">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 capitalize gradient-text">
                      {`${key.replace("-", " ")} Learning`}
                    </h2>
                    <div className="text-base sm:text-lg text-light-gray/80">
                      <ReactMarkdown>
                        {cat.description ||
                          "Explore algorithms in this category"}
                      </ReactMarkdown>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
      </motion.div>
    </main>
  );
}
