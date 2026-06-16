import Phaser from 'phaser';
import { MapManager } from '../managers/MapManager';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../config/TileConfig';

export class GameScene extends Phaser.Scene {
  private mapManager!: MapManager;

  constructor() { super({ key: 'GameScene' }); }

  create() {
    // Kamera auf Kartengröße setzen
    this.cameras.main.setBounds(
      0, 0,
      MAP_WIDTH * TILE_SIZE,
      MAP_HEIGHT * TILE_SIZE
    );

    // Tilemap erzeugen
    this.mapManager = new MapManager(this);
    this.mapManager.generate();

    // Kristall in der Mitte
    const center = this.mapManager.getPixelCenter();
    const crystal = this.add.circle(center.x, center.y, 24, 0x9B59B6);
    crystal.setInteractive();
    crystal.on('pointerdown', () => {
      console.log('Kristall geklickt!');
    });

    // Kamera zentrieren
    this.cameras.main.centerOn(center.x, center.y);

    // Kamera-Scroll mit Maus (rechte Maustaste / Mittelklick)
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && pointer.button === 2) {
        this.cameras.main.scrollX -= pointer.velocity.x / 10;
        this.cameras.main.scrollY -= pointer.velocity.y / 10;
      }
    });

    this.scene.launch('UIScene');
  }
}
