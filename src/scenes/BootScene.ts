import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    // TODO: Alle Assets hier laden
    // this.load.image('grass', 'assets/tilemaps/grass.png');
    // this.load.spritesheet('goblin', 'assets/sprites/units/goblin.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    this.scene.start('GameScene');
  }
}
