export const TILE_SIZE = 64;
export const MAP_WIDTH = 20;   // Kacheln horizontal
export const MAP_HEIGHT = 12;  // Kacheln vertikal

export const TileType = {
  GRASS: 0,
  GRASS_DARK: 1,
  DIRT: 2,
  WATER: 3,
} as const;

export type TileType = typeof TileType[keyof typeof TileType];
