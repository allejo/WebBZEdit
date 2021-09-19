import { faTrash, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useDialogState } from 'reakit';

import {
  ITeleporterLink,
  teleporterSideLiteral,
} from '../../Document/Obstacles/TeleporterLink';
import {
  TeleLinkEditorOpenEvent,
  TeleLinkEditorOpenEventName,
} from '../../Events/ITeleLinkEditorOpenEvent';
import { classList } from '../../Utilities/cssClasses';
import Alert, { AlertType } from '../Alert';
import Button from '../Button';
import ListenerModal from '../ListenerModal';
import { Tab, TabList } from '../TabList';

import alternatingStyles from '../../sass/alternatingGrid.module.scss';
import styles from './TeleporterLinkEditorModal.module.scss';

interface LinkListItemProps {
  link: ITeleporterLink;
  isDeleted: boolean;
  onDelete: (uuid: string) => void;
  onRestore: (uuid: string) => void;
}

const LinkListItem = ({
  link,
  isDeleted,
  onDelete,
  onRestore,
}: LinkListItemProps) => {
  const onButtonClick = () => {
    isDeleted ? onRestore(link._uuid) : onDelete(link._uuid);
  };

  return (
    <li
      key={link._uuid}
      className={classList([styles.linkListItem, alternatingStyles.listItem])}
    >
      <span className={classList([[styles.deletedItem, isDeleted]])}>
        {link.to.name} ({teleporterSideLiteral(link.to.side)})
      </span>
      <Button
        type={isDeleted ? 'success' : 'danger'}
        onClick={onButtonClick}
        className={styles.deleteButton}
      >
        <FontAwesomeIcon
          fixedWidth={true}
          icon={isDeleted ? faTrashRestore : faTrash}
        />
      </Button>
    </li>
  );
};

interface LinkEditorProps {
  links: ITeleporterLink[];
}

const LinkEditor = ({ links }: LinkEditorProps) => {
  const [linksToDelete, setLinksToDelete] = useState<string[]>([]);

  const handleDeletion = (uuid: string) => {
    setLinksToDelete([...linksToDelete, uuid]);
  };
  const handleRestore = (uuid: string) => {
    const links = [...linksToDelete];
    delete links[links.indexOf(uuid)];

    setLinksToDelete(links);
  };

  return (
    <ul className={classList([styles.linkList, alternatingStyles.container])}>
      {links.map((link) => (
        <LinkListItem
          isDeleted={linksToDelete.indexOf(link._uuid) >= 0}
          link={link}
          onDelete={handleDeletion}
          onRestore={handleRestore}
        />
      ))}
    </ul>
  );
};

const TeleporterLinkEditorModal = () => {
  const dialog = useDialogState();

  return (
    <ListenerModal<TeleLinkEditorOpenEvent>
      dialog={dialog}
      event={TeleLinkEditorOpenEventName}
      title="Teleporter Link Editor"
      hideOnClickOutside={false}
      hideOnEsc={false}
    >
      {(eventData) => {
        if (!eventData) {
          return (
            <Alert type={AlertType.Danger} header="Modal Open Error">
              This modal was opened without any event data. Please report this
              as a bug.
            </Alert>
          );
        }

        const teleporter = eventData.getTeleporter();
        const frontLinks = eventData.getFrontTeleporterLinks();
        const backLinks = eventData.getBackTeleporterLinks();

        return (
          <>
            <p>
              <strong>Teleporter:</strong> {teleporter.name}
            </p>
            <TabList aria-label="Teleporter Sides">
              <Tab title="Front side">
                <LinkEditor links={frontLinks} />
              </Tab>
              <Tab title="Back side">
                <LinkEditor links={backLinks} />
              </Tab>
            </TabList>
          </>
        );
      }}
    </ListenerModal>
  );
};

export default TeleporterLinkEditorModal;
