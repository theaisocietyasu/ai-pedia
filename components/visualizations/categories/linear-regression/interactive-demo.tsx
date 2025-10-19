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
          <div className="h-64">
            <h4 className="text-white text-sm font-medium mb-3">
              Polynomial Regression (Degree: {polynomialDegree})
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={polynomialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="x" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Scatter dataKey="y" fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case 'regularization':
        return (
          <div className="h-64">
            <h4 className="text-white text-sm font-medium mb-3">
              Regularization Effect (λ = {regularizationStrength.toFixed(2)})
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regularizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="feature" stroke="#9ca3af" angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="coefficient" fill="#ec4899" name="Original" />
                <Bar dataKey="regularized" fill="#8b5cf6" name="Regularized" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return (
          <div className="h-64 flex items-center justify-center">
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
      className="w-full h-96 bg-gradient-to-br from-purple/5 to-pink/5 rounded-lg border border-white/10 p-6"
    >
      <div className="flex h-full">
        {/* Demo Area */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">Interactive Linear Regression Demo</h3>
          {renderDemo()}
        </div>

        {/* Controls */}
        <div className="w-64 ml-6">
          <h4 className="text-md font-medium text-white mb-3">Demo Type</h4>
          
          <ButtonGroup
            options={demoOptions}
            selected={demoType}
            onChange={(key) => setDemoType(key as any)}
            className="mb-6"
          />

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