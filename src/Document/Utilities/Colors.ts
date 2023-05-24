import {
  ColorNamesToLiterals,
  ColorLiteralsToNames,
  ColorsRGB,
} from '../../data/colors';

export type ColorTuple = [number, number, number];
export type ColorLiteral = keyof typeof ColorsRGB;
export type ColorName = keyof typeof ColorNamesToLiterals;
export const ColorLiterals = Object.freeze(new Set(Object.keys(ColorsRGB)));

const colorAliases: Record<string, ColorLiteral> = {};

function buildAliases(): void {
  if (Object.isFrozen(colorAliases)) {
    return;
  }

  ColorLiterals.forEach((literal) => {
    const transformed = literal.replace(/_/g, '').replace(/gray/g, 'grey');
    colorAliases[transformed] = literal as ColorLiteral;
  });

  Object.freeze(colorAliases);
}

function isAlias(value: string): null | ColorLiteral {
  buildAliases();

  if (value in colorAliases) {
    return colorAliases[value];
  }

  return null;
}

export function getColorLiteral(value: string): ColorLiteral | null {
  if (ColorLiterals.has(value)) {
    return value as ColorLiteral;
  }

  const alias = isAlias(value);
  if (alias != null) {
    return alias;
  }

  if (value in ColorNamesToLiterals) {
    return ColorNamesToLiterals[value as keyof typeof ColorNamesToLiterals];
  }

  return null;
}

export function getColorName(literal: ColorLiteral): ColorName | null {
  if (literal in ColorLiteralsToNames) {
    return ColorLiteralsToNames[literal];
  }

  return null;
}

export function isColorLiteral(value: string): boolean {
  return getColorLiteral(value) != null;
}
