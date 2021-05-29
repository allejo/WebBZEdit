import React, { useRef } from 'react';
import { MenuItem, MenuStateReturn } from 'reakit/Menu';
import { useSetRecoilState } from 'recoil';

import { parseBZWDocument } from '../../../../Document/parseBZWDocument';
import { documentState } from '../../../../atoms';

interface Props {
  menu: MenuStateReturn;
}

const OpenMapMenuItem = ({ menu }: Props) => {
  const setDocument = useSetRecoilState(documentState);
  const supportsFileSystem = typeof window.showOpenFilePicker !== 'undefined';
  const inputRef = useRef<HTMLInputElement>(null);

  const handleWorldFileContents = (contents: string) => {
    setDocument(parseBZWDocument(contents));
  };

  const handleMenuItemClick = async () => {
    if (supportsFileSystem) {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'BZFlag World File',
            accept: { 'text/plain': ['.bzw'] },
          },
        ],
      });
      const file = await fileHandle.getFile();
      handleWorldFileContents(await file.text());
    } else if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleLegacyFileInputClick = () => {
    if (!inputRef.current?.files) {
      return;
    }

    const files = inputRef.current.files;

    if (files.length !== 1) {
      // @TODO Throw an error here
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      handleWorldFileContents(reader.result as string);
    });
    reader.addEventListener('error', () => {
      // @TODO Throw an error on here
    });
    reader.readAsText(files[0]);
  };

  return (
    <MenuItem {...menu} onClick={handleMenuItemClick}>
      Open Map
      {!supportsFileSystem && (
        <input
          ref={inputRef}
          type="file"
          accept=".bzw"
          style={{ display: 'none' }}
          onChange={handleLegacyFileInputClick}
        />
      )}
    </MenuItem>
  );
};

export default OpenMapMenuItem;
