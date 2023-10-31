import { ITeleporter } from '../Document/Obstacles/Teleporter';
import { ITeleporterLink } from '../Document/Obstacles/TeleporterLink';

export interface ITeleLinkEditorOpenEvent {
	getTeleporter(): ITeleporter;
	getTeleporterLinks(): string[];
	getFrontTeleporterLinks(): ITeleporterLink[];
	getBackTeleporterLinks(): ITeleporterLink[];
}

export const TeleLinkEditorOpenEventName = 'teleLinkEditorOpen';

export class TeleLinkEditorOpenEvent implements ITeleLinkEditorOpenEvent {
	constructor(
		private readonly teleporter: ITeleporter,
		private readonly frontLinks: ITeleporterLink[],
		private readonly backLinks: ITeleporterLink[],
	) {}

	getTeleporter(): ITeleporter {
		return this.teleporter;
	}

	getTeleporterLinks(): string[] {
		return this.teleporter._links;
	}

	getFrontTeleporterLinks(): ITeleporterLink[] {
		return this.frontLinks;
	}

	getBackTeleporterLinks(): ITeleporterLink[] {
		return this.backLinks;
	}
}
