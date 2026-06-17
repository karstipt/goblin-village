import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.load.image('icon-holz',      'assets/sprites/ui/holz.svg');
    this.load.image('icon-erz',       'assets/sprites/ui/erz.svg');
    this.load.image('icon-metall',    'assets/sprites/ui/metall.svg');
    this.load.image('icon-nahrung',   'assets/sprites/ui/nahrung.svg');
    this.load.image('icon-diamanten', 'assets/sprites/ui/diamanten.svg');
    this.load.image('dorf', 'assets/sprites/buildings/dorf2.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}
