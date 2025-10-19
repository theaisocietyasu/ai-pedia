# Visualization Components

This directory contains all the interactive visualization components used throughout the ML visualization platform. The components are organized in a modular structure for better maintainability and scalability.

## 📁 Directory Structure

```
components/visualizations/
├── categories/                 # Categorized visualization components
│   ├── ai-ml-general/         # General AI/ML visualization components
│   │   ├── basic-ml-concepts.tsx
│   │   ├── neural-networks.tsx
│   │   └── index.ts
│   ├── linear-regression/      # Linear regression specific visualizations
│   │   ├── interactive-equation.tsx
│   │   ├── assumption-plots.tsx
│   │   ├── implementation-comparison.tsx
│   │   ├── model-evaluation.tsx
│   │   ├── interactive-demo.tsx
│   │   └── index.ts
│   └── index.ts               # Main categories export
├── shared/                    # Shared utilities and components
│   ├── types.ts              # TypeScript type definitions
│   ├── components.tsx        # Reusable UI components
│   ├── utils.ts              # Utility functions
│   └── index.ts              # Shared exports
├── LazyVisualization.tsx     # Lazy loading wrapper
├── visualization-registry.tsx # Main registry and component resolver
└── README.md                 # This file
```

## 🎯 Categories

### AI/ML General (`ai-ml-general/`)
Contains general-purpose AI and ML visualization components that are not specific to any particular algorithm:

- **AITrendsVisualization** - AI trends and adoption rates
- **ActivationFunctionVisualizer** - Neural network activation functions
- **NeuralNetworkDemo** - Interactive neural network architecture
- **CNNArchitectureVisualizer** - Convolutional Neural Network flow
- **YOLODetectionDemo** - Object detection demonstration
- **AttentionMechanismDemo** - Attention weights visualization
- **MultiModalLearningDemo** - Multi-modal AI processing

### Linear Regression (`linear-regression/`)
Contains visualizations specific to linear regression concepts and techniques:

- **LinearEquationVisualization** (`VZ-linear-equation`) - Interactive 3D linear equation with controls
- **AssumptionPlotsVisualization** (`VZ-assumptions-plots`) - Diagnostic plots for model assumptions
- **RegressionComparisonVisualization** (`VZ-regression-comparison`) - Implementation comparison charts
- **ModelEvaluationVisualization** (`VZ-model-evaluation`) - Performance metrics dashboard
- **InteractiveDemoVisualization** (`VZ-interactive-demo`) - Interactive learning demos

## 🛠️ Shared Components

The `shared/` directory contains reusable components and utilities:

### Components (`shared/components.tsx`)
- **ControlPanel** - Standardized control panel layout
- **SliderControl** - Reusable slider input with labels
- **CheckboxControl** - Styled checkbox component
- **ButtonGroup** - Multi-option button selector
- **VisualizationError** - Error state display
- **VisualizationLoading** - Loading state display

### Utilities (`shared/utils.ts`)
- **generateSampleData()** - Generate sample datasets
- **generatePolynomialData()** - Create polynomial regression data
- **generateDiagnosticData()** - Create diagnostic plot data
- **calculateRSquared()** - R-squared calculation
- **calculateMSE()** - Mean Squared Error calculation
- **calculateMAE()** - Mean Absolute Error calculation
- **formatNumber()** - Number formatting utility
- **generateColorPalette()** - Color palette generation
- **debounce()** - Performance optimization utility
- **animationVariants** - Framer Motion animation presets

### Types (`shared/types.ts`)
- **VisualizationProps** - Base visualization component props
- **ChartData** - Standard chart data interface
- **MetricData** - Metrics display interface
- **PlotConfig** - Plot configuration interface
- **ControlPanelProps** - Control panel props
- **SliderControlProps** - Slider control props
- **CheckboxControlProps** - Checkbox control props
- **ButtonGroupProps** - Button group props

## 📝 Usage in Markdown

Visualizations can be embedded in markdown content using div tags with specific IDs:

```html
<!-- AI/ML General (using component names directly) -->
<div id="AITrendsVisualization"></div>
<div id="NeuralNetworkDemo"></div>

<!-- Linear Regression (using VZ- prefix) -->
<div id="VZ-linear-equation"></div>
<div id="VZ-assumptions-plots"></div>
<div id="VZ-regression-comparison"></div>
<div id="VZ-model-evaluation"></div>
<div id="VZ-interactive-demo"></div>
```

## ➕ Adding New Visualizations

To add a new visualization component:

1. **Choose the appropriate category** or create a new one under `categories/`
2. **Create the component file** with proper imports from `shared/`
3. **Export from category index** (`categories/[category]/index.ts`)
4. **Import in main registry** (`visualization-registry.tsx`)
5. **Add to VISUALIZATION_COMPONENTS** object with appropriate key
6. **Update this README** with the new component documentation

### Example: Adding a new component

```tsx
// categories/linear-regression/new-component.tsx
"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ControlPanel, 
  SliderControl, 
  animationVariants 
} from "../../shared";

export const NewLinearRegressionComponent: React.FC = () => {
  const [parameter, setParameter] = useState(1.0);

  return (
    <motion.div {...animationVariants.fadeIn}>
      {/* Component implementation */}
    </motion.div>
  );
};
```

```tsx
// Update categories/linear-regression/index.ts
export * from './new-component';
```

```tsx
// Update visualization-registry.tsx
import { 
  // ... existing imports
  NewLinearRegressionComponent
} from "./categories";

export const VISUALIZATION_COMPONENTS = {
  // ... existing components
  "VZ-new-component": NewLinearRegressionComponent,
};
```

## 🎨 Design Principles

- **Modularity**: Components are organized by functionality and purpose
- **Reusability**: Shared components and utilities prevent code duplication
- **Consistency**: Standardized interfaces and design patterns
- **Performance**: Lazy loading and optimized rendering
- **Accessibility**: Proper error handling and loading states
- **Extensibility**: Easy to add new categories and components

## 🔧 Technical Dependencies

- **React** - Component framework
- **Framer Motion** - Animations and transitions
- **Recharts** - 2D chart library
- **React Three Fiber** - 3D visualizations
- **React Three Drei** - 3D helpers and components
- **Three.js** - 3D rendering engine

## 📚 Migration Notes

The previous monolithic `visualization-registry.tsx` has been split into:
- Category-specific component files
- Shared utilities and types
- Centralized registry for component resolution

All existing component IDs remain unchanged to maintain backward compatibility with existing markdown content.