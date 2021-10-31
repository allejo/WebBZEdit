import { OptionsFlag, RabbitMode } from '../Obstacles/Option';
import { WorldEditorHelper } from './WorldEditorHelper';

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

export function getGameMode(this: WorldEditorHelper): GameMode {
  if (this.world._options['-c'] === true) {
    return GameMode.CaptureTheFlag;
  }

  if (this.world._options['-offa'] === true) {
    return GameMode.OpenFreeForAll;
  }

  let rabbitMode;
  if ((rabbitMode = this.world._options['-rabbit'])) {
    if (rabbitMode === RabbitMode.killer) {
      return GameMode.RabbitByKiller;
    }

    if (rabbitMode === RabbitMode.random) {
      return GameMode.RabbitByRandom;
    }

    if (rabbitMode === RabbitMode.score) {
      return GameMode.RabbitByScore;
    }
  }

  return GameMode.FreeForAll;
}

export function setGameMode(this: WorldEditorHelper, mode: GameMode): void {
  const gameModeOpts: OptionsFlag[] = ['-c', '-offa', '-rabbit'];

  for (const gameModeOpt of gameModeOpts) {
    delete this.world._options[gameModeOpt];
  }

  switch (mode) {
    case GameMode.CaptureTheFlag:
      this.world._options['-c'] = true;
      break;

    case GameMode.OpenFreeForAll:
      this.world._options['-offa'] = true;
      break;

    case GameMode.RabbitByKiller:
      this.world._options['-rabbit'] = RabbitMode.killer;
      break;

    case GameMode.RabbitByRandom:
      this.world._options['-rabbit'] = RabbitMode.random;
      break;

    case GameMode.RabbitByScore:
      this.world._options['-rabbit'] = RabbitMode.score;
      break;

    default:
      break;
  }
}
