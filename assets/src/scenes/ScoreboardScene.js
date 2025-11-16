export default class ScoreboardScene extends Phaser.Scene {
  constructor() { super('Scoreboard'); }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, 60, 'Placar de Líderes', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
    const menuBtn = this.add.text(width / 2, height - 50, 'Voltar ao Menu', { fontSize: '24px', color: '#0a84ff', backgroundColor: '#0b1220', padding: { x: 10, y: 5 } }).setOrigin(0.5).setInteractive();
    menuBtn.on('pointerdown', () => this.scene.start('Menu'));

    const loadingText = this.add.text(width / 2, height / 2, 'Carregando...', { fontSize: '28px', color: '#e6edf3' }).setOrigin(0.5);

    this.fetchScores().then(scores => { loadingText.destroy(); this.displayScores(scores); }).catch(error => {
      loadingText.setText('Erro ao carregar pontuações.'); console.error('Erro:', error);
    });
  }

  async fetchScores() {
    const res = await fetch('api/scores.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  displayScores(scores) {
    const { width } = this.scale; let yPos = 140;
    if (!Array.isArray(scores) || scores.length === 0) {
      this.add.text(width / 2, 200, 'Nenhuma pontuação registrada.', { fontSize: '22px', color: '#9fb3c8' }).setOrigin(0.5); return;
    }
    scores.forEach((item, index) => {
      const rank = `${index + 1}.`.padEnd(4); const name = String(item.name).padEnd(20); const score = `${item.score} pts`;
      this.add.text(width / 2, yPos, `${rank}${name}${score}`, { fontSize: '24px', color: index < 3 ? '#f9d71c' : '#e6edf3', fontFamily: 'monospace' }).setOrigin(0.5);
      yPos += 35;
    });
  }
}

