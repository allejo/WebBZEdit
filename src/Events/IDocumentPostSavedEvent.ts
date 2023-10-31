export interface IDocumentPostSavedEvent {
	getRawWorld(): string;
	setRawWorld(world: string): void;
}

export const DocumentPostSavedEventName = 'worldDocumentPostSave';

export class DocumentPostSavedEvent implements IDocumentPostSavedEvent {
	constructor(private rawWorld: string) {}

	getRawWorld(): string {
		return this.rawWorld;
	}

	setRawWorld(text: string): void {
		this.rawWorld = text;
	}
}
