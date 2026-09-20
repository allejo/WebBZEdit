export interface IPassableObject {
  drivethrough: boolean;
  shootthrough: boolean;
  passable: boolean;
}

export function implementsIPassableObject(
  value: any,
): value is IPassableObject {
  return (
    value.hasOwnProperty('drivethrough') &&
    value.hasOwnProperty('shootthrough') &&
    value.hasOwnProperty('passable') &&
    true
  );
}
export function newIPassableObject(): IPassableObject {
  return {
    drivethrough: false,
    shootthrough: false,
    get passable(): boolean {
      return this.drivethrough && this.shootthrough;
    },
    set passable(value: boolean) {
      this.drivethrough = value;
      this.shootthrough = value;
    },
  };
}
