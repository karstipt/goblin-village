import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  create() {
    // Grüner Hintergrund (Platzhalter für Tilemap)
    this.add.rectangle(640, 360, 1280, 720, 0x7EC850);

    // Kristall in der Mitte (Platzhalter)
    const crystal = this.add.circle(640, 360, 30, 0x9B59B6);
    crystal.setInteractive();
    crystal.on('pointerdown', () => {
      console.log('Kristall geklickt! → Einheiten-Menü öffnen');
      // TODO: UIScene.showUnitMenu() aufrufen
    });

    // UI-Scene parallel starten
    this.scene.launch('UIScene');
  }
}
