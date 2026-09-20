import { bzwString } from '../attributeParsers';

export const MaterialFriendlyProperties = {
  matref: bzwString,
};

export interface IMaterialFriendly {
  matref?: string;
}

export function implementsIMaterialFriendly(
  value: any,
): value is IMaterialFriendly {
  return value.hasOwnProperty('matref');
}
