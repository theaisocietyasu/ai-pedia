import type { GraphBounds, GraphNode } from "@/lib/graph-types";

/**
 * The camera looks at a world point (`cx`, `cy`) at magnification `k`, and
 * `ox` nudges the whole view sideways in screen pixels so a focused node can
 * sit in the space left over beside the open reading panel.
 */
export interface Camera {
  cx: number;
  cy: number;
  k: number;
  ox: number;
}

export const MIN_K = 0.12;
export const MAX_K = 9;

/**
 * Zoom thresholds, as multiples of the opening framing. Measuring against that
 * rather than an absolute scale keeps the reveals landing at the same point in
 * the gesture on a phone and on a wide monitor.
 */
const LEVEL_BREAKS = [1.5, 3.4] as const;

/** 0 = categories only, 1 = articles, 2 = headings. */
export function levelFor(k: number, baseK: number): number {
  const ratio = k / Math.max(baseK, 1e-6);
  if (ratio < LEVEL_BREAKS[0]) return 0;
  if (ratio < LEVEL_BREAKS[1]) return 1;
  return 2;
}

/** Magnification used when a node of each kind is brought into focus. */
export function focusScaleFor(node: GraphNode, baseK: number): number {
  switch (node.kind) {
    case "root":
      return baseK;
    case "category":
      return baseK * 2.1;
    case "article":
      return baseK * 4.4;
    default:
      return baseK * 6.5;
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function transformFor(cam: Camera, w: number, h: number): string {
  const tx = w / 2 + cam.ox;
  const ty = h / 2;
  return `translate(${tx} ${ty}) scale(${cam.k}) translate(${-cam.cx} ${-cam.cy})`;
}

/** Screen pixel → world coordinate under the current camera. */
export function toWorld(
  cam: Camera,
  w: number,
  h: number,
  px: number,
  py: number,
): { x: number; y: number } {
  return {
    x: (px - w / 2 - cam.ox) / cam.k + cam.cx,
    y: (py - h / 2) / cam.k + cam.cy,
  };
}

/** A camera that frames the whole graph with a little breathing room. */
export function fitCamera(
  bounds: GraphBounds,
  w: number,
  h: number,
  padding = 96,
): Camera {
  const bw = Math.max(1, bounds.maxX - bounds.minX);
  const bh = Math.max(1, bounds.maxY - bounds.minY);
  // The caption sits across the top, so the frame keeps clear of it.
  const k = clamp(
    Math.min((w - padding * 2) / bw, (h - padding * 2 - 70) / bh),
    MIN_K,
    2.2,
  );
  return {
    cx: (bounds.minX + bounds.maxX) / 2,
    cy: (bounds.minY + bounds.maxY) / 2,
    k,
    ox: 0,
  };
}

/**
 * Keeps the camera tethered to the map: the scale stays within reach of the
 * opening framing, and the centre may drift only part of a screen beyond the
 * outermost node. Without this the mesh is endless in every direction and it is
 * entirely possible to zoom into blank paper and lose the site.
 */
export function clampCamera(
  cam: Camera,
  bounds: GraphBounds,
  baseK: number,
  w: number,
  h: number,
): Camera {
  const k = clamp(clamp(cam.k, baseK * 0.55, baseK * 14), MIN_K, MAX_K);
  if (!w || !h) return { ...cam, k };
  const slackX = (w / (2 * k)) * 0.7;
  const slackY = (h / (2 * k)) * 0.7;
  return {
    ...cam,
    k,
    cx: clamp(cam.cx, bounds.minX - slackX, bounds.maxX + slackX),
    cy: clamp(cam.cy, bounds.minY - slackY, bounds.maxY + slackY),
  };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Ease-out cubic — quick to leave, gentle to arrive. */
export function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Interpolates two cameras. Scale moves through log space so that zooming
 * from far out to close in feels like a constant rate rather than a lurch.
 */
export function blend(from: Camera, to: Camera, t: number): Camera {
  return {
    cx: lerp(from.cx, to.cx, t),
    cy: lerp(from.cy, to.cy, t),
    k: Math.exp(lerp(Math.log(from.k), Math.log(to.k), t)),
    ox: lerp(from.ox, to.ox, t),
  };
}
