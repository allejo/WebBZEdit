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
      <ul className={styles.teleLinks}>
        {links.map((link) => (
          <li key={link._uuid} className={styles.teleLink}>
            {link.to.name} ({teleporterSideLiteral(link.to.side)})
          </li>
        ))}
      </ul>
    </div>
  );
};

interface Props {
  data: ITeleporter;
  onChange: (changes: ITeleporter) => void;
}

const TeleporterControl = ({ data }: Props) => {
  const world = useRecoilValue(documentState);
  const [frontLinks, backLinks] = useMemo(() => {
    const front: ITeleporterLink[] = [],
      back: ITeleporterLink[] = [];

    for (const linkUUID of data._links) {
      const link = world?.children[linkUUID] as ITeleporterLink;

      if (link.from.name !== data.name) {
        continue;
      }

      if (link.from.side === TeleporterSide.Forward) {
        front.push(link);
      } else if (link.from.side === TeleporterSide.Backward) {
        back.push(link);
      } else {
        front.push(link);
        back.push(link);
      }
    }

    return [front, back];
  }, [data._links, data.name, world?.children]);
  const handleOpenEditor = () => {
    const eventData = new TeleLinkEditorOpenEvent(data, frontLinks, backLinks);
    eventBus.dispatch(TeleLinkEditorOpenEventName, eventData);
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
        <div className="row">
          <LinkRenderer title="Front" links={frontLinks} />
          <LinkRenderer title="Back" links={backLinks} />
        </div>
      </div>
    </section>
  );
};

export default TeleporterControl;
export type { Props as ITeleporterControlProps };
