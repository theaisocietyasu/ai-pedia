"use client";

import { motion } from "framer-motion";
import { Code, ExternalLink, Play } from "lucide-react";
import type React from "react";
import {
  VISUALIZATION_COMPONENTS,
  Visualization,
} from "../visualizations/visualization-registry";

interface BlogVisualizationProps {
  componentId: string;
  title?: string;
}

// placeholder visualization components - these would be replaced with actual interactive demos
const visualizationComponents: Record<string, React.ComponentType> = {
  NeuralNetworkVisualization: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {/* input layer */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white text-center">
            Input Layer
          </h4>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-12 h-12 mx-auto rounded-full bg-purple/30 border-2 border-purple
                           flex items-center justify-center text-sm font-bold text-white"
              >
                {i}
              </motion.div>
            ))}
          </div>
        </div>

        {/* hidden layer */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white text-center">
            Hidden Layer
          </h4>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2 + 1,
                }}
                className="w-10 h-10 mx-auto rounded-full bg-pink/30 border-2 border-pink
                           flex items-center justify-center text-xs font-bold text-white"
              >
                H{i}
              </motion.div>
            ))}
          </div>
        </div>

        {/* output layer */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white text-center">
            Output Layer
          </h4>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4 + 2,
                }}
                className="w-12 h-12 mx-auto rounded-full bg-blue-purple/30 border-2 border-blue-purple
                           flex items-center justify-center text-sm font-bold text-white"
              >
                O{i}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),

  ObjectDetectionDemo: () => (
    <div className="space-y-4">
      <div className="relative aspect-video bg-dark-gray rounded-lg border border-white/10 overflow-hidden">
        <div className="absolute inset-4 border-2 border-purple rounded-lg">
          <div className="absolute -top-6 left-0 bg-purple text-white text-xs px-2 py-1 rounded">
            Car (95%)
          </div>
        </div>
        <div className="absolute top-8 right-8 w-16 h-12 border-2 border-pink rounded">
          <div className="absolute -top-6 left-0 bg-pink text-white text-xs px-2 py-1 rounded">
            Person (87%)
          </div>
        </div>
        <div className="absolute bottom-8 left-8 w-12 h-8 border-2 border-blue-purple rounded">
          <div className="absolute -top-6 left-0 bg-blue-purple text-white text-xs px-2 py-1 rounded">
            Dog (92%)
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-light-gray/60">
          <Play size={48} />
        </div>
      </div>
      <p className="text-sm text-light-gray/60 text-center">
        Interactive object detection demo - Click to start
      </p>
    </div>
  ),

  TransformerVisualization: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white text-center">
            Input Embeddings
          </h4>
          <div className="space-y-2">
            {["The", "cat", "sat", "on", "mat"].map((word, i) => (
              <motion.div
                key={word}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="p-2 bg-purple/20 border border-purple/50 rounded text-center text-sm text-white"
              >
                {word}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white text-center">
            Self-Attention
          </h4>
          <div className="relative h-40 bg-pink/10 border border-pink/30 rounded-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border-2 border-pink rounded-full opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center text-pink text-sm font-medium">
              Attention Matrix
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white text-center">Output</h4>
          <div className="space-y-2">
            {["Le", "chat", "était", "assis", "sur", "le", "tapis"].map(
              (word, i) => (
                <motion.div
                  key={word}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15 + 1,
                  }}
                  className="p-2 bg-blue-purple/20 border border-blue-purple/50 rounded text-center text-sm text-white"
                >
                  {word}
                </motion.div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  ),

  LinearRegressionDemo: () => (
    <div className="space-y-4">
      <div className="relative aspect-square bg-dark-gray rounded-lg border border-white/10 p-4">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 300"
          className="text-white"
        >
          {/* grid lines */}
          <defs>
            <pattern
              id="grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* data points */}
          {[
            [50, 250],
            [80, 220],
            [120, 180],
            [160, 140],
            [200, 100],
            [240, 80],
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#3a388e"
              animate={{ r: [4, 6, 4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          {/* regression line */}
          <motion.line
            x1="30"
            y1="270"
            x2="270"
            y2="30"
            stroke="#8d2f6a"
            strokeWidth="3"
            strokeDasharray="5,5"
            animate={{ strokeDashoffset: [0, 10] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
      <p className="text-sm text-light-gray/60 text-center">
        Interactive linear regression visualization
      </p>
    </div>
  ),

  TensorFlowDemo: () => (
    <div className="space-y-4">
      <div className="bg-dark-gray rounded-lg border border-white/10 p-4">
        <pre className="text-sm text-light-gray/80 overflow-x-auto">
          <code>{`import tensorflow as tf

# Create a simple neural network
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation='softmax')
])

# Compile the model
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
model.fit(x_train, y_train, epochs=5)`}</code>
        </pre>
      </div>
      <div className="flex items-center justify-center gap-4 p-4 bg-white/5 rounded-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-purple border-t-transparent rounded-full"
        />
        <span className="text-sm text-light-gray/80">
          Training in progress...
        </span>
      </div>
    </div>
  ),
};

export function BlogVisualization({
  componentId,
  title,
}: BlogVisualizationProps) {
  const hasComponent = !!VISUALIZATION_COMPONENTS[componentId];
  const legacyComponent = visualizationComponents[componentId];
  const displayTitle = title || `${componentId} Demo`;

  // Use new registry first, fall back to legacy components
  if (hasComponent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="border border-white/10 rounded-xl bg-white/5 overflow-hidden"
      >
        {title && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold gradient-text">{title}</h3>
              <button
                className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-purple/20 hover:bg-purple/30
                                text-purple border border-purple/50 rounded-lg transition-colors duration-300"
              >
                <Play size={14} />
                Interactive
              </button>
            </div>
          </div>
        )}
        <div className="p-0">
          <Visualization
            componentId={componentId}
            fallbackTitle={displayTitle}
          />
        </div>
      </motion.div>
    );
  }

  // Legacy component support
  if (legacyComponent) {
    const LegacyComponent = legacyComponent;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="border border-white/10 rounded-xl bg-white/5 p-6 space-y-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold gradient-text">
            {displayTitle}
          </h3>
          <button
            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-purple/20 hover:bg-purple/30
                            text-purple border border-purple/50 rounded-lg transition-colors duration-300"
          >
            <Play size={14} />
            Run Demo
          </button>
        </div>
        <LegacyComponent />
      </motion.div>
    );
  }

  // Fallback for missing components
  return (
    <div className="text-center py-12 border border-white/10 rounded-xl bg-white/5">
      <Code size={48} className="mx-auto mb-4 text-light-gray/60" />
      <h3 className="text-lg font-semibold text-white mb-2">
        Interactive Demo
      </h3>
      <p className="text-light-gray/60 mb-4">
        Component "{componentId}" will be implemented here
      </p>
      <button
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple/20 hover:bg-purple/30
                        text-purple border border-purple/50 rounded-lg transition-colors duration-300"
      >
        <ExternalLink size={16} />
        View Implementation
      </button>
    </div>
  );
}
