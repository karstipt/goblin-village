import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.load.image('kristall', 'assets/sprites/buildings/kristall.png');
    this.load.image('zaun',     'assets/sprites/buildings/zaun.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}
