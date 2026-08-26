# Theatre.js Animation Editor Implementation Plan

## Overview
Theatre.js is a professional animation library with a visual editor specifically built for Three.js. It's perfect for your use case because:
- ✅ Visual timeline editor (like video editing software)
- ✅ Keyframe-based animations
- ✅ Export/import projects as JSON
- ✅ Works seamlessly with React Three Fiber
- ✅ Production-ready (used by studios like Active Theory)
- ✅ No backend required for editing (all client-side)

## Installation

```bash
pnpm add @theatre/core @theatre/studio @theatre/r3f
```

### Package Versions (Latest)
- `@theatre/core`: ^0.5.1 - Core animation engine (ships to production)
- `@theatre/studio`: ^0.5.1 - Visual editor UI (dev only)
- `@theatre/r3f`: ^0.5.1 - React Three Fiber integration

## Architecture

### Phase 1: Basic Setup (Days 1-3)

```
/app/learn/animation-studio/
├── page.tsx                    # Main editor page (admin only)
└── components/
    ├── TheatreEditor.tsx       # Theatre.js editor wrapper
    ├── AnimationCanvas.tsx     # Three.js canvas with Theatre
    └── ObjectLibrary.tsx       # Drag & drop object palette

/components/visualizations/
├── TheatreRenderer.tsx         # Generic renderer for saved animations
└── categories/
    └── custom-animations/      # User-created animations
```

### Phase 2: Data Flow

```
1. Creation Flow:
   Officer opens /learn/animation-studio
   → Adds objects to scene
   → Animates using Theatre.js timeline
   → Exports to JSON
   → Saves to MongoDB with unique ID
   → Gets shareable ID: VZ-custom-neural-flow

2. Usage Flow:
   Officer edits markdown: <div id="VZ-custom-neural-flow"></div>
   → TheatreRenderer fetches JSON from DB
   → Loads Theatre.js project
   → Plays animation
```

## Implementation Guide

### Step 1: Install Dependencies

```bash
cd /home/ash/student_orgs/AIS/ml-visualization
pnpm add @theatre/core @theatre/studio @theatre/r3f
```

### Step 2: Create Theatre.js Studio Page

**File: `/app/learn/animation-studio/page.tsx`**

```typescript
'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';

// Dynamic import to prevent SSR issues
const TheatreStudio = dynamic(
  () => import('./components/TheatreEditor'),
  { ssr: false }
);

export default function AnimationStudioPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <div className="min-h-screen bg-dark-gray">
          <header className="bg-dark-gray/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
                Animation Studio
              </h1>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-purple/20 hover:bg-purple/30 rounded-lg border border-purple/50 transition-colors">
                  Load Animation
                </button>
                <button className="px-4 py-2 bg-pink hover:bg-pink/90 rounded-lg transition-colors">
                  Save Animation
                </button>
              </div>
            </div>
          </header>
          
          <TheatreStudio />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
```

### Step 3: Create Theatre.js Editor Component

**File: `/app/learn/animation-studio/components/TheatreEditor.tsx`**

```typescript
'use client'

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { getProject, val } from '@theatre/core';
import studio from '@theatre/studio';
import extension from '@theatre/r3f/dist/extension';
import { editable as e, SheetProvider } from '@theatre/r3f';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Initialize Theatre.js studio (only in development)
if (process.env.NODE_ENV === 'development') {
  studio.initialize();
  studio.extend(extension);
}

// Create Theatre.js project
const theatreProject = getProject('AnimationStudio', {
  state: undefined // Start with empty state
});

const AnimatedScene = () => {
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
      
      {/* Editable objects */}
      <e.mesh theatreKey="Sphere1" position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <e.meshStandardMaterial theatreKey="SphereMaterial" color="#8b5cf6" />
      </e.mesh>
      
      <e.mesh theatreKey="Box1" position={[3, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <e.meshStandardMaterial theatreKey="BoxMaterial" color="#ec4899" />
      </e.mesh>
      
      {/* Grid helper */}
      <gridHelper args={[20, 20]} />
      
      <OrbitControls makeDefault />
    </SheetProvider>
  );
};

export default function TheatreEditor() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    setIsReady(true);
    
    // Auto-play on load
    const sheet = theatreProject.sheet('Scene');
    sheet.project.ready.then(() => {
      sheet.sequence.play({ iterationCount: Infinity });
    });
  }, []);
  
  const handleExport = () => {
    const state = studio.createContentOfSaveFile(theatreProject.address.projectId);
    console.log('Export state:', state);
    
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
  };
  
  const handleSave = async () => {
    const state = studio.createContentOfSaveFile(theatreProject.address.projectId);
    
    try {
      const response = await fetch('/api/animations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'My Animation',
          config: state
        })
      });
      
      const data = await response.json();
      alert(`Animation saved! ID: ${data.id}`);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save animation');
    }
  };
  
  if (!isReady) return <div>Loading...</div>;
  
  return (
    <div className="h-[calc(100vh-80px)] relative">
      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
        >
          Export JSON
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white"
        >
          Save to DB
        </button>
      </div>
      
      {/* Three.js Canvas */}
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <AnimatedScene />
      </Canvas>
    </div>
  );
}
```

