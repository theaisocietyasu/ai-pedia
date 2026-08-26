"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animate?: boolean;
  delay?: number;
}

export function GradientText({
  children,
  className,
  gradient = "from-purple via-pink to-blue-purple",
  animate = true,
  delay = 0,
}: GradientTextProps) {
  return (
    <motion.span
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "inline-block bg-gradient-to-r bg-clip-text text-transparent",
        "bg-[length:200%_auto] animate-gradient-shift",
        gradient,
        className,
      )}
      style={{
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </motion.span>
  );
}
