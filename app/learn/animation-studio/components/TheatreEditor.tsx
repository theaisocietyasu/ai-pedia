'use client'

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { getProject } from '@theatre/core';
import studio from '@theatre/studio';
import extension from '@theatre/r3f/dist/extension';
import { editable as e, SheetProvider } from '@theatre/r3f';
import { OrbitControls } from '@react-three/drei';
import { useRouter } from 'next/navigation';

// Initialize Theatre.js studio (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  studio.initialize();
  studio.extend(extension);
}

// Create Theatre.js project
let theatreProject: ReturnType<typeof getProject> | null = null;

if (typeof window !== 'undefined') {
  theatreProject = getProject('AnimationStudio', {
    state: undefined // Start with empty state
  });
}

const AnimatedScene = () => {
  if (!theatreProject) return null;
  
  const sheet = theatreProject.sheet('Scene');
  
  return (
    <SheetProvider sheet={sheet}>
      {/* Editable camera */}
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
      
      {/* Editable objects - starting with a simple sphere */}
      <e.mesh theatreKey="Sphere1" position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#8b5cf6" />
      </e.mesh>
      
      <e.mesh theatreKey="Box1" position={[3, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ec4899" />
      </e.mesh>
      
      {/* Grid helper */}
      <gridHelper args={[20, 20]} />
      
      <OrbitControls makeDefault />
    </SheetProvider>
  );
};

export default function TheatreEditor() {
  const [isReady, setIsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [animationName, setAnimationName] = useState('');
  const [animationDescription, setAnimationDescription] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReady(true);
      
      // Auto-play on load
      if (theatreProject) {
        const sheet = theatreProject.sheet('Scene');
        sheet.project.ready.then(() => {
          sheet.sequence.play({ iterationCount: Infinity });
        });
      }
    }
  }, []);
  
  const handleExport = () => {
    if (!theatreProject || typeof window === 'undefined') return;
    
    try {
      const state = studio.createContentOfSaveFile(theatreProject.address.projectId);
      
      // Create download
      const blob = new Blob([JSON.stringify(state, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'animation.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export animation');
    }
  };
  
  const handleSave = async () => {
    if (!theatreProject || !animationName.trim()) {
      setSaveError('Please enter an animation name');
      return;
    }
    
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    
    try {
      const state = studio.createContentOfSaveFile(theatreProject.address.projectId);
      
      const response = await fetch('/api/animations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: animationName,
          description: animationDescription,
          config: state
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save animation');
      }
      
      setSaveSuccess(`Animation saved! ID: ${data.id}`);
      setAnimationName('');
      setAnimationDescription('');
      setShowSaveModal(false);
      
      // Show success message for 5 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 5000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save animation');
    } finally {
      setSaving(false);
    }
  };
  
  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading animation editor...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-80px)] relative">
      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-green-900/20 border border-green-500 text-green-400 px-6 py-3 rounded-lg">
          ✅ {saveSuccess}
        </div>
      )}
      
      {saveError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-900/20 border border-red-500 text-red-400 px-6 py-3 rounded-lg">
          ❌ {saveError}
        </div>
      )}
      
      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/50 text-blue-300 transition-colors"
        >
          📥 Export JSON
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-purple hover:bg-purple/80 rounded-lg text-white transition-colors"
        >
          💾 Save to Database
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
        >
          ← Back
        </button>
      </div>
      
      {/* Three.js Canvas */}
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <AnimatedScene />
      </Canvas>
      
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-gray border border-gray-700 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Save Animation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Animation Name *
                </label>
                <input
                  type="text"
                  value={animationName}
                  onChange={(e) => setAnimationName(e.target.value)}
                  placeholder="e.g., Neural Network Flow"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={animationDescription}
                  onChange={(e) => setAnimationDescription(e.target.value)}
                  placeholder="Brief description of the animation"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSaveError(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors"
                disabled={saving || !animationName.trim()}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
            
            {saveError && (
              <div className="mt-4 text-red-400 text-sm">{saveError}</div>
            )}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 bg-dark-gray/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 max-w-md">
        <h3 className="text-sm font-semibold text-white mb-2">💡 How to Use</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Use the Theatre.js panel (right side) to edit properties</li>
          <li>• Click on objects in the scene to select them</li>
          <li>• Add keyframes on the timeline to create animations</li>
          <li>• Save your animation to get an ID for embedding</li>
        </ul>
      </div>
    </div>
  );
}

