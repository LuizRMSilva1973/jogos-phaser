export default class RunnerMenu extends Phaser.Scene {
  constructor() { super('RunnerMenu'); }
  create() {
    const { width, height } = this.scale;
    this.add.text(width/2, 100, 'Runner', { fontSize: '56px', color: '#ffffff'}).setOrigin(0.5);
    const play = this.add.text(width/2, height/2, 'Jogar', { fontSize: '32px', color: '#0a84ff', backgroundColor:'#0b1220', padding:{x:14,y:8}}).setOrigin(0.5).setInteractive({useHandCursor:true});
    play.on('pointerdown', ()=> this.scene.start('RunnerGame'));
    const score = this.add.text(width/2, height/2+60, 'Placar', { fontSize: '24px', color:'#9fb3c8'}).setOrigin(0.5).setInteractive({useHandCursor:true});
    score.on('pointerdown', ()=> this.scene.start('Scoreboard'));
    this.add.text(width/2, height-40, 'ESC: voltar ao seletor', { fontSize:'16px', color:'#9fb3c8'}).setOrigin(0.5);
  }
}

