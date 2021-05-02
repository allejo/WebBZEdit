import { atom } from 'recoil';

import { BZWDocument } from './Document/BZWDocument';

export const documentState = atom<BZWDocument | null>({
  key: 'document',
  default: null,
});

export const selectionState = atom<string | null>({
  key: 'selectedObject',
  default: null,
});
