"use client"

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { animationVariants } from "../../shared";

export const NeuralNetworkDemo: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.fadeIn}
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
  );
};

export const CNNArchitectureVisualizer: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.slideLeft}
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
  );
};

export const YOLODetectionDemo: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.scaleIn}
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
  );
};