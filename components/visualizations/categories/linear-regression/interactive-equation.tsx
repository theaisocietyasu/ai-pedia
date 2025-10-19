"use client"

import React, { useState, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Text, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { 
  ControlPanel, 
  SliderControl, 
  CheckboxControl, 
  VisualizationLoading,
  generateSampleData,
  animationVariants 
} from "../../shared";

export const LinearEquationVisualization: React.FC = () => {
  const [slope, setSlope] = useState(1.5);
  const [intercept, setIntercept] = useState(2);
  const [showResiduals, setShowResiduals] = useState(false);

  // Generate sample data points
  const [dataPoints] = useState(() => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      const x = (i - 10) * 0.5;
      const y = slope * x + intercept + (Math.random() - 0.5) * 2; // Add some noise
      points.push({ x, y, predicted: slope * x + intercept });
    }
    return points;
  });

  const LineVisualization = () => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame(() => {
      if (groupRef.current) {
        // Animate the line slightly
        groupRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.02;
      }
    });

    // Create line points
    const linePoints = [];
    for (let x = -5; x <= 5; x += 0.1) {
      const y = slope * x + intercept;
      linePoints.push(new THREE.Vector3(x, y, 0));
    }

    return (
      <group ref={groupRef}>
        {/* Regression line */}
        <Line
          points={linePoints}
          color="#8b5cf6"
          lineWidth={3}
        />
        
        {/* Data points */}
        {dataPoints.map((point, index) => (
          <group key={index}>
            <Sphere
              position={[point.x, point.y, 0]}
              args={[0.08]}
            >
              <meshBasicMaterial color="#ec4899" />
            </Sphere>
            {showResiduals && (
              <Line
                points={[
                  new THREE.Vector3(point.x, point.y, 0),
                  new THREE.Vector3(point.x, point.predicted, 0)
                ]}
                color="#fbbf24"
                lineWidth={2}
              />
            )}
          </group>
        ))}

        {/* Coordinate axes */}
        <Line
          points={[new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)]}
          color="#64748b"
          lineWidth={1}
        />
        <Line
          points={[new THREE.Vector3(0, -6, 0), new THREE.Vector3(0, 6, 0)]}
          color="#64748b"
          lineWidth={1}
        />

        {/* Equation text */}
        <Text
          position={[0, 4.5, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`y = ${slope.toFixed(1)}x + ${intercept.toFixed(1)}`}
        </Text>
      </group>
    );
  };

  return (
    <motion.div
      {...animationVariants.scaleIn}
      className="w-full h-96 bg-gradient-to-br from-purple/10 to-pink/10 rounded-lg border border-white/10 overflow-hidden"
    >
      <div className="flex h-full">
        {/* 3D Visualization */}
        <div className="flex-1 relative">
          <Suspense fallback={<VisualizationLoading message="Loading 3D visualization..." />}>
            <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} />
              <LineVisualization />
              <OrbitControls 
                enableZoom={true} 
                enablePan={true} 
                enableRotate={true}
                maxDistance={15}
                minDistance={5}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Controls */}
        <ControlPanel title="Interactive Controls">
          <div className="space-y-4">
            <SliderControl
              label="Slope (β₁)"
              value={slope}
              min={-3}
              max={3}
              step={0.1}
              onChange={setSlope}
            />

            <SliderControl
              label="Intercept (β₀)"
              value={intercept}
              min={-5}
              max={5}
              step={0.1}
              onChange={setIntercept}
            />

            <CheckboxControl
              id="residuals"
              label="Show Residuals"
              checked={showResiduals}
              onChange={setShowResiduals}
            />
          </div>

          <div className="mt-6 p-3 bg-gray-700/50 rounded">
            <h4 className="text-sm font-medium text-white mb-2">Equation Components:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• β₀ (intercept): {intercept.toFixed(1)}</li>
              <li>• β₁ (slope): {slope.toFixed(1)}</li>
              <li>• Pink dots: Data points</li>
              <li>• Purple line: Regression line</li>
              <li>• Yellow lines: Residuals</li>
            </ul>
          </div>
        </ControlPanel>
      </div>
    </motion.div>
  );
};