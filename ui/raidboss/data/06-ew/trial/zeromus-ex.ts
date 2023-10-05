import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  miasmicBlastPositions?: ({ x: number; y: number })[];
  decOffset?: number;
}

const headmarkerMap = {
  'tankbuster': '016C',
  'blackHole': '014A',
  'spread': '0017',
  'enums': '00D3',
  'stack': '003E',
} as const;

const firstHeadmarker = parseInt(headmarkerMap.tankbuster, 16);
const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

const triggerSet: TriggerSet<Data> = {
  id: 'TheAbyssalFractureExtreme',
  zoneId: ZoneId.TheAbyssalFractureExtreme,
  timelineFile: 'zeromus-ex.txt',
  triggers: [
    {
      id: 'ZeromusEx Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: 'ZeromusEx Visceral Whirl NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B43', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text!({ dir1: output.ne!(), dir2: output.sw!() });
      },
      outputStrings: {
        text: {
          en: '${dir1}/${dir2}',
        },
        ne: Outputs.northeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: 'ZeromusEx Visceral Whirl NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B46', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text!({ dir1: output.nw!(), dir2: output.se!() });
      },
      outputStrings: {
        text: {
          en: '${dir1}/${dir2}',
        },
        nw: Outputs.northwest,
        se: Outputs.southeast,
      },
    },
    {
      id: 'ZeromusEx Miasmic Blast',
      type: 'StartsUsing',
      netRegex: { id: '8B49', capture: true },
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        // TODO: This trigger does not work 100% of the time in raidemulator and needs more testing in-zone
        data.miasmicBlastPositions ??= [];

        const combatants = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants;

        if (combatants === undefined || combatants.length !== 1) {
          console.error(
            `Miasmic Blast: unexpected response to getCombatants, got ${
              JSON.stringify(combatants)
            }`,
          );
          return;
        }

        const combatant = combatants[0];

        if (combatant === undefined)
          return;

        data.miasmicBlastPositions.push({
          x: combatant.PosX,
          y: combatant.PosY,
        });
      },
      infoText: (data, _matches, output) => {
        if (data.miasmicBlastPositions === undefined || data.miasmicBlastPositions.length < 3)
          return;
        const possibleSafeSpots = [
          'WNW',
          'NW',
          'NNW',
          'NNE',
          'NE',
          'ENE',
        ] as const;
        type safeSpotType = typeof possibleSafeSpots[number];
        // There's probably a better way to handle this rather than an exhaustive check
        let safeSpots: safeSpotType[] = [
          'WNW',
          'NW',
          'NNW',
          'NNE',
          'NE',
          'ENE',
        ];

        // From the center, Xs always spawn 0y, 7y, or 14y on either axis away from middle
        // So treat safe spots as half way between those possible points, on the edge
        const safeSpotMap: {
          [key in safeSpotType]: { x: number; y: number };
        } = {
          'WNW': { x: 80, y: 94 },
          'NW': { x: 80, y: 80 },
          'NNW': { x: 94, y: 80 },
          'NNE': { x: 106, y: 80 },
          'NE': { x: 120, y: 80 },
          'ENE': { x: 120, y: 94 },
        };

        for (const pos of data.miasmicBlastPositions) {
          const removeSpots: safeSpotType[] = [];
          for (const spot of safeSpots) {
            // If this blast is at a 45º angle to the safe spot, remove the safe spot
            const angle =
              ((Math.atan2(pos.y - safeSpotMap[spot].y, pos.x - safeSpotMap[spot].x) * 180 /
                Math.PI) + 180) % 90;
            if (Math.abs(angle - 45) < Number.EPSILON) {
              removeSpots.push(spot);
            }
          }
          safeSpots = safeSpots.filter((spot) => !removeSpots.includes(spot));
        }

        delete data.miasmicBlastPositions;

        if (safeSpots.length !== 1) {
          console.error(`Miasmic Blast: Could not find safe spot`, safeSpots);
          return output.unknown!();
        }

        const safeSpot = safeSpots[0] ?? 'unknown';

        return output[safeSpot]!();
      },
      outputStrings: {
        WNW: Outputs.dirWNW,
        NW: Outputs.dirNW,
        NNW: Outputs.dirNNW,
        NNE: Outputs.dirNNE,
        NE: Outputs.dirNE,
        ENE: Outputs.dirENE,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'ZeromusEx Fractured Eventide NE Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B3C', capture: false },
      alertText: (_data, _matches, output) => output.ne!(),
      outputStrings: {
        ne: Outputs.northeast,
      },
    },
    {
      id: 'ZeromusEx Fractured Eventide NW Safe',
      type: 'StartsUsing',
      netRegex: { id: '8B3D', capture: false },
      alertText: (_data, _matches, output) => output.nw!(),
      outputStrings: {
        nw: Outputs.northwest,
      },
    },
    {
      id: 'ZeromusEx Black Hole Headmarker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.role === 'tank',
      suppressSeconds: 20,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkerMap.blackHole)
          return output.blackHole!();
      },
      outputStrings: {
        blackHole: {
          en: 'Black Hole on YOU',
        },
      },
    },
    {
      id: 'ZeromusEx Spread Headmarker',
      type: 'HeadMarker',
      netRegex: { capture: true },
      condition: (data, matches) =>
        data.decOffset !== undefined && getHeadmarkerId(data, matches) === headmarkerMap.spread,
      suppressSeconds: 2,
      response: Responses.spread(),
    },
    {
      id: 'ZeromusEx Enum Headmarker',
      type: 'HeadMarker',
      netRegex: { capture: true },
      condition: (data, matches) =>
        data.decOffset !== undefined && getHeadmarkerId(data, matches) === headmarkerMap.enums,
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.enumeration!(),
      outputStrings: {
        enumeration: {
          en: 'Enumeration',
          de: 'Enumeration',
          fr: 'Énumération',
          ja: 'エアーバンプ',
          cn: '蓝圈分摊',
          ko: '2인 장판',
        },
      },
    },
    {
      id: 'ZeromusEx Stack Headmarker',
      type: 'HeadMarker',
      netRegex: { capture: true },
      condition: (data, matches) =>
        data.decOffset !== undefined && getHeadmarkerId(data, matches) === headmarkerMap.stack,
      response: Responses.stackMarkerOn(),
    },
  ],
};

export default triggerSet;
