/// <reference types="../global" />
import { sortFn } from 'color-sorter';
import dedent from 'dedent';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { ColorLiteral, ColorTuple } from '../src/Document/Utilities/Colors';
import { Colors } from './resources/colors';

function objectMap<R, O extends Record<string, V>, V = O[keyof O]>(
  obj: O,
  fn: (value: V, key: string, index: number) => R,
): Record<keyof O, R> {
  return Object.fromEntries(
    Object.entries<any>(obj).map(([k, v], i) => [k, fn(v, k, i)]),
  ) as Record<keyof O, R>;
}

const ColorsRGB = objectMap(Colors, (rawRGB) =>
  rawRGB.map((v) => Math.floor(v * 255)),
);

function getColorsSorted(): [ColorLiteral, ColorTuple][] {
  const newColors = Object.entries(ColorsRGB);

  newColors.sort(([_, rgb1], [__, rgb2]) => {
    return sortFn(`rgb(${rgb1.join(',')})`, `rgb(${rgb2.join(',')})`);
  });

  return newColors;
}

function toSentenceCase(str: string): string {
  return str
    .replace(/([a-z_]+)(\d+)/gm, '$1_$2')
    .split(/_/)
    .filter((chunk) => chunk.trim().length > 0)
    .map((chunk) => chunk[0].toUpperCase() + chunk.substring(1))
    .join(' ');
}

const ColorNamesToLiterals = Object.fromEntries(
  Object.keys(Colors).map((key) => [toSentenceCase(key), key]),
);

const output = dedent`
  import { ColorLiteral, ColorTuple } from '../Document/Utilities/Colors';

  type ColorDict = Record<string, ColorTuple>;
  type ColorMap = [ColorLiteral, ColorTuple][];

  export const ColorsRGB: ColorDict = ${JSON.stringify(ColorsRGB)};

  const sortedColors: ColorMap = ${JSON.stringify(getColorsSorted())};
  export const ColorsSorted = new Map<ColorLiteral, ColorTuple>(sortedColors);

  export const ColorNamesToLiterals = ${JSON.stringify(ColorNamesToLiterals)};
  export const ColorLiteralsToNames = Object.fromEntries(Object.entries(ColorNamesToLiterals).map(e => e.reverse()));
`;

writeFileSync(resolve(__dirname, '..', 'src', 'data', 'colors.ts'), output);
