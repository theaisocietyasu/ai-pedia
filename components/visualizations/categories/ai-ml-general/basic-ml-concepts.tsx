"use client";

import { motion } from "framer-motion";
import type React from "react";
import { animationVariants } from "../../shared";

export const AITrendsVisualization: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.scaleIn}
      className="w-full h-48 md:h-64 bg-surface rounded-lg p-4 md:p-6
                 border border-line flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-purple-wash rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 md:w-8 md:h-8 text-purple"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
          AI Trends Visualization
        </h3>
        <p className="text-muted text-xs md:text-sm px-2">
          Interactive chart showing the latest AI trends and adoption rates
          across industries.
        </p>
      </div>
    </motion.div>
  );
};

export const ActivationFunctionVisualizer: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.slideUp}
      className="w-full h-64 md:h-80 bg-surface rounded-lg p-4 md:p-6
                 border border-line flex items-center justify-center"
    >
      <div className="text-center w-full">
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 max-w-sm mx-auto">
          {["ReLU", "Sigmoid", "Tanh"].map((func) => (
            <div
              key={func}
              className="p-2 md:p-3 bg-background rounded border border-line"
            >
              <div className="w-full h-8 md:h-12 bg-purple rounded mb-2" />
              <span className="text-xs md:text-sm text-ink-2">{func}</span>
            </div>
          ))}
        </div>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
          Activation Functions
        </h3>
        <p className="text-muted text-xs md:text-sm px-2">
          Interactive visualization of common neural network activation
          functions.
        </p>
      </div>
    </motion.div>
  );
};

export const AttentionMechanismDemo: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.slideUp}
      className="w-full h-48 md:h-64 bg-surface rounded-lg p-4 md:p-6
                 border border-line flex items-center justify-center"
    >
      <div className="text-center">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-1 md:gap-2 mb-4 md:mb-6 max-w-xs md:max-w-none mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={String.fromCharCode(65 + i)}
              className="w-6 h-6 md:w-8 md:h-8 rounded border border-line flex items-center justify-center text-xs"
              style={{
                background: i === 3 || i === 4 ? "#C6BFEC" : "#F3F1EA",
                color: i === 3 || i === 4 ? "#191918" : "#6F6D66",
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
          Attention Mechanism
        </h3>
        <p className="text-muted text-xs md:text-sm px-2">
          Visualization of attention weights focusing on relevant input tokens
        </p>
      </div>
    </motion.div>
  );
};

export const MultiModalLearningDemo: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.fadeIn}
      className="w-full h-56 md:h-72 bg-surface rounded-lg p-4 md:p-6
                 border border-line relative"
    >
      <div className="h-full flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-4 md:gap-8 items-center justify-center max-w-sm md:max-w-none mx-auto">
          {/* Text Input */}
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-wash rounded-lg mb-2 md:mb-3 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-purple"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <span className="text-xs md:text-sm text-ink-2">Text</span>
          </div>

          {/* Image Input */}
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-wash rounded-lg mb-2 md:mb-3 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-purple-deep"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
              </svg>
            </div>
            <span className="text-xs md:text-sm text-ink-2">Image</span>
          </div>

          {/* Audio Input */}
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-wash rounded-lg mb-2 md:mb-3 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
              </svg>
            </div>
            <span className="text-xs md:text-sm text-ink-2">Audio</span>
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <p className="text-xs md:text-sm text-muted text-center px-2">
            Multi-modal AI combining text, image, and audio processing
          </p>
        </div>
      </div>
    </motion.div>
  );
};
