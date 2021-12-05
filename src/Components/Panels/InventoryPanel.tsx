import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { IBaseObject } from '../../Document/Obstacles/BaseObject';
import { documentState, selectionState } from '../../atoms';
import TextField from '../Form/TextField';
import ObstacleSummary from './Inventory/ObstacleSummary';

import styles from './InventoryPanel.module.scss';

// https://stackoverflow.com/a/7557433
function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  const docEl = document.documentElement;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || docEl.clientHeight) &&
    rect.right <= (window.innerWidth || docEl.clientWidth)
  );
}

const InventoryPanel = () => {
  const bzwDocument = useRecoilValue(documentState);
  const [selection, setSelection] = useRecoilState(selectionState);
  const [searchTerm, setSearchTerm] = useState('');
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleOnClick = (event: MouseEvent, obstacle: IBaseObject) => {
    setSelection(obstacle._uuid);
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  const filterObjects = (object: IBaseObject) => {
    const displayName =
      object.name || `${object._objectType} ${object._uuid.substr(0, 8)}`;
    return displayName.includes(searchTerm);
  };

  // If the selection changes, scroll to the element in our inventory if it's
  // not in our current viewport.
  useEffect(() => {
    if (!selection) {
      return;
    }

    const ref = refs.current[selection];
    if (ref && !isElementInViewport(ref)) {
      ref.scrollIntoView();
    }
  }, [selection]);

  if (!bzwDocument) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <TextField
        label={'Obstacle Filter'}
        onChange={handleSearch}
        value={searchTerm}
        style={{ marginBottom: '10px' }}
        labelProps={{ style: { fontWeight: 'bold' } }}
      />
      {Object.values(bzwDocument.children)
        .filter((object) => object._objectType !== 'link')
        .filter(filterObjects)
        .map((object) => (
          // Don't display links on their own because they're displayed under the teleporters
          <ObstacleSummary
            key={object._uuid}
            ref={(el) => (refs.current[object._uuid] = el)}
            onClick={handleOnClick}
            obstacle={object}
            selected={object._uuid === selection}
          />
        ))}
    </div>
  );
};

export default InventoryPanel;
