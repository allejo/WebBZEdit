import { BZDBType } from '../../data/bzdb-types';
import {
  bzwBool,
  bzwHashable,
  bzwInt,
  bzwRepeatable,
  bzwString,
} from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export type Accelerations = {
  linear: number;
  angular: number;
};

export type ShotLimit = {
  flag: string;
  num: number;
};

export type FlagCount = {
  flag: string;
  count: number;
};

export enum RabbitMode {
  score = 'score',
  killer = 'killer',
  random = 'random',
}

export type MaxPlayersSimple = {
  total: number;
};

export type MaxPlayersVerbose = {
  rogue: number;
  red: number;
  green: number;
  blue: number;
  purple: number;
  observer: number;
};

export type MaxPlayers = MaxPlayersSimple | MaxPlayersVerbose;

export function bzwAccelerations(input: string): Accelerations {
  const accArray = input.split(' ');
  const linear = accArray[0] ? parseInt(accArray[0]) : 50;
  const angular = accArray[1] ? parseInt(accArray[1]) : 38;

  return {
    linear: linear,
    angular: angular,
  };
}

export function bzwBZDBSetting(input: string): [string, string] {
  return input.split(' ') as [string, string];
}

export function bzwShotLimit(input: string): ShotLimit {
  const slArray = input.split(' ');
  const id = slArray[0];
  const num = parseInt(slArray[1]);

  return {
    flag: id,
    num: num,
  };
}

export function bzwRabbitMode(value: string): RabbitMode {
  return value as RabbitMode;
}

export function bzwMaxPlayers(input: string): MaxPlayers {
  const maxMPArray = input.split(',');

  if (maxMPArray.length === 1) {
    return {
      total: parseInt(maxMPArray[0]),
    };
  }

  return {
    rogue: parseInt(maxMPArray[0]) || 0,
    red: parseInt(maxMPArray[1]) || 0,
    green: parseInt(maxMPArray[2]) || 0,
    blue: parseInt(maxMPArray[3]) || 0,
    purple: parseInt(maxMPArray[4]) || 0,
    observer: parseInt(maxMPArray[5]) || 0,
  };
}

export function bzwFlag(input: string): FlagCount {
  const flagArray = input.split('{');

  const id = flagArray[0];
  const count = flagArray[1] ? parseInt(flagArray[1].replace('}', '')) : 1;

  return {
    flag: id,
    count: count,
  };
}

export const OptionsProperties = {
  '-a': bzwAccelerations,
  '-admsg': bzwRepeatable(bzwString),
  '-autoteam': bzwBool,
  '-c': bzwBool,
  '+f': bzwRepeatable(bzwFlag),
  '-f': bzwRepeatable(bzwString),
  '-fb': bzwBool,
  '-handicap': bzwBool,
  '-j': bzwBool,
  '-loadplugin': bzwRepeatable(bzwString),
  '-maxidle': bzwInt,
  '-mp': bzwMaxPlayers,
  '-mps': bzwInt,
  '-ms': bzwInt,
  '-mts': bzwInt,
  '-noTeamKills': bzwBool,
  '-offa': bzwBool,
  '+r': bzwBool,
  '-rabbit': bzwRabbitMode,
  '+s': bzwInt,
  '-s': bzwInt,
  '-sa': bzwBool,
  '-sb': bzwBool,
  '-set': bzwHashable<string, string>(bzwBZDBSetting),
  '-sl': bzwRepeatable(bzwShotLimit),
  '-srvmsg': bzwRepeatable(bzwString),
  '-st': bzwInt,
  '-sw': bzwInt,
  '-tk': bzwBool,
};

export interface IOptions extends IBaseObject {
  '-a'?: Accelerations;
  '-admsg'?: string[];
  '-autoteam'?: boolean;
  '-c'?: boolean;
  '-fb'?: boolean;
  '+f'?: FlagCount[];
  '-f'?: string[];
  '-handicap'?: boolean;
  '-j'?: boolean;
  '-loadplugin'?: string[];
  '-maxidle'?: number;
  '-mp'?: MaxPlayers;
  '-mps'?: number;
  '-ms'?: number;
  '-mts'?: number;
  '-noTeamKills'?: boolean;
  '-offa'?: boolean;
  '+r'?: boolean;
  '-rabbit'?: RabbitMode;
  '+s'?: number;
  '-s'?: number;
  '-sa'?: boolean;
  '-sb'?: boolean;
  '-set'?: Record<BZDBType | string, string>;
  '-sl'?: ShotLimit[];
  '-srvmsg'?: string[];
  '-st'?: number;
  '-sw'?: number;
  '-tk'?: boolean;
}

export function newIOptions(): IOptions {
  return {
    ...newIBaseObject('options'),
  };
}

export type OptionsFlag = keyof IOptions;
