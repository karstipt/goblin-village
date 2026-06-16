import Phaser from 'phaser';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, TileType } from '../config/TileConfig';

export class MapManager {
  private scene: Phaser.Scene;
  private tileGraphics: Phaser.GameObjects.Graphics;

  // Farben pro Tile-Typ
  private colors: Record<number, number[]> = {
    [TileType.GRASS]:      [0x7EC850, 0x89D455, 0x74BA49],
    [TileType.GRASS_DARK]: [0x5FA832, 0x68B838, 0x57982E],
    [TileType.DIRT]:       [0xC8A46E, 0xD4B07A, 0xBC9862],
    [TileType.WATER]:      [0x4A90D9, 0x5599E0, 0x4080C8],
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.tileGraphics = scene.add.graphics();
  }

  generate(): number[][] {
    const map: number[][] = [];

    for (let y = 0; y < MAP_HEIGHT; y++) {
      map[y] = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        map[y][x] = this.pickTile(x, y);
      }
    }

    this.render(map);
    return map;
  }

  private pickTile(x: number, y: number): number {
    // Rand-Wasser
    if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
      return TileType.WATER;
    }
    // Zufälliges Gras mit etwas Abwechslung
    const r = Math.random();
    if (r < 0.6) return TileType.GRASS;
    if (r < 0.85) return TileType.GRASS_DARK;
    return TileType.DIRT;
  }

  private render(map: number[][]): void {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tileType = map[y][x];
        const colorVariants = this.colors[tileType];
        const color = colorVariants[(x + y) % colorVariants.length];

        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Tile-Fläche
        this.tileGraphics.fillStyle(color, 1);
        this.tileGraphics.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Subtile Rasterlinien
        this.tileGraphics.lineStyle(1, 0x000000, 0.06);
        this.tileGraphics.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

        // Wasser: kleines Wellen-Detail
        if (tileType === TileType.WATER) {
          this.tileGraphics.lineStyle(1, 0xffffff, 0.2);
          this.tileGraphics.beginPath();
          this.tileGraphics.moveTo(px + 10, py + TILE_SIZE / 2);
          this.tileGraphics.lineTo(px + 25, py + TILE_SIZE / 2 - 4);
          this.tileGraphics.lineTo(px + 40, py + TILE_SIZE / 2);
          this.tileGraphics.strokePath();
        }

        // Gras: kleiner Grashalm-Punkt
        if (tileType === TileType.GRASS && Math.random() < 0.3) {
          this.tileGraphics.fillStyle(0x5FA832, 0.6);
          this.tileGraphics.fillRect(
            px + Math.floor(Math.random() * 50) + 6,
            py + Math.floor(Math.random() * 50) + 6,
            3, 8
          );
        }
      }
    }
  }

  getPixelCenter(): { x: number; y: number } {
    return {
      x: (MAP_WIDTH * TILE_SIZE) / 2,
      y: (MAP_HEIGHT * TILE_SIZE) / 2,
    };
  }
}
