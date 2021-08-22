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
import {
  DocumentPreSavedEventName,
  IDocumentPreSavedEvent,
} from '../Events/IDocumentPreSavedEvent';

/*
 * The scale tank that appears in our editor is not part of the map file. Our
 * map parsing information will only handle actual BZW markup. Therefore, we
 * inject our tank model after the world document has been parsed.
 */
eventBus.on<IDocumentParsedEvent>(DocumentParsedEventName, (eventData) => {
  const world = eventData.getWorld();

  if (world) {
    const newWorld = produce(world, (draftWorld) => {
      draftWorld.children[ITankModelObjectType] = newITankModel();
    });

    eventData.setWorld(newWorld);
  }
});

/*
 * When we export the map to a BZW file, we should remove the scale tank so that
 * our BZW writer doesn't try to write markup for it.
 */
eventBus.on<IDocumentPreSavedEvent>(DocumentPreSavedEventName, (eventData) => {
  const world = eventData.getWorld();

  if (world) {
    const newWorld = produce(world, (draftWorld) => {
      delete draftWorld.children[ITankModelObjectType];
    });

    eventData.setWorld(newWorld);
  }
});
