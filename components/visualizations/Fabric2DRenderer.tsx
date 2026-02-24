'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { fabric as FabricNamespace } from 'fabric';

type FabricCanvas = FabricNamespace.Canvas;

interface Fabric2DRendererProps {
  animationId: string;
}

interface Animation2DDoc {
  _id: string;
  config: {
    canvasJSON: unknown;
    width?: number;
    height?: number;
  };
}

export const Fabric2DRenderer: React.FC<Fabric2DRendererProps> = ({
  animationId,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/animations2d/${animationId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || 'Failed to load animation');
        }
        const data = (await res.json()) as Animation2DDoc;

        if (!isMounted) return;
        if (!canvasElementRef.current) return;

        const fabricModule = await import('fabric');
        const fabric = fabricModule.fabric;

        const width = data.config.width ?? 800;
        const height = data.config.height ?? 450;

        const canvas = new fabric.Canvas(canvasElementRef.current, {
          width,
          height,
          backgroundColor: '#050816',
          selection: false,
        });

        canvasRef.current = canvas;

        canvas.loadFromJSON(
          data.config.canvasJSON as FabricNamespace.ICanvasOptions,
          () => {
            canvas.renderAll();
          },
        );

        setLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (isMounted) {
          setError(message);
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
      if (canvasRef.current) {
        canvasRef.current.dispose();
        canvasRef.current = null;
      }
    };
  }, [animationId]);

  if (loading) {
    return (
      <div className="w-full h-64 rounded-lg border border-white/10 bg-gradient-to-br from-purple/10 to-pink/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-300">Loading 2D animation…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 rounded-lg border border-red-500/40 bg-red-500/10 flex items-center justify-center">
        <p className="text-xs text-red-300">
          Failed to load 2D animation:
          {' '}
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-white/10 bg-[#050816] flex items-center justify-center py-4">
      <canvas
        ref={canvasElementRef}
        className="max-w-full h-auto border border-gray-800 rounded-md bg-[#050816]"
      />
    </div>
  );
};

export default Fabric2DRenderer;

