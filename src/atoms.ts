import { atom } from 'recoil';

import { IWorld } from './Document/Obstacles/World';

export const documentState = atom<IWorld | null>({
  key: 'document',
  default: null,
});

export const fileHandleState = atom<FileSystemFileHandle | null>({
  key: 'fileHandle',
  default: null,
});

export const selectionState = atom<string | null>({
  key: 'selectedObject',
  default: null,
});
