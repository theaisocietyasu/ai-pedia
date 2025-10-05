"use client"

import { forwardRef, ButtonHTMLAttributes } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ButtonVariant, ButtonSize } from "@/lib/types"

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const buttonVariants = {
  primary: "bg-gradient-to-r from-purple to-pink text-white hover:shadow-lg hover:shadow-purple/30",
  secondary: "bg-dark-gray text-white hover:bg-dark-gray/80",
  outline: "border border-white/20 text-white hover:bg-white/10",
  ghost: "text-white hover:bg-white/10",
  gradient: "gradient-bg text-white hover:shadow-lg hover:shadow-purple/30"
}

const buttonSizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-10 py-4 text-lg",
  xl: "px-12 py-5 text-xl"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = "left",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const MotionButton = motion.button

    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "font-medium rounded-lg transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* content */}
        <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </span>

        {/* hover effect overlay */}
        <span className="absolute inset-0 rounded-lg overflow-hidden">
          <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
        </span>
      </MotionButton>
    )
  }
)

Button.displayName = "Button"