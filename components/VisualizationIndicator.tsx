"use client";

import type React from "react";
import { extractVZComponents, type VZComponent } from "@/lib/markdown-utils";

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
      <div className="flex items-center gap-1 text-xs text-purple-300">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
        <span>
          {vizComponents.length} visualization
          {vizComponents.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tooltip with visualization list */}
      <div className="group relative">
        <button className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
          ℹ️
        </button>
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-800 border border-gray-600 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
          <div className="text-xs font-medium text-purple-300 mb-2">
            Interactive Visualizations Found:
          </div>
          <div className="space-y-1">
            {vizComponents.map((viz, index) => (
              <div key={index} className="text-xs text-gray-300">
                <span className="font-mono text-purple-200">{viz.id}</span>
                <div className="text-gray-400 ml-2">• {viz.placeholder}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationIndicator;
