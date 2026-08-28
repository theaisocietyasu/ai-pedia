"use client";

import { Line, OrbitControls, Sphere, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import type React from "react";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import {
  animationVariants,
  CheckboxControl,
  ControlPanel,
  SliderControl,
  VisualizationLoading,
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
        <Line points={linePoints} color="#5B4FB3" lineWidth={3} />

        {/* Data points */}
        {dataPoints.map((point) => (
          <group key={point.x}>
            <Sphere position={[point.x, point.y, 0]} args={[0.08]}>
              <meshBasicMaterial color="#8F84D6" />
            </Sphere>
            {showResiduals && (
              <Line
                points={[
                  new THREE.Vector3(point.x, point.y, 0),
                  new THREE.Vector3(point.x, point.predicted, 0),
                ]}
                color="#B45309"
                lineWidth={2}
              />
            )}
          </group>
        ))}

        {/* Coordinate axes */}
        <Line
          points={[new THREE.Vector3(-6, 0, 0), new THREE.Vector3(6, 0, 0)]}
          color="#6F6D66"
          lineWidth={1}
        />
        <Line
          points={[new THREE.Vector3(0, -6, 0), new THREE.Vector3(0, 6, 0)]}
          color="#6F6D66"
          lineWidth={1}
        />

        {/* Equation text */}
        <Text
          position={[0, 4.5, 0]}
          fontSize={0.3}
          color="#191918"
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
      className="w-full h-80 md:h-96 bg-surface rounded-lg border border-line overflow-hidden relative"
    >
      <div className="flex flex-col lg:flex-row h-full">
        {/* 3D Visualization */}
        <div className="flex-1 relative min-h-[300px] lg:min-h-0">
          <Suspense
            fallback={
              <VisualizationLoading message="Loading 3D visualization..." />
            }
          >
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

        {/* Controls - Responsive Panel */}
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

          <div className="mt-6 p-3 bg-surface border border-line rounded">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Equation Components:
            </h4>
            <ul className="text-xs text-ink-2 space-y-1">
              <li>• β₀ (intercept): {intercept.toFixed(1)}</li>
              <li>• β₁ (slope): {slope.toFixed(1)}</li>
              <li>• Lavender dots: Data points</li>
              <li>• Purple line: Regression line</li>
              <li>• Amber lines: Residuals</li>
            </ul>
          </div>
        </ControlPanel>
      </div>
    </motion.div>
  );
};
