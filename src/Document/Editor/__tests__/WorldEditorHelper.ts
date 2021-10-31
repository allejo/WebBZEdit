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
  describe('Editing Teleporter and Links', () => {
    describe('Link Edits', () => {
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

    describe('Teleporter Edits', () => {
      it('should delete a teleporter and its links', () => {
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
            to tele2:f
          end

          link
            from tele2:f
            to tele1:f
          end

          link
            from tele2:b
            to tele3:f
          end

          link
            from tele3:f
            to tele1:f
          end

          link
            from tele3:b
            to tele1:b
          end
        `);
        expect(world._teleporters).toHaveLength(3);

        const teleUUID = world._teleporters[2];
        const teleporter = world.children[teleUUID] as ITeleporter;

        const startingLinks = Object.values(world.children).filter(
          (child) => child._objectType === 'link',
        );
        expect(startingLinks).toHaveLength(5);

        const editor = new WorldEditorHelper(world);
        editor.delObstacle(teleporter);

        expect(world._teleporters).toHaveLength(2);

        const endingLinks = Object.values(world.children).filter(
          (child) => child._objectType === 'link',
        );
        expect(endingLinks).toHaveLength(2);
      });
    });
  });
});
