"use client"

import React from "react"
import { motion } from "framer-motion"

/**
 * Visualization Component Registry
 *
 * This file contains all the React visualization components that can be
 * embedded in markdown content using <div id="ComponentName"></div> syntax.
 *
 * To add a new visualization:
 * 1. Create the component below
 * 2. Add it to the VISUALIZATION_COMPONENTS object
 * 3. The component ID in markdown should match the key in the registry
 */

// Example visualization components
const AITrendsVisualization: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-64 bg-gradient-to-br from-purple/20 to-pink/20 rounded-lg p-6
                 border border-white/10 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-purple" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">AI Trends Visualization</h3>
        <p className="text-light-gray/70 text-sm">
          Interactive chart showing the latest AI trends and adoption rates across industries.
        </p>
      </div>
    </motion.div>
  )
}

const ActivationFunctionVisualizer: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-80 bg-gradient-to-r from-blue-purple/10 to-purple/10 rounded-lg p-6
                 border border-white/10 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {['ReLU', 'Sigmoid', 'Tanh'].map((func, index) => (
            <div key={func} className="p-3 bg-white/5 rounded border border-white/10">
              <div className="w-full h-12 bg-gradient-to-r from-purple to-pink rounded mb-2 opacity-70" />
              <span className="text-sm text-light-gray">{func}</span>
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Activation Functions</h3>
        <p className="text-light-gray/70 text-sm">
          Interactive visualization of common neural network activation functions.
        </p>
      </div>
    </motion.div>
  )
}

const NeuralNetworkDemo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-96 bg-gradient-to-br from-dark-gray/50 to-purple/10 rounded-lg p-6
                 border border-white/10 relative overflow-hidden"
    >
      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-5 gap-8 items-center">
          {/* Input Layer */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-light-gray text-center mb-2">Input</h4>
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 bg-purple rounded-full animate-pulse" />
            ))}
          </div>

          {/* Hidden Layer 1 */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-light-gray text-center mb-2">Hidden</h4>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-5 h-5 bg-pink rounded-full animate-pulse"
                   style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>

          {/* Hidden Layer 2 */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-light-gray text-center mb-2">Hidden</h4>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-5 h-5 bg-blue-purple rounded-full animate-pulse"
                   style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>

          {/* Hidden Layer 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-light-gray text-center mb-2">Hidden</h4>
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 bg-purple rounded-full animate-pulse"
                   style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>

          {/* Output Layer */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium text-light-gray text-center mb-2">Output</h4>
            {[1, 2].map(i => (
              <div key={i} className="w-6 h-6 bg-gradient-to-r from-purple to-pink rounded-full animate-pulse"
                   style={{ animationDelay: `${i * 0.25}s` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-light-gray/70 text-center">
          Interactive Neural Network Architecture Demo
        </p>
      </div>
    </motion.div>
  )
}

const CNNArchitectureVisualizer: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full h-72 bg-gradient-to-r from-dark-gray/40 to-blue-purple/10 rounded-lg p-6
                 border border-white/10 flex items-center justify-center"
    >
      <div className="flex items-center gap-4 overflow-x-auto">
        {/* Input Image */}
        <div className="text-center flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-purple to-pink rounded mb-2" />
          <span className="text-xs text-light-gray">Input</span>
        </div>

        <div className="text-light-gray">→</div>

        {/* Conv Layer 1 */}
        <div className="text-center flex-shrink-0">
          <div className="w-14 h-14 bg-purple/70 rounded mb-2" />
          <span className="text-xs text-light-gray">Conv1</span>
        </div>

        <div className="text-light-gray">→</div>

        {/* Pool Layer 1 */}
        <div className="text-center flex-shrink-0">
          <div className="w-12 h-12 bg-pink/70 rounded mb-2" />
          <span className="text-xs text-light-gray">Pool1</span>
        </div>

        <div className="text-light-gray">→</div>

        {/* Conv Layer 2 */}
        <div className="text-center flex-shrink-0">
          <div className="w-10 h-10 bg-blue-purple/70 rounded mb-2" />
          <span className="text-xs text-light-gray">Conv2</span>
        </div>

        <div className="text-light-gray">→</div>

        {/* Pool Layer 2 */}
        <div className="text-center flex-shrink-0">
          <div className="w-8 h-8 bg-purple/70 rounded mb-2" />
          <span className="text-xs text-light-gray">Pool2</span>
        </div>

        <div className="text-light-gray">→</div>

        {/* Fully Connected */}
        <div className="text-center flex-shrink-0">
          <div className="w-6 h-12 bg-gradient-to-b from-purple to-pink rounded mb-2" />
          <span className="text-xs text-light-gray">FC</span>
        </div>

        <div className="text-light-gray">→</div>

        {/* Output */}
        <div className="text-center flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-pink to-purple rounded mb-2" />
          <span className="text-xs text-light-gray">Output</span>
        </div>
      </div>
    </motion.div>
  )
}

const YOLODetectionDemo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-80 bg-gradient-to-br from-pink/10 to-purple/10 rounded-lg p-6
                 border border-white/10 relative overflow-hidden"
    >
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          {/* Mock image */}
          <div className="w-64 h-48 bg-dark-gray/60 rounded-lg border border-white/20 relative">
            {/* Detection boxes */}
            <div className="absolute top-4 left-4 w-16 h-12 border-2 border-purple rounded">
              <span className="absolute -top-6 left-0 text-xs text-purple font-medium">Car 98%</span>
            </div>
            <div className="absolute top-8 right-6 w-12 h-16 border-2 border-pink rounded">
              <span className="absolute -top-6 right-0 text-xs text-pink font-medium">Person 95%</span>
            </div>
            <div className="absolute bottom-6 left-8 w-20 h-10 border-2 border-blue-purple rounded">
              <span className="absolute -top-6 left-0 text-xs text-blue-purple font-medium">Bike 87%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <h3 className="text-lg font-semibold text-white mb-1 text-center">YOLO Object Detection</h3>
        <p className="text-sm text-light-gray/70 text-center">
          Real-time object detection and classification
        </p>
      </div>
    </motion.div>
  )
}

const AttentionMechanismDemo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full h-64 bg-gradient-to-r from-purple/5 to-pink/5 rounded-lg p-6
                 border border-white/10 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="grid grid-cols-8 gap-2 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded border border-white/20 flex items-center justify-center text-xs"
              style={{
                background: i === 3 || i === 4 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                color: i === 3 || i === 4 ? '#ffffff' : 'rgba(224, 224, 224, 0.6)'
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Attention Mechanism</h3>
        <p className="text-light-gray/70 text-sm">
          Visualization of attention weights focusing on relevant input tokens
        </p>
      </div>
    </motion.div>
  )
}

const MultiModalLearningDemo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
      className="w-full h-72 bg-gradient-to-br from-blue-purple/10 to-pink/10 rounded-lg p-6
                 border border-white/10 flex items-center justify-center"
    >
      <div className="grid grid-cols-3 gap-8 items-center">
        {/* Text Input */}
        <div className="text-center">
          <div className="w-16 h-16 bg-purple/30 rounded-lg mb-3 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <span className="text-sm text-light-gray">Text</span>
        </div>

        {/* Image Input */}
        <div className="text-center">
          <div className="w-16 h-16 bg-pink/30 rounded-lg mb-3 flex items-center justify-center">
            <svg className="w-8 h-8 text-pink" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
            </svg>
          </div>
          <span className="text-sm text-light-gray">Image</span>
        </div>

        {/* Audio Input */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-purple/30 rounded-lg mb-3 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-purple" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
            </svg>
          </div>
          <span className="text-sm text-light-gray">Audio</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-light-gray/70 text-center">
          Multi-modal AI combining text, image, and audio processing
        </p>
      </div>
    </motion.div>
  )
}

// Registry of all available visualization components
export const VISUALIZATION_COMPONENTS: Record<string, React.ComponentType> = {
  AITrendsVisualization,
  ActivationFunctionVisualizer,
  NeuralNetworkDemo,
  CNNArchitectureVisualizer,
  YOLODetectionDemo,
  AttentionMechanismDemo,
  MultiModalLearningDemo,

  // Add more visualization components here as needed
  // The key should match the ID used in markdown: <div id="ComponentName"></div>
}

/**
 * Component to render a visualization by ID
 */
interface VisualizationProps {
  componentId: string
  fallbackTitle?: string
}

export const Visualization: React.FC<VisualizationProps> = ({
  componentId,
  fallbackTitle = "Interactive Visualization"
}) => {
  // Safety check for component ID
  if (!componentId || typeof componentId !== 'string') {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg p-6
                      border border-red-500/20 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Invalid Component ID</h3>
          <p className="text-light-gray/70 text-sm">
            No valid component ID provided.
          </p>
        </div>
      </div>
    )
  }

  const Component = VISUALIZATION_COMPONENTS[componentId]

  if (!Component) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg p-6
                      border border-red-500/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Visualization Not Found</h3>
          <p className="text-light-gray/70 text-sm">
            Component "{componentId}" is not available in the registry.
          </p>
        </div>
      </div>
    )
  }

  try {
    return <Component />
  } catch (error) {
    console.error(`Error rendering visualization component ${componentId}:`, error)
    return (
      <div className="w-full h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg p-6
                      border border-red-500/20 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Component Error</h3>
          <p className="text-light-gray/70 text-sm">
            Error rendering "{componentId}" component.
          </p>
        </div>
      </div>
    )
  }
}

export default Visualization