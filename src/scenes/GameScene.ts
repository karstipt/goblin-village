import Phaser from 'phaser';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, VILLAGE } from '../config/TileConfig';

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  create() {
    const W = MAP_WIDTH  * TILE_SIZE;   // 1280
    const H = MAP_HEIGHT * TILE_SIZE;   //  896

    this.cameras.main.setBounds(0, 0, W, H);

    // ── Hintergrund-Gras ──────────────────────────────────────────────
    const bg = this.add.graphics();
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const isVillage =
          x >= VILLAGE.x && x < VILLAGE.x + VILLAGE.w &&
          y >= VILLAGE.y && y < VILLAGE.y + VILLAGE.h;

        // Randwasser
        const isWater =
          x === 0 || x === MAP_WIDTH  - 1 ||
          y === 0 || y === MAP_HEIGHT - 1;

        let color: number;
        if (isWater)         color = (x + y) % 2 === 0 ? 0x4A90D9 : 0x5599E0;
        else if (isVillage)  color = (x + y) % 2 === 0 ? 0x8FD44A : 0x9ADE52;
        else                 color = (x + y) % 2 === 0 ? 0x7EC850 : 0x89D455;

        bg.fillStyle(color, 1);
        bg.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // Wasser-Wellen
        if (isWater) {
          bg.lineStyle(1, 0xffffff, 0.25);
          bg.beginPath();
          bg.moveTo(x * TILE_SIZE + 8,  y * TILE_SIZE + TILE_SIZE / 2);
          bg.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + TILE_SIZE / 2 - 4);
          bg.lineTo(x * TILE_SIZE + 40, y * TILE_SIZE + TILE_SIZE / 2);
          bg.strokePath();
        }

        // Gras-Details außerhalb des Dorfs
        if (!isVillage && !isWater && Math.random() < 0.25) {
          bg.fillStyle(0x5FA832, 0.5);
          bg.fillRect(
            x * TILE_SIZE + Phaser.Math.Between(4, 52),
            y * TILE_SIZE + Phaser.Math.Between(4, 52),
            3, 9
          );
        }
      }
    }

    // ── Zaun-Sprite (deckt den Dorfbereich ab) ────────────────────────
    const fenceX = VILLAGE.x * TILE_SIZE + (VILLAGE.w * TILE_SIZE) / 2;
    const fenceY = VILLAGE.y * TILE_SIZE + (VILLAGE.h * TILE_SIZE) / 2;
    const fence  = this.add.image(fenceX, fenceY, 'zaun');

    // Zaun auf Dorfgröße skalieren (512 × 512 Sprite)
    const targetW = VILLAGE.w * TILE_SIZE;
    const targetH = VILLAGE.h * TILE_SIZE;
    fence.setDisplaySize(targetW * 2, targetH * 1.4);

    // Weißen Hintergrund des Sprites ausblenden
    fence.setAlpha(0.97);

    // ── Kristall-Sprite (Dorfmittelpunkt) ─────────────────────────────
    const crystalX = fenceX;
    const crystalY = fenceY - TILE_SIZE * 0.5;   // leicht nach oben versetzt
    const crystal  = this.add.image(crystalX, crystalY, 'kristall');
    crystal.setDisplaySize(96, 96);
    crystal.setInteractive({ useHandCursor: true });

    // Sanftes Schweben
    this.tweens.add({
      targets: crystal,
      y: crystalY - 8,
      duration: 1800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Puls beim Klick
    crystal.on('pointerdown', () => {
      this.tweens.add({
        targets: crystal,
        scaleX: crystal.scaleX * 1.3,
        scaleY: crystal.scaleY * 1.3,
        duration: 120,
        yoyo: true,
        ease: 'Quad.easeOut',
      });
      console.log('Kristall aktiviert!');
    });

    // Hover-Glow
    crystal.on('pointerover',  () => crystal.setTint(0xddaaff));
    crystal.on('pointerout',   () => crystal.clearTint());

    // ── Kamera ────────────────────────────────────────────────────────
    this.cameras.main.centerOn(fenceX, fenceY);

    // Kamera-Drag (rechte Maustaste)
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown && p.button === 2) {
        this.cameras.main.scrollX -= p.velocity.x / 10;
        this.cameras.main.scrollY -= p.velocity.y / 10;
      }
    });

    this.scene.launch('UIScene');
  }
}
