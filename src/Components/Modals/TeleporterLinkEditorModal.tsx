import {
  faPlus,
  faSave,
  faTrash,
  faTrashRestore,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import produce from 'immer';
import { nanoid } from 'nanoid';
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

type StringDict = Record<string, string>;
type TeleMetadata = [ITeleporter[], StringDict, StringDict];

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
  teleMetadata: TeleMetadata;
}

const LinkListItemAdder = ({
  onAdd,
  side,
  teleporter,
  teleMetadata: [teleporters, teleUuidToName],
}: LinkListItemAdderProps) => {
  const [teleName, setTeleName] = useState<string>(teleporters[0].name!);
  const [teleUUID, setTeleUUID] = useState<string>(teleporters[0]._uuid!);
  const [teleSide, setTeleSide] = useState<TeleporterSide>(
    TeleporterSide.Forward,
  );

  const handleTeleNameChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setTeleName(teleUuidToName[event.currentTarget.value]);
    setTeleUUID(event.currentTarget.value);
  };
  const handleTeleSideChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    setTeleSide(event.currentTarget.value as TeleporterSide);
  };
  const handleOnClick = () => {
    onAdd({
      ...newITeleporterLink(),
      _uuid: nanoid(),
      from: {
        name: teleporter.name!,
        side: side,
      },
      to: {
        name: teleName,
        side: teleSide,
      },
    });
  };

  return (
    <li
      className={classList([styles.linkListItem, alternatingStyles.listItem])}
    >
      <div>
        <select onChange={handleTeleNameChange} value={teleUUID}>
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
  teleMetadata: TeleMetadata;
}

const LinkEditor = ({
  links,
  onChange,
  side,
  teleporter,
  teleMetadata,
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
      // Only pass up new links that weren't deleted
      add: linksToAdd.filter((tele) => !linksToDelete.includes(tele._uuid)),
      del: linksToDelete,
    });
  }, [linksToAdd, linksToDelete, onChange]);

  useEffect(() => {
    setLinksToAdd([]);
    setLinksToDelete([]);
  }, [links]);

  const renderLinks = (links: ITeleporterLink[], keySuffix: string) =>
    links.map((link) => (
      <LinkListItem
        key={link._uuid + keySuffix}
        isDeleted={linksToDelete.indexOf(link._uuid) >= 0}
        link={link}
        onDelete={handleDeletion}
        onRestore={handleRestore}
      />
    ));

  return (
    <ul className={classList([styles.linkList, alternatingStyles.container])}>
      {renderLinks(links, '')}
      {renderLinks(linksToAdd, '-new')}

      <LinkListItemAdder
        onAdd={handleAddition}
        side={side}
        teleporter={teleporter}
        teleMetadata={teleMetadata}
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

  const teleMetadata: TeleMetadata = useMemo(() => {
    const teles: ITeleporter[] = [];
    const teleUuidToName: StringDict = {};
    const teleNameToUuid: StringDict = {};

    for (const teleUUID of world?._teleporters ?? []) {
      const tele = world?.children[teleUUID] as ITeleporter;

      teles.push(tele);
      teleUuidToName[teleUUID] = tele.name!;
      teleNameToUuid[tele.name!] = tele._uuid;
    }

    return [teles, teleUuidToName, teleNameToUuid];
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

            console.log(frontLinkEdits);
            console.log(backLinkEdits);

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
                  teleMetadata={teleMetadata ?? [[], {}, {}]}
                />
              </Tab>
              <Tab title="Back side">
                <LinkEditor
                  links={backLinks}
                  onChange={setBackLinkEdits}
                  side={TeleporterSide.Backward}
                  teleporter={teleporter}
                  teleMetadata={teleMetadata ?? [[], {}, {}]}
                />
              </Tab>
            </TabList>
            <div>
              <Button type="success" onClick={handleSave} icon={faSave}>
                Save
              </Button>
            </div>
          </>
        );
      }}
    </ListenerModal>
  );
};

export default TeleporterLinkEditorModal;
