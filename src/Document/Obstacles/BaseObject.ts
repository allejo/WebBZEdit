import { MapObjectType } from '../contracts';

export interface IBaseObject {
	[key: string]: unknown;

	_uuid: string;
	_objectType: string;
	_infoString: string;
	_terminator: string;
	children: Record<string, MapObjectType>;
}

export function newIBaseObject(objectType: string, uuid = ''): IBaseObject {
	return {
		_uuid: uuid,
		_objectType: objectType,
		_infoString: '',
		_terminator: 'end',
		children: {},
	};
}
