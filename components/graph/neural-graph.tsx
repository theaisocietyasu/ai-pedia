"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GraphData, GraphEdge, GraphNode } from "@/lib/graph-types";
import { ROOT_ID } from "@/lib/graph-types";
import { drawField, type FieldStyle } from "./ambient-field";
import {
  blend,
  type Camera,
  clamp,
  clampCamera,
  easeOut,
  fitCamera,
  focusScaleFor,
  levelFor,
  MAX_K,
  MIN_K,
  toWorld,
  transformFor,
} from "./camera";

/**
 * The panel drags in the whole markdown stack — react-markdown, KaTeX, the
 * syntax highlighter — which has no business loading before someone opens a
 * node. It arrives with the first click instead.
 */
const ArticlePanel = dynamic(
  () => import("./article-panel").then((m) => m.ArticlePanel),
  { ssr: false },
);

/** Label size in world units, by tree depth. */
const LABEL_SIZE = [46, 27, 15, 8.5, 6] as const;

/** Below this viewport width the panel covers the canvas instead of splitting it. */
const NARROW = 900;

interface Size {
  w: number;
  h: number;
}

interface OpenArticle {
  href: string;
  anchor?: string;
}

function labelSize(depth: number): number {
  return LABEL_SIZE[Math.min(depth, LABEL_SIZE.length - 1)];
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/**
 * A gently bowed link between two nodes. The bow direction is derived from the
 * edge's own ids so the network keeps the same hand-drawn shape on every load.
 */
function edgePath(a: GraphNode, b: GraphNode, bow: number): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)} Q${(mx - dy * bow).toFixed(2)} ${(
    my + dx * bow
  ).toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

function bowFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ((h % 1000) / 1000 - 0.5) * 0.22;
}

