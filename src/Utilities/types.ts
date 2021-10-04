export type Vector3F = [number, number, number];
export type Vector4F = [number, number, number, number];

/**
 * @link https://github.com/microsoft/TypeScript/issues/10421#issuecomment-518806979
 */
export function assumeType<T>(_: unknown): asserts _ is T {
  // ¯\_(ツ)_/¯
}
