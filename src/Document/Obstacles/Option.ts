import { INameable } from '../Attributes/INameable';
import { bzwBool, bzwInt, bzwRepeatable, bzwString } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export type Accelerations = {
  linear: number;
  angular: number;
};

export type DBvar = {
  name: string;
  value: string;
};

export type Sl = {
  id: string;
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

export type maxPoints = {
  total?: number;
  rogue?: number;
  red?: number;
  green?: number;
  blue?: number;
  purple?: number;
  observer?: number;
};

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
export function bzwSl(input: string): Sl {
  const slArray = input.split(' ');
  const id = slArray[0];
  const num = parseInt(slArray[1]);

  return {
    id: id,
    num: num,
  };
}

export function bzwRabbit(value: string): Rabbit {
  return value as Rabbit;
}

export function bzwMp(input: string): maxPoints {
  const maxMPArray = input.split(',');
  if (maxMPArray.length === 1) {
    const total = parseInt(maxMPArray[0]);
    return {
      total: total,
    };
  }
  return {
    rogue:
      maxMPArray[0] && maxMPArray[0] === ''
        ? undefined
        : parseInt(maxMPArray[0]),
    red:
      maxMPArray[1] && maxMPArray[1] === ''
        ? undefined
        : parseInt(maxMPArray[1]),
    green:
      maxMPArray[2] && maxMPArray[2] === ''
        ? undefined
        : parseInt(maxMPArray[2]),
    blue:
      maxMPArray[3] && maxMPArray[3] === ''
        ? undefined
        : parseInt(maxMPArray[3]),
    purple:
      maxMPArray[4] && maxMPArray[4] === ''
        ? undefined
        : parseInt(maxMPArray[4]),
    observer:
      maxMPArray[5] && maxMPArray[5] === ''
        ? undefined
        : parseInt(maxMPArray[5]),
  };
}

export function bzwFlag(input: string): flagCount {
  const flagArray = input.split('{');

  const id = flagArray[0];
  const count = flagArray[1] ? parseInt(flagArray[1].replace('}', '')) : 1;

  return {
    id: id,
    count: count,
  };
}

export const OptionProperties = {
  name: bzwString,
  '-a': bzwAcc,
  '-addmsg': bzwRepeatable(bzwString),
  '-autoteam': bzwBool,
  '-c': bzwBool,
  '+f': bzwRepeatable(bzwFlag),
  '-f': bzwRepeatable(bzwString),
  '-fb': bzwBool,
  '-handicap': bzwBool,
  '-j': bzwBool,
  '-loadplugin': bzwRepeatable(bzwString),
  '-maxidle': bzwInt,
  '-mp': bzwMp,
  '-mps': bzwInt,
  '-ms': bzwInt,
  '-mts': bzwInt,
  '-noteamkills': bzwBool,
  '-offa': bzwBool,
  '+r': bzwBool,
  '-rabbit': bzwRabbit,
  '+s': bzwInt,
  '-s': bzwInt,
  '-sa': bzwBool,
  '-sb': bzwBool,
  '-set': bzwRepeatable(bzwDBvar),
  '-sl': bzwSl,
  '-srvmsg': bzwRepeatable(bzwString),
  '-st': bzwInt,
  '-sw': bzwInt,
  '-tk': bzwBool,
};

export interface IOption extends IBaseObject, INameable {
  '-a'?: Accelerations;
  '-addmsg'?: string;
  '-autoteam'?: boolean;
  '-c'?: boolean;
  '-fb'?: boolean;
  '+f'?: flagCount;
  '-f'?: string;
  '-handicap'?: boolean;
  '-j'?: boolean;
  '-loadplugin'?: string;
  '-maxidle'?: number;
  '-mp'?: maxPoints;
  '-mps'?: number;
  '-ms'?: number;
  '-mts'?: number;
  '-noteamkills'?: boolean;
  '-offa'?: boolean;
  '+r'?: boolean;
  '-rabbit'?: Rabbit;
  '+s'?: number;
  '-s'?: number;
  '-sa'?: boolean;
  '-sb'?: boolean;
  '-set'?: DBvar;
  '-sl'?: Sl;
  '-srvmsg'?: string;
  '-st'?: number;
  '-sw'?: number;
  '-tk'?: boolean;
}

export function newIOption(): IOption {
  return {
    ...newIBaseObject('option'),
    name: 'option',
  };
}
