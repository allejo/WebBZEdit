import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import Base from '../3DModels/Base';
import Box from '../3DModels/Box';
import Pyramid from '../3DModels/Pyramid';
import { Base as BZWBase } from '../Document/Obstacles/Base';
import { Box as BZWBox } from '../Document/Obstacles/Box';
import { Pyramid as BZWPyramid } from '../Document/Obstacles/Pyramid';
import { documentState, selectionState } from '../atoms';

function handleOnClick(uuid: string | null, setter: any) {
  return (obstacle: any) => {
    console.log(obstacle);
    setter(uuid);
  };
}

const BZWDocumentRenderer = () => {
  const [selection, setSelection] = useRecoilState(selectionState);
  const document = useRecoilValue(documentState);

  if (document === null) {
    return null;
  }

  return (
    <>
      {Object.values(document.objects).map((obstacle) => {
        const callback = handleOnClick(obstacle.uuid, setSelection);
        const isSelected = selection === obstacle.uuid;
        const props = {
          key: obstacle.uuid,
          onClick: callback,
          isSelected: isSelected,
        };

        if (obstacle instanceof BZWBox) {
          return <Box {...props} obstacle={obstacle} />;
        } else if (obstacle instanceof BZWPyramid) {
          return <Pyramid {...props} obstacle={obstacle} />;
        } else if (obstacle instanceof BZWBase) {
          return <Base {...props} obstacle={obstacle} />;
        }

        return null;
      })}
    </>
  );
};

export default BZWDocumentRenderer;
