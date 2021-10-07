import {
  faLongArrowAltRight,
  faLongArrowAltLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { IBaseObject } from '../../../Document/Obstacles/BaseObject';
import { ITeleporter } from '../../../Document/Obstacles/Teleporter';
import {
  ITeleporterLink,
  TeleporterSide,
} from '../../../Document/Obstacles/TeleporterLink';
import { documentState } from '../../../atoms';

import styles from './ObstacleSummary.module.scss';

interface Props {
  object: IBaseObject;
}

const LinkSummary = ({ object }: Props) => {
  const world = useRecoilValue(documentState);

  const tele = object as ITeleporter;
  const frontLinks = tele._links.filter((uuid) => {
    const link = world?.children[uuid] as ITeleporterLink;

    return (
      link.from.side !== TeleporterSide.Backward ||
      link.to.side !== TeleporterSide.Backward
    );
  });
  const backLinks = tele._links.filter((uuid) => {
    const link = world?.children[uuid] as ITeleporterLink;

    return (
      link.from.side !== TeleporterSide.Forward ||
      link.to.side !== TeleporterSide.Forward
    );
  });

  return (
    <div>
      {['Front', 'Back'].map((side) => {
        const links = side === 'Front' ? frontLinks : backLinks;
        return (
          <div className={styles.links} key={side}>
            <div>{side}</div>
            <ul>
              {links.map((uuid, i) => {
                const link = world?.children[uuid] as ITeleporterLink;
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
