'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';

// Dynamic import to prevent SSR issues with Theatre.js
const TheatreStudio = dynamic(
  () => import('./components/TheatreEditor'),
  { ssr: false }
);

export default function AnimationStudioPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <div className="min-h-screen bg-background">
          <header className="bg-dark-gray/80 backdrop-blur-sm border-b border-gray-800 p-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
                🎬 Animation Studio
              </h1>
              <p className="text-sm text-gray-400 hidden md:block">
                Create and edit 3D animations visually
              </p>
            </div>
          </header>
          
          <TheatreStudio />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}

