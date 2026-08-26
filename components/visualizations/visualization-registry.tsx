"use client";

import type React from "react";
// Import all visualization components from organized categories
import {
  ActivationFunctionVisualizer,
  // AI/ML General visualizations
  AITrendsVisualization,
  AssumptionPlotsVisualization,
  AttentionMechanismDemo,
  CNNArchitectureVisualizer,
  InteractiveDemoVisualization,
  // Linear Regression visualizations
  LinearEquationVisualization,
  ModelEvaluationVisualization,
  MultiModalLearningDemo,
  NeuralNetworkDemo,
  RegressionComparisonVisualization,
  YOLODetectionDemo,
} from "./categories";
import { VisualizationError, type VisualizationProps } from "./shared";

/**
 * Visualization Component Registry
 *
 * This file contains the registry of all React visualization components that can be
 * embedded in markdown content using <div id="ComponentName"></div> syntax.
 *
 * The components are now organized in modular categories under ./categories/
 *
 * To add a new visualization:
 * 1. Create the component in the appropriate category folder
 * 2. Export it from the category's index.ts
 * 3. Import it above and add it to the VISUALIZATION_COMPONENTS object
 * 4. The component ID in markdown should match the key in the registry
 */

// Registry of all available visualization components
export const VISUALIZATION_COMPONENTS: Record<string, React.ComponentType> = {
  // AI/ML General Components
  AITrendsVisualization,
  ActivationFunctionVisualizer,
  NeuralNetworkDemo,
  CNNArchitectureVisualizer,
  YOLODetectionDemo,
  AttentionMechanismDemo,
  MultiModalLearningDemo,

  // Linear Regression Visualizations (with VZ- prefix for consistency)
  "VZ-linear-equation": LinearEquationVisualization,
  "VZ-assumptions-plots": AssumptionPlotsVisualization,
  "VZ-regression-comparison": RegressionComparisonVisualization,
  "VZ-model-evaluation": ModelEvaluationVisualization,
  "VZ-interactive-demo": InteractiveDemoVisualization,

  // Add more visualization components here as needed
  // The key should match the ID used in markdown: <div id="ComponentName"></div>
};

/**
 * Component to render a visualization by ID
 */
export const Visualization: React.FC<VisualizationProps> = ({
  componentId,
  fallbackTitle = "Interactive Visualization",
}) => {
  // Safety check for component ID
  if (!componentId || typeof componentId !== "string") {
    return <VisualizationError componentId={componentId} type="invalid-id" />;
  }

  const Component = VISUALIZATION_COMPONENTS[componentId];

  if (!Component) {
    return <VisualizationError componentId={componentId} type="not-found" />;
  }

  try {
    return <Component />;
  } catch (error) {
    console.error(
      `Error rendering visualization component ${componentId}:`,
      error,
    );
    return <VisualizationError componentId={componentId} type="error" />;
  }
};

export default Visualization;
