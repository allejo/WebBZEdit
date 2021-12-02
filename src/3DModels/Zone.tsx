import React from 'react';

import { IZone } from '../Document/Obstacles/Zone';
import SkinnableBox, { MaterialParams } from './Abstract/SkinnableBox';

interface Props {
  obstacle: IZone;
  isSelected: boolean;
  onClick: (obstacle: IZone) => void;
}

const Zone = ({ obstacle, isSelected, onClick }: Props) => {
  const { position, size, rotation = 0 } = obstacle;
  const handleOnClick = () => onClick(obstacle);

  const translucentMat: MaterialParams = {
    color: 'cyan',
    transparent: true,
    opacity: 0.4,
  };

  return (
    <SkinnableBox
      position={position}
      size={size}
      rotation={rotation}
      onClick={handleOnClick}
      isSelected={isSelected}
      topMaterial={translucentMat}
      botMaterial={translucentMat}
      xPosMaterial={translucentMat}
      xNegMaterial={translucentMat}
      yPosMaterial={translucentMat}
      yNegMaterial={translucentMat}
    />
  );
};

export default Zone;
export type { Props as IZoneProps };
