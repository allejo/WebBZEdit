import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { ITeleporter } from '../../../Document/Obstacles/Teleporter';
import {
  ITeleporterLink,
  TeleporterSide,
  teleporterSideLiteral,
} from '../../../Document/Obstacles/TeleporterLink';
import {
  TeleLinkEditorOpenEvent,
  TeleLinkEditorOpenEventName,
} from '../../../Events/ITeleLinkEditorOpenEvent';
import eventBus from '../../../Utilities/EventBus';
import { classList } from '../../../Utilities/cssClasses';
import { documentState } from '../../../atoms';
import Button from '../../Button';

import styles from './TeleporterControl.module.scss';

interface LinkRendererProps {
  title: string;
  links: ITeleporterLink[];
}

const LinkRenderer = ({ title, links: teleLinks }: LinkRendererProps) => {
  const links = useMemo(
    () => teleLinks.sort((a, b) => a.to.name.localeCompare(b.to.name)),
    [teleLinks],
  );

  return (
    <div className="col-6">
      <h3 className={styles.linkListHeader}>{title}</h3>

      {links.length === 0 ? (
        <span className={styles.noLinks}>No Links</span>
      ) : (
        <ul className={styles.teleLinks}>
          {links.map((link) => (
            <li key={link._uuid} className={styles.teleLink}>
              {link.to.name} ({teleporterSideLiteral(link.to.side)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface Props {
  data: ITeleporter;
}

const TeleporterControl = ({ data }: Props) => {
  const world = useRecoilValue(documentState);

  const frontLinks: ITeleporterLink[] = [];
  const backLinks: ITeleporterLink[] = [];

  for (const linkUUID of data._links) {
    const link = world?.children[linkUUID] as ITeleporterLink;

    if (link === undefined || link.from.name !== data.name) {
      continue;
    }

    if (link.from.side === TeleporterSide.Forward) {
      frontLinks.push(link);
    } else if (link.from.side === TeleporterSide.Backward) {
      backLinks.push(link);
    } else {
      frontLinks.push(link);
      backLinks.push(link);
    }
  }

  const handleOpenEditor = () => {
    eventBus.dispatch(
      TeleLinkEditorOpenEventName,
      new TeleLinkEditorOpenEvent(data, frontLinks, backLinks),
    );
  };

  return (
    <section>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Teleporter Links</h2>
          <Button
            type="info"
            className={styles.editButton}
            onClick={handleOpenEditor}
          >
            Edit
          </Button>
        </div>
        <div className={classList([styles.linkList, 'row'])}>
          <LinkRenderer title="Front" links={frontLinks} />
          <LinkRenderer title="Back" links={backLinks} />
        </div>
      </div>
    </section>
  );
};

export default TeleporterControl;
export type { Props as ITeleporterControlProps };
