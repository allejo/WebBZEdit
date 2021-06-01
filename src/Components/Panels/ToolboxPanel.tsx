import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  implementsIPassableObject,
  IPassableObject,
} from '../../Document/Attributes/IPassableObject';
import {
  implementsIPositionable,
  IPositionable,
} from '../../Document/Attributes/IPositionable';
import { IBaseObject } from '../../Document/Obstacles/BaseObject';
import { IPyramid } from '../../Document/Obstacles/Pyramid';
import { documentState, selectionState } from '../../atoms';
import PassabilityControl from './Toolbox/PassabilityControl';
import PositionableControl from './Toolbox/PositionableControl';
import PyramidControl from './Toolbox/PyramidControl';

import styles from './ToolboxPanel.module.scss';

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
      const obstacle: IPassableObject = draftWorld.children[
        selectedUUID
      ] as any;

      obstacle.drivethrough = data.drivethrough;
      obstacle.shootthrough = data.shootthrough;
    });

    setBZWDocument(nextWorld);
  };

  const handlePyramidOnChange = (data: IPyramid) => {
    if (!world || !selectedUUID) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const obstacle: IPyramid = draftWorld.children[selectedUUID] as any;

      obstacle.flipz = data.flipz;
    });

    setBZWDocument(nextWorld);
  };

  if (!selection) {
    return (
      <div className={styles.noSelectionContainer}>
        Select an object to edit
      </div>
    );
  }

  return (
    <div className={styles.toolContainer}>
      {selection && implementsIPositionable(selection) && (
        <PositionableControl
          data={selection}
          onChange={handlePositionableOnChange}
        />
      )}
      {selection && implementsIPassableObject(selection) && (
        <PassabilityControl
          data={selection}
          onChange={handlePassabilityOnChange}
        />
      )}
      {selection && selection._objectType === 'pyramid' && (
        <PyramidControl
          data={selection as IPyramid}
          onChange={handlePyramidOnChange}
        />
      )}
    </div>
  );
};

export default ToolboxPanel;
