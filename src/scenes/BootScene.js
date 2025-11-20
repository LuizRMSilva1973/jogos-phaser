export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Nothing to load from network; we generate textures programaticamente
  }

  create() {
    this.createGeneratedTextures();
    // Inicia o jogo imediatamente (bypass do menu)
    this.scene.start('Game');
  }

  createGeneratedTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Platform block (64x20)
    g.clear();
    g.fillStyle(0x22324a, 1);
    g.fillRoundedRect(0, 0, 64, 20, 6);
    g.lineStyle(2, 0x2f466d, 1);
    g.strokeRoundedRect(1, 1, 62, 18, 6);
    g.generateTexture('platform', 64, 20);

    // Ground tile (64x32)
    g.clear();
    g.fillStyle(0x1a2639, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x24364f, 1);
    for (let x = 0; x < 64; x += 8) {
      g.fillRect(x, 16, 4, 16);
    }
    g.generateTexture('ground', 64, 32);

    // Player (32x48) body and visor
    g.clear();
    g.fillStyle(0x0a84ff, 1);
    g.fillRoundedRect(0, 0, 32, 48, 6);
    g.fillStyle(0x072c4e, 1);
    g.fillRoundedRect(6, 8, 20, 12, 4);
    g.generateTexture('player', 32, 48);

    // Star collectible (24x24)
    const starSize = 24;
    g.clear();
    g.fillStyle(0xffcf40, 1);
    const cx = starSize / 2, cy = starSize / 2;
    const r1 = 10, r2 = 5, spikes = 5;
    let rot = Math.PI / 2 * 3;
    let x = cx, y = cy;
    g.beginPath();
    g.moveTo(cx, cy - r1);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * r1;
      y = cy + Math.sin(rot) * r1;
      g.lineTo(x, y);
      rot += Math.PI / spikes;
      x = cx + Math.cos(rot) * r2;
      y = cy + Math.sin(rot) * r2;
      g.lineTo(x, y);
      rot += Math.PI / spikes;
    }
    g.lineTo(cx, cy - r1);
    g.closePath();
    g.fillPath();
    g.generateTexture('star', starSize, starSize);

    // Bomb (20x20 circle)
    g.clear();
    g.fillStyle(0xff4d4f, 1);
    g.fillCircle(10, 10, 10);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(6, 6, 2);
    g.generateTexture('bomb', 20, 20);

    // Button (round) 64x64
    g.clear();
    g.fillStyle(0xffffff, 0.08);
    g.fillCircle(32, 32, 32);
    g.lineStyle(2, 0xffffff, 0.25);
    g.strokeCircle(32, 32, 30);
    g.generateTexture('btn', 64, 64);

    // Arrow icons for buttons
    // Left arrow
    g.clear();
    g.fillStyle(0xffffff, 0.9);
    g.beginPath();
    g.moveTo(42, 20);
    g.lineTo(22, 32);
    g.lineTo(42, 44);
    g.closePath();
    g.fillPath();
    g.generateTexture('icon-left', 64, 64);
    // Right arrow
    g.clear();
    g.fillStyle(0xffffff, 0.9);
    g.beginPath();
    g.moveTo(22, 20);
    g.lineTo(42, 32);
    g.lineTo(22, 44);
    g.closePath();
    g.fillPath();
    g.generateTexture('icon-right', 64, 64);
    // Up arrow
    g.clear();
    g.fillStyle(0xffffff, 0.9);
    g.beginPath();
    g.moveTo(32, 18);
    g.lineTo(44, 40);
    g.lineTo(20, 40);
    g.closePath();
    g.fillPath();
    g.generateTexture('icon-up', 64, 64);
  }
}
