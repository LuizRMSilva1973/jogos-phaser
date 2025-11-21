import { requireSubscription } from '../../subscription.js';

export default class RunnerBoot extends Phaser.Scene {
  constructor() { super('RunnerBoot'); }
  preload() {}
  create() {
    if (!requireSubscription({ gameId: 'runner' })) return;
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // ground
    g.clear(); g.fillStyle(0x263238, 1); g.fillRect(0,0,64,24); g.generateTexture('r-ground',64,24);
    // player
    g.clear(); g.fillStyle(0x26a69a,1); g.fillRoundedRect(0,0,28,28,6); g.generateTexture('r-player',28,28);
    // obstacle
    g.clear(); g.fillStyle(0xef5350,1); g.fillRoundedRect(0,0,16,32,4); g.generateTexture('r-ob',16,32);
    this.scene.start('RunnerMenu');
  }
}
