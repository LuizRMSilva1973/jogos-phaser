import GameSelector from './scenes/GameSelector.js';
// Sky
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
// Runner
import RunnerBoot from './scenes/runner/Boot.js';
import RunnerMenu from './scenes/runner/Menu.js';
import RunnerGame from './scenes/runner/Game.js';
// Genéricas
import SubmitScoreScene from './scenes/SubmitScoreScene.js';
import ScoreboardScene from './scenes/ScoreboardScene.js';
import { hasActiveSubscription, requireSubscription } from './subscription.js';
import { findGame } from './games.js';

const ratio = 16 / 9;
const baseWidth = 960;
const baseHeight = Math.round(baseWidth / ratio);

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: baseWidth,
  height: baseHeight,
  backgroundColor: '#0b1220',
  dom: {
    createContainer: true
  },
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 980 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    GameSelector,
    // Sky
    BootScene, MenuScene, GameScene,
    // Runner
    RunnerBoot, RunnerMenu, RunnerGame,
    // Genéricas
    SubmitScoreScene, ScoreboardScene
  ],
};

window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const requestedGameId = params.get('game');
  const requestedGame = requestedGameId ? findGame(requestedGameId) : null;

  // Se usuário veio direto para um jogo sem assinatura, volta ao painel
  if (requestedGame && !hasActiveSubscription()) {
    requireSubscription({ gameId: requestedGameId });
    return;
  }

  // Prevent page scroll during gameplay on mobile
  document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  // Start game selector
  // eslint-disable-next-line no-new
  const game = new Phaser.Game(config);
  if (requestedGameId) {
    game.registry.set('requestedGame', requestedGameId);
  }
  // Escape volta ao seletor de jogos
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (game.scene.isActive('Game') || game.scene.isActive('Menu') || game.scene.isActive('Scoreboard') || game.scene.isActive('SubmitScore')) {
        game.scene.start('GameSelector');
      }
    }
  });
});
