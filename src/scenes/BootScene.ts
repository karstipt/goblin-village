import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.load.image('kristall', 'assets/sprites/buildings/kristall.png');
    this.load.image('zaun',     'assets/sprites/buildings/zaun.png');
    this.load.image('icon-holz',      'assets/sprites/ui/holz.svg');
    this.load.image('icon-erz',       'assets/sprites/ui/erz.svg');
    this.load.image('icon-metall',    'assets/sprites/ui/metall.svg');
    this.load.image('icon-nahrung',   'assets/sprites/ui/nahrung.svg');
    this.load.image('icon-diamanten', 'assets/sprites/ui/diamanten.svg');
    this.load.image('erzmine', 'assets/sprites/buildings/erzmine.svg');
  }

  create() {
    this.scene.start('GameScene');
  }
}
