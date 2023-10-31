import { bzwString, bzwTeleRef } from '../attributeParsers';
import { INameable } from '../Attributes/INameable';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const TeleporterLinkProperties = {
	name: bzwString,
	from: bzwTeleRef,
	to: bzwTeleRef,
};

export type TeleporterReference = {
	name: string;
	side: TeleporterSide;
};

export enum TeleporterSide {
	Both = '*',
	Forward = 'f',
	Backward = 'b',
}

export interface ITeleporterLink extends IBaseObject, INameable {
	from: TeleporterReference;
	to: TeleporterReference;
}

export function newITeleporterLink(): ITeleporterLink {
	return {
		...newIBaseObject('link'),
		from: { name: '', side: TeleporterSide.Both },
		to: { name: '', side: TeleporterSide.Both },
	};
}

export function teleporterSideLiteral(side: TeleporterSide): string {
	switch (side) {
		case TeleporterSide.Backward:
			return 'Back';

		case TeleporterSide.Forward:
			return 'Front';

		case TeleporterSide.Both:
			return 'Both';
	}
}
