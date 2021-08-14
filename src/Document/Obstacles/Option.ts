import { bzwBool, bzwInt, bzwRepeatable, bzwString } from '../attributeParsers';

export const OptionProperties = {
  '-a': bzwAcc,
  '-addmsg': bzwRepeatable(bzwString),
  '-autoTeam': bzwBool,
  '-c': bzwBool,
  '-fb': bzwBool,
  '+f': bzwRepeatable(bzwFlag),
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
  '-set': bzwRepeatable(bzwDBvar),
  '-sl': bzwSl,
  '-svrmsg': bzwRepeatable(bzwString),
  '-st': bzwInt,
  '-sw': bzwInt,
  '-tk': bzwBool,
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

export function bzwAcc(input: string): Accelerations {
  const accArray = input.split(' ');
  const linear = accArray[0] ? parseInt(accArray[0]) : 50;
  const angular = accArray[1] ? parseInt(accArray[1]) : 38;

  return {
    linear: linear,
    angular: angular,
  };
}

export function bzwDBvar(input: string): DBvar {
  const DBArray = input.split(' ');
  const name = DBArray[0];
  const value = DBArray[1];

  return {
    name: name,
    value: value,
  };
}
export function bzwSl(input: string): sl {
  const slArray = input.split(' ');
  const id = parseInt(slArray[0]);
  const num = parseInt(slArray[1]);

  return {
    id: id,
    num: num,
  };
}

export function bzwRabbit(value: Rabbit) {
  return value;
}

export function bzwFlag(input: string): flagCount {
  const flagArray = input.split(' ');

  const id = flagArray[0];
  const count = flagArray[1] ? parseInt(flagArray[1]) : 1;

  return {
    id: id,
    count: count,
  };
}
