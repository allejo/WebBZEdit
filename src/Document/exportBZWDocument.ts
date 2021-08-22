import eventBus from '../EventBus';
import {
  DocumentPostSavedEvent,
  DocumentPostSavedEventName,
  IDocumentPostSavedEvent,
} from '../Events/IDocumentPostSavedEvent';
import {
  DocumentPreSavedEvent,
  DocumentPreSavedEventName,
  IDocumentPreSavedEvent,
} from '../Events/IDocumentPreSavedEvent';
import { IWorld } from './Obstacles/World';
import { writeBZWDocument } from './writeBZWDocument';

/**
 * A wrapper function around `writeBZWDocument()` that will dispatch related
 * events for plugins to hook into.
 *
 * @param world
 */
export function exportBZWDocument(world: IWorld | null): string {
  const preSaveEvent = new DocumentPreSavedEvent(world);

  eventBus.dispatch<IDocumentPreSavedEvent>(
    DocumentPreSavedEventName,
    preSaveEvent,
  );

  const updatedWorld = preSaveEvent.getWorld();
  const rawWorld = updatedWorld ? writeBZWDocument(updatedWorld) : '';

  const postSaveEvent = new DocumentPostSavedEvent(rawWorld);

  eventBus.dispatch<IDocumentPostSavedEvent>(
    DocumentPostSavedEventName,
    postSaveEvent,
  );

  return postSaveEvent.getRawWorld();
}
