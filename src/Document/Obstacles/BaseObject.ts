import { IPassableObject } from '../attributePartials';

export interface IBaseObject {
  [key: string]: any;

  _uuid: string;
  _objectType: string;
  _infoString: string;
  _terminator: string;
  _parent: IBaseObject | null;
  children: Record<string, IBaseObject>;
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

export function newIBaseObject(
  objectType: string,
  uuid: string = '',
): IBaseObject {
  return {
    _uuid: uuid,
    _objectType: objectType,
    _infoString: '',
    _terminator: 'end',
    _parent: null,
    children: {},
  };
}
