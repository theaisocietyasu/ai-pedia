import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import type {
  ButtonGroupProps,
  CheckboxControlProps,
  ControlPanelProps,
  SliderControlProps,
} from "./types";

/**
 * Reusable control panel for visualization controls with mobile responsiveness
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  children,
  title = "Controls",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          md:hidden fixed top-4 right-4 z-20 p-3 bg-gray-800/90 border border-white/20 
          rounded-lg text-white shadow-lg backdrop-blur-sm transition-all
          ${isOpen ? "bg-purple/20 border-purple" : "hover:bg-gray-700/90"}
        `}
        aria-label="Toggle controls"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          ) : (
            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          )}
        </svg>
      </button>

      {/* Desktop Panel */}
      <div
        className={`
        hidden md:block w-64 p-4 bg-gray-800/50 border-l border-white/10 ${className}
      `}
      >
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
      </div>

      {/* Mobile Panel (Overlay) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="
            md:hidden fixed inset-y-0 right-0 z-10 w-80 max-w-[90vw] 
            bg-gray-800/95 backdrop-blur-md border-l border-white/10 
            shadow-2xl overflow-y-auto
          "
        >
          <div className="p-4 pt-16">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            {children}
          </div>
        </motion.div>
      )}

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-5 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

/**
 * Slider control component
 */
export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}: {value.toFixed(step < 1 ? 1 : 0)}
        {unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
};

/**
 * Checkbox control component
 */
export const CheckboxControl: React.FC<CheckboxControlProps> = ({
  label,
  checked,
  onChange,
  id,
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2"
      />
      <label htmlFor={id} className="text-sm text-gray-300">
        {label}
      </label>
    </div>
  );
};

/**
 * Button group for selecting between options
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  selected,
  onChange,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selected === option.key
              ? "bg-purple/20 border-purple text-white"
              : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
          }`}
        >
          <div className="font-medium text-sm">{option.label}</div>
          {option.description && (
            <div className="text-xs opacity-75 mt-1">{option.description}</div>
          )}
        </button>
      ))}
    </div>
  );
};

/**
 * Error state component for visualizations
 */
export const VisualizationError: React.FC<{
  componentId: string;
  message?: string;
  type?: "not-found" | "error" | "invalid-id";
}> = ({ componentId, message, type = "not-found" }) => {
  const getErrorContent = () => {
    switch (type) {
      case "invalid-id":
        return {
          title: "Invalid Component ID",
          description: "No valid component ID provided.",
          icon: "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
        };
      case "error":
        return {
          title: "Component Error",
          description: message || `Error rendering "${componentId}" component.`,
          icon: "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
        };
      default:
        return {
          title: "Visualization Not Found",
          description: `Component "${componentId}" is not available in the registry.`,
          icon: "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div
      className="w-full h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg p-6
                    border border-red-500/20 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d={errorContent.icon} />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {errorContent.title}
        </h3>
        <p className="text-light-gray/70 text-sm">{errorContent.description}</p>
      </div>
    </div>
  );
};

/**
 * Loading state component for visualizations
 */
export const VisualizationLoading: React.FC<{ message?: string }> = ({
  message = "Loading visualization...",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-64 bg-gradient-to-br from-purple/10 to-pink/10 rounded-lg p-6
                 border border-white/10 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple/20 rounded-full flex items-center justify-center animate-spin">
          <svg
            className="w-8 h-8 text-purple"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        </div>
        <p className="text-light-gray/70 text-sm">{message}</p>
      </div>
    </motion.div>
  );
};
