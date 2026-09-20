import { bzwString } from '../attributeParsers';

export const NameableProperties = {
  name: bzwString,
};

export interface INameable {
  name?: string;
}

export function implementsINameable(value: any): value is INameable {
  return value.hasOwnProperty('name');
}
