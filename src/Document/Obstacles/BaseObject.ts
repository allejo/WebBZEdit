export interface IBaseObject {
  [key: string]: any;

  _uuid: string;
  _objectType: string;
  _caseSensitive: boolean;
  _infoString: string;
  _terminator: string;
  children: Record<string, IBaseObject>;
}

export function newIBaseObject(
  objectType: string,
  uuid: string = '',
): IBaseObject {
  return {
    _uuid: uuid,
    _objectType: objectType,
    _caseSensitive: false,
    _infoString: '',
    _terminator: 'end',
    children: {},
  };
}
