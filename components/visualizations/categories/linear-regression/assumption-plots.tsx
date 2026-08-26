"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  animationVariants,
  ButtonGroup,
  generateDiagnosticData,
  type PlotConfig,
} from "../../shared";

type PlotType = "good" | "heteroscedastic" | "nonlinear" | "nonnormal";

export const AssumptionPlotsVisualization: React.FC = () => {
  const [currentPlot, setCurrentPlot] = useState<PlotType>("good");
  const plotData = generateDiagnosticData(currentPlot);

  const plotConfigs: Record<string, PlotConfig> = {
    good: {
      title: "Good Model",
      description: "Residuals randomly scattered around zero",
      color: "#10b981",
    },
    heteroscedastic: {
      title: "Heteroscedasticity",
      description: "Residual variance increases with fitted values",
      color: "#f59e0b",
    },
    nonlinear: {
      title: "Non-linearity",
      description:
        "Clear pattern in residuals indicates missing non-linear terms",
      color: "#ef4444",
    },
    nonnormal: {
      title: "Non-normal Residuals",
      description: "Residuals not normally distributed",
      color: "#8b5cf6",
    },
  };

  const plotOptions = Object.entries(plotConfigs).map(([key, config]) => ({
    key,
    label: config.title,
    description:
      key === "good"
        ? "No violations"
        : key === "heteroscedastic"
          ? "Variance issue"
          : key === "nonlinear"
            ? "Pattern in residuals"
            : "Distribution issue",
  }));

  return (
    <motion.div
      {...animationVariants.slideUp}
      className="w-full overflow-y-scroll h-80 md:h-96 bg-gradient-to-br from-gray-900/50 to-purple/10 rounded-lg border border-white/10 p-4 md:p-6"
    >
      <div className="flex flex-col lg:flex-row h-full gap-4">
        {/* Plot Area */}
        <div className="flex-1 min-h-[250px] lg:min-h-0">
          <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">
            Diagnostic Plot: {plotConfigs[currentPlot].title}
          </h3>

          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={plotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="fitted"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Fitted Values",
                    position: "insideBottom",
                    offset: -5,
                    style: { fill: "#9ca3af", fontSize: 12 },
                  }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Residuals",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#9ca3af", fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                />
                <Scatter
                  dataKey="residual"
                  fill={plotConfigs[currentPlot].color}
                  fillOpacity={0.6}
                />
                <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="5 5" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs md:text-sm text-gray-300 mt-2">
            {plotConfigs[currentPlot].description}
          </p>
        </div>

        {/* Controls - Mobile: Bottom, Desktop: Right */}
        <div className="lg:w-48 lg:ml-6 mt-4 lg:mt-0">
          <h4 className="text-sm md:text-md font-medium text-white mb-3">
            Plot Types
          </h4>

          {/* Mobile: Horizontal buttons */}
          <div className="lg:hidden grid grid-cols-2 gap-2 mb-4">
            {plotOptions.map((option) => (
              <button
                type="button"
                key={option.key}
                onClick={() => setCurrentPlot(option.key as PlotType)}
                className={`text-left p-2 rounded-lg border transition-all text-sm ${
                  currentPlot === option.key
                    ? "bg-purple/20 border-purple text-white"
                    : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  {option.description}
                </div>
              </button>
            ))}
          </div>

          {/* Desktop: Vertical buttons */}
          <div className="hidden lg:block">
            <ButtonGroup
              options={plotOptions}
              selected={currentPlot}
              onChange={(key) => setCurrentPlot(key as PlotType)}
            />
          </div>

          <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
            <h5 className="text-sm font-medium text-white mb-2">
              Key Insights:
            </h5>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Random scatter = Good model</li>
              <li>• Funnel shape = Heteroscedasticity</li>
              <li>• Curved pattern = Non-linearity</li>
              <li>• Extreme outliers = Non-normality</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
