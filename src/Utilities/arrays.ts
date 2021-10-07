/**
 * @param arr
 * @param value
 *
 * @link https://stackoverflow.com/a/5767357
 */
export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);

  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
}
