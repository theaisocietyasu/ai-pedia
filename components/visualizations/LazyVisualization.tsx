"use client";

import { motion } from "framer-motion";
import React, { lazy, Suspense } from "react";

// Lazy load the visualization registry to prevent SSR issues
const VisualizationRegistry = lazy(() =>
  import("./visualization-registry").then((module) => ({
    default: module.Visualization,
  })),
);

interface LazyVisualizationProps {
  componentId: string;
  fallbackTitle?: string;
}

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full h-64 bg-surface rounded-lg border border-line flex items-center justify-center"
  >
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted text-sm">Loading visualization…</p>
    </div>
  </motion.div>
);

const ErrorFallback = ({
  componentId,
  fallbackTitle,
}: LazyVisualizationProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full h-64 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center"
  >
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-700"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Visualization Error
      </h3>
      <p className="text-ink-2 text-sm mb-2">Failed to load "{componentId}"</p>
      <p className="text-muted text-xs">
        {fallbackTitle || "Interactive Visualization"}
      </p>
    </div>
  </motion.div>
);

export const LazyVisualization: React.FC<LazyVisualizationProps> = ({
  componentId,
  fallbackTitle,
}) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary
        fallback={
          <ErrorFallback
            componentId={componentId}
            fallbackTitle={fallbackTitle}
          />
        }
      >
        <VisualizationRegistry
          componentId={componentId}
          fallbackTitle={fallbackTitle}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

// Simple error boundary for visualization components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Visualization component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default LazyVisualization;
