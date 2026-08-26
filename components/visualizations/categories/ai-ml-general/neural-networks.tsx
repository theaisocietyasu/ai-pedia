"use client";

import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import type React from "react";
import { useRef } from "react";
import { animationVariants } from "../../shared";

export const NeuralNetworkDemo: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.fadeIn}
      className="w-full h-80 md:h-96 bg-gradient-to-br from-dark-gray/50 to-purple/10 rounded-lg p-4 md:p-6
                 border border-white/10 relative overflow-hidden"
    >
      <div className="flex items-center justify-center h-full">
        <div className="grid grid-cols-5 gap-2 md:gap-8 items-center max-w-sm md:max-w-none mx-auto">
          {/* Input Layer */}
          <div className="flex flex-col gap-2 md:gap-3">
            <h4 className="text-xs md:text-sm font-medium text-light-gray text-center mb-1 md:mb-2">
              Input
            </h4>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 md:w-6 md:h-6 bg-purple rounded-full animate-pulse mx-auto"
              />
            ))}
          </div>

          {/* Hidden Layer 1 */}
          <div className="flex flex-col gap-1 md:gap-2">
            <h4 className="text-xs md:text-sm font-medium text-light-gray text-center mb-1 md:mb-2">
              Hidden
            </h4>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 h-3 md:w-5 md:h-5 bg-pink rounded-full animate-pulse mx-auto"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          {/* Hidden Layer 2 */}
          <div className="flex flex-col gap-1 md:gap-2">
            <h4 className="text-xs md:text-sm font-medium text-light-gray text-center mb-1 md:mb-2">
              Hidden
            </h4>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 h-3 md:w-5 md:h-5 bg-blue-purple rounded-full animate-pulse mx-auto"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          {/* Hidden Layer 3 */}
          <div className="flex flex-col gap-2 md:gap-3">
            <h4 className="text-xs md:text-sm font-medium text-light-gray text-center mb-1 md:mb-2">
              Hidden
            </h4>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-3 h-3 md:w-5 md:h-5 bg-purple rounded-full animate-pulse mx-auto"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          {/* Output Layer */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h4 className="text-xs md:text-sm font-medium text-light-gray text-center mb-1 md:mb-2">
              Output
            </h4>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-purple to-pink rounded-full animate-pulse mx-auto"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs md:text-sm text-light-gray/70 text-center px-2">
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
      className="w-full h-56 md:h-72 bg-gradient-to-r from-dark-gray/40 to-blue-purple/10 rounded-lg p-4 md:p-6
                 border border-white/10 flex items-center justify-center"
    >
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2">
        {/* Input Image */}
        <div className="text-center flex-shrink-0">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-purple to-pink rounded mb-1 md:mb-2" />
          <span className="text-xs text-light-gray">Input</span>
        </div>

        <div className="text-light-gray text-sm">→</div>

        {/* Conv Layer 1 */}
        <div className="text-center flex-shrink-0">
          <div className="w-8 h-8 md:w-14 md:h-14 bg-purple/70 rounded mb-1 md:mb-2" />
          <span className="text-xs text-light-gray">Conv1</span>
        </div>

        <div className="text-light-gray text-sm">→</div>

        {/* Pool Layer 1 */}
        <div className="text-center flex-shrink-0">
          <div className="w-7 h-7 md:w-12 md:h-12 bg-pink/70 rounded mb-1 md:mb-2" />
          <span className="text-xs text-light-gray">Pool1</span>
        </div>

        <div className="text-light-gray text-sm">→</div>

        {/* Conv Layer 2 */}
        <div className="text-center flex-shrink-0">
          <div className="w-6 h-6 md:w-10 md:h-10 bg-blue-purple/70 rounded mb-1 md:mb-2" />
          <span className="text-xs text-light-gray">Conv2</span>
        </div>

        <div className="text-light-gray text-sm">→</div>

        {/* Pool Layer 2 */}
        <div className="text-center flex-shrink-0">
          <div className="w-5 h-5 md:w-8 md:h-8 bg-purple/70 rounded mb-1 md:mb-2" />
          <span className="text-xs text-light-gray">Pool2</span>
        </div>

        <div className="text-light-gray text-sm">→</div>

        {/* Fully Connected */}
        <div className="text-center flex-shrink-0">
          <div className="w-4 h-8 md:w-6 md:h-12 bg-gradient-to-b from-purple to-pink rounded mb-1 md:mb-2" />
          <span className="text-xs text-light-gray">FC</span>
        </div>

        <div className="text-light-gray text-sm">→</div>

        {/* Output */}
        <div className="text-center flex-shrink-0">
          <div className="w-5 h-5 md:w-8 md:h-8 bg-gradient-to-br from-pink to-purple rounded mb-1 md:mb-2" />
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
      className="w-full h-64 md:h-80 bg-gradient-to-br from-pink/10 to-purple/10 rounded-lg p-4 md:p-6
                 border border-white/10 relative overflow-hidden"
    >
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          {/* Mock image */}
          <div className="w-48 h-36 md:w-64 md:h-48 bg-dark-gray/60 rounded-lg border border-white/20 relative">
            {/* Detection boxes */}
            <div className="absolute top-2 md:top-4 left-2 md:left-4 w-12 h-8 md:w-16 md:h-12 border-2 border-purple rounded">
              <span className="absolute -top-4 md:-top-6 left-0 text-xs text-purple font-medium">
                Car 98%
              </span>
            </div>
            <div className="absolute top-4 md:top-8 right-3 md:right-6 w-8 h-12 md:w-12 md:h-16 border-2 border-pink rounded">
              <span className="absolute -top-4 md:-top-6 right-0 text-xs text-pink font-medium">
                Person 95%
              </span>
            </div>
            <div className="absolute bottom-3 md:bottom-6 left-4 md:left-8 w-14 h-6 md:w-20 md:h-10 border-2 border-blue-purple rounded">
              <span className="absolute -top-4 md:-top-6 left-0 text-xs text-blue-purple font-medium">
                Bike 87%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2">
        <h3 className="text-base md:text-lg font-semibold text-white mb-1 text-center">
          YOLO Object Detection
        </h3>
        <p className="text-xs md:text-sm text-light-gray/70 text-center px-2">
          Real-time object detection and classification
        </p>
      </div>
    </motion.div>
  );
};
