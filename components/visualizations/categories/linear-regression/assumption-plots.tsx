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
      color: "#15803D",
    },
    heteroscedastic: {
      title: "Heteroscedasticity",
      description: "Residual variance increases with fitted values",
      color: "#B45309",
    },
    nonlinear: {
      title: "Non-linearity",
      description:
        "Clear pattern in residuals indicates missing non-linear terms",
      color: "#B91C1C",
    },
    nonnormal: {
      title: "Non-normal Residuals",
      description: "Residuals not normally distributed",
      color: "#5B4FB3",
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
      className="w-full overflow-y-scroll h-80 md:h-96 bg-surface rounded-lg border border-line p-4 md:p-6"
    >
      <div className="flex flex-col lg:flex-row h-full gap-4">
        {/* Plot Area */}
        <div className="flex-1 min-h-[250px] lg:min-h-0">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-4">
            Diagnostic Plot: {plotConfigs[currentPlot].title}
          </h3>

          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={plotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D6" />
                <XAxis
                  dataKey="fitted"
                  stroke="#6F6D66"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Fitted Values",
                    position: "insideBottom",
                    offset: -5,
                    style: { fill: "#6F6D66", fontSize: 12 },
                  }}
                />
                <YAxis
                  stroke="#6F6D66"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Residuals",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#6F6D66", fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FAF9F5",
                    border: "1px solid #E3E0D6",
                    borderRadius: 6,
                    color: "#191918",
                    fontSize: "14px",
                  }}
                />
                <Scatter
                  dataKey="residual"
                  fill={plotConfigs[currentPlot].color}
                  fillOpacity={0.6}
                />
                <ReferenceLine y={0} stroke="#191918" strokeDasharray="5 5" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs md:text-sm text-ink-2 mt-2">
            {plotConfigs[currentPlot].description}
          </p>
        </div>

        {/* Controls - Mobile: Bottom, Desktop: Right */}
        <div className="lg:w-48 lg:ml-6 mt-4 lg:mt-0">
          <h4 className="text-sm md:text-md font-medium text-foreground mb-3">
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
                    ? "bg-purple-wash border-purple text-purple-deep"
                    : "bg-surface border-line text-ink-2 hover:bg-surface-2"
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

          <div className="mt-6 p-3 bg-surface border border-line rounded-lg">
            <h5 className="text-sm font-medium text-foreground mb-2">
              Key Insights:
            </h5>
            <ul className="text-xs text-ink-2 space-y-1">
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
