"use client"

import React from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../../shared";

export const AITrendsVisualization: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.scaleIn}
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
  );
};

export const ActivationFunctionVisualizer: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.slideUp}
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
  );
};

export const AttentionMechanismDemo: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.slideUp}
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
  );
};

export const MultiModalLearningDemo: React.FC = () => {
  return (
    <motion.div
      {...animationVariants.fadeIn}
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
  );
};