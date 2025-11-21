export const games = [
  {
    id: 'sky',
    title: 'Sky Platforms (Phaser 3)',
    implemented: true,
    entryScene: 'Boot',
  },
  {
    id: 'runner',
    title: 'Runner',
    implemented: true,
    entryScene: 'RunnerBoot',
  },
];

export function findGame(id) {
  return games.find((g) => g.id === id);
}

export function playableGames() {
  return games.filter((g) => g.implemented);
}