### Step 4: Create Generic Theatre.js Renderer

**File: `/components/visualizations/TheatreRenderer.tsx`**

```typescript
'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { getProject } from '@theatre/core';
import { SheetProvider, editable as e } from '@theatre/r3f';
import { OrbitControls } from '@react-three/drei';

interface TheatreRendererProps {
  animationId: string;
}

export const TheatreRenderer: React.FC<TheatreRendererProps> = ({ animationId }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const projectRef = useRef(null);
  
  useEffect(() => {
    // Fetch animation config from API
    fetch(`/api/animations/${animationId}`)
      .then(res => res.json())
      .then(data => {
        setConfig(data.config);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load animation:', err);
        setLoading(false);
      });
  }, [animationId]);
  
  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-purple/10 to-pink/10 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading animation...</p>
        </div>
      </div>
    );
  }
  
  if (!config) {
    return (
      <div className="w-full h-96 bg-red-500/10 rounded-lg flex items-center justify-center">
        <p className="text-red-500">Failed to load animation</p>
      </div>
    );
  }
  
  // Create Theatre.js project from saved config
  const project = getProject('LoadedAnimation', { state: config });
  const sheet = project.sheet('Scene');
  
  // Auto-play
  useEffect(() => {
    if (sheet) {
      sheet.sequence.play({ iterationCount: Infinity });
    }
  }, [sheet]);
  
  return (
    <div className="w-full h-96 bg-dark-gray/50 rounded-lg overflow-hidden border border-white/10">
      <Canvas>
        <SheetProvider sheet={sheet}>
          {/* Scene will be reconstructed from config */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
          
          {/* Dynamic objects based on config */}
          <group>
            {/* Objects will be created from config.sheets.Scene.objects */}
          </group>
          
          <OrbitControls enableZoom={false} />
        </SheetProvider>
      </Canvas>
    </div>
  );
};
```

### Step 5: Create API Endpoints

**File: `/app/api/animations/save/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Animation } from '@/models/animation_model';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, config, description } = await request.json();
    
    await dbConnect();
    
    const animation = await Animation.create({
      name,
      config,
      description,
      createdBy: session.user.discordId,
      createdAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      id: `VZ-custom-${animation._id}`,
      animation
    });
  } catch (error) {
    console.error('Save animation error:', error);
    return NextResponse.json(
      { error: 'Failed to save animation' },
      { status: 500 }
    );
  }
}
```

**File: `/app/api/animations/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Animation } from '@/models/animation_model';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Extract MongoDB ID from VZ-custom-{id} format
    const mongoId = params.id.replace('VZ-custom-', '');
    
    const animation = await Animation.findById(mongoId);
    
    if (!animation) {
      return NextResponse.json(
        { error: 'Animation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(animation);
  } catch (error) {
    console.error('Fetch animation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch animation' },
      { status: 500 }
    );
  }
}
```

### Step 6: Create MongoDB Model

**File: `/models/animation_model.js`**

```javascript
import mongoose from 'mongoose';

const animationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  config: {
    type: Object, // Theatre.js project state
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }]
});

animationSchema.index({ createdBy: 1, createdAt: -1 });

export const Animation = mongoose.models.Animation || 
  mongoose.model('Animation', animationSchema, 'animations');
```

### Step 7: Update Visualization Registry

**File: `/components/visualizations/visualization-registry.tsx`**

Add this to the registry:

