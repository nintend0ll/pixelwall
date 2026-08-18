import { useCallback, useRef, useState } from "react";
import {
  CELLS,
  EMPTY_DRAWING,
  GRID,
  PALETTE,
  colorAt,
  setPixel,
} from "./palette";

type Tool = "draw" | "erase";

export function PixelEditor({
  pixels,
  onChange,
}: {
  pixels: string;
  onChange: (next: string) => void;
}) {
  const [color, setColor] = useState(10); // Lavender accent as default
  const [tool, setTool] = useState<Tool>("draw");
  const painting = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const paintAt = useCallback(
    (index: number) => {
      onChange(setPixel(pixels, index, tool === "erase" ? 0 : color));
    },
    [pixels, onChange, color, tool],
  );

  const indexFromPoint = (clientX: number, clientY: number) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.floor(((clientX - rect.left) / rect.width) * GRID);
    const y = Math.floor(((clientY - rect.top) / rect.height) * GRID);
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) return null;
    return y * GRID + x;
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={gridRef}
        className="pixel-grid"
        style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
        onPointerDown={(e) => {
          painting.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          const i = indexFromPoint(e.clientX, e.clientY);
          if (i !== null) paintAt(i);
        }}
        onPointerMove={(e) => {
          if (!painting.current) return;
          const i = indexFromPoint(e.clientX, e.clientY);
          if (i !== null) paintAt(i);
        }}
        onPointerUp={() => {
          painting.current = false;
        }}
        onPointerLeave={() => {
          painting.current = false;
        }}
      >
        {Array.from({ length: CELLS }, (_, i) => {
          const fill = colorAt(pixels, i);
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-label={`pixel ${i}`}
              className="pixel-cell"
              style={
                fill === "transparent" ? undefined : { backgroundColor: fill }
              }
            />
          );
        })}
      </div>

      <div className="color-palette">
        {PALETTE.map((hex, i) =>
          i === 0 ? null : (
            <button
              key={hex}
              type="button"
              aria-label={`color ${i}`}
              onClick={() => {
                setColor(i);
                setTool("draw");
              }}
              className={`color-swatch ${
                color === i && tool === "draw" ? "active" : ""
              }`}
              style={{ backgroundColor: hex }}
              title={`Color ${i}`}
            />
          ),
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setTool(tool === "erase" ? "draw" : "erase")}
          className={`btn-secondary ${
            tool === "erase" ? "accent-bg !text-foreground" : ""
          }`}
        >
          eraser
        </button>
        <button
          type="button"
          onClick={() => onChange(EMPTY_DRAWING)}
          className="btn-secondary btn-danger"
        >
          clear
        </button>
      </div>
    </div>
  );
}
