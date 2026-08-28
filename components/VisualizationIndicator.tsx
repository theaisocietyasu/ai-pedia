"use client";

import { Info } from "lucide-react";
import type React from "react";
import { extractVZComponents } from "@/lib/markdown-utils";

interface VisualizationIndicatorProps {
  content: string;
  className?: string;
}

export const VisualizationIndicator: React.FC<VisualizationIndicatorProps> = ({
  content,
  className = "",
}) => {
  const vizComponents = extractVZComponents(content);

  if (vizComponents.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1 text-xs text-purple-deep">
        <span className="w-2 h-2 bg-purple rounded-full"></span>
        <span>
          {vizComponents.length} visualization
          {vizComponents.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tooltip with visualization list */}
      <div className="group relative">
        <button
          type="button"
          aria-label="Visualization details"
          className="text-xs text-muted hover:text-foreground transition-colors"
        >
          <Info size={14} aria-hidden="true" />
        </button>
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-background border border-line rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
          <div className="text-xs font-medium text-purple-deep mb-2">
            Interactive Visualizations Found:
          </div>
          <div className="space-y-1">
            {vizComponents.map((viz) => (
              <div key={viz.id} className="text-xs text-ink-2">
                <span className="font-mono text-purple-deep">{viz.id}</span>
                <div className="text-muted ml-2">{viz.placeholder}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationIndicator;
