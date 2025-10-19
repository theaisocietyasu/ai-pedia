"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";
import { 
  animationVariants,
  formatNumber 
} from "../../shared";

interface PerformanceData {
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
  adj_r2: number;
  samples: number;
}

export const ModelEvaluationVisualization: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Sample performance data for different dataset sizes
  const performanceData: Record<string, PerformanceData> = {
    small: {
      mse: 23.4,
      rmse: 4.84,
      mae: 3.21,
      r2: 0.892,
      adj_r2: 0.887,
      samples: 100
    },
    medium: {
      mse: 45.7,
      rmse: 6.76,
      mae: 4.93,
      r2: 0.847,
      adj_r2: 0.841,
      samples: 1000
    },
    large: {
      mse: 67.2,
      rmse: 8.20,
      mae: 6.14,
      r2: 0.823,
      adj_r2: 0.819,
      samples: 10000
    }
  };

  const currentData = performanceData[selectedDataset];

  // Data for R² visualization
  const r2Data = [
    { name: 'Explained Variance', value: currentData.r2 * 100, fill: '#8b5cf6' },
    { name: 'Unexplained Variance', value: (1 - currentData.r2) * 100, fill: '#374151' }
  ];

  // Metric comparison chart data
  const metricComparison = [
    { metric: 'MSE', value: currentData.mse, max: 100 },
    { metric: 'RMSE', value: currentData.rmse, max: 10 },
    { metric: 'MAE', value: currentData.mae, max: 8 },
    { metric: 'R²', value: currentData.r2 * 100, max: 100 }
  ];

  return (
    <motion.div
      {...animationVariants.slideUp}
      className="w-full h-96 bg-gradient-to-br from-gray-900/50 to-purple/10 rounded-lg border border-white/10 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Model Performance Dashboard</h3>
        
        {/* Dataset selector */}
        <div className="flex space-x-2">
          {Object.keys(performanceData).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedDataset(size as any)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedDataset === size
                  ? 'bg-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)} Dataset
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 h-80">
        {/* Metrics Cards */}
        <div className="space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-purple-400 text-sm font-medium mb-2">Mean Squared Error</h4>
            <div className="text-2xl font-bold text-white">{formatNumber(currentData.mse, 1)}</div>
            <div className="text-xs text-gray-400">Lower is better</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-pink-400 text-sm font-medium mb-2">RMSE</h4>
            <div className="text-2xl font-bold text-white">{formatNumber(currentData.rmse, 2)}</div>
            <div className="text-xs text-gray-400">Same units as target</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-blue-400 text-sm font-medium mb-2">MAE</h4>
            <div className="text-2xl font-bold text-white">{formatNumber(currentData.mae, 2)}</div>
            <div className="text-xs text-gray-400">Robust to outliers</div>
          </div>
        </div>

        {/* R² Pie Chart */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-green-400 text-sm font-medium mb-2">
            R² Score: {formatNumber(currentData.r2 * 100, 1)}%
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={r2Data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {r2Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Variance Explained</div>
            <div className="text-sm text-gray-300">
              Adj. R²: {formatNumber(currentData.adj_r2 * 100, 1)}%
            </div>
          </div>
        </div>

        {/* Metric Comparison */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-yellow-400 text-sm font-medium mb-2">Normalized Metrics</h4>
          <div className="space-y-3">
            {metricComparison.map((item, index) => (
              <div key={item.metric}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.metric}</span>
                  <span className="text-white">
                    {formatNumber(item.value, item.metric === 'R²' ? 1 : 2)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple to-pink"
                    style={{ 
                      width: `${(item.value / item.max) * 100}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-400">
            Dataset size: {currentData.samples.toLocaleString()} samples
          </div>
        </div>
      </div>
    </motion.div>
  );
};