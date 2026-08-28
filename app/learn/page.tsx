"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

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
        setCategories(await getCategories());
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load learning categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (error) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-4">Learn</p>
        <h1 className="font-display text-4xl mb-4">Something went wrong</h1>
        <p className="text-ink-2 mb-8 max-w-md">{error}</p>
        <Link href="/">
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            iconPosition="left"
            className="rounded-full"
          >
            Back to home
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="container pt-24 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-5"
          >
            The AI Society · Arizona State University
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl mb-6"
          >
            Learn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display italic text-xl sm:text-2xl text-ink-2"
          >
            Beginner and deep-dive tutorials in artificial intelligence.
          </motion.p>
        </div>
      </section>

      <section className="container pb-24">
        <div className="max-w-2xl mx-auto border-t border-line">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static skeleton placeholders
                  key={i}
                  className="py-8 border-b border-line animate-pulse"
                >
                  <div className="h-7 w-1/2 bg-surface-2 rounded mb-4" />
                  <div className="h-4 bg-surface-2 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-surface-2 rounded" />
                </div>
              ))
            : Object.entries(categories).map(([key, cat], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <Link
                    href={`/learn/${key}`}
                    className="group block py-8 border-b border-line"
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <h2 className="font-display text-3xl capitalize group-hover:text-purple-deep transition-colors">
                        {key.replace(/-/g, " ")}
                      </h2>
                      <ArrowRight
                        size={18}
                        className="shrink-0 text-muted group-hover:text-purple-deep group-hover:translate-x-1 transition-all"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-base text-ink-2 leading-relaxed">
                      <ReactMarkdown>
                        {cat.description ||
                          "Explore algorithms in this category"}
                      </ReactMarkdown>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>
    </main>
  );
}
