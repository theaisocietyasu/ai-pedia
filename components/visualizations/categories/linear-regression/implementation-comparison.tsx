"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import { 
  ButtonGroup, 
  animationVariants,
  generateColorPalette 
} from "../../shared";

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

export const RegressionComparisonVisualization: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'mse' | 'r2' | 'time'>('mse');
  
  // Sample comparison data
  const comparisonData: ComparisonData[] = [
    {
      method: 'From Scratch (Normal Eq.)',
      mse: 45.2,
      r2: 0.847,
      time: 0.023,
      color: '#8b5cf6'
    },
    {
      method: 'From Scratch (Gradient Desc.)',
      mse: 45.8,
      r2: 0.843,
      time: 0.156,
      color: '#ec4899'
    },
    {
      method: 'Scikit-learn',
      mse: 44.9,
      r2: 0.851,
      time: 0.008,
      color: '#10b981'
    }
  ];

  const metrics: Record<string, MetricConfig> = {
    mse: { label: 'Mean Squared Error', key: 'mse', unit: '', lower_better: true },
    r2: { label: 'R² Score', key: 'r2', unit: '', lower_better: false },
    time: { label: 'Training Time', key: 'time', unit: 's', lower_better: true }
  };

  const metricOptions = Object.entries(metrics).map(([key, metric]) => ({
    key,
    label: metric.label,
    description: metric.lower_better ? 'Lower is better' : 'Higher is better'
  }));

  return (
    <motion.div
      {...animationVariants.scaleIn}
      className="w-full h-80 bg-gradient-to-br from-blue-purple/10 to-pink/10 rounded-lg border border-white/10 p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        Implementation Comparison
      </h3>

      <div className="flex h-full">
        {/* Chart */}
        <div className="flex-1">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="method" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value, name) => [
                    `${value}${metrics[selectedMetric].unit}`, 
                    metrics[selectedMetric].label
                  ]}
                />
                <Bar 
                  dataKey={metrics[selectedMetric].key} 
                  fill={comparisonData[0].color}
                  radius={[4, 4, 0, 0]}
                >
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls and Info */}
        <div className="w-56 ml-6">
          <h4 className="text-md font-medium text-white mb-3">Metrics</h4>
          
          <ButtonGroup
            options={metricOptions}
            selected={selectedMetric}
            onChange={(key) => setSelectedMetric(key as any)}
            className="mb-6"
          />

          <div className="p-3 bg-gray-800/50 rounded-lg">
            <h5 className="text-sm font-medium text-white mb-2">Trade-offs:</h5>
            <ul className="text-xs text-gray-300 space-y-1">
              <li><span className="text-purple-400">•</span> Normal Eq: Fast, exact</li>
              <li><span className="text-pink-400">•</span> Gradient Desc: Scalable</li>
              <li><span className="text-green-400">•</span> Scikit-learn: Optimized</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};