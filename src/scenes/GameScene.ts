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
  private tooltip!:    Phaser.GameObjects.Container;

  constructor() { super({ key: 'GameScene' }); }

  create() {
    const W = MAP_WIDTH  * TILE_SIZE;
    const H = MAP_HEIGHT * TILE_SIZE;

    this.cameras.main.setBounds(0, 0, W, H);

    // ── Hintergrund ───────────────────────────────────────────────────
    const bg = this.add.graphics();

    // Dunkler Boden
    bg.fillStyle(0x1a1a2e, 1);
    bg.fillRect(0, 0, W, H);

    // Nebel-Wolken (mehrere überlagerte Ellipsen)
    const fogColors = [0x2a3a4a, 0x1e2e3e, 0x263545, 0x1a2a3a];
    const fogBlobs = [
      { x: 0.1, y: 0.3,  rx: 0.25, ry: 0.18 },
      { x: 0.3, y: 0.6,  rx: 0.30, ry: 0.20 },
      { x: 0.5, y: 0.2,  rx: 0.28, ry: 0.16 },
      { x: 0.6, y: 0.7,  rx: 0.35, ry: 0.22 },
      { x: 0.8, y: 0.4,  rx: 0.26, ry: 0.18 },
      { x: 0.9, y: 0.8,  rx: 0.20, ry: 0.15 },
      { x: 0.2, y: 0.85, rx: 0.30, ry: 0.16 },
      { x: 0.7, y: 0.15, rx: 0.25, ry: 0.14 },
      { x: 0.45, y: 0.5, rx: 0.40, ry: 0.25 },
    ];

    fogBlobs.forEach((f, i) => {
      bg.fillStyle(fogColors[i % fogColors.length], 0.35);
      bg.fillEllipse(f.x * W, f.y * H, f.rx * W * 2, f.ry * H * 2);
    });

    // Zweite Nebelschicht (heller, dünner)
    const fogBlobs2 = [
      { x: 0.25, y: 0.45, rx: 0.22, ry: 0.14 },
      { x: 0.55, y: 0.35, rx: 0.28, ry: 0.16 },
      { x: 0.75, y: 0.65, rx: 0.24, ry: 0.18 },
      { x: 0.15, y: 0.7,  rx: 0.20, ry: 0.12 },
      { x: 0.85, y: 0.25, rx: 0.22, ry: 0.14 },
    ];

    fogBlobs2.forEach(f => {
      bg.fillStyle(0x3a4a5a, 0.25);
      bg.fillEllipse(f.x * W, f.y * H, f.rx * W * 2, f.ry * H * 2);
    });

    // ── Dorfbild ──────────────────────────────────────────────────────
    const fenceX  = VILLAGE.x * TILE_SIZE + (VILLAGE.w * TILE_SIZE) / 2;
    const fenceY  = VILLAGE.y * TILE_SIZE + (VILLAGE.h * TILE_SIZE) / 2;
    const village = this.add.image(fenceX, fenceY, 'dorf');
    village.setDisplaySize(VILLAGE.w * TILE_SIZE * 2, VILLAGE.h * TILE_SIZE * 1.4);

    // ── Hotspots ──────────────────────────────────────────────────────
    const vW    = village.displayWidth;
    const vH    = village.displayHeight;
    const vLeft = fenceX - vW / 2;
    const vTop  = fenceY - vH / 2;

    // ✅ FIX 1 & 2: forEach korrekt geschlossen + pointerdown ergänzt
    BUILDINGS.forEach(b => {
      const hx = vLeft + (b.xPct / 100) * vW;
      const hy = vTop  + (b.yPct / 100) * vH;

      // Unsichtbare klickbare Zone
      const zone = this.add.rectangle(hx, hy, b.w, b.h, 0xffffff, 0);
      zone.setInteractive({ useHandCursor: true });

      zone.on('pointerover',  () => { this.showTooltip(hx, hy - b.h / 2 - 16, b.label); });
      zone.on('pointerout',   () => { this.hideTooltip(); });
      zone.on('pointerdown',  () => { this.openMenu(b); }); // ✅ NEU: Klick öffnet Menü direkt
    }); // ✅ forEach korrekt geschlossen

    // ── Gebäude-Menü ─────────────────────────────────────────────────
    // ✅ FIX 3: createMenu() nur 1× aufgerufen, außerhalb von forEach
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

    // ✅ FIX 3: scene.launch() nur 1× aufgerufen, außerhalb von forEach
    this.scene.launch('UIScene');
  }

  // ── Tooltip ────────────────────────────────────────────────────────

  private showTooltip(x: number, y: number, text: string) {
    if (this.tooltip) this.tooltip.destroy();

    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.92);
    bg.fillRoundedRect(-70, -16, 140, 32, 8);
    bg.lineStyle(1, 0x9B59B6, 0.8);
    bg.strokeRoundedRect(-70, -16, 140, 32, 8);

    const t = this.add.text(0, 0, text, {
      fontSize: '13px', color: '#F0C040',
      fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setOrigin(0.5);

    const clickZone = this.add.rectangle(0, 0, 140, 32, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });

    clickZone.on('pointerdown', () => {
      const building = BUILDINGS.find(b => b.label === text);
      if (building) this.openMenu(building);
    });

    this.tooltip = this.add.container(x, y, [bg, t, clickZone]);
    this.tooltip.setDepth(10);
  }

  private hideTooltip() {
    if (this.tooltip) { this.tooltip.destroy(); }
  }

  // ── Menü erstellen ────────────────────────────────────────────────

  private createMenu() {
    const mW = 320, mH = 260;

    this.menuBg = this.add.graphics();
    this.menuBg.fillStyle(0x1a1a2e, 0.97);
    this.menuBg.fillRoundedRect(0, 0, mW, mH, 12);
    this.menuBg.lineStyle(2, 0x9B59B6, 1);
    this.menuBg.strokeRoundedRect(0, 0, mW, mH, 12);

    // Titelleiste
    const titleBar = this.add.graphics();
    titleBar.fillStyle(0x2e1a4e, 1);
    titleBar.fillRoundedRect(0, 0, mW, 40, { tl: 12, tr: 12, bl: 0, br: 0 });

    this.menuTitle = this.add.text(mW / 2, 20, '', {
      fontSize: '16px', color: '#F0C040',
      fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.menuDesc = this.add.text(16, 52, '', {
      fontSize: '12px', color: '#aaaacc',
      fontFamily: 'sans-serif', wordWrap: { width: mW - 32 },
    });

    const btnUpgrade = this.makeMenuBtn(16,  148, 136, '🔨 Ausbauen');
    const btnInfo    = this.makeMenuBtn(168, 148, 136, '📋 Info');
    const btnProduce = this.makeMenuBtn(16,  196, 136, '⚙️ Produzieren');
    const btnClose   = this.makeMenuBtn(168, 196, 136, '✕ Schließen');

    btnClose.getAt(2).on('pointerdown', () => this.closeMenu());

    this.menuClose = this.add.text(mW - 14, 10, '✕', {
      fontSize: '14px', color: '#9B59B6', fontFamily: 'sans-serif',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    this.menuClose.on('pointerdown', () => this.closeMenu());

    this.menu = this.add.container(0, 0, [
      this.menuBg, titleBar, this.menuTitle, this.menuDesc,
      btnUpgrade, btnInfo, btnProduce, btnClose, this.menuClose,
    ]);
    this.menu.setDepth(20);
    this.menu.setScrollFactor(0); // bleibt fix auf dem Bildschirm
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
    zone.on('pointerover', () => { g.clear(); g.fillStyle(0x4e3e7e, 1); g.fillRoundedRect(x, y, w, 26, 5); g.lineStyle(1, 0x9B59B6, 0.7); g.strokeRoundedRect(x, y, w, 26, 5); });
    zone.on('pointerout',  () => { g.clear(); g.fillStyle(0x2e2e4e, 1); g.fillRoundedRect(x, y, w, 26, 5); g.lineStyle(1, 0x9B59B6, 0.7); g.strokeRoundedRect(x, y, w, 26, 5); });

    return this.add.container(0, 0, [g, t, zone]);
  }

  // ── Menü öffnen / schließen ───────────────────────────────────────

  private openMenu(b: Building) {
    if (this.activeKey === b.key && this.menu.visible) {
      this.closeMenu(); return;
    }
    this.activeKey = b.key;
    this.menuTitle.setText(b.label);
    this.menuDesc.setText(b.desc);

    // Popup zentriert auf dem Bildschirm
    const cam = this.cameras.main;
    const mW  = 320, mH = 260;
    const mX  = cam.scrollX + (cam.width  - mW) / 2;
    const mY  = cam.scrollY + (cam.height - mH) / 2;

    this.menu.setPosition(mX, mY);
    this.menu.setVisible(true);

    // Einblend-Animation
    this.menu.setScale(0.85);
    this.menu.setAlpha(0);
    this.tweens.add({
      targets:  this.menu,
      scaleX:   1, scaleY: 1, alpha: 1,
      duration: 150,
      ease:     'Back.easeOut',
    });
  }

  private closeMenu() {
    this.menu.setVisible(false);
    this.activeKey = null;
  }
}
