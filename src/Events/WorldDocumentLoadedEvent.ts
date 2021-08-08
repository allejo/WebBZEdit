import { IWorld } from '../Document/Obstacles/World';

export interface IWorldDocumentLoadedEventData {
  data: WorldDocumentLoadedEvent;
}

export const WorldDocumentLoadedEventName = 'worldDocumentLoaded';

export class WorldDocumentLoadedEvent {
  constructor(private world: IWorld | null = null) {}

  getWorld(): IWorld | null {
    return this.world;
  }

  setWorld(world: IWorld): void {
    this.world = world;
  }
}
