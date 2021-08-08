import eventBus from '../EventBus';
import {
  IDocumentParsedEvent,
  WorldEditor,
  DocumentParsedEventName,
} from '../Events/IDocumentParsedEvent';
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
  const event = new WorldEditor(world);

  eventBus.dispatch<IDocumentParsedEvent>(DocumentParsedEventName, {
    worldEditor: event,
  });

  return event.getWorld();
}
