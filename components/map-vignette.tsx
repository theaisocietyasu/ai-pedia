import { cn } from "@/lib/utils";

interface MapVignetteProps {
  /** CSS object-position of the region to zoom into, e.g. "27% 72%". */
  position: string;
  /** Zoom factor into the map. */
  zoom?: number;
  className?: string;
}

/**
 * A faint, zoomed-in crop of the hand-drawn map, used as a header band.
 * Purely decorative: absolutely positioned, non-interactive, aria-hidden.
 */
export function MapVignette({
  position,
  zoom = 2.1,
  className,
}: MapVignetteProps) {
  const [rawX = "50%", rawY = "50%"] = position.split(/\s+/);
  // Keep the visible window inside the artwork: at `zoom`× width the band
  // shows 1/zoom of the map, so the anchor must stay 1/(2·zoom) from the
  // left/right edges. Vertically the band is short, so a small margin does.
  // The extra 3% keeps the map's dashed border ruler out of view.
  const xMargin = 50 / zoom + 3;
  const x = `${clamp(parseFloat(rawX), xMargin, 100 - xMargin)}%`;
  const y = `${clamp(parseFloat(rawY), 16, 84)}%`;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none select-none",
        className,
      )}
    >
      {/*
        Size the map at `zoom` × band width and slide it so the region's
        (x%, y%) point sits at the band's centre. translate() percentages are
        relative to the image itself, which is what makes this exact.
      */}
      <img
        src="/art/map.svg"
        alt=""
        className="absolute left-1/2 top-1/2 max-w-none h-auto opacity-[0.18] sm:opacity-[0.24]"
        style={{
          width: `${zoom * 100}%`,
          transform: `translate(-${x}, -${y})`,
        }}
      />
      {/* keep the centre clear for the title */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 32% 60% at 50% 55%, var(--background) 0%, var(--background) 35%, transparent 100%)",
        }}
      />
      {/* fade the band into the page below and the bar above */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-background" />
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}

function clamp(n: number, min: number, max: number): number {
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : 50;
}
