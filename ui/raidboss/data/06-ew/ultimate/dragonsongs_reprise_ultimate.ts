import NetRegexes from '../../../../../resources/netregexes';
import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { LocaleText, TriggerSet } from '../../../../../types/trigger';

// TODO: Ser Adelphel knockback charge direction
// TODO: Ser Adelphel left/right movement after initial charge
// TODO: "move" call after you take your Brightwing cleave?
// TODO: Strength of the Ward safe directions
// TODO: Strength of the Ward Thordan direction
// TODO: Sanctity of the Ward left/right direction, short+long/stutter movement
// TODO: Meteor "run" call?

type Phase = 'doorboss' | 'thordan';

export interface Data extends RaidbossData {
  phase: Phase;
  decOffset?: number;
  seenEmptyDimension?: boolean;
  spiralThrustSafeZones?: number[];
  thordanJumpCounter?: number;
  thordanDir?: number;
  sanctityWardDir?: number;
}

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon6_t0t.avfx
  'hyperdimensionalSlash': '00EA',
  // vfx/lockon/eff/r1fz_firechain_01x.avfx through 04x
  'firechainCircle': '0119',
  'firechainTriangle': '011A',
  'firechainSquare': '011B',
  'firechainX': '011C',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  'skywardLeap': '014A',
  // vfx/lockon/eff/m0244trg_a1t.avfx and a2t
  'sword1': '0032',
  'sword2': '0033',
  // vfx/lockon/eff/r1fz_holymeteo_s12x.avfx
  'meteor': '011D',
} as const;

const firstMarker: { [phase in Phase]: string } = {
  'doorboss': headmarkers.hyperdimensionalSlash,
  'thordan': headmarkers.skywardLeap,
} as const;

const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker'], firstDecimalMarker?: number) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined)
      throw new UnreachableCode();
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

