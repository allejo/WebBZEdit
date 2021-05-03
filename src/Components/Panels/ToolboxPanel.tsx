import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { BaseObject } from '../../Document/Obstacles/BaseObject';
import {
  implementsIPositionable,
  IPositionable,
} from '../../Document/attributePartials';
import { documentState, selectionState } from '../../atoms';
import PositionableControls from '../ObstacleControls/PositionableControls';

const ToolboxPanel = () => {
  const bzwDocument = useRecoilValue(documentState);
  const selectedUUID = useRecoilValue(selectionState);

  const [selection, setSelection] = useState<BaseObject | null>(null);

  useEffect(() => {
    if (bzwDocument && selectedUUID) {
      setSelection(bzwDocument.objects[selectedUUID]);
    }
  }, [bzwDocument, selectedUUID]);

  const handlePositionableOnChange = (data: IPositionable) => {
    // const obj: BaseObject & IPositionable = Object.assign(
    //   null,
    //   selected,
    // );
    // obj.position = data.position;
    // obj.size = data.size;
    // obj.rotation = data.rotation;
  };

  return (
    <div className="d-flex p-3">
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
