import {
	bzwFloat,
	bzwIntVector,
	bzwRepeatable,
	bzwString,
	bzwStringVector,
	bzwVector3F,
} from '../attributeParsers';
import { INameable } from '../Attributes/INameable';
import { IPositionable } from '../Attributes/IPositionable';
import { IBaseObject, newIBaseObject } from './BaseObject';

function bzwZoneFlag(value: string): IZoneFlag {
	const chunks = value.split(' ');

	return [chunks[0], +(chunks[1] ?? 1)];
}

export const ZoneProperties = {
	name: bzwString,
	position: bzwVector3F,
	size: bzwVector3F,
	rotation: bzwFloat,
	zoneflag: bzwRepeatable(bzwZoneFlag),
	flag: bzwRepeatable(bzwStringVector),
	team: bzwIntVector,
	safety: bzwIntVector,
};

export interface IZone extends IBaseObject, INameable, IPositionable {
	zoneflag: IZoneFlag[];
	flag: string[];
	team?: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
	safety?: (1 | 2 | 3 | 4)[];
}
export type IZoneFlag = [string, number];
export type IZoneTeam = Exclude<IZone['team'], undefined>[0];
export type IZoneSafety = Exclude<IZone['safety'], undefined>[0];

export function newIZone(): IZone {
	return {
		...newIBaseObject('zone'),
		position: [0, 0, 0],
		size: [10, 10, 4],
		rotation: 0,
		zoneflag: [],
		flag: [],
	};
}
