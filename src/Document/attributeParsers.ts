import { Tuple, Vector2F, Vector3F, Vector4F } from '../Utilities/types';
import {
  TeleporterReference,
  TeleporterSide,
} from './Obstacles/TeleporterLink';
import { IWorld } from './Obstacles/World';

type KeyType = keyof any;

export type HashableParserCallback<K extends KeyType, V> = (
  line: string,
  world: IWorld,
) => [K, V];

export interface Hashable<K extends KeyType, V> {
  type: 'hashable';
  callback: HashableParserCallback<K, V>;
}

export function bzwHashable<K extends KeyType, V>(
  cb: Hashable<K, V>['callback'],
): Hashable<K, V> {
  return {
    type: 'hashable',
    callback: cb,
  };
}

export type RepeatableParserCallback<T> = (line: string, world: IWorld) => T;

export interface Repeatable<T> {
  type: 'repeatable';
  callback: RepeatableParserCallback<T>;
}

export type ValidParserCallbacks =
  | ReturnType<typeof bzwRepeatable>
  | ReturnType<typeof bzwHashable>
  | ((line: string, world: IWorld) => unknown);

export type AttributeParsers<T> = Record<keyof T, ValidParserCallbacks>;

export function bzwRepeatable<T>(cb: Repeatable<T>['callback']): Repeatable<T> {
  return {
    type: 'repeatable',
    callback: cb,
  };
}

export function bzwBool(_: string): boolean {
  return true;
}

export function bzwFloat(line: string): number {
  return Number.parseFloat(line);
}

export function bzwInt(line: string): number {
  return Number.parseInt(line);
}

export function bzwString(line: string): string {
  // Only use any string value before the `#`; i.e. the non-comment content
  return line.match(/([^#\n]+)(?!#)/)?.[0] ?? line;
}

export function bzwStringVector(line: string): string[] {
  return bzwString(line).split(/[ ]+/);
}

export function bzwIntVector(line: string): number[] {
  return bzwStringVector(line).map((value) => Number.parseInt(value));
}

export function bzwFloatVector(line: string): number[] {
  return bzwStringVector(line).map((value) => Number.parseFloat(value));
}

function bzwVectorNF<N extends number>(line: string, n: N): Tuple<N> {
  const tokens = line.split(/[ ]+/);

  if (tokens.length !== n) {
    throw new Error(`Expected ${n} values, but got ${tokens.length}`);
  }

  return tokens.map((value) => Number.parseFloat(value)) as Tuple<N>;
}

export function bzwVector2F(line: string): Vector2F {
  return bzwVectorNF(line, 2);
}

export function bzwVector3F(line: string): Vector3F {
  return bzwVectorNF(line, 3);
}

export function bzwVector4F(line: string): Vector4F {
  return bzwVectorNF(line, 4);
}

export function bzwTeleRef(line: string, world: IWorld): TeleporterReference {
  let name = line;
  let side = TeleporterSide.Both;
  const i = line.lastIndexOf(':');

  if (i !== -1) {
    name = line.substring(0, i);

    const sideStr = line.substring(i + 1);
    if (sideStr === 'f') {
      side = TeleporterSide.Forward;
    } else if (sideStr === 'b') {
      side = TeleporterSide.Backward;
    }
  } else if (!isNaN(+name)) {
    // teleporter reference was defined as a single number
    // determine which teleporter and side is being referenced
    const teleIndex = Math.floor(+name / 2),
      sideIndex = +name % 2;

    name = world.children[world._teleporters[teleIndex]].name ?? '';
    side = sideIndex === 0 ? TeleporterSide.Forward : TeleporterSide.Backward;
  }

  return {
    name: name,
    side: side,
  };
}
