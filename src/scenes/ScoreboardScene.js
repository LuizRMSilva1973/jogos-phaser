export default class ScoreboardScene extends Phaser.Scene {
  constructor() {
    super('Scoreboard');
  }

  create() {
    const { width, height } = this.scale;

    // Título
    this.add.text(width / 2, 60, 'Placar de Líderes', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

    // Botão para voltar ao menu
    const menuBtn = this.add.text(width / 2, height - 50, 'Voltar ao Menu', { fontSize: '24px', color: '#0a84ff', backgroundColor: '#0b1220', padding: { x: 10, y: 5 } })
      .setOrigin(0.5)
      .setInteractive();

    menuBtn.on('pointerdown', () => {
      this.scene.start('Menu');
    });

    // Exibe mensagem de carregamento
    const loadingText = this.add.text(width / 2, height / 2, 'Carregando...', { fontSize: '28px', color: '#e6edf3' }).setOrigin(0.5);

    // Busca os scores
    this.fetchScores().then(scores => {
      loadingText.destroy();
      this.displayScores(scores);
    }).catch(error => {
      loadingText.setText('Erro ao carregar pontuações.');
      console.error('Erro:', error);
    });
  }

  async fetchScores() {
    try {
      const response = await fetch('/api/scores');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Não foi possível buscar as pontuações:', error);
      return []; // Retorna vazio em caso de erro
    }
  }

  displayScores(scores) {
    const { width } = this.scale;
    let yPos = 140;

    if (scores.length === 0) {
      this.add.text(width / 2, 200, 'Nenhuma pontuação registrada.', { fontSize: '22px', color: '#9fb3c8' }).setOrigin(0.5);
      return;
    }

    scores.forEach((item, index) => {
      const rank = `${index + 1}.`.padEnd(4);
      const name = item.name.padEnd(20);
      const score = `${item.score} pts`;

      const text = this.add.text(width / 2, yPos, `${rank}${name}${score}`, {
        fontSize: '24px',
        color: index < 3 ? '#f9d71c' : '#e6edf3', // Dourado para o top 3
        fontFamily: 'monospace'
      }).setOrigin(0.5);

      yPos += 35;
    });
  }
}
