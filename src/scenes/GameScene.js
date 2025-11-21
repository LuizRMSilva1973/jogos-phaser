import { makeLevels } from '../levels.js';
import { requireSubscription } from '../subscription.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.score = 0;
    this.gameOver = false;
    this.levelIndex = 0;
    this.levels = [];
    this.music = null;
    this.muted = false;
  }

  create() {
    this.score = 0;
    this.gameOver = false;
    this.levelIndex = 0;

    const { width, height } = this.scale;

    if (!requireSubscription({ gameId: 'sky' })) return;

    // Background gradient rectangles
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0b1220, 0x0b1220, 0x0e1730, 0x0e1730, 1);
    bg.fillRect(0, 0, width, height);

    // UI
    this.scoreText = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '22px', color: '#e6edf3' }).setScrollFactor(0);
    this.levelText = this.add.text(width - 16, 16, '', { fontSize: '22px', color: '#e6edf3' }).setOrigin(1, 0).setScrollFactor(0);
    this.brandText = this.add.text(width - 16, 48, 'Sua Marca', { fontSize: '14px', color: '#9fb3c8' }).setOrigin(1, 0).setScrollFactor(0);

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    // Groups base
    this.platforms = this.physics.add.staticGroup();
    this.stars = this.physics.add.group();
    this.bombs = this.physics.add.group();

    // Player
    this.player = this.physics.add.sprite(100, height - 100, 'player');
    this.player.setBounce(0.15);
    this.player.setCollideWorldBounds(true);

    // Colliders/overlaps set once
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, width, height);

    // Touch controls
    this.createTouchControls();

    // Level definitions
    this.levels = makeLevels(width, height);
    this.loadLevel(0);

    // Audio
    this.setupAudio();
    this.playMusic();

    // Alguns navegadores exigem interação para desbloquear áudio
    const resume = () => {
      if (this.audioCtx?.state === 'suspended') this.audioCtx.resume();
      if (!this.muted && !this.music) this.playMusic();
      this.input.off('pointerdown', resume);
      this.input.keyboard?.off('keydown', resume);
    };
    this.input.on('pointerdown', resume);
    this.input.keyboard?.on('keydown', resume);

  }

  createTouchControls() {
    const { width, height } = this.scale;
    const isDesktop = this.sys.game.device.os.desktop;
    if (isDesktop) return;

    const padY = height - 60;
    const left = this.add.image(70, padY, 'btn').setScrollFactor(0).setDepth(10).setAlpha(0.5).setInteractive();
    const right = this.add.image(160, padY, 'btn').setScrollFactor(0).setDepth(10).setAlpha(0.5).setInteractive();
    const jump = this.add.image(width - 80, padY, 'btn').setScrollFactor(0).setDepth(10).setAlpha(0.5).setInteractive();

    this.add.image(70, padY, 'icon-left').setScrollFactor(0).setDepth(11).setAlpha(0.7);
    this.add.image(160, padY, 'icon-right').setScrollFactor(0).setDepth(11).setAlpha(0.7);
    this.add.image(width - 80, padY, 'icon-up').setScrollFactor(0).setDepth(11).setAlpha(0.7);

    this.touchState = { left: false, right: false, jump: false };

    const press = (key) => () => { this.touchState[key] = true; };
    const release = (key) => () => { this.touchState[key] = false; };

    left.on('pointerdown', press('left')).on('pointerup', release('left')).on('pointerout', release('left'));
    right.on('pointerdown', press('right')).on('pointerup', release('right')).on('pointerout', release('right'));
    jump.on('pointerdown', press('jump')).on('pointerup', release('jump')).on('pointerout', release('jump'));
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`Pontuação: ${this.score}`);
    this.playSfx('star');

    if (this.stars.countActive(true) === 0) {
      // Próxima fase ou ciclo com mais dificuldade
      if (this.levelIndex < this.levels.length - 1) {
        this.loadLevel(this.levelIndex + 1);
      } else {
        // A partir da última fase, mantém a fase e injeta uma bomba extra
        this.spawnBomb();
        // Recarrega as estrelas
        this.stars.children.iterate((child) => {
          child.enableBody(true, child.x, 0, true, true);
        });
      }
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff4d4f);
    this.gameOver = true;
    this.playSfx('hit');
    this.stopMusic();
    this.showGameOver();
  }

  showGameOver() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setScrollFactor(0);
    this.add.text(width / 2, height / 2 - 100, 'Fim de Jogo', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0);
    this.add.text(width / 2, height / 2 - 40, `Pontuação: ${this.score}`, { fontSize: '28px', color: '#e6edf3' }).setOrigin(0.5).setScrollFactor(0);

    // Botão de Salvar Pontuação
    const saveBtn = this.add.image(width / 2, height / 2 + 40, 'btn').setTint(0x0a84ff).setAlpha(0.9).setScrollFactor(0).setInteractive({ useHandCursor: true });
    const saveLabel = this.add.text(width / 2, height / 2 + 40, 'Salvar Pontuação', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0);
    saveBtn.on('pointerdown', () => this.scene.start('SubmitScore', { score: this.score }));
    saveBtn.on('pointerover', () => saveBtn.setAlpha(1)).on('pointerout', () => saveBtn.setAlpha(0.9));

    // Botão de Reiniciar
    const restartBtn = this.add.image(width / 2, height / 2 + 110, 'btn').setAlpha(0.9).setScrollFactor(0).setInteractive({ useHandCursor: true });
    const restartLabel = this.add.text(width / 2, height / 2 + 110, 'Jogar Novamente', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0);
    restartBtn.on('pointerdown', () => this.scene.restart());
    restartBtn.on('pointerover', () => restartBtn.setAlpha(1)).on('pointerout', () => restartBtn.setAlpha(0.9));
  }

  update() {
    if (this.gameOver) return;

    // Pause toggle
    if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
      this.physics.world.isPaused ? this.physics.world.resume() : this.physics.world.pause();
    }

    // Mute toggle
    if (Phaser.Input.Keyboard.JustDown(this.keyM)) this.toggleMute();

    const speed = 220;
    const jumpVel = -520;
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;

    let left = this.cursors.left.isDown;
    let right = this.cursors.right.isDown;
    let jump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (this.touchState) {
      left = left || this.touchState.left;
      right = right || this.touchState.right;
      jump = jump || this.touchState.jump;
    }

    if (left) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (jump && onGround) {
      this.player.setVelocityY(jumpVel);
      this.playSfx('jump');
    }
  }

  loadLevel(index) {
    const { width } = this.scale;
    this.levelIndex = index;
    const lvl = this.levels[index];

    // Physics adjustments
    this.physics.world.gravity.y = lvl.gravityY;

    // Clear previous
    this.platforms.clear(true, true);
    this.stars.clear(true, true);
    this.bombs.clear(true, true);

    // Build platforms
    for (const p of lvl.platforms) {
      this.platforms.create(p.x, p.y, p.key).refreshBody();
    }

    // Stars
    this.stars = this.physics.add.group({ key: 'star', repeat: lvl.stars.count - 1, setXY: { x: lvl.stars.startX, y: 0, stepX: lvl.stars.stepX } });
    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    // Bombs at start
    for (let i = 0; i < lvl.bombsAtStart; i++) this.spawnBomb(lvl.bombSpeed);

    // Player spawn
    this.player.setPosition(100, 0);
    this.player.setVelocity(0, 0);

    // Level HUD
    this.levelText.setText(`${lvl.name}`);
    const msg = this.add.text(width / 2, 80, `${lvl.name}`, { fontSize: '34px', color: '#ffffff' }).setOrigin(0.5).setScrollFactor(0);
    this.tweens.add({ targets: msg, alpha: 0, duration: 1200, ease: 'Sine.easeOut', onComplete: () => msg.destroy() });
  }

  spawnBomb(forceSpeed) {
    const lvl = this.levels[this.levelIndex];
    const speed = forceSpeed || lvl.bombSpeed || 220;
    const x = this.player.x < 400 ? Phaser.Math.Between(500, 900) : Phaser.Math.Between(50, 400);
    const bomb = this.bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-speed, speed), 20);
    bomb.allowGravity = false;
  }

  // ===== Áudio Procedural (sem assets) =====
  setupAudio() {
    this.audioCtx = this.sound.context || new (window.AudioContext || window.webkitAudioContext)();
    // Pré-cria buffers simples
    this.buffers = {
      jump: this.makeToneBuffer(440, 0.08, 'sine', { slideTo: 660 }),
      star: this.makeToneBuffer(880, 0.06, 'triangle', { slideTo: 1320 }),
      hit: this.makeToneBuffer(120, 0.2, 'square', { slideTo: 60 }),
      click: this.makeToneBuffer(500, 0.04, 'sine'),
    };
  }

  makeToneBuffer(freq, duration, type = 'sine', opts = {}) {
    const ctx = this.audioCtx;
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    const slideTo = opts.slideTo || freq;
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const f = freq + (slideTo - freq) * (i / length);
      let v;
      const w = 2 * Math.PI * f * t;
      switch (type) {
        case 'square': v = Math.sign(Math.sin(w)); break;
        case 'triangle': v = 2/Math.PI * Math.asin(Math.sin(w)); break;
        case 'saw': v = (2 * (t * f - Math.floor(0.5 + t * f))); break;
        default: v = Math.sin(w);
      }
      // Envelope simples (attack/decay)
      const env = Math.min(1, i / (0.01 * sampleRate)) * (1 - i / length);
      data[i] = v * env * 0.25;
    }
    return buffer;
  }

  playSfx(name) {
    if (this.muted || !this.buffers?.[name]) return;
    const ctx = this.audioCtx;
    const src = ctx.createBufferSource();
    src.buffer = this.buffers[name];
    const gain = ctx.createGain();
    gain.gain.value = 0.8;
    src.connect(gain).connect(ctx.destination);
    src.start();
  }

  playMusic() {
    if (this.muted) return;
    const ctx = this.audioCtx;
    // Pequeno loop de arpejo programático
    const tempo = 120; // bpm
    const beat = 60 / tempo;
    const seq = [523, 659, 784, 659, 523, 659, 784, 880];
    // Cria um oscilador contínuo suave com filtro
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    gain.gain.value = 0.06;
    osc.connect(filter).connect(gain).connect(ctx.destination);
    const start = ctx.currentTime + 0.05;
    seq.forEach((f, i) => {
      const t = start + i * beat * 0.5;
      osc.frequency.setValueAtTime(f, t);
    });
    // Repete a sequência
    const loopDur = seq.length * beat * 0.5;
    let loopCount = 0;
    const scheduleLoop = () => {
      if (this.gameOver || this.muted) return;
      const base = ctx.currentTime + 0.05;
      seq.forEach((f, i) => {
        const t = base + i * beat * 0.5;
        osc.frequency.setValueAtTime(f, t);
      });
      loopCount += 1;
      this.time.delayedCall(loopDur * 1000, scheduleLoop);
    };
    osc.start(start);
    this.time.delayedCall(loopDur * 1000, scheduleLoop);
    this.music = { osc, gain };
  }

  stopMusic() {
    if (this.music?.osc) {
      try { this.music.osc.stop(); } catch (_) {}
    }
    this.music = null;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.stopMusic(); else this.playMusic();
    this.brandText.setText(this.muted ? 'Sua Marca • Mudo' : 'Sua Marca');
  }
}
