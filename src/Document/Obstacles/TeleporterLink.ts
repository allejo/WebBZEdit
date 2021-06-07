import { TeleporterReference, TeleporterSide } from '../../Utilities/types';
import { INameable } from '../Attributes/INameable';
import { bzwString, bzwTeleRef } from '../attributeParsers';
import { IBaseObject, newIBaseObject } from './BaseObject';

export const TeleporterLinkProperties = {
  name: bzwString,
  from: bzwTeleRef,
  to: bzwTeleRef,
};

export interface ITeleporterLink extends IBaseObject, INameable {
  from: TeleporterReference;
  to: TeleporterReference;
}

export function newITeleporterLink(): ITeleporterLink {
  return {
    ...newIBaseObject('link'),
    name: 'link',
    from: { name: '', side: TeleporterSide.Both },
    to: { name: '', side: TeleporterSide.Both },
  };
}
