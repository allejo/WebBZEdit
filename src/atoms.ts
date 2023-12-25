import { atom, selector } from 'recoil';

import { ITeleporter } from './Document/Obstacles/Teleporter';
import { ITeleporterLink } from './Document/Obstacles/TeleporterLink';
import { IWorld } from './Document/Obstacles/World';

export const bzwViewState = atom<boolean>({ key: 'bzwView', default: false });

export const documentState = atom<IWorld | null>({
	key: 'document',
	default: null,
});

/**
 * A map of Teleporter names to their respective UUIDs
 */
export const documentTeles = selector<Record<string, string>>({
	key: 'documentTeleporters',
	get: ({ get }) => {
		const world = get(documentState);

		if (!world) {
			return {};
		}

		const teleporters = world._teleporters;
		const entries: Record<string, string> = {};

		for (const teleUUID of teleporters) {
			const teleporter = world.children[teleUUID] as ITeleporter;

			if (!teleporter) {
				continue;
			}

			entries[teleporter.name] = teleUUID;
		}

		return entries;
	},
});

export interface LinkToTeleRef {
	teleUUID: string;
}

export const documentLinks = selector<Record<string, LinkToTeleRef>>({
	key: 'documentLinks',
	get: ({ get }) => {
		const world = get(documentState);

		if (!world) {
			return {};
		}

		const teleMap = get(documentTeles);
		const entries: Record<string, LinkToTeleRef> = {};

		for (const teleUUID of world._teleporters) {
			const teleporter = world.children[teleUUID] as ITeleporter;

			for (const linkUUID of teleporter._links) {
				const link = world.children[linkUUID] as ITeleporterLink;

				entries[linkUUID] = {
					teleUUID: teleMap[link.from.name],
				};
			}
		}

		return entries;
	},
});

export const fileHandleState = atom<FileSystemFileHandle | null>({
	key: 'fileHandle',
	default: null,
});

export const lastSaveState = atom<Date | null>({
	key: 'lastSave',
	default: null,
});

export const selectionState = atom<string | null>({
	key: 'selectedObject',
	default: null,
});
