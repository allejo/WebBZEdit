import { ITeleporter } from '../Document/Obstacles/Teleporter';
import { ITeleporterLink } from '../Document/Obstacles/TeleporterLink';

export interface ITeleLinkEditorOpenEvent {
  getTeleporter(): ITeleporter;
  getTeleporterLinks(): ITeleporterLink[];
}

export const TeleLinkEditorOpenEventName = 'teleLinkEditorOpen';

export class TeleLinkEditorOpenEvent implements ITeleLinkEditorOpenEvent {
  constructor(private teleporter: ITeleporter) {}

  getTeleporter(): ITeleporter {
    return this.teleporter;
  }

  getTeleporterLinks(): ITeleporterLink[] {
    return this.teleporter._links;
  }
}
