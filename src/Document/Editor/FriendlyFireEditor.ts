import { OptionsFlag } from '../Obstacles/Option';
import { WorldEditorHelper } from './WorldEditorHelper';

export enum FriendlyFireMode {
  Impossible = 'i',
  WithPenalty = 'p',
  WithPenaltyAndSuicide = 's',
}

export function getFriendlyFire(this: WorldEditorHelper): FriendlyFireMode {
  if (this.world._options['-tk'] === true) {
    return FriendlyFireMode.WithPenalty;
  }

  if (this.world._options['-noTeamKills'] === true) {
    return FriendlyFireMode.Impossible;
  }

  return FriendlyFireMode.WithPenaltyAndSuicide;
}

export function setFriendlyFire(
  this: WorldEditorHelper,
  mode: FriendlyFireMode,
): void {
  const ffOpts: OptionsFlag[] = ['-noTeamKills', '-tk'];

  for (const ffOpt of ffOpts) {
    delete this.world._options[ffOpt];
  }

  switch (mode) {
    case FriendlyFireMode.Impossible:
      this.world._options['-noTeamKills'] = true;
      break;

    case FriendlyFireMode.WithPenalty:
      this.world._options['-tk'] = true;
      break;

    case FriendlyFireMode.WithPenaltyAndSuicide:
    default:
      break;
  }
}
