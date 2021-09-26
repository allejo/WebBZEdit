import dedent from 'dedent';
import { nanoid } from 'nanoid';

import { ITeleporter } from '../../Obstacles/Teleporter';
import {
  newITeleporterLink,
  TeleporterSide,
} from '../../Obstacles/TeleporterLink';
import { parseBZWDocument } from '../../parseBZWDocument';
import { WorldEditorHelper } from '../WorldEditorHelper';

describe('BZW Editor Helper', () => {
  it('should add teleporter links', () => {
    const world = parseBZWDocument(dedent`
    teleporter tele1
      pos 0 0 0
      size 5 5 5
    end

    teleporter tele2
      pos 0 0 0
      size 5 5 5
    end

    link
      from tele1:f
      to tele2:f
    end
    `);
    const link = {
      ...newITeleporterLink(),
      _uuid: nanoid(),
      from: {
        name: 'tele1',
        side: TeleporterSide.Backward,
      },
      to: {
        name: 'tele2',
        side: TeleporterSide.Backward,
      },
    };
    const helper = new WorldEditorHelper(world);
    helper.addLink(link).cleanUp();

    const teleporter = world.children[world._teleporters[0]] as ITeleporter;

    expect(teleporter._links).toHaveLength(2);
    expect(teleporter._links[1]).toEqual(link._uuid);
  });

  it('should delete teleporter links', () => {
    const world = parseBZWDocument(dedent`
    teleporter tele1
      pos 0 0 0
      size 5 5 5
    end

    teleporter tele2
      pos 0 0 0
      size 5 5 5
    end

    teleporter tele3
      pos 0 0 0
      size 5 5 5
    end

    link
      from tele1:f
      to tele1:f
    end

    link
      from tele1:f
      to tele2:f
    end

    link
      from tele1:f
      to tele3:f
    end
    `);
    const teleUUID = world._teleporters[0];
    const teleporter = world.children[teleUUID] as ITeleporter;
    const linkUUID = teleporter._links[1];

    const editor = new WorldEditorHelper(world);
    editor.delLink(linkUUID).cleanUp();

    const newLinks = (world.children[teleUUID] as ITeleporter)._links;

    expect(newLinks).toHaveLength(2);
    expect(newLinks).not.toContain(linkUUID);
    expect(world.children).not.toContain(linkUUID);
  });
});
