import { unstable_ComboboxGridStateReturn } from 'reakit';

import { bzwBool, bzwInt, bzwRepeatable, bzwString } from '../attributeParsers';

export const OptionProperties = {
  '-a': bzwAcc,
  '-addmsg': bzwRepeatable(bzwString),
  '-autoTeam': bzwBool,
  '-c': bzwBool,
  '-fb': bzwBool,
  '-f': bzwRepeatable(bzwString),
  '-handicap': bzwBool,
  '-j': bzwBool,
  '-loadplugin': bzwRepeatable(bzwString),
  '-maxidle': bzwInt,
  '-mps': bzwInt,
  '-ms': bzwInt,
  '-mts': bzwInt,
  '-noTeamKills': bzwBool,
  '-offa': bzwBool,
  '+r': bzwBool,
  '-rabbit': bzwRabbit,
  '+s': bzwInt,
  '-s': bzwInt,
  '-sa': bzwBool,
  '-sb': bzwBool,
};

export type Accelerations = {
  linear: number;
  angular: number;
};

export type BZDBvar = {
  name: string;
  value: string;
};
export enum Rabbit {
  score = 'score',
  killer = 'killer',
  random = 'random',
}

export function bzwAcc(linear = 50, angular = 38): Accelerations {
  return {
    linear: linear,
    angular: angular,
  };
}

export function bzDBvar(name: string, value: string): BZDBvar {
  return {
    name: name,
    value: value,
  };
}

export function bzwRabbit(value: Rabbit) {
  return value;
}
