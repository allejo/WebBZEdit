export function writeArray(array: Array<any>): string[] {
  return array.map((value) => {
    if (typeof value === 'number') {
      return writeNumber(value);
    }

    return value;
  });
}

export function writeNumber(value: number): string {
  if (value % 1 === 0) {
    return value.toFixed(0);
  }

  return value.toFixed(6).replace(/0+$/, '');
}
