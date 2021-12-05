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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleOnClick = (event: MouseEvent, obstacle: IBaseObject) => {
    setSelection(obstacle._uuid);
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const tokens: string[] = value.split(' ');
    const types: string[] = [];
    const terms: string[] = [];

    tokens.forEach((term) => {
      if (term.substring(0, 4) === 'type') {
        if (term.substring(5) !== '') {
          types.push(term.substring(5));
        }
      } else {
        if (term !== '') {
          terms.push(term);
        }
      }
    });

    setSearchTerms(terms);
    setFilterTypes(types);
  };

  const searchObjects = (object: IBaseObject) => {
    if (searchTerms.length !== 0) {
      const displayName =
        object.name || `${object._objectType} ${object._uuid.substr(0, 8)}`;
      return searchTerms.some((term) => displayName?.includes(term));
    }
    return true;
  };

  const filterObjectTypes = (object: IBaseObject) => {
    if (filterTypes.length !== 0) {
      return filterTypes.some(
        (type) => object._objectType === type && object._objectType !== 'link',
      );
    }
    return object._objectType !== 'link';
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
        .filter(searchObjects)
        .filter(filterObjectTypes)
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
