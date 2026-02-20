'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { getProject } from '@theatre/core';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { OrbitControls } from '@react-three/drei';
import { VisualizationLoading, VisualizationError } from './shared';
// Import from the animation studio components
// Note: In a larger app we might want to move these to a shared 'lib' or 'ui' folder
import { SceneObjectFactory, SceneObjectProps } from '../../app/learn/animation-studio/components/SceneObjects';

interface TheatreRendererProps {
  animationId: string;
  fallbackTitle?: string;
}

export const TheatreRenderer: React.FC<TheatreRendererProps> = ({
  animationId,
  fallbackTitle = "Interactive Animation"
}) => {
  const [theatreState, setTheatreState] = useState<any>(null);
  const [sceneObjects, setSceneObjects] = useState<SceneObjectProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const projectRef = useRef<ReturnType<typeof getProject> | null>(null);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Extract MongoDB ID from VZ-custom-{id} format
    const mongoId = animationId.replace('VZ-custom-', '');

    // Fetch animation config from API
    fetch(`/api/animations/${mongoId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load animation: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data.config) {
          throw new Error('Invalid animation data');
        }

        // Handle new config format (with sceneObjects) vs legacy
        if (data.config.sceneObjects && data.config.theatreState) {
          setTheatreState(data.config.theatreState);
          setSceneObjects(data.config.sceneObjects);
        } else {
          // Legacy format: config IS the theatre state
          setTheatreState(data.config);
          // For legacy animations, we might want to hardcode the original default objects
          // But since we just started, we can assume empty or migrated
          setSceneObjects([]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load animation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load animation');
        setLoading(false);
      });
  }, [animationId]);

  // Initialize Theatre.js project when config is loaded
  useEffect(() => {
    if (!theatreState || typeof window === 'undefined') return;

    try {
      // Create a unique project name for each animation to prevent conflicts
      const projectName = `TheatreAnimation_${animationId.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Check if project already exists
      let project = projectRef.current;
      if (!project) {
        project = getProject(projectName, { state: theatreState });
        projectRef.current = project;
      }

      // Get the sheet (assuming it's named 'Scene')
      const sheet = project.sheet('Scene');
      sheetRef.current = sheet;

      // Auto-play animation
      sheet.project.ready.then(() => {
        sheet.sequence.play({ iterationCount: Infinity });
      }).catch((err) => {
        console.error('Error playing animation:', err);
        setError('Failed to play animation');
      });

    } catch (err) {
      console.error('Error initializing Theatre.js project:', err);
      setError('Failed to initialize animation');
    }
  }, [theatreState, animationId]);

  if (loading) {
    return <VisualizationLoading message="Loading animation..." />;
  }

  if (error || !theatreState) {
    return (
      <VisualizationError
        componentId={animationId}
        message={error || 'Animation not found'}
        type="error"
      />
    );
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-purple/10 to-pink/10 rounded-lg overflow-hidden border border-white/10">
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <SheetProvider sheet={sheetRef.current}>
          {/* Editable camera - will be controlled by Theatre.js */}
          <e.perspectiveCamera
            theatreKey="Camera"
            makeDefault
            position={[5, 5, 5]}
            fov={75}
          />

          {/* Editable lights */}
          <e.ambientLight theatreKey="AmbientLight" intensity={0.5} />
          <e.directionalLight
            theatreKey="DirectionalLight"
            position={[10, 10, 5]}
            intensity={1}
          />

          {/* Dynamic objects from config */}
          {sceneObjects.map((obj) => (
            <SceneObjectFactory
              key={obj.id}
              type={obj.type}
              props={obj}
            />
          ))}

          {/* Grid helper for reference (optional, maybe removing it for "view" mode is better, keeping for now) */}
          {/* <gridHelper args={[20, 20]} /> */}

          {/* OrbitControls for user interaction */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            maxDistance={15}
            minDistance={5}
          />
        </SheetProvider>
      </Canvas>
    </div>
  );
};

export default TheatreRenderer;


