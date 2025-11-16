import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import SubmitScoreScene from './scenes/SubmitScoreScene.js';
import ScoreboardScene from './scenes/ScoreboardScene.js';

const ratio = 16 / 9;
const baseWidth = 960;
const baseHeight = Math.round(baseWidth / ratio);

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: baseWidth,
  height: baseHeight,
  backgroundColor: '#0b1220',
  dom: { createContainer: true },
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 980 }, debug: false },
  },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, MenuScene, GameScene, SubmitScoreScene, ScoreboardScene],
};

window.addEventListener('load', () => {
  document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  // eslint-disable-next-line no-new
  new Phaser.Game(config);
});

