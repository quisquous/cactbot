import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

// TODO:
// - Combine Terrastorm 2 and Arctic Assault callout spots?

const arcticAssaultQuadrants = {
  '00': 'ne',
  '01': 'nw',
  '02': 'ne',
  '03': 'se',
  '04': 'se',
  '05': 'sw',
  '06': 'nw',
  '07': 'sw',
} as const;

type ArcticAssaultSlots = keyof typeof arcticAssaultQuadrants;

export interface Data extends RaidbossData {
  galeSphereShadows: ('n' | 'e' | 's' | 'w')[];
  galeSphereCasts: {
    x: number;
    y: number;
    castTime: number;
  }[];
  terrastormCount: number;
  terrastormCombatantDirs: number[];
  arcticAssaultMapEffects: ArcticAssaultSlots[];
}

// MapEffect info:
/*
Slots:

00 = Middle North ice wall, facing east
01 = Middle North ice wall, facing west
02 = Center East ice wall, facing north
03 = Center East ice wall, facing south
04 = Middle South ice wall, facing east
05 = Middle South ice wall, facing west
06 = Center West ice wall, facing north
07 = Center West ice wall, facing south

08/09/0A/0B/0C/0D = Seen in log, but unknown

Flags:
For ice wall, `00020001` enables, `00080004` disables
*/

type GaleDirections = 'n' | 'e' | 's' | 'w';
type GaleSafeSpots = GaleDirections | 'middle' | 'unknown';

// Calculate combatant position in an all 8 cards/intercards
const matchedPositionTo8Dir = (combatant: PluginCombatantState) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;

  // Majority of mechanics center around three circles:
  // NW at 0, NE at 2, South at 5
  // Map NW = 0, N = 1, ..., W = 7

  return Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};

