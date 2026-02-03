'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { getProject } from '@theatre/core';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { OrbitControls } from '@react-three/drei';
import { VisualizationLoading, VisualizationError } from './shared';

interface TheatreRendererProps {
  animationId: string;
  fallbackTitle?: string;
}

export const TheatreRenderer: React.FC<TheatreRendererProps> = ({ 
  animationId,
  fallbackTitle = "Interactive Animation"
}) => {
  const [config, setConfig] = useState<any>(null);
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
        setConfig(data.config);
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
    if (!config || typeof window === 'undefined') return;
    
    try {
      // Create a unique project name for each animation
      const projectName = `TheatreAnimation_${animationId.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const project = getProject(projectName, { state: config });
      projectRef.current = project;
      
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
  }, [config, animationId]);
  
  if (loading) {
    return <VisualizationLoading message="Loading animation..." />;
  }
  
  if (error || !config) {
    return (
      <VisualizationError 
        componentId={animationId} 
        message={error || 'Animation not found'}
        type="error"
      />
    );
  }
  
  if (!sheetRef.current) {
    return <VisualizationLoading message="Initializing animation..." />;
  }
  
  // Render scene with editable components that match the saved config
  // Note: Objects need to match the structure from the editor
  const RenderScene = () => {
    if (!sheetRef.current) return null;
    
    return (
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
        
        {/* Editable objects - these should match what was created in the editor */}
        <e.mesh theatreKey="Sphere1" position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#8b5cf6" />
        </e.mesh>
        
        <e.mesh theatreKey="Box1" position={[3, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ec4899" />
        </e.mesh>
        
        {/* Grid helper for reference */}
        <gridHelper args={[20, 20]} />
        
        {/* OrbitControls for interaction */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={5}
        />
      </SheetProvider>
    );
  };
  
  return (
    <div className="w-full h-96 bg-gradient-to-br from-purple/10 to-pink/10 rounded-lg overflow-hidden border border-white/10">
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <RenderScene />
      </Canvas>
    </div>
  );
};

export default TheatreRenderer;

