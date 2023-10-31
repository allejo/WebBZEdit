import { nanoid } from 'nanoid';

import { ITeleporter } from '../../Obstacles/Teleporter';
import {
	newITeleporterLink,
	TeleporterSide,
} from '../../Obstacles/TeleporterLink';
import { newIWorld } from '../../Obstacles/World';
import { parseBZWDocument } from '../../parseBZWDocument';
import { bzw } from '../../testingUtilities';
import { writeBZWDocument } from '../../writeBZWDocument';
import { FriendlyFireMode } from '../FriendlyFireEditor';
import { GameMode } from '../GameModeEditor';
import { WorldEditorHelper } from '../WorldEditorHelper';

describe('BZW Editor Helper', () => {
	describe('Editing Teleporter and Links', () => {
		describe('Link Edits', () => {
			it('should add teleporter links', () => {
				const world = parseBZWDocument(bzw`
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
				const world = parseBZWDocument(bzw`
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
				expect(world.children).not.toHaveProperty(linkUUID);
			});
		});

		describe('Teleporter Edits', () => {
			it('should delete a teleporter and its links', () => {
				const world = parseBZWDocument(bzw`
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

	describe('Editing gameplay options', () => {
		describe('Getting game modes', () => {
			const dataProvider = [
				{
					description: 'should default to FFA mode given no options block',
					world: bzw`
            options
            end
          `,
					gameMode: GameMode.FreeForAll,
				},
				{
					description: 'should return CTF when the -c option is used',
					world: bzw`
            options
              -c
            end
          `,
					gameMode: GameMode.CaptureTheFlag,
				},
				{
					description: 'should return OFFA when the -offa option is used',
					world: bzw`
            options
              -offa
            end
          `,
					gameMode: GameMode.OpenFreeForAll,
				},
				{
					description:
						'should return rabbit by score when the `-rabbit score` option is used',
					world: bzw`
            options
              -rabbit score
            end
          `,
					gameMode: GameMode.RabbitByScore,
				},
				{
					description:
						'should return rabbit by killer when the `-rabbit killer` option is used',
					world: bzw`
            options
              -rabbit killer
            end
          `,
					gameMode: GameMode.RabbitByKiller,
				},
				{
					description:
						'should return rabbit by random when the `-rabbit random` option is used',
					world: bzw`
            options
              -rabbit random
            end
          `,
					gameMode: GameMode.RabbitByRandom,
				},
			];

			for (const { description, world: bzw, gameMode } of dataProvider) {
				it(description, () => {
					const world = parseBZWDocument(bzw);
					const helper = new WorldEditorHelper(world);

					expect(helper.getGameMode()).toEqual(gameMode);
				});
			}
		});

		describe('Setting game modes', () => {
			const dataProvider = [
				{
					description:
						'should create a free for all world with no options block',
					gameMode: GameMode.FreeForAll,
					expected: bzw`
            world
              size 800
            end
          `,
				},
				{
					description: 'should create a CTF world with an options block',
					gameMode: GameMode.CaptureTheFlag,
					expected: bzw`
            world
              size 800
            end

            options
              -c
            end
          `,
				},
				{
					description: 'should create an Open FFA world with an options block',
					gameMode: GameMode.OpenFreeForAll,
					expected: bzw`
            world
              size 800
            end

            options
              -offa
            end
          `,
				},
				{
					description:
						'should create a rabbit (by score) world with an options block',
					gameMode: GameMode.RabbitByScore,
					expected: bzw`
            world
              size 800
            end

            options
              -rabbit score
            end
          `,
				},
				{
					description:
						'should create a rabbit (by killer) world with an options block',
					gameMode: GameMode.RabbitByKiller,
					expected: bzw`
            world
              size 800
            end

            options
              -rabbit killer
            end
          `,
				},
				{
					description:
						'should create a rabbit (by random) world with an options block',
					gameMode: GameMode.RabbitByRandom,
					expected: bzw`
            world
              size 800
            end

            options
              -rabbit random
            end
          `,
				},
			];

			for (const { description, gameMode, expected } of dataProvider) {
				it(description, () => {
					const world = newIWorld();
					const helper = new WorldEditorHelper(world);

					helper.setGameMode(gameMode);

					expect(
						writeBZWDocument(world, {
							indentation: 'space',
							indentationWidth: 2,
						}),
					).toEqual(expected);
				});
			}
		});

		describe('Getting friendly fire', () => {
			const dataProvider = [
				{
					description: 'should result in an "impossible" friendly fire mode',
					world: bzw`
            options
              -noteamkills
            end
          `,
					expected: FriendlyFireMode.Impossible,
				},
				{
					description: 'should result in a "with penalty" friendly fire mode',
					world: bzw`
            options
              -tk
            end
          `,
					expected: FriendlyFireMode.WithPenalty,
				},
				{
					description:
						'should result in a default "with penalty & suicide" friendly fire mode',
					world: bzw`
            options
            end
          `,
					expected: FriendlyFireMode.WithPenaltyAndSuicide,
				},
			];

			for (const { description, world: bzw, expected } of dataProvider) {
				it(description, () => {
					const world = parseBZWDocument(bzw);
					const helper = new WorldEditorHelper(world);

					expect(helper.getFriendlyFire()).toEqual(expected);
				});
			}
		});

		describe('Setting friendly fire', () => {
			const dataProvider = [
				{
					description: 'should result in an "impossible" friendly fire mode',
					ffMode: FriendlyFireMode.Impossible,
					expected: bzw`
            world
              size 800
            end

            options
              -noteamkills
            end
          `,
				},
				{
					description: 'should result in a "with penalty" friendly fire mode',
					ffMode: FriendlyFireMode.WithPenalty,
					expected: bzw`
            world
              size 800
            end

            options
              -tk
            end
          `,
				},
				{
					description:
						'should result in a default "with penalty & suicide" friendly fire mode',
					ffMode: FriendlyFireMode.WithPenaltyAndSuicide,
					expected: bzw`
            world
              size 800
            end
          `,
				},
			];

			for (const { description, ffMode, expected } of dataProvider) {
				it(description, () => {
					const world = newIWorld();
					const helper = new WorldEditorHelper(world);

					helper.setFriendlyFire(ffMode);

					expect(
						writeBZWDocument(world, {
							indentation: 'space',
							indentationWidth: 2,
						}),
					).toEqual(expected);
				});
			}
		});

		describe('Handling simple boolean options', () => {
			it('should default ricochet + jumping to false from a bzw without it set', () => {
				const world = parseBZWDocument(bzw`
          options
          end
        `);
				const helper = new WorldEditorHelper(world);

				expect(helper.areRicochetsEnabled()).toEqual(false);
				expect(helper.isJumpingEnabled()).toEqual(false);
			});

			it('should read jumping correctly from a bzw if set', () => {
				const world = parseBZWDocument(bzw`
          options
            -j
          end
        `);
				const helper = new WorldEditorHelper(world);

				expect(helper.isJumpingEnabled()).toEqual(true);
			});

			it('should read ricochet correctly from a bzw if set', () => {
				const world = parseBZWDocument(bzw`
          options
            +r
          end
        `);
				const helper = new WorldEditorHelper(world);

				expect(helper.areRicochetsEnabled()).toEqual(true);
			});

			it('should set jumping and ricochet correctly', () => {
				const world = newIWorld();
				const helper = new WorldEditorHelper(world);

				helper.enableJumping(true);
				helper.enableRicochets(true);

				expect(
					writeBZWDocument(world, {
						indentation: 'space',
						indentationWidth: 2,
					}),
				).toEqual(bzw`
          world
            size 800
          end

          options
            -j
            +r
          end
        `);
			});
		});
	});
});
