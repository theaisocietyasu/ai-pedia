import { NeuralGraph } from "@/components/graph/neural-graph";
import type { GraphData } from "@/lib/graph-types";

/**
 * Full-bleed home for the map, with the standing caption that tells a first
 * visitor the canvas is something to move around in.
 */
export function GraphStage({ graph }: { graph: GraphData }) {
  return (
    <div className="relative h-full w-full">
      <NeuralGraph graph={graph} />
      <div className="pointer-events-none absolute inset-x-0 top-5 z-10 px-6 text-center">
        <p className="eyebrow">The AI Society · Arizona State University</p>
        <p className="mt-2 text-xs text-muted">
          Scroll to zoom · drag to pan · click a node to read
        </p>
      </div>
    </div>
  );
}
