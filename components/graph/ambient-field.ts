import type { Camera } from "./camera";

/**
 * The ambient mesh behind the map — the faint constellation of dots and links
 * that keeps the canvas from ever reading as empty space.
 *
 * It is procedural and unbounded rather than a fixed set of points. World space
 * is cut into cells, each cell's points are derived from a hash of its
 * coordinates, and only the cells currently on screen are drawn. Pan as far as
 * you like and there is always more of it, with no data to store.
 *
 * Density is held constant in *screen* space: the cell size is chosen as the
 * power of two closest to `CELL_PX / scale`, so zooming in subdivides the field
 * instead of thinning it out. Crossing an octave swaps the whole mesh, which
 * reads as detail resolving rather than as a jump.
 */

/** Target on-screen size of one cell, in CSS pixels. */
const CELL_PX = 100;
const POINTS_PER_CELL = 5;
/**
 * Points closer than this (on screen) get linked. Kept below the smallest cell
 * a rounded octave can produce (CELL_PX / √2), because the neighbour search
 * only looks one cell out — a longer reach would drop the links it cannot see
 * and keep the long ones it can, webbing the screen with stray diagonals.
 */
const LINK_PX = 66;

/** The field slides slightly slower than the graph, which reads as depth. */
const PARALLAX = 0.88;

/** Cell budget, so a pathological camera can never lock up the frame. */
const MAX_CELLS = 6000;

export interface FieldStyle {
  /** Colour of the dots — the site's ink. */
  ink: string;
  /** Colour of the links — the site's hairline. */
  line: string;
}

interface FieldPoint {
  x: number;
  y: number;
  /** Stable 0–1 roll deciding size and brightness. */
  s: number;
}

/**
 * Integer hash → 0–1. Deterministic across machines and reloads.
 *
 * Every input, the salt included, is folded in before the final avalanche. Mix
 * the salt in at the end instead and the x and y draws for a point stay
 * correlated, which lays the whole field out along one diagonal.
 */
function rand(cx: number, cy: number, i: number, salt: number): number {
  let h = Math.imul(cx ^ 0x9e3779b9, 374761393);
  h = Math.imul(h ^ Math.imul(cy, 668265263), 2246822519);
  h = Math.imul(h ^ Math.imul(i + 1, 3266489917), 668265263);
  h = Math.imul(h ^ Math.imul(salt + 1, 374761393), 2246822519);
  h ^= h >>> 15;
  h = Math.imul(h, 2246822519);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489917);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function pointsInCell(cx: number, cy: number, cell: number): FieldPoint[] {
  const points: FieldPoint[] = [];
  for (let i = 0; i < POINTS_PER_CELL; i++) {
    points.push({
      x: (cx + rand(cx, cy, i, 1)) * cell,
      y: (cy + rand(cx, cy, i, 2)) * cell,
      s: rand(cx, cy, i, 3),
    });
  }
  return points;
}

/**
 * Redraws the whole field for the current camera. Cheap enough to run on every
 * animation frame: a few hundred dots and links, no allocation of note beyond
 * the visible cells.
 */
export function drawField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cam: Camera,
  style: FieldStyle,
): void {
  ctx.clearRect(0, 0, width, height);
  if (width <= 0 || height <= 0) return;

  const k = cam.k;
  const octave = Math.round(Math.log2(Math.max(CELL_PX / k, 1e-6)));
  const cell = 2 ** octave;

  // The field's own centre, lagged behind the camera's.
  const fx = cam.cx * PARALLAX;
  const fy = cam.cy * PARALLAX;
  const originX = width / 2 + cam.ox;
  const originY = height / 2;

  const linkWorld = LINK_PX / k;
  const marginWorld = linkWorld + cell;
  const minX = fx - (originX + marginWorld * k) / k;
  const maxX = fx + (width - originX + marginWorld * k) / k;
  const minY = fy - (originY + marginWorld * k) / k;
  const maxY = fy + (height - originY + marginWorld * k) / k;

  const c0 = Math.floor(minX / cell);
  const c1 = Math.ceil(maxX / cell);
  const r0 = Math.floor(minY / cell);
  const r1 = Math.ceil(maxY / cell);
  if ((c1 - c0 + 1) * (r1 - r0 + 1) > MAX_CELLS) return;

  const grid = new Map<string, FieldPoint[]>();
  for (let c = c0; c <= c1; c++) {
    for (let r = r0; r <= r1; r++) {
      grid.set(`${c},${r}`, pointsInCell(c, r, cell));
    }
  }

  const toScreenX = (x: number) => (x - fx) * k + originX;
  const toScreenY = (y: number) => (y - fy) * k + originY;

  // --- links -------------------------------------------------------------
  // Each cell only looks forward, so no pair is considered twice.
  const forward = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ] as const;
  const linkWorldSq = linkWorld * linkWorld;

  ctx.strokeStyle = style.line;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  for (let c = c0; c <= c1; c++) {
    for (let r = r0; r <= r1; r++) {
      const here = grid.get(`${c},${r}`);
      if (!here) continue;
      for (const [dc, dr] of forward) {
        const there = grid.get(`${c + dc},${r + dr}`);
        if (!there) continue;
        for (let i = 0; i < here.length; i++) {
          // Within a cell, only later points, so a point never links to itself.
          const start = dc === 0 && dr === 0 ? i + 1 : 0;
          for (let j = start; j < there.length; j++) {
            const a = here[i];
            const b = there[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            if (dx * dx + dy * dy > linkWorldSq) continue;
            ctx.moveTo(toScreenX(a.x), toScreenY(a.y));
            ctx.lineTo(toScreenX(b.x), toScreenY(b.y));
          }
        }
      }
    }
  }
  ctx.stroke();

  // --- dots --------------------------------------------------------------
  ctx.fillStyle = style.ink;
  for (const points of grid.values()) {
    for (const p of points) {
      const sx = toScreenX(p.x);
      const sy = toScreenY(p.y);
      if (sx < -8 || sy < -8 || sx > width + 8 || sy > height + 8) continue;
      // A handful of points per screen are noticeably brighter, which gives the
      // mesh some structure instead of an even grey wash.
      const hub = p.s > 0.93;
      ctx.globalAlpha = hub ? 0.4 : 0.12 + p.s * 0.18;
      ctx.beginPath();
      ctx.arc(sx, sy, hub ? 2.1 : 0.7 + p.s * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
}