const triggerSet: TriggerSet<Data> = {
  id: 'TheVoidcastDaisExtreme',
  zoneId: ZoneId.TheVoidcastDaisExtreme,
  timelineFile: 'golbez-ex.txt',
  initData: () => {
    return {
      terrastormCount: 0,
      terrastormCombatantDirs: [],
      galeSphereShadows: [],
      galeSphereCasts: [],
      arcticAssaultMapEffects: [],
    };
  },
  timelineTriggers: [
    {
      id: 'GolbezEx Flames of Eventide 1',
      regex: /Flames of Eventide 1/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'GolbezEx Flames of Eventide Swap',
      regex: /Flames of Eventide 1/,
      beforeSeconds: 0,
      condition: (data) => data.role === 'tank',
      alarmText: Outputs.tankSwap,
    },
  ],
  triggers: [
    {
      id: 'GolbezEx Terrastorm',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '8466', source: 'Golbez', capture: true }),
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const meteorData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });

        if (meteorData === null) {
          console.error(`Terrastorm: null data`);
          return;
        }
        if (meteorData.combatants.length !== 1) {
          console.error(`Terrastorm: expected 1, got ${meteorData.combatants.length}`);
          return;
        }

        const meteor = meteorData.combatants[0];
        if (!meteor)
          throw new UnreachableCode();
        data.terrastormCombatantDirs.push(matchedPositionTo8Dir(meteor));
      },
      alertText: (data, _matches, output) => {
        if (data.terrastormCombatantDirs.length < 2)
          return;

        const meteors = data.terrastormCombatantDirs;

        data.terrastormCombatantDirs = [];
        ++data.terrastormCount;

        const dirs: { [dir: number]: string } = {
          0: 'nw',
          2: 'ne',
          4: 'se',
          6: 'sw',
        };

        for (const meteor of meteors) {
          delete dirs[meteor];
        }

        const dirOutputs: string[] = [];

        for (const dir of Object.values(dirs)) {
          dirOutputs.push(output[dir]!());
        }

        return dirOutputs.join('/');
      },
      outputStrings: {
        nw: Outputs.dirNW,
        ne: Outputs.dirNE,
        sw: Outputs.dirSW,
        se: Outputs.dirSE,
      },
    },
    {
      id: 'GolbezEx Lingering Spark Bait',
      type: 'StartsUsing',
      netRegex: { id: '8468', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Circles',
          de: 'Kreise ködern',
          fr: 'Déposez les cercles',
          ja: 'ゆか誘導',
          cn: '集合放圈',
          ko: '장판 유도',
        },
      },
    },
    {
      id: 'GolbezEx Lingering Spark Move',
      type: 'Ability',
      netRegex: { id: '8468', source: 'Golbez', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'GolbezEx Phases of the Blade',
      type: 'StartsUsing',
      netRegex: { id: '86DB', source: 'Golbez', capture: false },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'GolbezEx Binding Cold',
      type: 'StartsUsing',
      netRegex: { id: '84B3', source: 'Golbez', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'GolbezEx Void Meteor',
      type: 'StartsUsing',
      netRegex: { id: '84AD', source: 'Golbez', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'GolbezEx Black Fang',
      type: 'StartsUsing',
      netRegex: { id: '8471', source: 'Golbez', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'GolbezEx Abyssal Quasar',
      type: 'StartsUsing',
      netRegex: { id: '84AB', source: 'Golbez', capture: false },
      suppressSeconds: 3,
      alertText: (_data, _matches, output) => output.partnerStack!(),
      outputStrings: {
        partnerStack: {
          en: 'Partner Stack',
          de: 'Mit Partner sammeln',
          fr: 'Package partenaire',
          ja: '2人で頭割り',
          cn: '2 人分摊',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'GolbezEx Eventide Triad',
      type: 'StartsUsing',
      netRegex: { id: '8480', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.rolePositions!(),
      outputStrings: {
        rolePositions: {
          en: 'Role positions',
          de: 'Rollenposition',
          fr: 'Positions par rôle',
          ja: 'ロール特定位置へ',
          cn: '去指定位置',
          ko: '1단리밋 산개위치로',
        },
      },
    },
    {
      id: 'GolbezEx Eventide Fall',
      type: 'StartsUsing',
      netRegex: { id: '8485', source: 'Golbez', capture: false },
      suppressSeconds: 3,
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'GolbezEx Void Tornado',
      type: 'StartsUsing',
      netRegex: { id: '845D', source: 'Golbez', capture: false },
      suppressSeconds: 3,
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'GolbezEx Void Aero III',
      type: 'StartsUsing',
      netRegex: { id: '845C', source: 'Golbez', capture: false },
      suppressSeconds: 3,
      alertText: (_data, _matches, output) => output.partnerStack!(),
      outputStrings: {
        partnerStack: {
          en: 'Partner Stack',
          de: 'Mit Partner sammeln',
          fr: 'Package partenaire',
          ja: '2人で頭割り',
          cn: '2 人分摊',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'GolbezEx Void Blizzard III',
      type: 'StartsUsing',
      netRegex: { id: '8462', source: 'Golbez', capture: false },
      suppressSeconds: 3,
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'GolbezEx Gale Sphere Collector',
      type: 'StartsUsing',
      netRegex: { id: '845[89AB]', source: 'Gale Sphere', capture: true },
      run: (data, matches) => {
        data.galeSphereCasts.push({
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          castTime: parseFloat(matches.castTime),
        });
        if (data.galeSphereCasts.length === 16) {
          data.galeSphereCasts.sort((left, right) => {
            return left.castTime - right.castTime;
          });
        }
      },
    },
    {
      id: 'GolbezEx Gale Sphere Directions',
      type: 'Ability',
      netRegex: { id: '84(?:4F|50|51|52)', source: 'Golbez\'s Shadow', capture: true },
      infoText: (data, matches, output) => {
        switch (matches.id) {
          case '844F':
            data.galeSphereShadows.push('n');
            break;
          case '8450':
            data.galeSphereShadows.push('e');
            break;
          case '8451':
            data.galeSphereShadows.push('w');
            break;
          case '8452':
            data.galeSphereShadows.push('s');
            break;
        }

        if (data.galeSphereShadows.length < 4)
          return;

        const [dir1, dir2, dir3, dir4] = data.galeSphereShadows;

        data.galeSphereShadows = [];

        return output.clones!({
          dir1: dir1 ?? 'unknown',
          dir2: dir2 ?? 'unknown',
          dir3: dir3 ?? 'unknown',
          dir4: dir4 ?? 'unknown',
        });
      },
      outputStrings: {
        n: Outputs.dirN,
        e: Outputs.dirE,
        s: Outputs.dirS,
        w: Outputs.dirW,
        unknown: Outputs.unknown,
        clones: {
          en: 'Clones: ${dir1}->${dir2}->${dir3}->${dir4}',
        },
      },
    },
    {
      id: 'GolbezEx Gale Safe Spots',
      type: 'StartsUsing',
      netRegex: { id: '845[89AB]', source: 'Gale Sphere', capture: false },
      condition: (data) => data.galeSphereCasts.length === 16,
      infoText: (data, _matches, output) => {
        const order: (GaleDirections)[] = [];
        const safeSpots: { [dir in GaleDirections]: GaleSafeSpots } = {
          n: 'unknown',
          e: 'unknown',
          s: 'unknown',
          w: 'unknown',
        };

        data.galeSphereCasts.forEach((sphere) => {
          let dir: GaleDirections;
          if (sphere.x > 113)
            dir = 'e';
          else if (sphere.y > 113)
            dir = 's';
          else if (sphere.x < 87)
            dir = 'w';
          else
            dir = 'n';

          if (!order.includes(dir))
            order.push(dir);
        });

        const sphereDirections: { [dir in GaleDirections]: Data['galeSphereCasts'] } = {
          n: data.galeSphereCasts.filter((sphere) => sphere.y < 87),
          e: data.galeSphereCasts.filter((sphere) => sphere.x > 113),
          s: data.galeSphereCasts.filter((sphere) => sphere.y > 113),
          w: data.galeSphereCasts.filter((sphere) => sphere.x < 87),
        };

        const possibleDirs = ['n', 'e', 's', 'w'] as const;

        for (const dir of possibleDirs) {
          const spheres = sphereDirections[dir];
          const key: 'x' | 'y' = ['n', 's'].includes(dir) ? 'x' : 'y';

          // For these, there are 6 possible cast locations, of which 4 will be present
          // We only need to check three of the six to determine the safe spot
          // All of these coordinates are 0.50 higher. To avoid floating point issues
          // we're just using the floor'd coordinates.
          const possibleSpots: { [coord: number]: GaleSafeSpots[] } = {
            112: ['s', 'e'],
            102: ['middle'],
            87: ['n', 'w'],
          };

          for (const sphere of spheres) {
            delete possibleSpots[Math.floor(sphere[key])];
          }

          const remainingSpots = Object.values(possibleSpots);
          const spot = remainingSpots[0];
          if (remainingSpots.length > 1 || !spot)
            continue;

          let finalSpot: GaleSafeSpots | undefined = 'unknown';

          if (spot[0] === 'middle')
            finalSpot = 'middle';
          else
            finalSpot = key === 'y' ? spot[0] : spot[1];

          safeSpots[dir] = finalSpot ?? 'unknown';
        }

        const dirOutputs: string[] = [];

        for (const dir of order) {
          dirOutputs.push(output[safeSpots[dir]]!());
        }

        return dirOutputs.join('->');
      },
      outputStrings: {
        n: Outputs.dirN,
        e: Outputs.dirE,
        s: Outputs.dirS,
        w: Outputs.dirW,
        middle: Outputs.middle,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'GolbezEx Gale Sphere Cleanup',
      type: 'StartsUsing',
      netRegex: { id: '845[89AB]', source: 'Gale Sphere', capture: false },
      condition: (data) => data.galeSphereCasts.length === 16,
      delaySeconds: 15,
      run: (data) => {
        data.galeSphereCasts = [];
      },
    },
    {
      id: 'GolbezEx Arctic Assault',
      type: 'MapEffect',
      netRegex: { location: '0[0-7]', flags: '00020001', capture: true },
      alertText: (data, matches, output) => {
        data.arcticAssaultMapEffects.push(matches.location as ArcticAssaultSlots);

        if (data.arcticAssaultMapEffects.length < 2)
          return;

        const possibleSpots = {
          'nw': true,
          'ne': true,
          'sw': true,
          'se': true,
        };

        for (const slot of data.arcticAssaultMapEffects) {
          delete possibleSpots[arcticAssaultQuadrants[slot]];
        }

        data.arcticAssaultMapEffects = [];

        const dirOutputs: string[] = [];

        const remainingSpots = Object.keys(possibleSpots);

        if (remainingSpots.length !== 2)
          return output.unknown!();

        const firstChar = remainingSpots[0]?.[0] ?? '';
        const lastChar = remainingSpots[0]?.[1] ?? '';

        // Handle the cardinal direction safe case for 2nd arctic assault
        if (remainingSpots.every((spot) => spot.startsWith(firstChar)))
          return output[firstChar]!();

        if (remainingSpots.every((spot) => spot.endsWith(lastChar)))
          return output[lastChar]!();

        for (const dir of Object.keys(possibleSpots)) {
          dirOutputs.push(output[dir]!());
        }

        return dirOutputs.join('/');
      },
      outputStrings: {
        nw: Outputs.dirNW,
        ne: Outputs.dirNE,
        sw: Outputs.dirSW,
        se: Outputs.dirSE,
        n: Outputs.dirN,
        e: Outputs.dirE,
        s: Outputs.dirS,
        w: Outputs.dirW,
        unknown: Outputs.unknown,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Eventide Fall/Eventide Triad': 'Eventide Fall/Triad',
        'Void Tornado/Void Aero III': 'Void Tornado/Aero III',
        'Void Aero III/Void Tornado': 'Void Aero III/Tornado',
      },
    },
  ],
};

export default triggerSet;
