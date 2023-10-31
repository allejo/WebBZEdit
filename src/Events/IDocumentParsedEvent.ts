import { IWorld } from '../Document/Obstacles/World';

export interface IDocumentParsedEvent {
	getWorld(): IWorld | null;
	setWorld(world: IWorld | null): void;
}

export const DocumentParsedEventName = 'worldDocumentLoaded';

/**
 * Event data in CustomEvents is recursively read-only disallowing reassignments
 * of its data. This is a workaround to allow event listeners to update the
 * world by having getters and setters to make changes.
 */
export class DocumentParsedEvent implements IDocumentParsedEvent {
	constructor(private world: IWorld | null = null) {}

	getWorld(): IWorld | null {
		return this.world;
	}

	setWorld(world: IWorld): void {
		this.world = world;
	}
}
