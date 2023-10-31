import { IWorld } from '../Document/Obstacles/World';

export interface IDocumentPreSavedEvent {
	getWorld(): IWorld | null;
	setWorld(world: IWorld | null): void;
}

export const DocumentPreSavedEventName = 'worldDocumentPreSave';

export class DocumentPreSavedEvent implements IDocumentPreSavedEvent {
	constructor(private world: IWorld | null = null) {}

	getWorld(): IWorld | null {
		return this.world;
	}

	setWorld(world: IWorld): void {
		this.world = world;
	}
}
