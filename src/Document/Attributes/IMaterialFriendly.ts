export interface IMaterialFriendly {
  matref?: string;
}

export function implementsIMaterialFriendly(
  value: any,
): value is IMaterialFriendly {
  return value.hasOwnProperty('matref');
}
