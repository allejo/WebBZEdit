import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import Base from '../../../3DModels/Base';
import Box from '../../../3DModels/Box';
import Ground from '../../../3DModels/Ground';
import Pyramid from '../../../3DModels/Pyramid';
import Tank from '../../../3DModels/Tank';
import Teleporter from '../../../3DModels/Teleporter';
import WorldBorder from '../../../3DModels/WorldBorder';
import { IBase } from '../../../Document/Obstacles/Base';
import { IBox } from '../../../Document/Obstacles/Box';
import { IPyramid } from '../../../Document/Obstacles/Pyramid';
import {
  ITankModel,
  ITankModelObjectType,
} from '../../../Document/Obstacles/TankModel';
import { ITeleporter } from '../../../Document/Obstacles/Teleporter';
import { documentState, selectionState } from '../../../atoms';

function handleOnClick(uuid: string | null, setter: any) {
  return () => setter(uuid);
}

const BZWDocumentRenderer = () => {
  const [selection, setSelection] = useRecoilState(selectionState);
  const document = useRecoilValue(documentState);

  if (document === null) {
    return null;
  }

  return (
    <>
      {Object.values(document.children).map((obstacle) => {
        const callback = handleOnClick(obstacle._uuid, setSelection);
        const props = {
          key: obstacle._uuid,
          onClick: callback,
          isSelected: selection === obstacle._uuid,
        };

        if (obstacle._objectType === ITankModelObjectType) {
          return <Tank {...props} configuration={obstacle as ITankModel} />;
        } else if (obstacle._objectType === 'box') {
          return <Box {...props} obstacle={obstacle as IBox} />;
        } else if (obstacle._objectType === 'pyramid') {
          return <Pyramid {...props} obstacle={obstacle as IPyramid} />;
        } else if (obstacle._objectType === 'base') {
          return <Base {...props} obstacle={obstacle as IBase} />;
        } else if (obstacle._objectType === 'teleporter') {
          return <Teleporter {...props} obstacle={obstacle as ITeleporter} />;
        }

        return null;
      })}
      <Ground worldSize={document.size} />
      <WorldBorder wallHeight={6.15} worldSize={document.size} />
    </>
  );
};

export default BZWDocumentRenderer;