// Calculate combatant position
const matchedPositionToDir = (combatant: PluginCombatantState) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;

  // During Thordan, knight dives start at the 8 cardinals + numerical
  // slop on a radius=23 circle.
  // N = (100, 77), E = (123, 100), S = (100, 123), W = (77, 100)
  // NE = (116.26, 83.74), SE = (116.26, 116.26), SW = (83.74, 116.26), NW = (83.74, 83.74)
  //
  // Starting with northwest to favor sorting between north and south for
  // Advanced Relativity party splits.
  // Map NW = 0, N = 1, ..., W = 7

  return (Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8);
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'dragonsongs_reprise_ultimate.txt',
  initData: () => {
    return {
      phase: 'doorboss',
    };
  },
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      // 62D4 = Holiest of Holy
      // 63C8 = Ascalon's Mercy Concealed
      netRegex: NetRegexes.startsUsing({ id: ['62D4', '63C8'], capture: true }),
      run: (data, matches) => {
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            data.phase = 'thordan';
            break;
        }
      },
    },
    {
      id: 'DSR Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        const firstHeadmarker: number = parseInt(firstMarker[data.phase], 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'DSR Holiest of Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4', source: 'Ser Adelphel', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62D4', source: 'Adelphel', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62D4', source: 'Sire Adelphel', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62D4', source: '聖騎士アデルフェル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62D4', source: '圣骑士阿代尔斐尔', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62D4', source: '성기사 아델펠', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Holiest Hallowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D0', source: 'Ser Adelphel' }),
      netRegexDe: NetRegexes.startsUsing({ id: '62D0', source: 'Adelphel' }),
      netRegexFr: NetRegexes.startsUsing({ id: '62D0', source: 'Sire Adelphel' }),
      netRegexJa: NetRegexes.startsUsing({ id: '62D0', source: '聖騎士アデルフェル' }),
      netRegexCn: NetRegexes.startsUsing({ id: '62D0', source: '圣骑士阿代尔斐尔' }),
      netRegexKo: NetRegexes.startsUsing({ id: '62D0', source: '성기사 아델펠' }),
      response: Responses.interrupt(),
    },
    {
      id: 'DSR Empty Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DA', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DA', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DA', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DA', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DA', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DA', source: '성기사 그리노', capture: false }),
      alertText: (data, _matches, output) => {
        return data.seenEmptyDimension ? output.in!() : output.inAndTether!();
      },
      run: (data) => data.seenEmptyDimension = true,
      outputStrings: {
        inAndTether: {
          en: 'In + Tank Tether',
          de: 'Rein + Tank-Verbindung',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DB', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DB', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DB', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DB', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DB', source: '성기사 그리노', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC', source: 'Ser Grinnaux', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62DC', source: 'Grinnaux', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62DC', source: 'Sire Grinnaux', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62DC', source: '聖騎士グリノー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '62DC', source: '圣骑士格里诺', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '62DC', source: '성기사 그리노', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'DSR Hyperdimensional Slash Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.hyperdimensionalSlash)
          return output.slashOnYou!();
      },
      outputStrings: {
        slashOnYou: {
          en: 'Slash on YOU',
          de: 'Schlag auf DIR',
        },
      },
    },
    {
      id: 'DSR Playstation Fire Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle)
          return output.circle!();
        if (id === headmarkers.firechainTriangle)
          return output.triangle!();
        if (id === headmarkers.firechainSquare)
          return output.square!();
        if (id === headmarkers.firechainX)
          return output.x!();
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          de: 'Roter Kreis',
        },
        triangle: {
          en: 'Green Triangle',
          de: 'Grünes Dreieck',
        },
        square: {
          en: 'Purple Square',
          de: 'Lilanes Viereck',
        },
        x: {
          en: 'Blue X',
          de: 'Blaues X',
        },
      },
    },
    {
      id: 'DSR Ascalon\'s Mercy Concealed',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C8', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '63C8', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '63C8', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '63C8', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '63C8', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '63C8', source: '기사신 토르당', capture: false }),
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Spiral Thrust Safe Spots',
      // 63D3 Strength of the Ward
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D3', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '63D3', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '63D3', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '63D3', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '63D3', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '63D3', source: '기사신 토르당', capture: false }),
      condition: (data) => data.phase === 'thordan',
      delaySeconds: 5,
      promise: async (data) => {
        // Collect Ser Vellguine (3636), Ser Paulecrain (3637), Ser Ignasse (3638) entities
        const vellguineLocaleNames: LocaleText = {
          en: 'Ser Vellguine',
        };

        const paulecrainLocaleNames: LocaleText = {
          en: 'Ser Paulecrain',
        };

        const ignasseLocaleNames: LocaleText = {
          en: 'Ser Ignasse',
        };

        // Select the knights
        const combatantNameKnights = [];
        combatantNameKnights.push(vellguineLocaleNames[data.parserLang]);
        combatantNameKnights.push(paulecrainLocaleNames[data.parserLang]);
        combatantNameKnights.push(ignasseLocaleNames[data.parserLang]);

        const spiralThrusts = [];
        for (const combatantName of combatantNameKnights) {
          let combatantData = null;
          if (combatantName) {
            combatantData = await callOverlayHandler({
              call: 'getCombatants',
              names: [combatantName],
            });
          }

          // if we could not retrieve combatant data, the
          // trigger will not work, so just resume promise here
          if (combatantData === null) {
            console.error(`Spiral Thrust: null data`);
            return;
          }
          if (!combatantData.combatants) {
            console.error(`Spiral Thrust: null combatants`);
            return;
          }
          const combatantDataLength = combatantData.combatants.length;
          if (combatantDataLength !== 1) {
            console.error(`Spiral Thrust: expected 1 combatants got ${combatantDataLength}`);
            return;
          }

          // Add the combatant's position
          const combatant = combatantData.combatants.pop();
          if (!combatant)
            throw new UnreachableCode();
          spiralThrusts.push(matchedPositionToDir(combatant));
        }

        if (spiralThrusts.length !== 3) {
          console.error(`Spiral Thrusts: expected 3 combatants got ${spiralThrusts.length}`);
          return;
        }

        // Array of dirNums
        const dirNums = [0, 1, 2, 3, 4, 5, 6, 7];

        // Remove where the knights are at and where they will go to
        if (spiralThrusts[0]) {
          delete dirNums[(spiralThrusts[0] + 4) % 8];
          delete dirNums[spiralThrusts[0]];
        }
        if (spiralThrusts[1]) {
          delete dirNums[(spiralThrusts[1] + 4) % 8];
          delete dirNums[spiralThrusts[1]];
        }
        if (spiralThrusts[2]) {
          delete dirNums[(spiralThrusts[2] + 4) % 8];
          delete dirNums[spiralThrusts[2]];
        }

        // Remove null elements from the array to get remaining two dirNums
        dirNums.forEach(
          (dirNum) => {
            if (dirNum !== null)
              (data.spiralThrustSafeZones ??= []).push(dirNum);
          }
        );
      },
      infoText: (data, _matches, output) => {
        data.spiralThrustSafeZones ??= [];
        if (data.spiralThrustSafeZones.length !== 2) {
          console.error(`Spiral Thrusts: expected 2 safe zones got ${data.spiralThrustSafeZones.length}`);
          return;
        }
        // Map of directions
        const dirs: { [dir: number]: string } = {
          0: output.northwest!(),
          1: output.north!(),
          2: output.northeast!(),
          3: output.east!(),
          4: output.southeast!(),
          5: output.south!(),
          6: output.southwest!(),
          7: output.west!(),
          8: output.unknown!(),
        };
        return output.safeSpots!({
          dir1: dirs[data.spiralThrustSafeZones[0] ?? 8],
          dir2: dirs[data.spiralThrustSafeZones[1] ?? 8],
        });
      },
      run: (data) => delete data.spiralThrustSafeZones,
      outputStrings: {
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        unknown: Outputs.unknown,
        safeSpots: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          fr: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
        },
      },
    },
    {
      id: 'DSR Dragon\'s Rage',
      // 63C4 Is Thordan's --middle-- action, thordan jumps again and becomes untargetable, shortly after the 2nd 6C34 action
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63C4', source: 'King Thordan' }),
      netRegexDe: NetRegexes.ability({ id: '63C4', source: 'Thordan' }),
      netRegexFr: NetRegexes.ability({ id: '63C4', source: 'Roi Thordan' }),
      netRegexJa: NetRegexes.ability({ id: '63C4', source: '騎神トールダン' }),
      netRegexCn: NetRegexes.ability({ id: '63C4', source: '骑神托尔丹' }),
      netRegexKo: NetRegexes.ability({ id: '63C4', source: '기사신 토르당' }),
      condition: (data) => (data.phase === 'thordan' && (data.thordanJumpCounter = (data.thordanJumpCounter ?? 0) + 1) === 2),
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        // Select King Thordan
        let thordanData = null;
        thordanData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (thordanData === null) {
          console.error(`King Thordan: null data`);
          return;
        }
        if (!thordanData.combatants) {
          console.error(`King Thordan: null combatants`);
          return;
        }
        const thordanDataLength = thordanData.combatants.length;
        if (thordanDataLength !== 1) {
          console.error(`King Thordan: expected 1 combatants got ${thordanDataLength}`);
          return;
        }

        // Add the combatant's position
        const thordan = thordanData.combatants.pop();
        if (!thordan)
          throw new UnreachableCode();
        data.thordanDir = matchedPositionToDir(thordan);
      },
      infoText: (data, _matches, output) => {
        // Map of directions
        const dirs: { [dir: number]: string } = {
          0: output.northwest!(),
          1: output.north!(),
          2: output.northeast!(),
          3: output.east!(),
          4: output.southeast!(),
          5: output.south!(),
          6: output.southwest!(),
          7: output.west!(),
          8: output.unknown!(),
        };
        return output.thordanLocation!({
          dir: dirs[data.thordanDir ?? 8],
        });
      },
      run: (data) => delete data.thordanDir,
      outputStrings: {
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        unknown: Outputs.unknown,
        thordanLocation: {
          en: 'Boss: ${dir}',
        },
      },
    },
    {
      id: 'DSR Skyward Leap',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.skywardLeap)
          return output.leapOnYou!();
      },
      outputStrings: {
        leapOnYou: {
          en: 'Leap on YOU',
          de: 'Sprung auf DIR',
        },
      },
    },
    {
      id: 'DSR Ancient Quaga',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C6', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63C6', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63C6', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63C6', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '63C6', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '63C6', source: '기사신 토르당', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Sanctity of the Ward Direction',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E1', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '63E1', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '63E1', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '63E1', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '63E1', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '63E1', source: '기사신 토르당', capture: false }),
      condition: (data) => data.phase === 'thordan',
      delaySeconds: 3,
      promise: async (data) => {
        // Only need to know one of the knights locations, Ser Janlenoux (3635)
        const janlenouxLocaleNames: LocaleText = {
          en: 'Ser Janlenoux',
        };

        // Select Ser Janlenoux
        let combatantNameJanlenoux = null;
        combatantNameJanlenoux = janlenouxLocaleNames[data.parserLang];

        let combatantDataJanlenoux = null;
        if (combatantNameJanlenoux) {
          combatantDataJanlenoux = await callOverlayHandler({
            call: 'getCombatants',
            names: [combatantNameJanlenoux],
          });
        }

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (combatantDataJanlenoux === null) {
          console.error(`Ser Janlenoux: null data`);
          return;
        }
        if (!combatantDataJanlenoux.combatants) {
          console.error(`Ser Janlenoux: null combatants`);
          return;
        }
        const combatantDataJanlenouxLength = combatantDataJanlenoux.combatants.length;
        if (combatantDataJanlenouxLength <= 1) {
          console.error(`Ser Janlenoux: expected at least 1 combatants got ${combatantDataJanlenouxLength}`);
          return;
        }

        // Add the combatant's position
        combatantDataJanlenoux.combatants.pop();
        const combatantJanlenoux = combatantDataJanlenoux.combatants.pop();
        if (!combatantJanlenoux)
          throw new UnreachableCode();

        data.sanctityWardDir = matchedPositionToDir(combatantJanlenoux);
      },
      infoText: (data, _matches, output) => {
        // Map of directions
        const dirs: { [dir: number]: string } = {
          0: output.counterclock!(),
          1: output.unknown!(), // north position
          2: output.clockwise!(),
          3: output.clockwise!(),
          4: output.clockwise!(),
          5: output.unknown!(), // south position
          6: output.counterclock!(),
          7: output.counterclock!(),
          8: output.unknown!(),
        };
        return dirs[data.sanctityWardDir ?? 8];
      },
      run: (data) => delete data.sanctityWardDir,
      outputStrings: {
        clockwise: {
          en: 'Clockwise',
        },
        counterclock: {
          en: 'Counterclockwise',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'DSR Sanctity of the Ward Swords',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alarmText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.sword1)
          return output.sword1!();
        if (id === headmarkers.sword2)
          return output.sword2!();
      },
      outputStrings: {
        sword1: {
          en: '1',
        },
        sword2: {
          en: '2',
        },
      },
    },
    {
      id: 'DSR Dragon\'s Gaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0', source: 'King Thordan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '63D0', source: 'Thordan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '63D0', source: 'Roi Thordan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '63D0', source: '騎神トールダン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '63D0', source: '骑神托尔丹', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '63D0', source: '기사신 토르당', capture: false }),
      durationSeconds: 5,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'DSR Sanctity of the Ward Meteor Role',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data) => data.phase === 'thordan',
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id !== headmarkers.meteor)
          return;
        if (data.party.isDPS(matches.target))
          return output.dpsMeteors!();
        return output.tankHealerMeteors!();
      },
      outputStrings: {
        tankHealerMeteors: {
          en: 'Tank/Healer Meteors',
        },
        dpsMeteors: {
          en: 'DPS Meteors',
        },
      },
    },
    {
      id: 'DSR Sanctity of the Ward Meteor You',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.meteor)
          return output.meteorOnYou!();
      },
      outputStrings: {
        meteorOnYou: Outputs.meteorOnYou,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Empty Dimension/Full Dimension': 'Empty/Full Dimension',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'King Thordan': 'Thordan',
        'Ser Adelphel': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux': 'Grinnaux',
        'Ser Guerrique': 'Guerrique',
        'Ser Hermenost': 'Hermenost',
        'Ser Ignasse': 'Ignasse',
        'Ser Janlenoux': 'Janlenoux',
        'Ser Zephirin': 'Zephirin',
      },
      'replaceText': {
        'Ancient Quaga': 'Seisga Antiqua',
        'Ascalon\'s Mercy Concealed': 'Askalons geheime Gnade',
        'Ascalon\'s Might': 'Macht von Askalon',
        'Brightblade\'s Steel': 'Schimmernder Stahl',
        'Brightwing(?!ed)': 'Lichtschwinge',
        'Brightwinged Flight': 'Flug der Lichtschwingen',
        'Conviction': 'Konviktion',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Empty Dimension': 'Dimension der Leere',
        'Execution': 'Exekution',
        'Faith Unmoving': 'Fester Glaube',
        'Full Dimension': 'Dimension der Weite',
        'Heavenly Heel': 'Himmelsschritt',
        'Heavensblaze': 'Himmlisches Lodern',
        'Heavensflame': 'Himmlische Flamme',
        'Heavy Impact': 'Heftiger Einschlag',
        'Holiest of Holy': 'Quell der Heiligkeit',
        'Holy Bladedance': 'Geweihter Schwerttanz',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Knights of the Round': 'Ritter der Runde',
        'Lightning Storm': 'Blitzsturm',
        'Planar Prison': 'Dimensionsfalle',
        'Pure of Heart': 'Reines Herz',
        'Skyblind': 'Lichtblind',
        'Skyward Leap': 'Luftsprung',
        'Spear of the Fury': 'Speer der Furie',
        'Spiral Thrust': 'Spiralstoß',
        'Strength of the Ward': 'Übermacht der Königsschar',
        'The Bull\'s Steel': 'Unbändiger Stahl',
        'The Dragon\'s Rage': 'Zorn des Drachen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'King Thordan': 'roi Thordan',
        'Ser Adelphel': 'sire Adelphel',
        'Ser Charibert': 'sire Charibert',
        'Ser Grinnaux': 'sire Grinnaux',
        'Ser Guerrique': 'sire Guerrique',
        'Ser Hermenost': 'sire Hermenoist',
        'Ser Ignasse': 'sire Ignassel',
        'Ser Janlenoux': 'sire Janlenoux',
        'Ser Zephirin': 'sire Zéphirin',
      },
      'replaceText': {
        'Ancient Quaga': 'Méga Séisme ancien',
        'Ascalon\'s Mercy Concealed': 'Grâce d\'Ascalon dissimulée',
        'Ascalon\'s Might': 'Puissance d\'Ascalon',
        'Brightblade\'s Steel': 'Résolution radiante',
        'Brightwing(?!ed)': 'Aile lumineuse',
        'Brightwinged Flight': 'Vol céleste',
        'Conviction': 'Conviction',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Empty Dimension': 'Vide dimensionnel',
        'Execution': 'Exécution',
        'Faith Unmoving': 'Foi immuable',
        'Full Dimension': 'Plénitude dimensionnelle',
        'Heavenly Heel': 'Estoc céleste',
        'Heavensblaze': 'Embrasement céleste',
        'Heavensflame': 'Flamme céleste',
        'Heavy Impact': 'Impact violent',
        'Holiest of Holy': 'Saint des saints',
        'Holy Bladedance': 'Danse de la lame céleste',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Knights of the Round': 'Chevaliers de la Table ronde',
        'Lightning Storm': 'Pluie d\'éclairs',
        'Planar Prison': 'Prison dimensionnelle',
        'Pure of Heart': 'Pureté du cœur',
        'Skyblind': 'Sceau céleste',
        'Skyward Leap': 'Bond céleste',
        'Spear of the Fury': 'Lance de la Conquérante',
        'Spiral Thrust': 'Transpercement tournoyant',
        'Strength of the Ward': 'Force du Saint-Siège',
        'The Bull\'s Steel': 'Résolution rueuse',
        'The Dragon\'s Rage': 'Colère du dragon',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'King Thordan': '騎神トールダン',
        'Ser Adelphel': '聖騎士アデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux': '聖騎士グリノー',
        'Ser Guerrique': '聖騎士ゲリック',
        'Ser Hermenost': '聖騎士エルムノスト',
        'Ser Ignasse': '聖騎士イニアセル',
        'Ser Janlenoux': '聖騎士ジャンルヌ',
        'Ser Zephirin': '聖騎士ゼフィラン',
      },
      'replaceText': {
        'Ancient Quaga': 'エンシェントクエイガ',
        'Ascalon\'s Mercy Concealed': 'インビジブル・アスカロンメルシー',
        'Ascalon\'s Might': 'アスカロンマイト',
        'Brightblade\'s Steel': '美剣の覚悟',
        'Brightwing(?!ed)': '光翼閃',
        'Brightwinged Flight': '蒼天の光翼',
        'Conviction': 'コンヴィクション',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Empty Dimension': 'エンプティディメンション',
        'Execution': 'エクスキューション',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Full Dimension': 'フルディメンション',
        'Heavenly Heel': 'ヘヴンリーヒール',
        'Heavensblaze': 'ヘヴンブレイズ',
        'Heavensflame': 'ヘヴンフレイム',
        'Heavy Impact': 'ヘヴィインパクト',
        'Holiest of Holy': 'ホリエストホーリー',
        'Holy Bladedance': 'ホーリーブレードダンス',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Knights of the Round': 'ナイツ・オブ・ラウンド',
        'Lightning Storm': '百雷',
        'Planar Prison': 'ディメンションジェイル',
        'Pure of Heart': 'ピュア・オブ・ハート',
        'Skyblind': '蒼天の刻印',
        'Skyward Leap': 'スカイワードリープ',
        'Spear of the Fury': 'スピア・オブ・ハルオーネ',
        'Spiral Thrust': 'スパイラルスラスト',
        'Strength of the Ward': '蒼天の陣：雷槍',
        'The Bull\'s Steel': '戦狂の覚悟',
        'The Dragon\'s Rage': '邪竜の魔炎',
      },
    },
  ],
};

export default triggerSet;
