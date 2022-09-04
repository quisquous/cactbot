import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  conceptual?: 'octa' | 'tetra' | 'di';
  combatantData: PluginCombatantState[];
  torches: NetMatches['StartsUsing'][];
  flareTargets: string[];
  upliftCounter: number;
  ventIds: string[];
  illusory?: 'bird' | 'snake';
}

const centerX = 100;
const centerY = 100;

const positionTo8Dir = (combatant: PluginCombatantState) => {
  const x = combatant.PosX - centerX;
  const y = combatant.PosY - centerY;

  // Dirs: N = 0, NE = 1, ..., NW = 7
  return Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheEighthCircleSavage,
  timelineFile: 'p8s.txt',
  initData: () => {
    return {
      combatantData: [],
      torches: [],
      flareTargets: [],
      upliftCounter: 0,
      ventIds: [],
    };
  },
  triggers: [
    // ---------------- Part 1 ----------------
    {
      id: 'P8S Genesis of Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7944', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8S Scorching Fang',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7912', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.conceptual === 'octa')
          return output.outAndSpread!();
        if (data.conceptual === 'tetra')
          return output.outAndStacks!();
        return output.out!();
      },
      run: (data) => delete data.conceptual,
      outputStrings: {
        out: Outputs.out,
        outAndSpread: {
          en: 'Out + Spread',
        },
        outAndStacks: {
          en: 'Out + Stacks',
        },
      },
    },
    {
      id: 'P8S Sun\'s Pinion',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7913', source: 'Hephaistos', capture: false }),
      // There are two casts, one for each side.
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.conceptual === 'octa')
          return output.inAndSpread!();
        if (data.conceptual === 'tetra')
          return output.inAndStacks!();
        return output.in!();
      },
      run: (data) => delete data.conceptual,
      outputStrings: {
        in: Outputs.in,
        inAndSpread: {
          en: 'In + Spread',
        },
        inAndStacks: {
          en: 'In + Stacks',
        },
      },
    },
    {
      id: 'P8S Flameviper',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7945', source: 'Hephaistos' }),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'P8S Conceptual Diflare Quadruped',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7917', source: 'Hephaistos', capture: false }),
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'P8S Conceptual Tetraflare Quadruped',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7916', source: 'Hephaistos', capture: false }),
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Partner Stacks',
        },
      },
    },
    {
      id: 'P8S Conceptual Tetraflare',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7915', source: 'Hephaistos', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.conceptual = 'tetra',
      outputStrings: {
        text: {
          en: '(partner stack, for later)',
          de: '(Partner-Stacks, für später)',
        },
      },
    },
    {
      id: 'P8S Conceptual Octaflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7914', source: 'Hephaistos', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.conceptual = 'octa',
      outputStrings: {
        text: {
          en: '(spread, for later)',
          de: '(Verteilen, für später)',
        },
      },
    },
    {
      id: 'P8S Octaflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '791D', source: 'Hephaistos', capture: false }),
      response: Responses.spread('alarm'),
    },
    {
      id: 'P8S Tetraflare',
      type: 'StartsUsing',
      // During vents and also during clones.
      netRegex: NetRegexes.startsUsing({ id: '791E', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.illusory === 'bird')
          return output.inAndStacks!();
        if (data.illusory === 'snake')
          return output.outAndStacks!();
        return output.stacks!();
      },
      run: (data) => delete data.illusory,
      outputStrings: {
        inAndStacks: {
          en: 'In + Stacks',
        },
        outAndStacks: {
          en: 'Out + Stacks',
        },
        stacks: {
          en: 'Partner Stacks',
        },
      },
    },
    {
      id: 'P8S Nest of Flamevipers',
      type: 'StartsUsing',
      // During clones.
      netRegex: NetRegexes.startsUsing({ id: '791F', source: 'Hephaistos', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.illusory === 'bird')
          return output.inAndProtean!();
        if (data.illusory === 'snake')
          return output.outAndProtean!();
        // This shouldn't happen, but just in case.
        return output.protean!();
      },
      run: (data) => delete data.illusory,
      outputStrings: {
        inAndProtean: {
          en: 'In + Protean',
        },
        outAndProtean: {
          en: 'Out + Protean',
        },
        protean: {
          en: 'Protean',
        },
      },
    },
    {
      id: 'P8S Torch Flame Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7927', source: 'Hephaistos' }),
      run: (data, matches) => data.torches.push(matches),
    },
    {
      id: 'P8S Torch Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7927', source: 'Hephaistos', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.combatantData = [];
        const ids = data.torches.map((torch) => parseInt(torch.sourceId, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
        data.torches = [];
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length === 0)
          return;

        const safe = {
          cornerNW: true,
          cornerNE: true,
          cornerSE: true,
          cornerSW: true,
          // Unlike normal mode, these "outside" are two tiles and not 4,
          // e.g. "outsideNorth" = NNW/NNE tiles.
          // The ordering here matters.
          outsideNorth: true,
          insideNorth: true,
          outsideWest: true,
          insideWest: true,
          outsideEast: true,
          insideEast: true,
          outsideSouth: true,
          insideSouth: true,
        };

        // idx = x + y * 4
        // This map is the tile index mapped to the keys that any
        // torch exploding on that square would make unsafe.
        const unsafeMap: { [idx: number]: (keyof typeof safe)[] } = {
          0: ['cornerNW'],
          1: ['outsideNorth'],
          2: ['outsideNorth'],
          3: ['cornerNE'],

          4: ['outsideWest'],
          5: ['insideWest', 'insideNorth'],
          6: ['insideEast', 'insideNorth'],
          7: ['outsideEast'],

          8: ['outsideWest'],
          9: ['insideWest', 'insideSouth'],
          10: ['insideEast', 'insideSouth'],
          11: ['outsideEast'],

          12: ['cornerSW'],
          13: ['outsideSouth'],
          14: ['outsideSouth'],
          15: ['cornerSE'],
        };

        // Loop through all torches, remove any rows/columns it intersects with
        // to find safe lanes.
        for (const torch of data.combatantData) {
          // x, y = 85, 95, 105, 115
          // map to ([0, 3], [0, 3])
          const x = Math.floor((torch.PosX - 85) / 10);
          const y = Math.floor((torch.PosY - 85) / 10);

          const idx = x + y * 4;
          const unsafeArr = unsafeMap[idx];
          for (const entry of unsafeArr ?? [])
            delete safe[entry];
        }

        const safeKeys = Object.keys(safe);
        const [safe0, safe1, safe2, safe3] = safeKeys;

        // Unexpectedly zero safe zones.
        if (safe0 === undefined)
          return;

        // Special case inner four squares.
        if (
          safeKeys.length === 4 &&
          // Ordered same as keys above.
          safe0 === 'insideNorth' &&
          safe1 === 'insideWest' &&
          safe2 === 'insideEast' &&
          safe3 === 'insideSouth'
        )
          return output.insideSquare!();

        // Not set up to handle more than two safe zones.
        if (safe2 !== undefined)
          return;
        if (safe1 === undefined)
          return output[safe0]!();

        const dir1 = output[safe0]!();
        const dir2 = output[safe1]!();
        return output.combo!({ dir1: dir1, dir2: dir2 });
      },
      outputStrings: {
        combo: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
        insideSquare: {
          en: 'Inside Square',
          de: 'Inneres Viereck',
        },
        cornerNW: {
          en: 'NW Corner',
          de: 'NW Ecke',
        },
        cornerNE: {
          en: 'NE Corner',
          de: 'NO Ecke',
        },
        cornerSE: {
          en: 'SE Corner',
          de: 'SO Ecke',
        },
        cornerSW: {
          en: 'SW Corner',
          de: 'SW Ecke',
        },
        outsideNorth: {
          en: 'Outside North',
          de: 'Im Norden raus',
          fr: 'Nord Extérieur',
          ja: '北、外側',
          ko: '북쪽, 바깥',
        },
        insideNorth: {
          en: 'Inside North',
          de: 'Im Norden rein',
          fr: 'Nord Intérieur',
          ja: '北、内側',
          ko: '북쪽, 안',
        },
        outsideEast: {
          en: 'Outside East',
          de: 'Im Osten raus',
          fr: 'Est Extérieur',
          ja: '東、外側',
          ko: '동쪽, 바깥',
        },
        insideEast: {
          en: 'Inside East',
          de: 'Im Osten rein',
          fr: 'Est Intérieur',
          ja: '東、内側',
          ko: '동쪽, 안',
        },
        outsideSouth: {
          en: 'Outside South',
          de: 'Im Süden raus',
          fr: 'Sud Extérieur',
          ja: '南、外側',
          ko: '남쪽, 바깥',
        },
        insideSouth: {
          en: 'Inside South',
          de: 'Im Süden rein',
          fr: 'Sud Intérieur',
          ja: '南、内側',
          ko: '남쪽, 안',
        },
        outsideWest: {
          en: 'Outside West',
          de: 'Im Westen raus',
          fr: 'Ouest Extérieur',
          ja: '西、外側',
          ko: '서쪽, 바깥',
        },
        insideWest: {
          en: 'Inside West',
          de: 'Im Westen rein',
          fr: 'Ouest Intérieur',
          ja: '西、内側',
          ko: '서쪽, 안',
        },
      },
    },
    {
      id: 'P8S Ektothermos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79EA', source: 'Hephaistos', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P8S Footprint',
      type: 'Ability',
      // There is 6.4 seconds between this Reforged Reflection ability and the Footprint (7109) ability.
      netRegex: NetRegexes.ability({ id: '794B', source: 'Hephaistos', capture: false }),
      delaySeconds: 1.5,
      response: Responses.knockback(),
    },
    {
      id: 'P8S Snaking Kick',
      type: 'StartsUsing',
      // This is the Reforged Reflection cast.
      netRegex: NetRegexes.startsUsing({ id: '794C', source: 'Hephaistos', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'P8S Uplift Counter',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7935', source: 'Hephaistos', capture: false }),
      // Count in a separate trigger so that we can suppress it, but still call out for
      // both people hit.
      preRun: (data, _matches) => data.upliftCounter++,
      suppressSeconds: 1,
      sound: '',
      infoText: (data, _matches, output) => output.text!({ num: data.upliftCounter }),
      tts: null,
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'P8S Uplift Number',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7935', source: 'Hephaistos' }),
      condition: Conditions.targetIsYou(),
      // ~12.8 seconds between #1 Uplift (7935) to #1 Stomp Dead (7937)
      // ~13.8 seconds between #4 Uplift (7935) to #4 Stomp Dead (7937).
      // Split the difference with 13.3 seconds.
      durationSeconds: 13.3,
      alertText: (data, _matches, output) => output.text!({ num: data.upliftCounter }),
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'P8S Quadrupedal Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A04', source: 'Hephaistos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Follow Jump',
        },
      },
    },
    {
      id: 'P8S Quadrupedal Crush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A05', source: 'Hephaistos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away From Jump',
        },
      },
    },
    {
      id: 'P8S Illusory Hephaistos Scorched Pinion First',
      type: 'StartsUsing',
      // This is "Illusory Hephaistos" but sometimes it says "Gorgon".
      netRegex: NetRegexes.startsUsing({ id: '7953' }),
      condition: (data) => data.flareTargets.length === 0,
      suppressSeconds: 1,
      promise: async (data, matches) => {
        data.combatantData = [];

        const id = parseInt(matches.sourceId, 16);
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [id],
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        const combatant = data.combatantData[0];
        if (combatant === undefined || data.combatantData.length !== 1)
          return;

        const dir = positionTo8Dir(combatant);
        if (dir === 0 || dir === 4)
          return output.northSouth!();
        if (dir === 2 || dir === 6)
          return output.eastWest!();
      },
      outputStrings: {
        northSouth: {
          en: 'North/South Bird',
        },
        eastWest: {
          en: 'East/West Bird',
        },
      },
    },
    {
      id: 'P8S Illusory Hephaistos Scorched Pinion Second',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7953', source: 'Illusory Hephaistos', capture: false }),
      condition: (data) => data.flareTargets.length > 0,
      suppressSeconds: 1,
      run: (data) => data.illusory = 'bird',
    },
    {
      id: 'P8S Illusory Hephaistos Scorching Fang Second',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7952', source: 'Illusory Hephaistos', capture: false }),
      condition: (data) => data.flareTargets.length > 0,
      suppressSeconds: 1,
      run: (data) => data.illusory = 'snake',
    },
    {
      id: 'P8S Hemitheos\'s Flare Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72CE', source: 'Hephaistos' }),
      preRun: (data, matches) => data.flareTargets.push(matches.target),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      outputStrings: {
        text: {
          en: '(avoid proteans)',
          de: '(weiche Himmelsrichtungen aus)',
        },
      },
    },
    {
      id: 'P8S Hemitheos\'s Flare Not Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72CE', source: 'Hephaistos', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.flareTargets.includes(data.me))
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'In for Protean',
          de: 'rein für Himmelsrichtungen',
        },
      },
    },
    {
      id: 'P8S Suneater Cthonic Vent Add',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '11404' }),
      run: (data, matches) => data.ventIds.push(matches.id),
    },
    {
      id: 'P8S Suneater Cthonic Vent Initial',
      type: 'StartsUsing',
      // TODO: vents #2 and #3 are hard, but the first vent cast has a ~5s cast time.
      netRegex: NetRegexes.startsUsing({ id: '7925', source: 'Suneater', capture: false }),
      suppressSeconds: 1,
      promise: async (data: Data) => {
        data.combatantData = [];
        if (data.ventIds.length !== 2)
          return;

        const ids = data.ventIds.map((id) => parseInt(id, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length === 0)
          return;

        const unsafeSpots = data.combatantData.map((c) => positionTo8Dir(c)).sort();

        const [unsafe0, unsafe1] = unsafeSpots;
        if (unsafe0 === undefined || unsafe1 === undefined)
          throw new UnreachableCode();

        // edge case wraparound
        if (unsafe0 === 1 && unsafe1 === 7)
          return output.south!();

        // adjacent unsafe spots, cardinal is safe
        if (unsafe1 - unsafe0 === 2) {
          // this average is safe to do because wraparound was taken care of above.
          const unsafeCard = Math.floor((unsafe0 + unsafe1) / 2);

          const safeDirMap: { [dir: number]: string } = {
            0: output.south!(), // this won't happen, but here for completeness
            2: output.west!(),
            4: output.north!(),
            6: output.east!(),
          } as const;
          return safeDirMap[unsafeCard] ?? output.unknown!();
        }

        // two intercards are safe, they are opposite each other,
        // so we can pick the intercard counterclock of each unsafe spot.
        // e.g. 1/5 are unsafe (NE and SW), so SE and NW are safe.
        const safeIntercardMap: { [dir: number]: string } = {
          1: output.dirNW!(),
          3: output.dirNE!(),
          5: output.dirSE!(),
          7: output.dirSW!(),
        } as const;

        const safeStr0 = safeIntercardMap[unsafe0] ?? output.unknown!();
        const safeStr1 = safeIntercardMap[unsafe1] ?? output.unknown!();
        return output.comboDir!({ dir1: safeStr0, dir2: safeStr1 });
      },
      outputStrings: {
        comboDir: {
          en: '${dir1} / ${dir2}',
        },
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
        dirNE: Outputs.dirNE,
        dirSE: Outputs.dirSE,
        dirSW: Outputs.dirSW,
        dirNW: Outputs.dirNW,
        unknown: Outputs.unknown,
      },
    },
    // ---------------- Part 2 ----------------
    {
      id: 'P8S Aioniopyr',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79DF', source: 'Hephaistos', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
        },
      },
    },
    {
      id: 'P8S Tyrant\'s Unholy Darkness',
      type: 'StartsUsing',
      // Untargeted, with 79DE damage after.
      netRegex: NetRegexes.startsUsing({ id: '79DD', source: 'Hephaistos', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Split Tankbusters',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Conceptual Octaflare/Conceptual Tetraflare': 'Conceptual Octa/Tetraflare',
        'Emergent Octaflare/Emergent Tetraflare': 'Emergent Octa/Tetraflare',
        'Forcible Trifire/Forcible Difreeze': 'Forcible Trifire/Difreeze',
        'Forcible Difreeze/Forcible Trifire': 'Forcible Difreeze/Trifire',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Hephaistos': 'Hephaistos',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hephaistos': 'Héphaïstos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Hephaistos': 'ヘファイストス',
      },
    },
  ],
};

export default triggerSet;
