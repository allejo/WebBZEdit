import React, { MouseEvent, forwardRef } from 'react';

import { IBaseObject } from '../../../Document/Obstacles/BaseObject';

import thumbBase from '../../../assets/thumb_base.png';
import thumbBox from '../../../assets/thumb_box.png';
import thumbPyramid from '../../../assets/thumb_pyramid.png';
import styles from './ObstacleSummary.module.scss';

interface Props {
  obstacle: IBaseObject;
  onClick: (event: MouseEvent, obstacle: IBaseObject) => void;
  selected: boolean;
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

const ObstacleSummary = forwardRef<HTMLDivElement, Props>(
  ({ obstacle, onClick, selected }: Props, ref) => {
    const displayName =
      obstacle.name ?? `${obstacle._objectType} ${obstacle._uuid.substr(0, 8)}`;

    return (
      <div
        ref={ref}
        className={`${styles.wrapper} ${selected && styles.selected}`}
        onClick={(event) => onClick(event, obstacle)}
      >
        <div>{getThumbnail(obstacle._objectType)}</div>
        <div className={styles.body}>{displayName}</div>
      </div>
    );
  },
);

export default ObstacleSummary;
