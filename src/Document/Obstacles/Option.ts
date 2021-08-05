import { unstable_ComboboxGridStateReturn } from 'reakit';

import { bzwBool, bzwInt, bzwRepeatable, bzwString } from '../attributeParsers';

export const OptionProperties = {
  '-a': bzwAcc,
  '-addmsg': bzwRepeatable(bzwString),
  '-autoTeam': bzwBool,
  '-c': bzwBool,
  '-fb': bzwBool,
  '+f': bzwFlag,
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
  set: bzwDBvar,
  sl: bzwSl,
  svrmsg: bzwRepeatable(bzwString),
  st: bzwInt,
  sw: bzwInt,
  tk: bzwBool,
};

export type Accelerations = {
  linear: number;
  angular: number;
};

export type DBvar = {
  name: string;
  value: string;
};

export type sl = {
  id: number;
  num: number;
};

export type flagCount = {
  id: string;
  count: number;
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

export function bzwDBvar(name: string, value: string): DBvar {
  return {
    name: name,
    value: value,
  };
}
export function bzwSl(id: number, num: number): sl {
  return {
    id: id,
    num: num,
  };
}

export function bzwRabbit(value: Rabbit) {
  return value;
}

export function bzwFlag(id: string, count = 1): flagCount {
  return {
    id: id,
    count: count,
  };
}
