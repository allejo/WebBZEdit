import {
  faLongArrowAltRight,
  faLongArrowAltLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { forwardRef } from 'react';

import { IBaseObject } from '../../../Document/Obstacles/BaseObject';
import { ITeleporter } from '../../../Document/Obstacles/Teleporter';
import { TeleporterSide } from '../../../Document/Obstacles/TeleporterLink';

import styles from './ObstacleSummary.module.scss';

interface Props {
  object: IBaseObject;
}

const LinkSummary = forwardRef<HTMLDivElement, Props>(
  ({ object }: Props, ref) => {
    const tele = object as ITeleporter,
      frontLinks = tele._links.filter(
        (link) =>
          link.from.side !== TeleporterSide.Backward ||
          link.to.side !== TeleporterSide.Backward,
      ),
      backLinks = tele._links.filter(
        (link) =>
          link.from.side !== TeleporterSide.Forward ||
          link.to.side !== TeleporterSide.Forward,
      );

    return (
      <div>
        {['Front', 'Back'].map((side) => {
          const links = side === 'Front' ? frontLinks : backLinks;
          return (
            <div className={styles.links}>
              <div>{side}</div>
              <ul>
                {links.map((link, i) => {
                  const isFromTele = link.from.name === tele.name;
                  if (isFromTele) {
                    return (
                      <li key={`${tele.name}-link${i}`}>
                        <FontAwesomeIcon icon={faLongArrowAltRight} />{' '}
                        {link.to.name}:{link.to.side}
                      </li>
                    );
                  } else {
                    return (
                      <li key={`${tele.name}-link${i}`}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft} />{' '}
                        {link.from.name}:{link.from.side}
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  },
);

export default LinkSummary;
