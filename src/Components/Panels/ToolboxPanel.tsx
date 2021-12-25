import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  implementsIPassableObject,
  IPassableObject,
} from '../../Document/Attributes/IPassableObject';
import { implementsISizeable } from '../../Document/Attributes/ISizeable';
import { IBase } from '../../Document/Obstacles/Base';
import { IBaseObject } from '../../Document/Obstacles/BaseObject';
import { IPyramid } from '../../Document/Obstacles/Pyramid';
import { ITeleporter } from '../../Document/Obstacles/Teleporter';
import { IZone } from '../../Document/Obstacles/Zone';
import { documentState, selectionState } from '../../atoms';
import AlterableControl, {
  IAlterableControlDataType,
  canUseAlterableControlToolbox,
} from './Toolbox/AlterableControl';
import BaseControl from './Toolbox/BaseControl';
import PassabilityControl from './Toolbox/PassabilityControl';
import PyramidControl from './Toolbox/PyramidControl';
import TeleporterControl from './Toolbox/TeleporterControl';
import ZoneControl from './Toolbox/ZoneControl';

import styles from './ToolboxPanel.module.scss';

const ToolboxPanel = () => {
  const [world, setBZWDocument] = useRecoilState(documentState);
  const selectedUUID = useRecoilValue(selectionState);

  const [selection, setSelection] = useState<IBaseObject | null>(null);

  useEffect(() => {
    if (!world) {
      return;
    }

    setSelection(selectedUUID ? world.children[selectedUUID] : null);
  }, [world, selectedUUID]);

  const handleAlterableOnChange = (data: IAlterableControlDataType) => {
    if (!world || !selectedUUID) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const obstacle: IAlterableControlDataType = draftWorld.children[
        selectedUUID
      ] as any;

      obstacle.position = data.position;
      obstacle.rotation = data.rotation;

      if (implementsISizeable(obstacle) && implementsISizeable(data)) {
        obstacle.size = data.size;
      }
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

  const handleBaseOnChange = (data: IBase) => {
    if (!world || !selectedUUID) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const obstacle: IBase = draftWorld.children[selectedUUID] as any;

      obstacle.color = data.color;
    });

    setBZWDocument(nextWorld);
  };

  const handleZoneOnChange = (data: IZone) => {
    if (!world || !selectedUUID) {
      return;
    }

    const nextWorld = produce(world, (draftWorld) => {
      const obstacle: IZone = draftWorld.children[selectedUUID] as any;

      obstacle.team = data.team;
      obstacle.safety = data.safety;
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
      {selection && canUseAlterableControlToolbox(selection) && (
        <AlterableControl data={selection} onChange={handleAlterableOnChange} />
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
      {selection && selection._objectType === 'base' && (
        <BaseControl data={selection as IBase} onChange={handleBaseOnChange} />
      )}
      {selection && selection._objectType === 'teleporter' && (
        <TeleporterControl data={selection as ITeleporter} />
      )}
      {selection && selection._objectType === 'zone' && (
        <ZoneControl data={selection as IZone} onChange={handleZoneOnChange} />
      )}
    </div>
  );
};

export default ToolboxPanel;
