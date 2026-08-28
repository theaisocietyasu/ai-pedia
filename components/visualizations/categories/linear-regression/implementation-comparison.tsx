"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { animationVariants, ButtonGroup } from "../../shared";

interface ComparisonData {
  method: string;
  mse: number;
  r2: number;
  time: number;
  color: string;
}

interface MetricConfig {
  label: string;
  key: keyof ComparisonData;
  unit: string;
  lower_better: boolean;
}

type MetricKey = "mse" | "r2" | "time";

export const RegressionComparisonVisualization: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("mse");

  // Sample comparison data
  const comparisonData: ComparisonData[] = [
    {
      method: "From Scratch (Normal Eq.)",
      mse: 45.2,
      r2: 0.847,
      time: 0.023,
      color: "#5B4FB3",
    },
    {
      method: "From Scratch (Gradient Desc.)",
      mse: 45.8,
      r2: 0.843,
      time: 0.156,
      color: "#8F84D6",
    },
    {
      method: "Scikit-learn",
      mse: 44.9,
      r2: 0.851,
      time: 0.008,
      color: "#C6BFEC",
    },
  ];

  const metrics: Record<string, MetricConfig> = {
    mse: {
      label: "Mean Squared Error",
      key: "mse",
      unit: "",
      lower_better: true,
    },
    r2: { label: "R² Score", key: "r2", unit: "", lower_better: false },
    time: {
      label: "Training Time",
      key: "time",
      unit: "s",
      lower_better: true,
    },
  };

  const metricOptions = Object.entries(metrics).map(([key, metric]) => ({
    key,
    label: metric.label,
    description: metric.lower_better ? "Lower is better" : "Higher is better",
  }));

  return (
    <motion.div
      {...animationVariants.scaleIn}
      className="w-full h-80 md:h-96 bg-surface rounded-lg border border-line p-4 md:p-6"
    >
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-4">
        Implementation Comparison
      </h3>

      <div className="flex flex-col lg:flex-row h-full gap-4">
        {/* Chart */}
        <div className="flex-1 min-h-[250px] lg:min-h-0">
          <div className="h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D6" />
                <XAxis
                  dataKey="method"
                  stroke="#6F6D66"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis stroke="#6F6D66" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#FAF9F5",
                    border: "1px solid #E3E0D6",
                    borderRadius: 6,
                    color: "#191918",
                    fontSize: "14px",
                  }}
                  formatter={(value) => [
                    `${value}${metrics[selectedMetric].unit}`,
                    metrics[selectedMetric].label,
                  ]}
                />
                <Bar
                  dataKey={metrics[selectedMetric].key}
                  fill={comparisonData[0].color}
                  radius={[4, 4, 0, 0]}
                >
                  {comparisonData.map((entry) => (
                    <Cell key={entry.method} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls and Info */}
        <div className="lg:w-56 lg:ml-6 mt-4 lg:mt-0">
          <h4 className="text-sm md:text-md font-medium text-foreground mb-3">
            Metrics
          </h4>

          {/* Mobile: Horizontal buttons */}
          <div className="lg:hidden grid grid-cols-3 gap-2 mb-4">
            {metricOptions.map((option) => (
              <button
                type="button"
                key={option.key}
                onClick={() => setSelectedMetric(option.key as MetricKey)}
                className={`text-center p-2 rounded-lg border transition-all text-xs ${
                  selectedMetric === option.key
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
          <div className="hidden lg:block mb-6">
            <ButtonGroup
              options={metricOptions}
              selected={selectedMetric}
              onChange={(key) => setSelectedMetric(key as MetricKey)}
            />
          </div>

          <div className="p-3 bg-surface border border-line rounded-lg">
            <h5 className="text-sm font-medium text-foreground mb-2">
              Trade-offs:
            </h5>
            <ul className="text-xs text-ink-2 space-y-1">
              <li>
                <span className="text-purple-deep">•</span> Normal Eq: Fast,
                exact
              </li>
              <li>
                <span className="text-purple">•</span> Gradient Desc: Scalable
              </li>
              <li>
                <span className="text-purple-light">•</span> Scikit-learn:
                Optimized
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
