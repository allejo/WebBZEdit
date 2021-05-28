import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import Base from '../3DModels/Base';
import Box from '../3DModels/Box';
import Pyramid from '../3DModels/Pyramid';
import { IBase } from '../Document/Obstacles/Base';
import { IBox } from '../Document/Obstacles/Box';
import { IPyramid } from '../Document/Obstacles/Pyramid';
import { documentState, selectionState } from '../atoms';

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

        if (obstacle._objectType === 'box') {
          return <Box {...props} obstacle={obstacle as IBox} />;
        } else if (obstacle._objectType === 'pyramid') {
          return <Pyramid {...props} obstacle={obstacle as IPyramid} />;
        } else if (obstacle._objectType === 'base') {
          return <Base {...props} obstacle={obstacle as IBase} />;
        }

        return null;
      })}
    </>
  );
};

export default BZWDocumentRenderer;
