"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { animationVariants, formatNumber } from "../../shared";

interface PerformanceData {
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
  adj_r2: number;
  samples: number;
}

type DatasetSize = "small" | "medium" | "large";

export const ModelEvaluationVisualization: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<DatasetSize>("medium");

  // Sample performance data for different dataset sizes
  const performanceData: Record<string, PerformanceData> = {
    small: {
      mse: 23.4,
      rmse: 4.84,
      mae: 3.21,
      r2: 0.892,
      adj_r2: 0.887,
      samples: 100,
    },
    medium: {
      mse: 45.7,
      rmse: 6.76,
      mae: 4.93,
      r2: 0.847,
      adj_r2: 0.841,
      samples: 1000,
    },
    large: {
      mse: 67.2,
      rmse: 8.2,
      mae: 6.14,
      r2: 0.823,
      adj_r2: 0.819,
      samples: 10000,
    },
  };

  const currentData = performanceData[selectedDataset];

  // Data for R² visualization
  const r2Data = [
    {
      name: "Explained Variance",
      value: currentData.r2 * 100,
      fill: "#5B4FB3",
    },
    {
      name: "Unexplained Variance",
      value: (1 - currentData.r2) * 100,
      fill: "#E3E0D6",
    },
  ];

  // Metric comparison chart data
  const metricComparison = [
    { metric: "MSE", value: currentData.mse, max: 100 },
    { metric: "RMSE", value: currentData.rmse, max: 10 },
    { metric: "MAE", value: currentData.mae, max: 8 },
    { metric: "R²", value: currentData.r2 * 100, max: 100 },
  ];

  return (
    <motion.div
      {...animationVariants.slideUp}
      className="w-full h-auto min-h-[400px] md:h-96 bg-surface rounded-lg border border-line p-4 md:p-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          Model Performance Dashboard
        </h3>

        {/* Dataset selector */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(performanceData).map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setSelectedDataset(size as DatasetSize)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedDataset === size
                  ? "bg-purple-wash text-purple-deep border border-purple"
                  : "bg-surface text-ink-2 border border-line hover:bg-surface-2"
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)} Dataset
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-[320px] lg:h-80">
        {/* Metrics Cards */}
        <div className="space-y-3">
          <div className="bg-surface border border-line rounded-lg p-3 md:p-4">
            <h4 className="text-purple-deep text-sm font-medium mb-2">
              Mean Squared Error
            </h4>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              {formatNumber(currentData.mse, 1)}
            </div>
            <div className="text-xs text-muted">Lower is better</div>
          </div>

          <div className="bg-surface border border-line rounded-lg p-3 md:p-4">
            <h4 className="text-purple text-sm font-medium mb-2">RMSE</h4>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              {formatNumber(currentData.rmse, 2)}
            </div>
            <div className="text-xs text-muted">Same units as target</div>
          </div>

          <div className="bg-surface border border-line rounded-lg p-3 md:p-4">
            <h4 className="text-purple text-sm font-medium mb-2">MAE</h4>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              {formatNumber(currentData.mae, 2)}
            </div>
            <div className="text-xs text-muted">Robust to outliers</div>
          </div>
        </div>

        {/* R² Pie Chart */}
        <div className="bg-surface border border-line rounded-lg p-3 md:p-4">
          <h4 className="text-green-700 text-sm font-medium mb-2">
            R² Score: {formatNumber(currentData.r2 * 100, 1)}%
          </h4>
          <div className="h-32 md:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={r2Data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {r2Data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]}
                  contentStyle={{
                    background: "#FAF9F5",
                    border: "1px solid #E3E0D6",
                    borderRadius: 6,
                    color: "#191918",
                    fontSize: "14px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-muted">Variance Explained</div>
            <div className="text-sm text-ink-2">
              Adj. R²: {formatNumber(currentData.adj_r2 * 100, 1)}%
            </div>
          </div>
        </div>

        {/* Metric Comparison */}
        <div className="bg-surface border border-line rounded-lg p-3 md:p-4">
          <h4 className="text-amber-700 text-sm font-medium mb-2">
            Normalized Metrics
          </h4>
          <div className="space-y-3">
            {metricComparison.map((item) => (
              <div key={item.metric}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink-2">{item.metric}</span>
                  <span className="text-foreground">
                    {formatNumber(item.value, item.metric === "R²" ? 1 : 2)}
                  </span>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-deep to-purple-light"
                    style={{
                      width: `${(item.value / item.max) * 100}%`,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-muted">
            Dataset size: {currentData.samples.toLocaleString()} samples
          </div>
        </div>
      </div>
    </motion.div>
  );
};
