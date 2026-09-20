/**
 * @deprecated
 * @link https://github.com/microsoft/TypeScript/issues/10421#issuecomment-518806979
 */
export function assumeType<T>(_: unknown): asserts _ is T {
  // ¯\_(ツ)_/¯
}

export type OneOf<T> = {
  [K in keyof T]-?: Pick<T, K> & Partial<T>;
}[keyof T];

export type Tuple<
  N extends number,
  T = number,
  Acc extends T[] = []
> = Acc['length'] extends N ? Acc : Tuple<N, T, [...Acc, T]>;

export type Vector2F = Tuple<2>;
export type Vector3F = Tuple<3>;
export type Vector4F = Tuple<4>;
