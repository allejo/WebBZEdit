export function assertEveryIsNotNull(values: any[], message: string) {
  if (values.every((v) => v != null)) {
    throw new Error(message);
  }
}

export function isDevEnv() {
  return import.meta.env.DEV;
}
