import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  terrastormCount: number;
  terrastormCombatantDirs: number[];
}

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
    };
  },
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
        const wanted = data.terrastormCount === 0 ? 2 : 3;
        if (data.terrastormCombatantDirs.length < wanted)
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
      netRegex: { id: '84AD', source: 'Golbez', capture: false },
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
          en: 'role positions',
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
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'GolbezEx Void Tornado',
      type: 'StartsUsing',
      netRegex: { id: '845D', source: 'Golbez', capture: false },
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
    {
      id: 'GolbezEx Void Aero III',
      type: 'StartsUsing',
      netRegex: { id: '845C', source: 'Golbez', capture: false },
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
      alertText: (_data, _matches, output) => output.healerGroups!(),
      outputStrings: {
        healerGroups: Outputs.healerGroups,
      },
    },
  ],
};

export default triggerSet;
