export type ParserCallback<T> = (line: string) => T;

export interface Repeatable<T> {
  type: 'repeatable';
  callback: ParserCallback<T>;
}

export function bzwRepeatable<T>(
  callback: Repeatable<T>['callback'],
): Repeatable<T> {
  return {
    type: 'repeatable',
    callback: callback,
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

export function bzwVector3F(line: string): [number, number, number] {
  const tokens = line.split(/[ ]+/);

  return [
    Number.parseFloat(tokens[0]),
    Number.parseFloat(tokens[1]),
    Number.parseFloat(tokens[2]),
  ];
}

export function bzwVector4F(line: string): [number, number, number, number] {
  const tokens = line.split(/[ ]+/);

  return [
    Number.parseFloat(tokens[0]),
    Number.parseFloat(tokens[1]),
    Number.parseFloat(tokens[2]),
    Number.parseFloat(tokens[3]),
  ];
}