```typescript
import { TheatreRenderer } from './TheatreRenderer';

export const VISUALIZATION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // ... existing components
  
  // Theatre.js custom animations (dynamic)
  // Handle all VZ-custom-* IDs
};

// Update Visualization component
export const Visualization: React.FC<VisualizationProps> = ({
  componentId,
  fallbackTitle = "Interactive Visualization"
}) => {
  // Check if it's a custom Theatre.js animation
  if (componentId.startsWith('VZ-custom-')) {
    return <TheatreRenderer animationId={componentId} />;
  }
  
  // ... existing logic
};
```

## Usage Guide for Officers

### Creating an Animation

1. Navigate to `/learn/animation-studio`
2. Use Theatre.js studio panel (right side) to:
   - Add objects to scene
   - Animate properties on the timeline
   - Preview in real-time
3. Click "Save to DB" when done
4. Copy the generated ID (e.g., `VZ-custom-507f1f77bcf86cd799439011`)

### Using in Markdown

```markdown
## Neural Network Visualization

Here's how data flows through a neural network:

<div id="VZ-custom-507f1f77bcf86cd799439011"></div>

The animation shows...
```

## Advanced Features (Future)

### Template Library

Create preset animations that officers can start from:

```typescript
const TEMPLATES = {
  'neural-network': {
    name: 'Neural Network',
    description: 'Basic neural network visualization',
    config: { /* Theatre.js state */ }
  },
  'regression-line': {
    name: 'Regression Line',
    description: 'Animated regression line fitting',
    config: { /* Theatre.js state */ }
  }
};
```

### Object Library Panel

Add a panel to drag & drop new objects:

```typescript
const AVAILABLE_OBJECTS = [
  { type: 'sphere', icon: '⚪', name: 'Sphere' },
  { type: 'box', icon: '🟦', name: 'Box' },
  { type: 'cylinder', icon: '🔵', name: 'Cylinder' },
  { type: 'cone', icon: '🔺', name: 'Cone' },
  { type: 'torus', icon: '🍩', name: 'Torus' },
  { type: 'line', icon: '📏', name: 'Line' },
  { type: 'text', icon: '🔤', name: 'Text' }
];
```

### Animation Presets

Common animation patterns:

```typescript
const ANIMATION_PRESETS = {
  'bounce': { /* keyframes */ },
  'pulse': { /* keyframes */ },
  'rotate': { /* keyframes */ },
  'fade': { /* keyframes */ },
  'scale': { /* keyframes */ }
};
```

## Benefits Summary

### For Officers (Non-Technical)
- ✅ Visual timeline editor (like video editing)
- ✅ No coding required
- ✅ Instant preview
- ✅ Save and reuse animations
- ✅ Professional-grade results

### For Developers
- ✅ Minimal code to maintain
- ✅ One generic renderer
- ✅ Type-safe with TypeScript
- ✅ Production-ready library
- ✅ Easy to extend

### For Students
- ✅ High-quality interactive visualizations
- ✅ Consistent experience
- ✅ Better learning outcomes

## Troubleshooting

### Common Issues

**Issue**: Theatre Studio not showing
**Solution**: Make sure you're running in development mode and studio.initialize() is called

**Issue**: "Window is not defined" error
**Solution**: Use dynamic import with `{ ssr: false }`

**Issue**: Animations not playing
**Solution**: Check that `sheet.sequence.play()` is called after project is ready

**Issue**: Props not animatable
**Solution**: Only editable (`e.mesh`) components can be animated

## Resources

- [Theatre.js Docs](https://www.theatrejs.com/docs/latest/getting-started)
- [Theatre.js R3F Integration](https://www.theatrejs.com/docs/latest/r3f)
- [Theatre.js Examples](https://github.com/theatre-js/theatre/tree/main/examples)
- [Video Tutorial](https://www.youtube.com/watch?v=icR9EIS1q34)

## Next Steps

1. **Install packages** (5 min)
2. **Create studio page** (1 hour)
3. **Test basic animation** (30 min)
4. **Create renderer component** (1 hour)
5. **Build API endpoints** (2 hours)
6. **Test end-to-end** (1 hour)
7. **Add object library** (4 hours)
8. **Create templates** (4 hours)
9. **Polish UI** (8 hours)
10. **Documentation & training** (4 hours)

**Total**: ~25 hours for MVP

## Success Metrics

- Officers can create animation in < 30 minutes
- Zero JavaScript code needed
- 100% of animations load correctly
- < 500ms load time for animations
- 60 FPS animation playback

---

Ready to get started? Run:
```bash
pnpm add @theatre/core @theatre/studio @theatre/r3f
```
