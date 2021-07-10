import { bzwBool, bzwString } from '../attributeParsers';

export const OptionProperties = {
  a: bzwAcc,
  msg: bzwString,
  autoTeam: bzwBool,
  c: bzwBool,
};

export type Accelerations = {
  linear: number;
  angular: number;
};

export function bzwAcc(linear = 50, angular = 38): Accelerations {
  return {
    linear: linear,
    angular: angular,
  };
}
