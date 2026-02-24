"use client";

import React from "react";
import { VisualizationError, VisualizationProps } from "./shared";

import { Fabric2DRenderer } from "./Fabric2DRenderer";

/* Import visualization categories */
import {
  AITrendsVisualization,
  ActivationFunctionVisualizer,
  NeuralNetworkDemo,
  CNNArchitectureVisualizer,
  YOLODetectionDemo,
  AttentionMechanismDemo,
  MultiModalLearningDemo,
  LinearEquationVisualization,
  AssumptionPlotsVisualization,
  RegressionComparisonVisualization,
  ModelEvaluationVisualization,
  InteractiveDemoVisualization,
} from "./categories";

/* Registry */
export const VISUALIZATION_COMPONENTS: Record<string, React.ComponentType> = {
  AITrendsVisualization,
  ActivationFunctionVisualizer,
  NeuralNetworkDemo,
  CNNArchitectureVisualizer,
  YOLODetectionDemo,
  AttentionMechanismDemo,
  MultiModalLearningDemo,

  "VZ-linear-equation": LinearEquationVisualization,
  "VZ-assumptions-plots": AssumptionPlotsVisualization,
  "VZ-regression-comparison": RegressionComparisonVisualization,
  "VZ-model-evaluation": ModelEvaluationVisualization,
  "VZ-interactive-demo": InteractiveDemoVisualization,
};

/* Renderer */
export const Visualization: React.FC<VisualizationProps> = ({
  componentId,
  fallbackTitle = "Interactive Visualization",
}) => {
  if (!componentId || typeof componentId !== "string") {
    return <VisualizationError componentId={componentId} type="invalid-id" />;
  }

  // Fabric 2D Studio animations
  if (componentId.startsWith("VZ2D-")) {
    return <Fabric2DRenderer animationId={componentId} />;
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
