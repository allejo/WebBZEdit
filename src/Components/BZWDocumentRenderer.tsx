import React from 'react';

import Base from '../3DModels/Base';
import Box from '../3DModels/Box';
import Pyramid from '../3DModels/Pyramid';
import { BZWDocument } from '../Document/BZWDocument';
import { Base as BZWBase } from '../Document/Obstacles/Base';
import { BaseObject } from '../Document/Obstacles/BaseObject';
import { Box as BZWBox } from '../Document/Obstacles/Box';
import { Pyramid as BZWPyramid } from '../Document/Obstacles/Pyramid';

interface Props {
  document: BZWDocument;
}

function handleOnClick(obstacle: any) {
  console.log(obstacle);
}

function obstacleToModel(obstacle: BaseObject): JSX.Element | null {
  if (obstacle instanceof BZWBox) {
    return (
      <Box key={obstacle.uuid} obstacle={obstacle} onClick={handleOnClick} />
    );
  } else if (obstacle instanceof BZWPyramid) {
    return (
      <Pyramid
        key={obstacle.uuid}
        obstacle={obstacle}
        onClick={handleOnClick}
      />
    );
  } else if (obstacle instanceof BZWBase) {
    return (
      <Base key={obstacle.uuid} obstacle={obstacle} onClick={handleOnClick} />
    );
  }

  return null;
}

const BZWDocumentRenderer = ({ document }: Props) => (
  <>
    {Object.values(document.objects).map((object) => obstacleToModel(object))}
  </>
);

export default BZWDocumentRenderer;
