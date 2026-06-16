import Phaser from 'phaser';

interface Resource {
  key:   string;
  label: string;
  icon:  string;
  value: number;
}

export class UIScene extends Phaser.Scene {
  private resources: Resource[] = [
    { key: 'holz',      label: 'Holz',      icon: 'icon-holz',      value: 120 },
    { key: 'erz',       label: 'Erz',       icon: 'icon-erz',       value: 45  },
    { key: 'metall',    label: 'Metall',     icon: 'icon-metall',    value: 30  },
    { key: 'nahrung',   label: 'Nahrung',    icon: 'icon-nahrung',   value: 200 },
    { key: 'diamanten', label: 'Diamanten',  icon: 'icon-diamanten', value: 8   },
  ];

  private valueTexts: Map<string, Phaser.GameObjects.Text> = new Map();

  constructor() { super({ key: 'UIScene' }); }

  create() {
    const barHeight = 52;
    const screenW   = this.scale.width;

    // Hintergrund-Leiste
    const bar = this.add.graphics();
    bar.fillStyle(0x1a1a2e, 0.85);
    bar.fillRect(0, 0, screenW, barHeight);
    bar.lineStyle(1, 0xffffff, 0.08);
    bar.strokeRect(0, 0, screenW, barHeight);

    // Ressourcen gleichmäßig verteilen
    const slotW   = screenW / this.resources.length;

    this.resources.forEach((res, i) => {
      const cx = slotW * i + slotW / 2;

      // Trennlinie zwischen Slots
      if (i > 0) {
        const divider = this.add.graphics();
        divider.lineStyle(1, 0xffffff, 0.08);
        divider.lineBetween(slotW * i, 8, slotW * i, barHeight - 8);
      }

      // Icon
      const icon = this.add.image(cx - 28, barHeight / 2, res.icon);
      icon.setDisplaySize(32, 32);

      // Label
      this.add.text(cx - 8, 10, res.label, {
        fontSize: '11px',
        color: '#aaaacc',
        fontFamily: 'sans-serif',
      });

      // Wert
      const valText = this.add.text(cx - 8, 26, String(res.value), {
        fontSize: '15px',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        fontStyle: 'bold',
      });
      this.valueTexts.set(res.key, valText);
    });

    // Öffentliche Methode: Ressource aktualisieren
    // Aufruf aus GameScene: this.scene.get('UIScene').updateResource('holz', 150)
  }

  updateResource(key: string, value: number) {
    const text = this.valueTexts.get(key);
    if (text) text.setText(String(value));
  }
}
