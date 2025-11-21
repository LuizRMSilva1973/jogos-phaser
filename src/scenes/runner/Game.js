import { requireSubscription } from '../../subscription.js';

export default class RunnerGame extends Phaser.Scene {
  constructor(){ super('RunnerGame'); }
  create(){
    const { width, height } = this.scale;
    if (!requireSubscription({ gameId: 'runner' })) return;
    this.physics.world.gravity.y = 1200;
    // bg
    const bg = this.add.graphics();
    bg.fillStyle(0x0b1220,1); bg.fillRect(0,0,width,height);
    // ground
    this.ground = this.physics.add.staticGroup();
    for(let x=0;x<width+64;x+=64){ this.ground.create(x, height-12, 'r-ground').setOrigin(0,1).refreshBody(); }
    // player
    this.player = this.physics.add.sprite(120,height-48,'r-player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.0);
    this.physics.add.collider(this.player, this.ground);
    // UI
    this.score=0; this.scoreText=this.add.text(16,16,'Pontuação: 0',{fontSize:'22px',color:'#e6edf3'}).setScrollFactor(0);
    // input
    this.cursors=this.input.keyboard.createCursorKeys();
    // obstacles
    this.obs = this.physics.add.group();
    this.spawnTimer = this.time.addEvent({ delay: 1400, loop:true, callback: ()=> this.spawnObstacle() });
    this.physics.add.collider(this.obs, this.ground);
    this.physics.add.collider(this.player, this.obs, ()=> this.gameOver(), null, this);
    // score timer
    this.time.addEvent({ delay: 500, loop:true, callback: ()=>{ this.score+=1; this.scoreText.setText('Pontuação: '+this.score); }});
  }
  update(){
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && onGround){ this.player.setVelocityY(-520); }
    // move obstacles left
    this.obs.children.iterate(o=>{ if(!o) return; o.setVelocityX(-260); if(o.x<-40) o.destroy(); });
  }
  spawnObstacle(){
    const { height } = this.scale; const ob = this.obs.create(960, height-36, 'r-ob'); ob.setCollideWorldBounds(false); ob.setImmovable(false); ob.body.allowGravity=true;
  }
  gameOver(){
    this.physics.pause();
    const { width, height } = this.scale;
    this.add.rectangle(0,0,width,height,0x000000,0.6).setOrigin(0).setScrollFactor(0);
    this.add.text(width/2,height/2-40,'Fim de Jogo',{fontSize:'40px',color:'#fff'}).setOrigin(0.5);
    const btn = this.add.text(width/2,height/2+20,'Salvar Pontuação',{fontSize:'24px',color:'#0a84ff',backgroundColor:'#0b1220',padding:{x:12,y:8}}).setOrigin(0.5).setInteractive({useHandCursor:true});
    btn.on('pointerdown', ()=> this.scene.start('SubmitScore',{ score: this.score }));
  }
}