export function NeuralGraph({ graph }: { graph: GraphData }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldStyleRef = useRef<FieldStyle>({ ink: "#191918", line: "#e3e0d6" });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const worldRef = useRef<SVGGElement | null>(null);
  const sizeRef = useRef<Size>({ w: 0, h: 0 });

  const camRef = useRef<Camera>({ cx: 0, cy: 0, k: 0.5, ox: 0 });
  /** Scale of the opening framing; every zoom threshold is relative to it. */
  const baseKRef = useRef(0.5);
  const animRef = useRef<{
    from: Camera;
    to: Camera;
    start: number;
    dur: number;
  } | null>(null);
  const rafRef = useRef<number | null>(null);

  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const pinchRef = useRef<number | null>(null);
  const capturedRef = useRef(new Set<number>());

  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [open, setOpen] = useState<OpenArticle | null>(null);

  const byId = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const n of graph.nodes) map.set(n.id, n);
    return map;
  }, [graph.nodes]);

  const edges = useMemo(
    () =>
      graph.edges
        .map((e: GraphEdge) => {
          const from = byId.get(e.from);
          const to = byId.get(e.to);
          if (!from || !to) return null;
          const id = `${e.from}->${e.to}`;
          return {
            id,
            kind: e.kind,
            from,
            to,
            depth: e.kind === "ring" ? 1 : to.depth,
            d: edgePath(from, to, e.kind === "ring" ? 0.16 : bowFor(id)),
          };
        })
        .filter((e): e is NonNullable<typeof e> => e !== null),
    [graph.edges, byId],
  );

  /** Every node from `id` up to the root, for highlighting a lineage. */
  const lineageOf = useCallback(
    (id: string | null): Set<string> => {
      const chain = new Set<string>();
      let cursor = id;
      while (cursor) {
        chain.add(cursor);
        cursor = byId.get(cursor)?.parent ?? null;
      }
      return chain;
    },
    [byId],
  );

  const highlight = useMemo(
    () => lineageOf(hoverId ?? activeId),
    [hoverId, activeId, lineageOf],
  );

  // ---------------------------------------------------------------- camera

  /** Repaints the procedural mesh for the current camera. */
  const paintField = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelW = Math.round(w * dpr);
    const pixelH = Math.round(h * dpr);
    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW;
      canvas.height = pixelH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawField(ctx, w, h, camRef.current, fieldStyleRef.current);
  }, []);

  const applyCamera = useCallback(() => {
    const world = worldRef.current;
    const svg = svgRef.current;
    if (!world || !svg) return;
    const { w, h } = sizeRef.current;
    world.setAttribute("transform", transformFor(camRef.current, w, h));
    const level = String(levelFor(camRef.current.k, baseKRef.current));
    if (svg.dataset.zoom !== level) svg.dataset.zoom = level;
    paintField();
  }, [paintField]);

  const tick = useCallback(
    (now: number) => {
      const anim = animRef.current;
      if (!anim) {
        rafRef.current = null;
        return;
      }
      const t = Math.min(1, (now - anim.start) / anim.dur);
      camRef.current = blend(anim.from, anim.to, easeOut(t));
      applyCamera();
      if (t >= 1) {
        animRef.current = null;
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [applyCamera],
  );

  const tether = useCallback(
    (cam: Camera): Camera => {
      const { w, h } = sizeRef.current;
      return clampCamera(cam, graph.bounds, baseKRef.current, w, h);
    },
    [graph.bounds],
  );

  const animateTo = useCallback(
    (to: Partial<Camera>, dur = 760) => {
      const from = { ...camRef.current };
      const next = tether({ ...from, ...to });
      if (
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
        dur === 0
      ) {
        animRef.current = null;
        camRef.current = next;
        applyCamera();
        return;
      }
      animRef.current = { from, to: next, start: performance.now(), dur };
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    },
    [applyCamera, tether, tick],
  );

  /** Stops any running flight and moves the camera immediately. */
  const setCamera = useCallback(
    (next: Camera) => {
      animRef.current = null;
      camRef.current = tether(next);
      applyCamera();
    },
    [applyCamera, tether],
  );

  /** Screen-space sideways shift that keeps a focused node clear of the panel. */
  const panelOffset = useCallback((panelOpen: boolean) => {
    const { w } = sizeRef.current;
    if (!panelOpen || w < NARROW) return 0;
    return -Math.min(760, w * 0.52) / 2;
  }, []);

  const resetView = useCallback(
    (dur = 760) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      animateTo(fitCamera(graph.overview, w, h), dur);
    },
    [animateTo, graph.overview],
  );

  // ------------------------------------------------------------- selection

  const closePanel = useCallback(() => {
    setOpen(null);
    animateTo({ ox: 0 });
  }, [animateTo]);

  const selectNode = useCallback(
    (node: GraphNode) => {
      setActiveId(node.id);

      if (node.id === ROOT_ID) {
        setOpen(null);
        resetView();
        return;
      }

      // Categories are waypoints: flying to one reveals its articles without
      // opening anything to read.
      if (node.kind === "category") {
        setOpen(null);
        animateTo({
          cx: node.x,
          cy: node.y,
          k: focusScaleFor(node, baseKRef.current),
          ox: 0,
        });
        return;
      }

      if (!node.href) return;
      const next: OpenArticle = { href: node.href, anchor: node.anchor };
      setOpen(next);
      animateTo({
        cx: node.x,
        cy: node.y,
        k: focusScaleFor(node, baseKRef.current),
        ox: panelOffset(true),
      });
    },
    [animateTo, panelOffset, resetView],
  );

  // --------------------------------------------------------------- sizing

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const styles = getComputedStyle(svg);
    fieldStyleRef.current = {
      ink: styles.getPropertyValue("--foreground").trim() || "#191918",
      line: styles.getPropertyValue("--line").trim() || "#e3e0d6",
    };

    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;
      const first = sizeRef.current.w === 0;
      sizeRef.current = { w: rect.width, h: rect.height };
      const fit = fitCamera(graph.overview, rect.width, rect.height);
      baseKRef.current = fit.k;
      if (first) {
        setCamera(fit);
        setReady(true);
      } else {
        applyCamera();
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [applyCamera, setCamera, graph.overview]);

  // ----------------------------------------------------------- wheel zoom

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = svg.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const { w, h } = sizeRef.current;
      const cam = camRef.current;

      // Trackpad pinch arrives as a ctrl-modified wheel with small deltas.
      const intensity = event.ctrlKey ? 0.01 : 0.0022;
      const k = clamp(
        cam.k * Math.exp(-event.deltaY * intensity),
        MIN_K,
        MAX_K,
      );
      const anchor = toWorld(cam, w, h, px, py);
      setCamera({
        k,
        ox: cam.ox,
        cx: anchor.x - (px - w / 2 - cam.ox) / k,
        cy: anchor.y - (py - h / 2) / k,
      });
    };

    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [setCamera]);

  // ------------------------------------------------------- pan and pinch

  /**
   * Pointer capture is taken only once a drag is really under way. Capturing on
   * pointerdown would retarget the click that follows to the <svg> itself, and
   * the node under the cursor would never hear about it.
   */
  const capture = useCallback((pointerId: number) => {
    const svg = svgRef.current;
    if (!svg || capturedRef.current.has(pointerId)) return;
    svg.setPointerCapture(pointerId);
    capturedRef.current.add(pointerId);
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      if (pointersRef.current.size === 1) {
        dragRef.current = { x: event.clientX, y: event.clientY, moved: false };
      } else {
        dragRef.current = null;
        pinchRef.current = null;
        // A second finger is unambiguously a gesture, never a tap.
        for (const id of pointersRef.current.keys()) capture(id);
      }
    },
    [capture],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const pointers = pointersRef.current;
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const previous = pinchRef.current;
        pinchRef.current = distance;
        if (previous && distance > 0) {
          const svg = svgRef.current;
          if (!svg) return;
          const rect = svg.getBoundingClientRect();
          const px = (a.x + b.x) / 2 - rect.left;
          const py = (a.y + b.y) / 2 - rect.top;
          const { w, h } = sizeRef.current;
          const cam = camRef.current;
          const k = clamp(cam.k * (distance / previous), MIN_K, MAX_K);
          const world = toWorld(cam, w, h, px, py);
          setCamera({
            k,
            ox: cam.ox,
            cx: world.x - (px - w / 2 - cam.ox) / k,
            cy: world.y - (py - h / 2) / k,
          });
        }
        return;
      }

      const drag = dragRef.current;
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true;
      capture(event.pointerId);
      drag.x = event.clientX;
      drag.y = event.clientY;
      const cam = camRef.current;
      setCamera({
        ...cam,
        cx: cam.cx - dx / cam.k,
        cy: cam.cy - dy / cam.k,
      });
    },
    [capture, setCamera],
  );

  const endPointer = useCallback((event: React.PointerEvent) => {
    const svg = svgRef.current;
    if (svg && capturedRef.current.delete(event.pointerId)) {
      svg.releasePointerCapture?.(event.pointerId);
    }
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) {
      // Cleared on the next frame so the click that follows can read it.
      const drag = dragRef.current;
      requestAnimationFrame(() => {
        if (dragRef.current === drag) dragRef.current = null;
      });
    }
  }, []);

  const wasDragged = () => dragRef.current?.moved === true;

  // ------------------------------------------------------------- keyboard

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (open) {
        closePanel();
        return;
      }
      if (activeId) {
        setActiveId(null);
        resetView();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeId, closePanel, resetView]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ---------------------------------------------------------------- render

  const dimmed = highlight.size > 1;

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {/* The unbounded ambient mesh. Canvas, not SVG: it is repainted on every
          frame of a pan or a flight, and there is no reason for any of it to
          exist in the DOM. */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <svg
        ref={svgRef}
        className="ngraph relative h-full w-full touch-none select-none"
        data-zoom="0"
        data-dimmed={dimmed ? "true" : "false"}
        style={{ opacity: ready ? 1 : 0 }}
        role="presentation"
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={() => {
          setActiveId(null);
          setOpen(null);
          resetView();
        }}
      >
        <title>Map of AI Pedia</title>
        <defs>
          {/* Clears a little paper around each real node so it is never read as
              part of the ambient mesh behind it. */}
          <radialGradient id="ngraph-halo">
            <stop className="ngraph-halo-in" offset="22%" />
            <stop className="ngraph-halo-out" offset="100%" />
          </radialGradient>
        </defs>
        <g ref={worldRef}>
          <g className="ngraph-edges">
            {edges.map((edge) => (
              <path
                key={edge.id}
                d={edge.d}
                data-depth={edge.depth}
                data-kind={edge.kind}
                data-lit={
                  highlight.has(edge.from.id) && highlight.has(edge.to.id)
                    ? "true"
                    : undefined
                }
              />
            ))}
          </g>

          <g className="ngraph-nodes">
            {graph.nodes.map((node) => {
              const lit = highlight.has(node.id);
              const size = labelSize(node.depth);
              return (
                <g
                  key={node.id}
                  data-depth={node.depth}
                  data-kind={node.kind}
                  data-lit={lit ? "true" : undefined}
                  data-active={activeId === node.id ? "true" : undefined}
                  transform={`translate(${node.x} ${node.y})`}
                >
                  <circle
                    className="ngraph-halo"
                    r={Math.max(node.r * 3.2, 15)}
                    fill="url(#ngraph-halo)"
                  />
                  {/* Generous invisible target — the drawn dots are small. */}
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: the canvas is aria-hidden decoration; the equivalent links live in the sr-only nav below */}
                  <circle
                    className="ngraph-hit"
                    r={Math.max(node.r * 2.4, 16)}
                    onPointerEnter={() => setHoverId(node.id)}
                    onPointerLeave={() =>
                      setHoverId((id) => (id === node.id ? null : id))
                    }
                    onClick={() => {
                      if (wasDragged()) return;
                      selectNode(node);
                    }}
                  />
                  <circle className="ngraph-dot" r={node.r} />
                  <text
                    className="ngraph-label"
                    y={node.r + size * 1.15}
                    fontSize={size}
                  >
                    {truncate(node.label, node.depth >= 3 ? 30 : 42)}
                  </text>
                  {node.sublabel && (
                    <text
                      className="ngraph-sublabel"
                      y={node.r + size * 2.05}
                      fontSize={size * 0.38}
                      letterSpacing={size * 0.07}
                    >
                      {node.sublabel.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Real links for keyboard users, screen readers and crawlers — the
          canvas above is decorative as far as assistive tech is concerned. */}
      <nav className="sr-only" aria-label="All topics">
        <h2>Topics</h2>
        <ul>
          {graph.nodes
            .filter((n) => n.kind === "category" || n.kind === "article")
            .map((n) => (
              <li key={n.id}>
                <Link href={n.href ?? "/"}>{n.label}</Link>
                {n.description ? ` — ${n.description}` : null}
              </li>
            ))}
        </ul>
      </nav>

      <GraphControls
        onReset={() => {
          setActiveId(null);
          setOpen(null);
          resetView();
        }}
        onZoom={(factor) => {
          const cam = camRef.current;
          animateTo({ k: clamp(cam.k * factor, MIN_K, MAX_K) }, 280);
        }}
      />

      {open && (
        <ArticlePanel
          href={open.href}
          anchor={open.anchor}
          onClose={closePanel}
        />
      )}
    </div>
  );
}

function GraphControls({
  onReset,
  onZoom,
}: {
  onReset: () => void;
  onZoom: (factor: number) => void;
}) {
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-background/85 px-1.5 py-1 backdrop-blur">
      <button
        type="button"
        onClick={() => onZoom(1 / 1.45)}
        className="pointer-events-auto h-8 w-8 rounded-full text-lg leading-none text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        aria-label="Zoom out"
      >
        −
      </button>
      <button
        type="button"
        onClick={onReset}
        className="pointer-events-auto rounded-full px-3 py-1 text-xs tracking-[0.14em] text-muted uppercase transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={() => onZoom(1.45)}
        className="pointer-events-auto h-8 w-8 rounded-full text-lg leading-none text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        aria-label="Zoom in"
      >
        +
      </button>
    </div>
  );
}
