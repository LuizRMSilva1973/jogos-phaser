export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;

    // Title
    this.add.text(width / 2, height * 0.28, 'Sky Platforms', {
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      fontSize: '56px',
      color: '#e6edf3',
      stroke: '#0a84ff',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height * 0.38, 'Colete as estrelas. Evite as bombas.', {
      fontSize: '22px',
      color: '#9fb3c8',
    }).setOrigin(0.5);

    // Play button
    const playBtn = this.add.image(0, 0, 'btn').setTint(0x0a84ff).setAlpha(0.9).setScale(1.2);
    const playLabel = this.add.text(0, 0, 'JOGAR', { fontSize: '28px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    const playContainer = this.add.container(width / 2, height * 0.55, [playBtn, playLabel]);
    playBtn.setInteractive({ useHandCursor: true })
      .on('pointerover', () => playBtn.setAlpha(1))
      .on('pointerout', () => playBtn.setAlpha(0.9))
      .on('pointerdown', () => this.scene.start('Game'));

    // Scoreboard button
    const scoreBtn = this.add.image(0, 0, 'btn').setAlpha(0.9);
    const scoreLabel = this.add.text(0, 0, 'Placar', { fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
    const scoreContainer = this.add.container(width / 2, height * 0.65, [scoreBtn, scoreLabel]);
    scoreBtn.setInteractive({ useHandCursor: true })
      .on('pointerover', () => scoreBtn.setAlpha(1))
      .on('pointerout', () => scoreBtn.setAlpha(0.9))
      .on('pointerdown', () => this.scene.start('Scoreboard'));

    // Controls hint
    const msg = this.sys.game.device.os.desktop
      ? 'Setas (← →) para mover, ↑ para pular. P para pausar.'
      : 'Toques: botões esquerda/direita e pular.';
    this.add.text(width / 2, height * 0.8, msg, { fontSize: '18px', color: '#b8c5d3' }).setOrigin(0.5);

    // Footer
    this.add.text(width / 2, height * 0.92, 'Feito com Phaser 3', { fontSize: '14px', color: '#8ea2b3' }).setOrigin(0.5);
  }
}
