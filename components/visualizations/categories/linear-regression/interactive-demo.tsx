"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  generatePolynomialData,
  SliderControl,
} from "../../shared";

type DemoType = "polynomial" | "regularization" | "comparison";

export const InteractiveDemoVisualization: React.FC = () => {
  const [demoType, setDemoType] = useState<DemoType>("polynomial");
  const [polynomialDegree, setPolynomialDegree] = useState(2);
  const [regularizationStrength, setRegularizationStrength] = useState(0.1);

  // Generate regularization data
  const generateRegularizationData = () => {
    const data = [];
    const features = 10;
    for (let i = 0; i < features; i++) {
      const coefficient =
        Math.exp(-regularizationStrength * i) * (Math.random() * 2 - 1);
      data.push({
        feature: `Feature ${i + 1}`,
        coefficient: coefficient,
        regularized: coefficient * Math.exp(-regularizationStrength * i),
      });
    }
    return data;
  };

  const polynomialData = generatePolynomialData(polynomialDegree);
  const regularizationData = generateRegularizationData();

  const demoOptions = [
    {
      key: "polynomial",
      label: "Polynomial Features",
      description: "Non-linear relationships",
    },
    {
      key: "regularization",
      label: "Regularization",
      description: "Prevent overfitting",
    },
    {
      key: "comparison",
      label: "Model Comparison",
      description: "Different approaches",
    },
  ];

  const renderDemo = () => {
    switch (demoType) {
      case "polynomial":
        return (
          <>
            <h4 className="text-foreground text-sm font-medium mb-3">
              Polynomial Regression (Degree: {polynomialDegree})
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={polynomialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D6" />
                <XAxis dataKey="x" stroke="#6F6D66" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6F6D66" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#FAF9F5",
                    border: "1px solid #E3E0D6",
                    borderRadius: 6,
                    color: "#191918",
                    fontSize: "14px",
                  }}
                />
                <Scatter dataKey="y" fill="#5B4FB3" />
              </ScatterChart>
            </ResponsiveContainer>
          </>
        );

      case "regularization":
        return (
          <>
            <h4 className="text-foreground text-sm font-medium mb-3">
              Regularization Effect (λ = {regularizationStrength.toFixed(2)})
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regularizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E0D6" />
                <XAxis
                  dataKey="feature"
                  stroke="#6F6D66"
                  angle={-45}
                  textAnchor="end"
                  height={60}
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
                />
                <Bar dataKey="coefficient" fill="#8F84D6" name="Original" />
                <Bar dataKey="regularized" fill="#5B4FB3" name="Regularized" />
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted">
              <Target
                className="w-6 h-6 mx-auto mb-2 text-purple-deep"
                aria-hidden="true"
              />
              <div>Interactive Linear Regression Demo</div>
              <div className="text-sm mt-2">Select a demo type above</div>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      {...animationVariants.fadeIn}
      className="w-full h-auto min-h-[400px] md:h-96 bg-surface rounded-lg border border-line p-4 md:p-6"
    >
      <div className="flex flex-col lg:flex-row h-full gap-4">
        {/* Demo Area */}
        <div className="flex-1 min-h-[300px] lg:min-h-0">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-4">
            Interactive Linear Regression Demo
          </h3>
          <div className="h-48 md:h-64">{renderDemo()}</div>
        </div>

        {/* Controls */}
        <div className="lg:w-64 lg:ml-6 mt-4 lg:mt-0">
          <h4 className="text-sm md:text-md font-medium text-foreground mb-3">
            Demo Type
          </h4>

          {/* Mobile: Horizontal buttons */}
          <div className="lg:hidden grid grid-cols-3 gap-2 mb-4">
            {demoOptions.map((option) => (
              <button
                type="button"
                key={option.key}
                onClick={() => setDemoType(option.key as DemoType)}
                className={`text-center p-2 rounded-lg border transition-all text-xs ${
                  demoType === option.key
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
              options={demoOptions}
              selected={demoType}
              onChange={(key) => setDemoType(key as DemoType)}
            />
          </div>

          {/* Dynamic Controls */}
          {demoType === "polynomial" && (
            <div className="space-y-4 mb-6">
              <SliderControl
                label="Polynomial Degree"
                value={polynomialDegree}
                min={1}
                max={5}
                step={1}
                onChange={(value) => setPolynomialDegree(value)}
              />
            </div>
          )}

          {demoType === "regularization" && (
            <div className="space-y-4 mb-6">
              <SliderControl
                label="Regularization λ"
                value={regularizationStrength}
                min={0}
                max={2}
                step={0.1}
                onChange={setRegularizationStrength}
              />
            </div>
          )}

          <div className="p-3 bg-surface border border-line rounded-lg">
            <h5 className="text-sm font-medium text-foreground mb-2">
              Key Concepts:
            </h5>
            <ul className="text-xs text-ink-2 space-y-1">
              <li>• Higher degree = More complex curves</li>
              <li>• Regularization = Smoother models</li>
              <li>• Balance complexity vs. generalization</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
