/**
 * Definições de Nível para o Jogo
 * Cada objeto de nível define a gravidade, plataformas, estrelas e bombas.
 * A função makeLevels aceita a largura e altura do jogo para criar fases dinâmicas.
 */
export const makeLevels = (width, height) => [
  {
    name: 'Fase 1',
    gravityY: 980,
    platforms: [
      // Chão
      ...Array.from({ length: Math.ceil(width / 64) }, (_, i) => ({ x: i * 64 + 32, y: height - 16, key: 'ground' })),
      // Plataformas
      { x: 180, y: 520, key: 'platform' },
      { x: 720, y: 460, key: 'platform' },
      { x: 430, y: 400, key: 'platform' },
      { x: 120, y: 330, key: 'platform' },
      { x: width - 120, y: 300, key: 'platform' },
    ],
    stars: { count: 12, startX: 16, stepX: 80 },
    bombsAtStart: 0,
    bombSpeed: 200,
  },
  {
    name: 'Fase 2',
    gravityY: 1040,
    platforms: [
      ...Array.from({ length: Math.ceil(width / 64) }, (_, i) => ({ x: i * 64 + 32, y: height - 16, key: 'ground' })),
      { x: 150, y: 520, key: 'platform' },
      { x: 350, y: 460, key: 'platform' },
      { x: 650, y: 420, key: 'platform' },
      { x: 820, y: 360, key: 'platform' },
      { x: 500, y: 320, key: 'platform' },
    ],
    stars: { count: 14, startX: 30, stepX: 64 },
    bombsAtStart: 1,
    bombSpeed: 240,
  },
  {
    name: 'Fase 3',
    gravityY: 1120,
    platforms: [
      ...Array.from({ length: Math.ceil(width / 64) }, (_, i) => ({ x: i * 64 + 32, y: height - 16, key: 'ground' })),
      { x: 200, y: 520, key: 'platform' },
      { x: 400, y: 480, key: 'platform' },
      { x: 600, y: 440, key: 'platform' },
      { x: 800, y: 400, key: 'platform' },
      { x: 300, y: 360, key: 'platform' },
      { x: 500, y: 320, key: 'platform' },
    ],
    stars: { count: 16, startX: 24, stepX: 58 },
    bombsAtStart: 2,
    bombSpeed: 280,
  },
];
