import produce from 'immer';
import React, {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  forwardRef,
  useState,
  SyntheticEvent,
  FormEvent,
  useEffect,
  useRef,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { WorldEditorHelper } from '../../../Document/Editor/WorldEditorHelper';
import { IBase } from '../../../Document/Obstacles/Base';
import { IBaseObject } from '../../../Document/Obstacles/BaseObject';
import { ITankModelObjectType } from '../../../Document/Obstacles/TankModel';
import { classList } from '../../../Utilities/cssClasses';
import keyboard from '../../../Utilities/keyboard';
import { documentState, selectionState } from '../../../atoms';
import LinkSummary from './LinkSummary';

import thumbBaseBlue from '../../../assets/thumb_base_blue.png';
import thumbBaseGreen from '../../../assets/thumb_base_green.png';
import thumbBasePurple from '../../../assets/thumb_base_purple.png';
import thumbBaseRed from '../../../assets/thumb_base_red.png';
import thumbBox from '../../../assets/thumb_box.png';
import thumbPyramid from '../../../assets/thumb_pyramid.png';
import thumbTank from '../../../assets/thumb_tank.png';
import thumbTeleporter from '../../../assets/thumb_teleporter.png';
import styles from './ObstacleSummary.module.scss';

interface Props {
  obstacle: IBaseObject;
  onClick: (event: MouseEvent, obstacle: IBaseObject) => void;
  selected: boolean;
}

const obstacleThumbs: Record<string, string> = {
  base: '',
  box: thumbBox,
  pyramid: thumbPyramid,
  teleporter: thumbTeleporter,
  [ITankModelObjectType]: thumbTank,
};

const baseThumbs: Record<IBase['color'], string> = {
  1: thumbBaseRed,
  2: thumbBaseGreen,
  3: thumbBaseBlue,
  4: thumbBasePurple,
};

function getThumbnail(object: IBaseObject): JSX.Element {
  const { _objectType: type } = object;

  if (obstacleThumbs[type] !== undefined) {
    let src = obstacleThumbs[type];

    if (type === 'base') {
      src = baseThumbs[(object as IBase).color];
    }

    return (
      <img className={styles.thumbnail} src={src} alt={`${type} thumbnail`} />
    );
  }

  return <span className={styles.empty} />;
}

function getSummary(obstacle: IBaseObject): JSX.Element {
  const displayName =
    obstacle.name || `${obstacle._objectType} ${obstacle._uuid.substr(0, 8)}`;

  if (obstacle._objectType === 'teleporter') {
    // display teleporters and their links
    return (
      <>
        <div>{getThumbnail(obstacle)}</div>
        <div className={styles.teleporter}>
          <div>{displayName}</div>
          <LinkSummary object={obstacle} />
        </div>
      </>
    );
  }

  return (
    <>
      <div>{getThumbnail(obstacle)}</div>
      <div className={styles.body}>{displayName}</div>
    </>
  );
}

const ObstacleSummary = forwardRef<HTMLDivElement, Props>(
  ({ obstacle, onClick, selected }: Props, ref) => {
    const [world, setBZWDocument] = useRecoilState(documentState);
    const selectedUUID = useRecoilValue(selectionState);
    const [nameEdit, setNameEdit] = useState(obstacle.name ?? '');
    const [editMode, setEditMode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (editMode) {
        inputRef.current?.focus();
      } else {
        inputRef.current?.blur();
      }
    }, [editMode]);

    const classes = classList([
      styles.wrapper,
      [styles.selected, selected],
      [styles.editMode, editMode],
    ]);

    const handleDoubleClick = () => {
      setEditMode(true);
    };

    const handleSave = (e: FocusEvent<HTMLInputElement> | FormEvent) => {
      e.preventDefault();
      saveName();
      setEditMode(false);
    };

    const handleOnNameChange = (e: SyntheticEvent<HTMLInputElement>) => {
      setNameEdit(e.currentTarget.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === keyboard.ESC) {
        setNameEdit(obstacle.name ?? '');
        setEditMode(false);
      }
    };

    const saveName = () => {
      const nextWorld = produce(world, (draftWorld) => {
        if (!draftWorld || !selectedUUID) {
          return;
        }

        const editor = new WorldEditorHelper(draftWorld);
        editor.renameObstacle(selectedUUID, nameEdit);
      });

      setBZWDocument(nextWorld);
    };

    return (
      <div
        ref={ref}
        className={classes}
        onClick={(event) => onClick(event, obstacle)}
        onDoubleClick={handleDoubleClick}
      >
        {getSummary(obstacle)}
        <form onSubmit={handleSave}>
          <input
            ref={inputRef}
            type="text"
            className={styles.editor}
            onBlur={handleSave}
            onChange={handleOnNameChange}
            onKeyDown={handleKeyDown}
            value={nameEdit}
          />
        </form>
      </div>
    );
  },
);

export default ObstacleSummary;
