import { nanoid } from 'nanoid';

export type EventBusCallback<T extends object> = (data: T) => void;
type EventBusInternalCallback<T> = (e: CustomEvent<T>) => void;

class EventBus {
	private callbacks: Record<string, EventBusInternalCallback<any>> = {};

	on<T extends object>(event: string, callback: EventBusCallback<T>): string {
		const id = nanoid(7);

		this.callbacks[id] = (e: CustomEvent<T>) => {
			callback(e.detail);
		};

		document.addEventListener(event, this.callbacks[id] as EventListener);

		return id;
	}

	dispatch<T extends {}>(event: string, data: T): void {
		document.dispatchEvent(new CustomEvent(event, { detail: data }));
	}

	remove(event: string, id: string): boolean {
		if (!this.callbacks[id]) {
			return false;
		}

		document.removeEventListener(event, this.callbacks[id] as EventListener);

		return true;
	}
}

const eventBus = new EventBus();
export default eventBus;
