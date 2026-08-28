"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

/**
 * Accent heading text. Kept under its historical name; renders in the
 * deep lavender ink rather than a gradient so it reads cleanly on paper.
 */
export function GradientText({
  children,
  className,
  animate = true,
  delay = 0,
}: GradientTextProps) {
  return (
    <motion.span
      initial={animate ? { opacity: 0, y: 12 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay }}
      className={cn("inline-block text-purple-deep", className)}
    >
      {children}
    </motion.span>
  );
}
