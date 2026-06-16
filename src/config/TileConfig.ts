export const TILE_SIZE   = 64;
export const MAP_WIDTH   = 20;
export const MAP_HEIGHT  = 14;

// Dorfbereich (Zaun-Innenraum) in Tile-Koordinaten
export const VILLAGE = {
  x: 6,   // linke Kante
  y: 3,   // obere Kante
  w: 8,   // Breite in Tiles
  h: 8,   // Höhe in Tiles
} as const;
