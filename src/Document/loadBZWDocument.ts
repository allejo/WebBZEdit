import eventBus from '../EventBus';
import {
  IWorldDocumentLoadedEventData,
  WorldDocumentLoadedEvent,
  WorldDocumentLoadedEventName,
} from '../Events/WorldDocumentLoadedEvent';
import { IWorld } from './Obstacles/World';
import { parseBZWDocument } from './parseBZWDocument';

/**
 * A wrapper function around `parseBZWDocument()` with the exception that it
 * will dispatch related events that extensions can attach themselves to.
 *
 * @param content The raw BZW contents to be parsed
 */
export function loadBZWDocument(content: string): IWorld | null {
  const world = parseBZWDocument(content);
  const event = new WorldDocumentLoadedEvent(world);

  eventBus.dispatch<IWorldDocumentLoadedEventData>(
    WorldDocumentLoadedEventName,
    {
      data: event,
    },
  );

  return event.getWorld();
}
