import produce from 'immer';

import {
  ITankModelObjectType,
  newITankModel,
} from '../Document/Obstacles/TankModel';
import eventBus from '../EventBus';
import {
  IDocumentParsedEvent,
  DocumentParsedEventName,
} from '../Events/IDocumentParsedEvent';

/*
 * The scale tank that appears in our editor is not part of the map file. Our
 * map parsing information will only handle actual BZW markup. Therefore, we
 * inject our tank model after the world document has been parsed.
 */
eventBus.on<IDocumentParsedEvent>(
  DocumentParsedEventName,
  ({ worldEditor }) => {
    const world = worldEditor.getWorld();

    if (world) {
      const newWorld = produce(world, (draftWorld) => {
        draftWorld.children[ITankModelObjectType] = newITankModel();
      });

      worldEditor.setWorld(newWorld);
    }
  },
);
