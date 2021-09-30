import {
  faPlus,
  faSave,
  faTrash,
  faTrashRestore,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import produce from 'immer';
import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDialogState } from 'reakit';
import { useRecoilState } from 'recoil';

import { ITeleporter } from '../../Document/Obstacles/Teleporter';
import {
  ITeleporterLink,
  newITeleporterLink,
  TeleporterSide,
  teleporterSideLiteral,
} from '../../Document/Obstacles/TeleporterLink';
import { WorldEditorHelper } from '../../Document/Utilities/WorldEditorHelper';
import {
  TeleLinkEditorOpenEvent,
  TeleLinkEditorOpenEventName,
} from '../../Events/ITeleLinkEditorOpenEvent';
import { classList } from '../../Utilities/cssClasses';
import { documentState } from '../../atoms';
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

interface LinkListItemAdderProps {
  onAdd: (link: ITeleporterLink) => void;
  side: TeleporterSide;
  teleporter: ITeleporter;
  teleporters: ITeleporter[];
}

const LinkListItemAdder = ({
  onAdd,
  side,
  teleporter,
  teleporters,
}: LinkListItemAdderProps) => {
  const [teleporterName, setTeleporterName] = useState('');
  const [teleSide, setTeleSide] = useState<TeleporterSide>(
    TeleporterSide.Forward,
  );

  const handleTeleNameChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setTeleporterName(event.currentTarget.name);
  };
  const handleTeleSideChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setTeleSide(event.currentTarget.name as TeleporterSide);
  };
  const handleOnClick = () => {
    onAdd({
      ...newITeleporterLink(),
      from: {
        name: teleporter.name!,
        side: side,
      },
      to: {
        name: teleporterName,
        side: teleSide,
      },
    });
  };

  return (
    <li
      className={classList([styles.linkListItem, alternatingStyles.listItem])}
    >
      <div>
        <select onChange={handleTeleNameChange} value={teleporterName}>
          {teleporters.map((tele) => (
            <option key={tele._uuid} value={tele._uuid}>
              {tele.name}
            </option>
          ))}
        </select>
        <select onChange={handleTeleSideChange} value={teleSide}>
          {[
            TeleporterSide.Forward,
            TeleporterSide.Backward,
            TeleporterSide.Both,
          ].map((value) => (
            <option key={value} value={value}>
              {teleporterSideLiteral(value)}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="success"
        onClick={handleOnClick}
        className={styles.deleteButton}
      >
        <FontAwesomeIcon fixedWidth={true} icon={faPlus} />
      </Button>
    </li>
  );
};

interface LinkEdits {
  add: ITeleporterLink[];
  del: string[];
}

interface LinkEditorProps {
  links: ITeleporterLink[];
  onChange: (edits: LinkEdits) => void;
  side: TeleporterSide;
  teleporter: ITeleporter;
  teleporters: ITeleporter[];
}

const LinkEditor = ({
  links,
  onChange,
  side,
  teleporter,
  teleporters,
}: LinkEditorProps) => {
  const [linksToAdd, setLinksToAdd] = useState<ITeleporterLink[]>([]);
  const [linksToDelete, setLinksToDelete] = useState<string[]>([]);

  const handleAddition = (link: ITeleporterLink) => {
    setLinksToAdd([...linksToAdd, link]);
  };
  const handleDeletion = (uuid: string) => {
    setLinksToDelete([...linksToDelete, uuid]);
  };
  const handleRestore = (uuid: string) => {
    const links = [...linksToDelete];
    delete links[links.indexOf(uuid)];

    setLinksToDelete(links);
  };

  useEffect(() => {
    onChange({
      add: linksToAdd,
      del: linksToDelete,
    });
  }, [linksToAdd, linksToDelete, onChange]);

  return (
    <ul className={classList([styles.linkList, alternatingStyles.container])}>
      {[...links, ...linksToAdd].map((link) => (
        <LinkListItem
          isDeleted={linksToDelete.indexOf(link._uuid) >= 0}
          link={link}
          onDelete={handleDeletion}
          onRestore={handleRestore}
        />
      ))}
      <LinkListItemAdder
        onAdd={handleAddition}
        side={side}
        teleporter={teleporter}
        teleporters={teleporters}
      />
    </ul>
  );
};

const TeleporterLinkEditorModal = () => {
  const dialog = useDialogState();
  const [world, setBZWDocument] = useRecoilState(documentState);

  const [frontLinkEdits, setFrontLinkEdits] = useState<LinkEdits>({
    add: [],
    del: [],
  });
  const [backLinkEdits, setBackLinkEdits] = useState<LinkEdits>({
    add: [],
    del: [],
  });

  const teleporters = useMemo(() => {
    return world?._teleporters.map(
      (uuid) => world?.children[uuid] as ITeleporter,
    );
  }, [world?._teleporters, world?.children]);

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

        const handleSave = () => {
          const nextWorld = produce(world, (draftWorld) => {
            if (draftWorld === null) {
              return;
            }

            const editor = new WorldEditorHelper(draftWorld);
            editor
              .addLinks(frontLinkEdits.add)
              .addLinks(backLinkEdits.add)
              .delLinks(frontLinkEdits.del)
              .delLinks(backLinkEdits.del)
              .cleanUp();
          });

          setBZWDocument(nextWorld);
          dialog.hide();
        };

        return (
          <>
            <p>
              <strong>Teleporter:</strong> {teleporter.name}
            </p>
            <TabList aria-label="Teleporter Sides">
              <Tab title="Front side">
                <LinkEditor
                  links={frontLinks}
                  onChange={setFrontLinkEdits}
                  side={TeleporterSide.Forward}
                  teleporter={teleporter}
                  teleporters={teleporters ?? []}
                />
              </Tab>
              <Tab title="Back side">
                <LinkEditor
                  links={backLinks}
                  onChange={setBackLinkEdits}
                  side={TeleporterSide.Backward}
                  teleporter={teleporter}
                  teleporters={teleporters ?? []}
                />
              </Tab>
            </TabList>
            <p>
              <Button type="success" onClick={handleSave} icon={faSave}>
                Save
              </Button>
            </p>
          </>
        );
      }}
    </ListenerModal>
  );
};

export default TeleporterLinkEditorModal;
