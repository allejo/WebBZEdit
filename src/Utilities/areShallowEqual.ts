/**
 * @link https://stackoverflow.com/a/22266891
 */
export function areEqualShallow<T extends {}>(a: T, b: T) {
	for (const key in a) {
		if (!(key in b) || a[key] !== b[key]) {
			return false;
		}
	}

	for (const key in b) {
		if (!(key in a) || a[key] !== b[key]) {
			return false;
		}
	}

	return true;
}
