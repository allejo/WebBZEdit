export function parseBool(_: string): boolean {
  return true;
}

export function parseFloat(line: string): number {
  return Number.parseFloat(line);
}

export function parseString(line: string): string {
  return line;
}

export function parseVector3F(line: string): [number, number, number] {
  const tokens = line.split(' ');

  return [
    Number.parseFloat(tokens[0]),
    Number.parseFloat(tokens[1]),
    Number.parseFloat(tokens[2]),
  ];
}
