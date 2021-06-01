import { faSave } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import React from 'react';
import { MenuStateReturn } from 'reakit/Menu';
import { useRecoilState } from 'recoil';

import {
  defaultFilePickerOptions,
  supportsFilesystemAPI,
} from '../../../../Utilities/filesystem';
import { fileHandleState } from '../../../../atoms';
import MenuItem from '../MenuItem';

interface Props extends MenuStateReturn {}

const SaveMapMenuItem = ({ ...menu }: Props) => {
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
    const bzwRaw = ''; // @TODO: Actually export the BZW document

    if (supportsFilesystemAPI()) {
      const fileHandle = await getFileHandle();
      const stream = await fileHandle.createWritable();

      await stream.write(bzwRaw);
      await stream.close();
    } else {
      const blob = new Blob([bzwRaw], {
        type: 'text/plain;charset=utf-8',
      });

      // TODO: Get a filename from the user somehow
      saveAs(blob, 'Untitled.bzw');
    }
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
