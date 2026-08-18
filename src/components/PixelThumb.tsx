import { CELLS, GRID, colorAt } from "./palette";

/** Renders a stored 16x16 drawing as a crisp scalable SVG. */
export function PixelThumb({
  pixels,
  className,
}: {
  pixels: string;
  className?: string;
}) {
  const rects = [];
  for (let i = 0; i < CELLS; i++) {
    const fill = colorAt(pixels, i);
    if (fill === "transparent") continue;
    rects.push(
      <rect
        key={i}
        x={i % GRID}
        y={Math.floor(i / GRID)}
        width={1}
        height={1}
        fill={fill}
      />,
    );
  }

  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="pixel art drawing"
    >
      {rects}
    </svg>
  );
}
