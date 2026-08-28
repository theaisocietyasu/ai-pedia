"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/lib/content";

export function CategoryList({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <p className="text-center text-muted">
        No categories yet. Add a folder under <code>content/</code> to get
        started.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto border-t border-line">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
        >
          <Link
            href={`/learn/${cat.slug}`}
            className="group block py-8 border-b border-line"
          >
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-display text-3xl group-hover:text-purple-deep transition-colors">
                {cat.title}
              </h2>
              <ArrowRight
                size={18}
                className="shrink-0 text-muted group-hover:text-purple-deep group-hover:translate-x-1 transition-all"
                aria-hidden="true"
              />
            </div>
            {cat.description && (
              <p className="mt-3 text-base text-ink-2 leading-relaxed">
                {cat.description}
              </p>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
