import { games, findGame } from '../games.js';
import { requireSubscription } from '../subscription.js';

export default class GameSelector extends Phaser.Scene {
  constructor() {
    super('GameSelector');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, 80, 'Selecione um Jogo', {
      fontSize: '48px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const initialGameId = this.game.registry.get('requestedGame');
    const initialGame = initialGameId ? findGame(initialGameId) : null;
    if (initialGame?.implemented && requireSubscription({ gameId: initialGame.id })) {
      this.launchGame(initialGame);
      return;
    }

    let y = 180;
    games.forEach(g => {
      const color = g.implemented ? '#0a84ff' : '#9fb3c8';
      const btn = this.add.text(width / 2, y, g.title, {
        fontSize: '28px',
        color,
        backgroundColor: '#0b1220',
        padding: { x: 12, y: 8 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: g.implemented });

      if (g.implemented) {
        btn.on('pointerdown', () => this.launchGame(g));
      }
      y += 60;
    });

    // dica
    this.add.text(width / 2, height - 40, 'Use ESC para voltar ao seletor', {
      fontSize: '18px', color: '#9fb3c8'
    }).setOrigin(0.5);
  }

  launchGame(game) {
    if (!requireSubscription({ gameId: game.id })) return;

    // Define game atual globalmente para facilitar integração
    window.CURRENT_GAME = { id: game.id, title: game.title };
    // Começa do Boot específico quando existir
    if (game.entryScene) this.scene.start(game.entryScene);
    else if (game.id === 'runner') this.scene.start('RunnerBoot');
    else this.scene.start('Boot');
  }
}
