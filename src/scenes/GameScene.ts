import Phaser from 'phaser';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, VILLAGE } from '../config/TileConfig';

interface Building {
  key:    string;
  label:  string;
  xPct:   number;
  yPct:   number;
  w:      number;
  h:      number;
  desc:   string;
}

const BUILDINGS: Building[] = [
  { key: 'hauptturm',        label: 'Hauptturm',        xPct: 50, yPct: 25, w: 140, h: 140, desc: 'Das Herz des Dorfes. Hier werden Verteidigung und Angriffe koordiniert.' },
  { key: 'holzfaellerhuette',label: 'Holzfällerhütte',  xPct: 22, yPct: 48, w: 130, h: 130, desc: 'Produziert Holz. Ausbaubar für schnellere Ernte.' },
  { key: 'schmiede',         label: 'Schmiede',          xPct: 35, yPct: 38, w: 120, h: 120, desc: 'Verarbeitet Erz zu Metall. Benötigt für Waffen und Rüstungen.' },
  { key: 'forschungszentrum',label: 'Forschungszentrum', xPct: 74, yPct: 32, w: 130, h: 130, desc: 'Schaltet neue Technologien und Einheiten frei.' },
  { key: 'werkstatt',        label: 'Werkstatt',         xPct: 78, yPct: 52, w: 120, h: 120, desc: 'Baut Belagerungsmaschinen und Werkzeuge.' },
  { key: 'lagerhaus',        label: 'Lagerhaus',         xPct: 68, yPct: 68, w: 120, h: 120, desc: 'Erhöht das Ressourcenlimit des Dorfes.' },
];

export class GameScene extends Phaser.Scene {
  private menu!:       Phaser.GameObjects.Container;
  private menuBg!:     Phaser.GameObjects.Graphics;
  private menuTitle!:  Phaser.GameObjects.Text;
  private menuDesc!:   Phaser.GameObjects.Text;
  private menuClose!:  Phaser.GameObjects.Text;
  private activeKey:   string | null = null;

  constructor() { super({ key: 'GameScene' }); }

  create() {
    const W = MAP_WIDTH  * TILE_SIZE;
    const H = MAP_HEIGHT * TILE_SIZE;

    this.cameras.main.setBounds(0, 0, W, H);

    // ── Hintergrund-Gras ─────────────────────────────────────────────
    const bg = this.add.graphics();
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const isWater = x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;
        const isVillage =
          x >= VILLAGE.x && x < VILLAGE.x + VILLAGE.w &&
          y >= VILLAGE.y && y < VILLAGE.y + VILLAGE.h;
        let color: number;
        if (isWater)        color = (x + y) % 2 === 0 ? 0x4A90D9 : 0x5599E0;
        else if (isVillage) color = (x + y) % 2 === 0 ? 0x8FD44A : 0x9ADE52;
        else                color = (x + y) % 2 === 0 ? 0x7EC850 : 0x89D455;
        bg.fillStyle(color, 1);
        bg.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        if (isWater) {
          bg.lineStyle(1, 0xffffff, 0.25);
          bg.beginPath();
          bg.moveTo(x * TILE_SIZE + 8,  y * TILE_SIZE + TILE_SIZE / 2);
          bg.lineTo(x * TILE_SIZE + 24, y * TILE_SIZE + TILE_SIZE / 2 - 4);
          bg.lineTo(x * TILE_SIZE + 40, y * TILE_SIZE + TILE_SIZE / 2);
          bg.strokePath();
        }
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

    // ── Dorfbild ─────────────────────────────────────────────────────
    const fenceX = VILLAGE.x * TILE_SIZE + (VILLAGE.w * TILE_SIZE) / 2;
    const fenceY = VILLAGE.y * TILE_SIZE + (VILLAGE.h * TILE_SIZE) / 2;
    const village = this.add.image(fenceX, fenceY, 'dorf');
    village.setDisplaySize(VILLAGE.w * TILE_SIZE * 1.4, VILLAGE.h * TILE_SIZE * 1.4);

    // ── Hotspots ──────────────────────────────────────────────────────
    const vW = village.displayWidth;
    const vH = village.displayHeight;
    const vLeft = fenceX - vW / 2;
    const vTop  = fenceY - vH / 2;

    BUILDINGS.forEach(b => {
      const hx = vLeft + (b.xPct / 100) * vW;
      const hy = vTop  + (b.yPct / 100) * vH;

      // Unsichtbare klickbare Zone
      const zone = this.add.rectangle(hx, hy, b.w, b.h, 0xffffff, 0);
      zone.setInteractive({ useHandCursor: true });

      // Hover-Highlight
      zone.on('pointerover', () => {
        zone.setFillStyle(0xffff00, 0.18);
        this.showTooltip(hx, hy - b.h / 2 - 16, b.label);
      });
      zone.on('pointerout', () => {
        zone.setFillStyle(0xffffff, 0);
        this.hideTooltip();
      });
      zone.on('pointerdown', () => {
        this.openMenu(b);
      });
    });

    // ── Kristall (Dorfmittelpunkt) ────────────────────────────────────
    const crystalX = fenceX;
    const crystalY = fenceY - TILE_SIZE * 0.5;
    const crystal  = this.add.image(crystalX, crystalY, 'kristall');
    crystal.setDisplaySize(80, 80);
    crystal.setInteractive({ useHandCursor: true });

    const floatTween = this.tweens.add({
      targets: crystal,
      y: crystalY - 8,
      duration: 1800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    const baseScale = crystal.scaleX;
    let pulseTween: Phaser.Tweens.Tween | null = null;

    crystal.on('pointerdown', () => {
      if (pulseTween) { pulseTween.stop(); crystal.setScale(baseScale); }
      pulseTween = this.tweens.add({
        targets: crystal,
        scaleX: baseScale * 1.3,
        scaleY: baseScale * 1.3,
        duration: 120,
        yoyo: true,
        ease: 'Quad.easeOut',
        onComplete: () => { crystal.setScale(baseScale); pulseTween = null; },
      });
    });
    crystal.on('pointerover', () => crystal.setTint(0xddaaff));
    crystal.on('pointerout',  () => crystal.clearTint());

    // ── Gebäude-Menü ─────────────────────────────────────────────────
    this.createMenu();

    // ── Kamera ───────────────────────────────────────────────────────
    this.cameras.main.centerOn(fenceX, fenceY);
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown && p.button === 2) {
        this.cameras.main.scrollX -= p.velocity.x / 10;
        this.cameras.main.scrollY -= p.velocity.y / 10;
      }
    });

