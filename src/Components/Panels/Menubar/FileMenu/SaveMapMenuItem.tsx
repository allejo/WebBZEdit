import { faSave } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import React from 'react';
import { MenuStateReturn } from 'reakit/Menu';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { exportBZWDocument } from '../../../../Document/exportBZWDocument';
import {
  defaultFilePickerOptions,
  supportsFilesystemAPI,
} from '../../../../Utilities/filesystem';
import {
  documentState,
  fileHandleState,
  lastSaveState,
} from '../../../../atoms';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const SaveMapMenuItem = ({ ...menu }: Props) => {
  const document = useRecoilValue(documentState);
  const setLastSave = useSetRecoilState(lastSaveState);
  const [activeFileHandle, setActiveFileHandle] = useRecoilState(
    fileHandleState,
  );
  const getFileHandle = async (): Promise<FileSystemFileHandle> => {
    if (!supportsFilesystemAPI()) {
      throw new Error('FileHandles are not supported by this browser.');
    }

    if (activeFileHandle) {
      return activeFileHandle;
    }

    const fileHandle = await window.showSaveFilePicker(
      defaultFilePickerOptions(),
    );
    setActiveFileHandle(fileHandle);

    return fileHandle;
  };
  const handleMenuItemClick = async () => {
    // @TODO: Can our document state be null in this situation? Should we
    //    disable the Save button at that point?
    const bzwRaw = exportBZWDocument(document);

    if (supportsFilesystemAPI()) {
      try {
        const fileHandle = await getFileHandle();
        const stream = await fileHandle.createWritable();

        await stream.write(bzwRaw);
        await stream.close();
      } catch (e) {
        // If the user aborted the selection, disregard
        if (e.code === DOMException.ABORT_ERR) {
        }

        // @TODO: Handle other potential exception codes?
      }
    } else {
      const blob = new Blob([bzwRaw], {
        type: 'text/plain;charset=utf-8',
      });

      // TODO: Get a filename from the user somehow
      saveAs(blob, 'Untitled.bzw');
    }

    setLastSave(new Date());
  };

  return (
    <MenuItem
      {...menu}
      icon={faSave}
      shortcut={{ meta: true, key: 'S' }}
      onTrigger={handleMenuItemClick}
    >
      Save
    </MenuItem>
  );
};

export default SaveMapMenuItem;
