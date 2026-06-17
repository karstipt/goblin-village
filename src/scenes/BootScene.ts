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
    this.load.image('holzfaellerhuette', 'assets/sprites/buildings/holzfaellerhuette.svg');
    this.load.image('schmiede',          'assets/sprites/buildings/schmiede.svg');
    this.load.image('forschungszentrum', 'assets/sprites/buildings/forschungszentrum.svg');
    this.load.image('werkstatt',         'assets/sprites/buildings/werkstatt.svg');
    this.load.image('dorf', 'assets/sprites/buildings/dorf2.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}