    // Klick auf leere Fläche schließt Menü
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.button === 0 && this.menu.visible) {
        this.closeMenu();
      }
    });

    this.scene.launch('UIScene');
  }

  // ── Tooltip ────────────────────────────────────────────────────────
  private tooltip!: Phaser.GameObjects.Container;

  private showTooltip(x: number, y: number, text: string) {
    if (this.tooltip) this.tooltip.destroy();
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.85);
    bg.fillRoundedRect(-60, -14, 120, 28, 6);
    const t = this.add.text(0, 0, text, {
      fontSize: '13px', color: '#ffffff', fontFamily: 'sans-serif',
    }).setOrigin(0.5);
    this.tooltip = this.add.container(x, y, [bg, t]);
    this.tooltip.setDepth(10);
  }

  private hideTooltip() {
    if (this.tooltip) { this.tooltip.destroy(); }
  }

  // ── Menü erstellen ────────────────────────────────────────────────
  private createMenu() {
    const mW = 280, mH = 200;
    this.menuBg = this.add.graphics();
    this.menuBg.fillStyle(0x1a1a2e, 0.95);
    this.menuBg.fillRoundedRect(0, 0, mW, mH, 10);
    this.menuBg.lineStyle(2, 0x9B59B6, 1);
    this.menuBg.strokeRoundedRect(0, 0, mW, mH, 10);

    this.menuTitle = this.add.text(mW / 2, 20, '', {
      fontSize: '16px', color: '#F0C040',
      fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.menuDesc = this.add.text(16, 52, '', {
      fontSize: '12px', color: '#ccccdd',
      fontFamily: 'sans-serif', wordWrap: { width: mW - 32 },
    });

    // Buttons
    const btnUpgrade  = this.makeMenuBtn(16,  130, 116, 'Ausbauen 🔨');
    const btnInfo     = this.makeMenuBtn(148, 130, 116, 'Info 📋');
    const btnProduce  = this.makeMenuBtn(16,  162, 116, 'Produzieren ⚙️');
    const btnClose    = this.makeMenuBtn(148, 162, 116, 'Schließen ✕');

    btnClose.on('pointerdown', () => this.closeMenu());

    this.menuClose = this.add.text(mW - 12, 8, '✕', {
      fontSize: '14px', color: '#888899', fontFamily: 'sans-serif',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    this.menuClose.on('pointerdown', () => this.closeMenu());

    this.menu = this.add.container(0, 0, [
      this.menuBg, this.menuTitle, this.menuDesc,
      btnUpgrade, btnInfo, btnProduce, btnClose, this.menuClose,
    ]);
    this.menu.setDepth(20);
    this.menu.setVisible(false);
  }

  private makeMenuBtn(x: number, y: number, w: number, label: string) {
    const g = this.add.graphics();
    g.fillStyle(0x2e2e4e, 1);
    g.fillRoundedRect(x, y, w, 26, 5);
    g.lineStyle(1, 0x9B59B6, 0.7);
    g.strokeRoundedRect(x, y, w, 26, 5);
    const t = this.add.text(x + w / 2, y + 13, label, {
      fontSize: '11px', color: '#ddddff', fontFamily: 'sans-serif',
    }).setOrigin(0.5);
    const zone = this.add.rectangle(x + w / 2, y + 13, w, 26, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => g.fillStyle(0x4e3e7e, 1));
    zone.on('pointerout',  () => g.fillStyle(0x2e2e4e, 1));
    return this.add.container(0, 0, [g, t, zone]);
  }

  private openMenu(b: Building) {
    if (this.activeKey === b.key && this.menu.visible) {
      this.closeMenu(); return;
    }
    this.activeKey = b.key;
    this.menuTitle.setText(b.label);
    this.menuDesc.setText(b.desc);

    // Menü neben dem Gebäude positionieren
    const cam   = this.cameras.main;
    const vLeft = (VILLAGE.x * TILE_SIZE + (VILLAGE.w * TILE_SIZE) / 2)
                  - (VILLAGE.w * TILE_SIZE * 1.4) / 2;
    const vTop  = (VILLAGE.y * TILE_SIZE + (VILLAGE.h * TILE_SIZE) / 2)
                  - (VILLAGE.h * TILE_SIZE * 1.4) / 2;
    const hx = vLeft + (b.xPct / 100) * (VILLAGE.w * TILE_SIZE * 1.4);
    const hy = vTop  + (b.yPct / 100) * (VILLAGE.h * TILE_SIZE * 1.4);

    const mX = Phaser.Math.Clamp(hx + 80, cam.scrollX + 10, cam.scrollX + cam.width  - 290);
    const mY = Phaser.Math.Clamp(hy - 100, cam.scrollY + 10, cam.scrollY + cam.height - 210);

    this.menu.setPosition(mX, mY);
    this.menu.setVisible(true);
  }

  private closeMenu() {
    this.menu.setVisible(false);
    this.activeKey = null;
  }
}
