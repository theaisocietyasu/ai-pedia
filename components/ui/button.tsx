"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import type { ButtonSize, ButtonVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-ink-2",
  secondary: "bg-surface text-foreground border border-line hover:bg-surface-2",
  outline:
    "border border-foreground/30 text-foreground hover:border-foreground hover:bg-surface",
  ghost: "text-foreground hover:bg-surface",
  gradient: "bg-purple-deep text-background hover:bg-purple",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-base",
  xl: "px-9 py-4 text-lg",
};

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
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-md",
          "font-medium tracking-tight transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && "w-full",
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-2",
            loading && "opacity-0",
          )}
        >
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";
