// 16-color palette. Index 0 is "empty" (transparent / background).
// Drawings are stored as a 256-character string of hex digits (16x16 grid),
// each digit being an index into this palette.
// Accent color: #b4befe (Lavender)
export const PALETTE: readonly string[] = [
  "transparent",

  "#11111b", // Base
  "#313244", // Surface0
  "#ffffff", // Text

  "#f38ba8", // Red
  "#eba0ac", // Rosewater
  "#fab387", // Peach
  "#f9e2af", // Yellow

  "#a6e3a1", // Green
  "#94e2d5", // Teal
  "#89dceb", // Sky

  "#74c7ec", // Sapphire
  "#89b4fa", // Blue

  "#b4befe", // Lavender
  "#cba6f7", // Mauve
  "#f5c2e7", // Pink
];

export const GRID = 16;
export const CELLS = GRID * GRID;
export const EMPTY_DRAWING = "0".repeat(CELLS);

export function isValidDrawing(pixels: string) {
  return /^[0-9a-f]{256}$/.test(pixels);
}

export function isBlank(pixels: string) {
  return /^0{256}$/.test(pixels);
}

export function setPixel(pixels: string, index: number, colorIndex: number) {
  const char = colorIndex.toString(16);
  if (pixels[index] === char) return pixels;
  return pixels.slice(0, index) + char + pixels.slice(index + 1);
}

export function colorAt(pixels: string, index: number) {
  const value = parseInt(pixels[index] ?? "0", 16);
  return PALETTE[value] ?? "transparent";
}
