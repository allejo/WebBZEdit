module 'color-sorter' {
  interface ConversionResult {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
    authored: string;
  }

  function convert(color: string): ConversionResult;
  function sortFn(a: string, b: string): number;
}

// @see https://stackoverflow.com/a/65340056
interface Array<T> {
  // T[] | [T] enforces a tuple type.
  // {[K in keyof this]: U} keeps a mapped tuple type.
  map<U>(
    callbackfn: (value: T, index: number, tuple: T[] | [T]) => U,
    thisArg?: any,
  ): { [K in keyof this]: U };
}
