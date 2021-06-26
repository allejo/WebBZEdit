import {
  faLongArrowAltRight,
  faLongArrowAltLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { IBaseObject } from '../../../Document/Obstacles/BaseObject';
import { ITeleporter } from '../../../Document/Obstacles/Teleporter';
import { TeleporterSide } from '../../../Document/Obstacles/TeleporterLink';

import styles from './ObstacleSummary.module.scss';

interface Props {
  object: IBaseObject;
}

const LinkSummary = ({ object }: Props) => {
  const tele = object as ITeleporter;
  const frontLinks = tele._links.filter(
    (link) =>
      link.from.side !== TeleporterSide.Backward ||
      link.to.side !== TeleporterSide.Backward,
  );
  const backLinks = tele._links.filter(
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
                const teleRef = isFromTele ? link.to : link.from;
                const icon = isFromTele
                  ? faLongArrowAltRight
                  : faLongArrowAltLeft;

                return (
                  <li key={`${tele.name}-link${i}`}>
                    <FontAwesomeIcon icon={icon} /> {teleRef.name}:
                    {teleRef.side}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default LinkSummary;
