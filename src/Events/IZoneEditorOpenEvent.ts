import { IZone } from '../Document/Obstacles/Zone';

export type ZoneEditorMode = 'zoneFlag' | 'flag';

export interface IZoneEditorOpenEvent {
	getEditorMode(): ZoneEditorMode;
	getZone(): IZone;
}

export const ZoneEditorOpenEventName = 'zoneEditorOpen';

export class ZoneEditorOpenEvent implements IZoneEditorOpenEvent {
	constructor(
		private readonly zone: IZone,
		private readonly mode: ZoneEditorMode,
	) {}

	getEditorMode(): ZoneEditorMode {
		return this.mode;
	}

	getZone(): IZone {
		return this.zone;
	}
}
