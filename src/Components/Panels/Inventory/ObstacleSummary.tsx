import React from 'react';

import { BaseObject } from '../../../Document/Obstacles/BaseObject';

import thumbBase from '../../../assets/thumb_base.png';
import thumbBox from '../../../assets/thumb_box.png';
import thumbPyramid from '../../../assets/thumb_pyramid.png';
import styles from './ObstacleSummary.module.scss';

interface Props {
  obstacle: BaseObject;
}

const obstacleThumbs: Record<string, string> = {
  base: thumbBase,
  box: thumbBox,
  pyramid: thumbPyramid,
};

function getThumbnail(type: string): JSX.Element {
  if (obstacleThumbs[type]) {
    return (
      <img
        className={styles.thumbnail}
        src={obstacleThumbs[type]}
        alt={`${type} thumbnail`}
      />
    );
  }

  return <span className={styles.empty} />;
}

const ObstacleSummary = ({ obstacle }: Props) => (
  <div className={styles.wrapper}>
    <div>{getThumbnail(obstacle.objectType)}</div>
    <div className={styles.body}>
      {obstacle.name ?? `${obstacle.objectType} ${obstacle.uuid.substr(0, 8)}`}
    </div>
  </div>
);

export default ObstacleSummary;
