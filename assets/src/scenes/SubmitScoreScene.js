export default class SubmitScoreScene extends Phaser.Scene {
  constructor() { super('SubmitScore'); }

  init(data) { this.score = data.score || 0; }

  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 100, 'Fim de Jogo', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 40, `Sua Pontuação: ${this.score}`, { fontSize: '32px', color: '#e6edf3' }).setOrigin(0.5);

    const dom = this.add.dom(width / 2, height / 2 + 40).createFromHTML(`
      <div style="display:flex;flex-direction:column;align-items:center;gap:15px;">
        <input type="text" id="nameInput" placeholder="Digite seu nome" style="width:280px;padding:12px;font-size:18px;border-radius:8px;border:2px solid #0a84ff;background:#1c2b4d;color:#e6edf3;">
        <button id="submitBtn" style="width:308px;padding:12px;font-size:18px;border-radius:8px;border:none;background:#0a84ff;color:white;cursor:pointer;">Enviar</button>
      </div>`);

    const nameInput = document.getElementById('nameInput');
    document.getElementById('submitBtn').addEventListener('click', async () => {
      const playerName = nameInput.value.trim();
      if (!playerName) return;
      try {
        await fetch('api/scores.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: playerName, score: this.score }) });
        dom.setVisible(false); this.scene.start('Scoreboard');
      } catch (e) { console.error('Erro ao salvar pontuação:', e); }
    });

    const menuBtn = this.add.text(width / 2, height / 2 + 120, 'Voltar ao Menu', { fontSize: '20px', color: '#9fb3c8', backgroundColor: '#0b1220', padding: { x: 10, y: 5 } })
      .setOrigin(0.5).setInteractive();
    menuBtn.on('pointerdown', () => { dom.setVisible(false); this.scene.start('Menu'); });
  }
}

