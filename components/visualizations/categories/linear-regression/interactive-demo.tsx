"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { 
  ButtonGroup, 
  SliderControl,
  generatePolynomialData,
  animationVariants 
} from "../../shared";

export const InteractiveDemoVisualization: React.FC = () => {
  const [demoType, setDemoType] = useState<'polynomial' | 'regularization' | 'comparison'>('polynomial');
  const [polynomialDegree, setPolynomialDegree] = useState(2);
  const [regularizationStrength, setRegularizationStrength] = useState(0.1);

  // Generate regularization data
  const generateRegularizationData = () => {
    const data = [];
    const features = 10;
    for (let i = 0; i < features; i++) {
      const coefficient = Math.exp(-regularizationStrength * i) * (Math.random() * 2 - 1);
      data.push({ 
        feature: `Feature ${i + 1}`, 
        coefficient: coefficient,
        regularized: coefficient * Math.exp(-regularizationStrength * i)
      });
    }
    return data;
  };

  const polynomialData = generatePolynomialData(polynomialDegree);
  const regularizationData = generateRegularizationData();

  const demoOptions = [
    { key: 'polynomial', label: 'Polynomial Features', description: 'Non-linear relationships' },
    { key: 'regularization', label: 'Regularization', description: 'Prevent overfitting' },
    { key: 'comparison', label: 'Model Comparison', description: 'Different approaches' }
  ];

  const renderDemo = () => {
    switch (demoType) {
      case 'polynomial':
        return (
          <>
            <h4 className="text-white text-sm font-medium mb-3">
              Polynomial Regression (Degree: {polynomialDegree})
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={polynomialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="x" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
                <Scatter dataKey="y" fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </>
        );

      case 'regularization':
        return (
          <>
            <h4 className="text-white text-sm font-medium mb-3">
              Regularization Effect (λ = {regularizationStrength.toFixed(2)})
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regularizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="feature" 
                  stroke="#9ca3af" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 10 }}
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
                <Bar dataKey="coefficient" fill="#ec4899" name="Original" />
                <Bar dataKey="regularized" fill="#8b5cf6" name="Regularized" />
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-lg mb-2">🎯</div>
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
      className="w-full h-auto min-h-[400px] md:h-96 bg-gradient-to-br from-purple/5 to-pink/5 rounded-lg border border-white/10 p-4 md:p-6"
    >
      <div className="flex flex-col lg:flex-row h-full gap-4">
        {/* Demo Area */}
        <div className="flex-1 min-h-[300px] lg:min-h-0">
          <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">Interactive Linear Regression Demo</h3>
          <div className="h-48 md:h-64">
            {renderDemo()}
          </div>
        </div>

        {/* Controls */}
        <div className="lg:w-64 lg:ml-6 mt-4 lg:mt-0">
          <h4 className="text-sm md:text-md font-medium text-white mb-3">Demo Type</h4>
          
          {/* Mobile: Horizontal buttons */}
          <div className="lg:hidden grid grid-cols-3 gap-2 mb-4">
            {demoOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setDemoType(option.key as any)}
                className={`text-center p-2 rounded-lg border transition-all text-xs ${
                  demoType === option.key
                    ? 'bg-purple/20 border-purple text-white'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-75 mt-1">{option.description}</div>
              </button>
            ))}
          </div>

          {/* Desktop: Vertical buttons */}
          <div className="hidden lg:block mb-6">
            <ButtonGroup
              options={demoOptions}
              selected={demoType}
              onChange={(key) => setDemoType(key as any)}
            />
          </div>

          {/* Dynamic Controls */}
          {demoType === 'polynomial' && (
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

          {demoType === 'regularization' && (
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

          <div className="p-3 bg-gray-800/50 rounded-lg">
            <h5 className="text-sm font-medium text-white mb-2">Key Concepts:</h5>
            <ul className="text-xs text-gray-300 space-y-1">
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