import produce from 'immer';

import {
  ITankModelObjectType,
  newITankModel,
} from '../Document/Obstacles/TankModel';
import eventBus from '../EventBus';
import {
  IWorldDocumentLoadedEventData,
  WorldDocumentLoadedEventName,
} from '../Events/WorldDocumentLoadedEvent';

eventBus.on<IWorldDocumentLoadedEventData>(
  WorldDocumentLoadedEventName,
  ({ data }) => {
    const world = data.getWorld();

    if (world) {
      const newWorld = produce(world, (draftWorld) => {
        draftWorld.children[ITankModelObjectType] = newITankModel();
      });

      data.setWorld(newWorld);
    }
  },
);
