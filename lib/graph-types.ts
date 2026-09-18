/**
 * The shape of the map, shared by the build-time layout in `lib/graph.ts` and
 * the browser-side canvas that draws it.
 *
 * This module is deliberately free of Node imports: the graph builder reads the
 * content directory with `node:fs`, and the client must be able to take these
 * types and constants without dragging that into the bundle.
 */

export type GraphNodeKind = "root" | "category" | "article" | "heading";

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  /** Small caption under the label, e.g. how many topics a branch holds. */
  sublabel?: string;
  description?: string;
  /** Article route, set on article nodes and inherited by heading nodes. */
  href?: string;
  /** Anchor id within the article, on heading nodes. */
  anchor?: string;
  parent?: string;
  /** Tree depth: 0 root, 1 category, 2 article, 3+ heading. */
  depth: number;
  x: number;
  y: number;
  r: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  /** "tree" edges are containment; "ring" edges link sibling categories. */
  kind: "tree" | "ring";
}

export interface GraphBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Everything, including the deep nodes that only appear when zoomed in. */
  bounds: GraphBounds;
  /**
   * Just the root and its categories — what the opening shot should frame.
   * Framing the full bounds instead would push the whole map into the middle
   * distance to leave room for detail nobody can see yet.
   */
  overview: GraphBounds;
}

export const ROOT_ID = "root";
