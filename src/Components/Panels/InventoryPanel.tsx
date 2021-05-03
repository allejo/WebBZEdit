import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { documentState, selectionState } from '../../atoms';
import ObstacleSummary from './Inventory/ObstacleSummary';

import styles from './InventoryPanel.module.scss';

const InventoryPanel = () => {
  const bzwDocument = useRecoilValue(documentState);
  const [selection, setSelection] = useRecoilState(selectionState);

  if (!bzwDocument) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {Object.values(bzwDocument?.objects).map((object) => {
        return <ObstacleSummary key={object.uuid} obstacle={object} />;
      })}
    </div>
  );
};

export default InventoryPanel;
