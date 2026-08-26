/**
 * Shared types for visualization components
 */

export interface VisualizationProps {
  componentId: string;
  fallbackTitle?: string;
}

export interface ChartData {
  x: number;
  y: number;
  [key: string]: unknown;
}

export interface MetricData {
  name: string;
  value: number;
  color?: string;
}

export interface PlotConfig {
  title: string;
  description: string;
  color: string;
}

export interface ControlPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}

export interface CheckboxControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export interface ButtonGroupProps {
  options: { key: string; label: string; description?: string }[];
  selected: string;
  onChange: (key: string) => void;
  className?: string;
}
