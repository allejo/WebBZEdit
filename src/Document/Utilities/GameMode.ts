export enum GameMode {
  CaptureTheFlag = 'ctf',
  FreeForAll = 'ffa',
  OpenFreeForAll = 'offa',
  RabbitByScore = 'rs',
  RabbitByKiller = 'rk',
  RabbitByRandom = 'rr',
}

export const GameModeLiterals: Readonly<Record<GameMode, string>> = {
  [GameMode.CaptureTheFlag]: 'Capture the Flag',
  [GameMode.FreeForAll]: 'Free for All',
  [GameMode.OpenFreeForAll]: 'Open Free for All',
  [GameMode.RabbitByKiller]: 'Rabbit selected by latest killer',
  [GameMode.RabbitByRandom]: 'Rabbit selected randomly',
  [GameMode.RabbitByScore]: 'Rabbit selected by score',
};

export function gameModeLiteral(mode: GameMode): string {
  return GameModeLiterals[mode];
}
