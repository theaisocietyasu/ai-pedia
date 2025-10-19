"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import { 
  ButtonGroup, 
  generateDiagnosticData,
  animationVariants,
  PlotConfig 
} from "../../shared";

export const AssumptionPlotsVisualization: React.FC = () => {
  const [currentPlot, setCurrentPlot] = useState<'good' | 'heteroscedastic' | 'nonlinear' | 'nonnormal'>('good');
  const plotData = generateDiagnosticData(currentPlot);

  const plotConfigs: Record<string, PlotConfig> = {
    good: { title: "Good Model", description: "Residuals randomly scattered around zero", color: "#10b981" },
    heteroscedastic: { title: "Heteroscedasticity", description: "Residual variance increases with fitted values", color: "#f59e0b" },
    nonlinear: { title: "Non-linearity", description: "Clear pattern in residuals indicates missing non-linear terms", color: "#ef4444" },
    nonnormal: { title: "Non-normal Residuals", description: "Residuals not normally distributed", color: "#8b5cf6" }
  };

  const plotOptions = Object.entries(plotConfigs).map(([key, config]) => ({
    key,
    label: config.title,
    description: key === 'good' ? 'No violations' : 
                 key === 'heteroscedastic' ? 'Variance issue' :
                 key === 'nonlinear' ? 'Pattern in residuals' : 'Distribution issue'
  }));

  return (
    <motion.div
      {...animationVariants.slideUp}
      className="w-full h-96 bg-gradient-to-br from-gray-900/50 to-purple/10 rounded-lg border border-white/10 p-6"
    >
      <div className="flex h-full">
        {/* Plot Area */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">
            Diagnostic Plot: {plotConfigs[currentPlot].title}
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={plotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="fitted" 
                  stroke="#9ca3af"
                  label={{ value: 'Fitted Values', position: 'insideBottom', offset: -5, style: { fill: '#9ca3af' } }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  label={{ value: 'Residuals', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
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

          <p className="text-sm text-gray-300 mt-2">
            {plotConfigs[currentPlot].description}
          </p>
        </div>

        {/* Controls */}
        <div className="w-48 ml-6">
          <h4 className="text-md font-medium text-white mb-3">Plot Types</h4>
          
          <ButtonGroup
            options={plotOptions}
            selected={currentPlot}
            onChange={(key) => setCurrentPlot(key as any)}
          />

          
        </div>
      </div>
    </motion.div>
  );
};