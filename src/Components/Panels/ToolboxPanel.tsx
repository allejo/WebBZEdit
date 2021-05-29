import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  implementsIPositionable,
  IPositionable,
} from '../../Document/Attributes/IPositionable';
import { IBaseObject } from '../../Document/Obstacles/BaseObject';
import { documentState, selectionState } from '../../atoms';
import PositionableControls from './Toolbox/PositionableControls';

import styles from './ToolboxPanel.module.scss';
import { implementsIPassableObject, IPassableObject } from '../../Document/Attributes/IPassableObject';
import PassabilityControls from './Toolbox/PassabilityControl';

const ToolboxPanel = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const selectedUUID = useRecoilValue(selectionState);

  const [selection, setSelection] = useState<IBaseObject | null>(null);

  useEffect(() => {
    if (world && selectedUUID) {
      setSelection(world.children[selectedUUID]);
    }
  }, [world, selectedUUID]);

  const handlePositionableOnChange = (data: IPositionable) => {
    if (!world || !selectedUUID) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const obstacle: IPositionable = draftWorld.children[selectedUUID] as any;

      obstacle.position = data.position;
      obstacle.size = data.size;
      obstacle.rotation = data.rotation;
    });

    setBZWDocument(nextWorld);
  };

  const handlePassabilityOnChange = (data: IPassableObject) => {
    if (!world || !selectedUUID) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const obstacle: IPassableObject = draftWorld.children[selectedUUID] as any;

      obstacle.drivethrough = data.drivethrough;
      obstacle.shootthrough = data.shootthrough;
      obstacle.passable = data.passable;
    });

    setBZWDocument(nextWorld);
  }

  if (!selection) {
    return (
      <div className={styles.noSelectionContainer}>
        Select an object to edit
      </div>
    );
  }

  return (
    <div className={styles.toolContainer}>
      {selection && implementsIPassableObject(selection) && (
        <PassabilityControls
          data={selection}
          onChange={handlePassabilityOnChange}
        />
      )}
      {selection && implementsIPositionable(selection) && (
        <PositionableControls
          data={selection}
          onChange={handlePositionableOnChange}
        />
      )}
    </div>
  );
};

export default ToolboxPanel;
