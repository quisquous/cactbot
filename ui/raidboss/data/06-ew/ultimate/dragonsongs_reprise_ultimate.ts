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
import { LocaleText, TriggerSet } from '../../../../../types/trigger';

// TODO: Ser Adelphel left/right movement after initial charge
// TODO: Meteor "run" call?
// TODO: Wyrmsbreath 2 cardinal positions for Cauterize and adjust delay
// TODO: Intercard instead of left/right for Hallowed Wings with Cauterize
// TODO: Trigger for Hallowed Wings with Hot Tail/Hot Wings

type Phase = 'doorboss' | 'thordan' | 'nidhogg' | 'haurchefant' | 'thordan2' | 'nidhogg2' | 'dragon-king';

export interface Data extends RaidbossData {
  phase: Phase;
  decOffset?: number;
  seenEmptyDimension?: boolean;
  adelphelId?: string;
  firstAdelphelJump: boolean;
  adelphelDir?: number;
  spiralThrustSafeZones?: number[];
  thordanJumpCounter?: number;
  thordanDir?: number;
  sanctityWardDir?: string;
  thordanMeteorMarkers: string[];
  // mapping of player name to 1, 2, 3 dot.
  diveFromGraceNum: { [name: string]: number };
  // mapping of 1, 2, 3 to whether that group has seen an arrow.
  diveFromGraceHasArrow: { [num: number]: boolean };
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
  // vfx/lockon/eff/r1fz_lockon_num01_s5x.avfx through num03
  'dot1': '013F',
  'dot2': '0140',
  'dot3': '0141',
} as const;

const firstMarker = (phase: Phase) => {
  return phase === 'doorboss' ? headmarkers.hyperdimensionalSlash : headmarkers.skywardLeap;
};

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

// Calculate combatant position in an all 8 cards/intercards
const matchedPositionTo8Dir = (combatant: PluginCombatantState) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;

  // During Thordan, knight dives start at the 8 cardinals + numerical
  // slop on a radius=23 circle.
  // N = (100, 77), E = (123, 100), S = (100, 123), W = (77, 100)
  // NE = (116.26, 83.74), SE = (116.26, 116.26), SW = (83.74, 116.26), NW = (83.74, 83.74)
  //
  // Map NW = 0, N = 1, ..., W = 7

  return (Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8);
};

// Calculate combatant position in 4 cardinals
const matchedPositionTo4Dir = (combatant: PluginCombatantState) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;

  // During the vault knights, Adelphel will jump to one of the 4 cardinals
  // N = (100, 78), E = (122, 100), S = (100, 122), W = (78, 100)
  //
  // N = 0, E = 1, S = 2, W = 3

  return (Math.round(2 - 2 * Math.atan2(x, y) / Math.PI) % 4);
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'dragonsongs_reprise_ultimate.txt',
  initData: () => {
    return {
      phase: 'doorboss',
      firstAdelphelJump: true,
      thordanMeteorMarkers: [],
      diveFromGraceNum: {},
      diveFromGraceHasArrow: { 1: false, 2: false, 3: false },
    };
  },
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      // 62D4 = Holiest of Holy
      // 63C8 = Ascalon's Mercy Concealed
      // 6708 = Final Chorus
      // 62E2 = Spear of the Fury
      // 6B86 = Incarnation
      // 6667 = unknown_6667
      // 71E4 = Shockwave
      netRegex: NetRegexes.startsUsing({ id: ['62D4', '63C8', '6708', '62E2', '6B86', '6667', '7438'], capture: true }),
      run: (data, matches) => {
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            data.phase = 'thordan';
            break;
          case '6708':
            data.phase = 'nidhogg';
            break;
          case '62E2':
            data.phase = 'haurchefant';
            break;
          case '6B86':
            data.phase = 'thordan2';
            break;
          case '6667':
            data.phase = 'nidhogg2';
            break;
          case '71E4':
            data.phase = 'dragon-king';
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
        const firstHeadmarker: number = parseInt(firstMarker(data.phase), 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'DSR Holiest of Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4', source: 'Ser Adelphel', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Holiest Hallowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D0', source: 'Ser Adelphel' }),
      response: Responses.interrupt(),
    },
    {
      id: 'DSR Empty Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DA', source: 'Ser Grinnaux', capture: false }),
      alertText: (data, _matches, output) => {
        return data.phase !== 'doorboss' || data.seenEmptyDimension ? output.in!() : output.inAndTether!();
      },
      run: (data) => data.seenEmptyDimension = true,
      outputStrings: {
        inAndTether: {
          en: 'In + Tank Tether',
          de: 'Rein + Tank-Verbindung',
          fr: 'Intérieur + Liens tanks',
          ja: '中へ + タンク線取り',
          ko: '안으로 + 탱커 선 가로채기',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB', source: 'Ser Grinnaux', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC', source: 'Ser Grinnaux', capture: false }),
      condition: (data) => data.phase !== 'doorboss' || data.adelphelDir === undefined,
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
          fr: 'Slash sur VOUS',
          ja: '自分にハイパーディメンション',
          ko: '고차원 대상자',
        },
      },
    },
    {
      id: 'DSR Adelphel ID Tracker',
      // 62D2 Is Ser Adelphel's Holy Bladedance, casted once during the encounter
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D2', source: 'Ser Adelphel' }),
      run: (data, matches) => data.adelphelId = matches.sourceId,
    },
    {
      id: 'DSR Adelphel KB Direction',
      type: 'NameToggle',
      netRegex: NetRegexes.nameToggle({ toggle: '01' }),
      condition: (data, matches) => data.phase === 'doorboss' && matches.id === data.adelphelId && data.firstAdelphelJump,
      // Delay 0.1s here to prevent any race condition issues with getCombatants
      delaySeconds: 0.1,
      promise: async (data, matches) => {
        data.firstAdelphelJump = false;
        // Select Ser Adelphel
        let adelphelData = null;
        adelphelData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.id, 16)],
        });

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (adelphelData === null) {
          console.error(`Ser Adelphel: null data`);
          return;
        }
        const adelphelDataLength = adelphelData.combatants.length;
        if (adelphelDataLength !== 1) {
          console.error(`Ser Adelphel: expected 1 combatants got ${adelphelDataLength}`);
          return;
        }

        // Add the combatant's position
        const adelphel = adelphelData.combatants.pop();
        if (!adelphel)
          throw new UnreachableCode();
        data.adelphelDir = matchedPositionTo4Dir(adelphel);
      },
      infoText: (data, _matches, output) => {
        // Map of directions, reversed to call out KB direction
        const dirs: { [dir: number]: string } = {
          0: output.south!(),
          1: output.west!(),
          2: output.north!(),
          3: output.east!(),
          4: output.unknown!(),
        };
        return output.adelphelLocation!({
          dir: dirs[data.adelphelDir ?? 4],
        });
      },
      run: (data) => delete data.adelphelDir,
      outputStrings: {
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
        unknown: Outputs.unknown,
        adelphelLocation: {
          en: 'Go ${dir} (knockback)',
          de: 'Geh ${dir} (Rückstoß)',
          ja: '${dir}へ (ノックバック)',
          cn: '去 ${dir} (击退)',
          ko: '${dir}으로 (넉백)',
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
          fr: 'Cercle rouge',
          ja: '赤まる',
          ko: '빨강 동그라미',
        },
        triangle: {
          en: 'Green Triangle',
          de: 'Grünes Dreieck',
          fr: 'Triangle vert',
          ja: '緑さんかく',
          ko: '초록 삼각',
        },
        square: {
          en: 'Purple Square',
          de: 'Lilanes Viereck',
          fr: 'Carré violet',
          ja: '紫しかく',
          ko: '보라 사각',
        },
        x: {
          en: 'Blue X',
          de: 'Blaues X',
          fr: 'Croix bleue',
          ja: '青バツ',
          ko: '파랑 X',
        },
      },
    },
    {
      id: 'DSR Skyblind',
      // 631A Skyblind (2.2s cast) is a targetted ground aoe where A65 Skyblind
      // effect expired on the player.
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'A65' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Ascalon\'s Mercy Concealed',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C8', source: 'King Thordan', capture: true }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      response: Responses.moveAway(),
    },
    {
      id: 'DSR Spiral Thrust Safe Spots',
      // 63D3 Strength of the Ward
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D3', source: 'King Thordan', capture: false }),
      condition: (data) => data.phase === 'thordan',
      // It appears that these adds can be in place at ~4.5s, but with latency this may fail for some.
      delaySeconds: 5,
      promise: async (data) => {
        // Collect Ser Vellguine (3636), Ser Paulecrain (3637), Ser Ignasse (3638) entities
        const vellguineLocaleNames: LocaleText = {
          en: 'Ser Vellguine',
          de: 'Vellguine',
          fr: 'sire Vellguine',
          ja: '聖騎士ヴェルギーン',
          cn: '圣骑士韦尔吉纳',
          ko: '성기사 벨긴',
        };

        const paulecrainLocaleNames: LocaleText = {
          en: 'Ser Paulecrain',
          de: 'Paulecrain',
          fr: 'sire Paulecrain',
          ja: '聖騎士ポールクラン',
          cn: '圣骑士波勒克兰',
          ko: '성기사 폴르크랭',
        };

        const ignasseLocaleNames: LocaleText = {
          en: 'Ser Ignasse',
          de: 'Ignasse',
          fr: 'sire Ignassel',
          ja: '聖騎士イニアセル',
          cn: '圣骑士伊尼亚斯',
          ko: '성기사 이냐스',
        };

        // Select the knights
        const combatantNameKnights = [];
        combatantNameKnights.push(vellguineLocaleNames[data.parserLang]);
        combatantNameKnights.push(paulecrainLocaleNames[data.parserLang]);
        combatantNameKnights.push(ignasseLocaleNames[data.parserLang]);

        const spiralThrusts = [];

        const knightCombatantData = await callOverlayHandler({
          call: 'getCombatants',
          names: combatantNameKnights,
        });

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here
        if (knightCombatantData === null) {
          console.error(`Spiral Thrust: null data`);
          return;
        }
        const combatantDataLength = knightCombatantData.combatants.length;
        if (combatantDataLength !== 3) {
          console.error(`Spiral Thrust: expected 3 combatants got ${combatantDataLength}`);
          return;
        }

        for (const combatant of knightCombatantData.combatants)
          spiralThrusts.push(matchedPositionTo8Dir(combatant));

        const [thrust0, thrust1, thrust2] = spiralThrusts;
        if (thrust0 === undefined || thrust1 === undefined || thrust2 === undefined)
          return;

        // Array of dirNums
        const dirNums = [0, 1, 2, 3, 4, 5, 6, 7];

        // Remove where the knights are at and where they will go to
        delete dirNums[(thrust0 + 4) % 8];
        delete dirNums[thrust0];
        delete dirNums[(thrust1 + 4) % 8];
        delete dirNums[thrust1];
        delete dirNums[(thrust2 + 4) % 8];
        delete dirNums[thrust2];

        // Remove null elements from the array to get remaining two dirNums
        dirNums.forEach((dirNum) => {
          if (dirNum !== null)
            (data.spiralThrustSafeZones ??= []).push(dirNum);
        });
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
        const thordanDataLength = thordanData.combatants.length;
        if (thordanDataLength !== 1) {
          console.error(`King Thordan: expected 1 combatants got ${thordanDataLength}`);
          return;
        }

        // Add the combatant's position
        const thordan = thordanData.combatants.pop();
        if (!thordan)
          throw new UnreachableCode();
        data.thordanDir = matchedPositionTo8Dir(thordan);
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
          en: '${dir} Thordan',
          de: '${dir} Thordan',
          ja: 'トールダン ${dir}',
          ko: '토르당 ${dir}',
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
          fr: 'Saut sur VOUS',
          ja: '自分に青マーカー',
          ko: '광역 대상자',
        },
      },
    },
    {
      id: 'DSR Ancient Quaga',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C6', source: 'King Thordan', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Sanctity of the Ward Direction',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E1', source: 'King Thordan', capture: false }),
      condition: (data) => data.phase === 'thordan',
      delaySeconds: 4.7,
      promise: async (data, _matches, output) => {
        // The two gladiators spawn in one of two positions: West (95, 100) or East (105, 100).
        // This triggers uses east/west location of the white knight, Ser Janlennoux (3635) to
        // determine where both knights will dash as they each only look in two directions.
        // Ser Janlenoux only looks towards the north (northeast or northwest).
        // Ser Adelphel only looks towards the south (southwest or southeast).
        // Thus we can just use one knight and get whether it is east or west for location.
        // Callout assumes starting from DRK position, but for east/west (two-movement strategy)
        // you can reverse the cw/ccw callout.
        const janlenouxLocaleNames: LocaleText = {
          en: 'Ser Janlenoux',
          de: 'Janlenoux',
          fr: 'sire Janlenoux',
          ja: '聖騎士ジャンルヌ',
          cn: '圣骑士让勒努',
          ko: '성기사 장르누',
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
        const combatantDataJanlenouxLength = combatantDataJanlenoux.combatants.length;
        if (combatantDataJanlenouxLength < 1) {
          console.error(`Ser Janlenoux: expected at least 1 combatants got ${combatantDataJanlenouxLength}`);
          return;
        }

        // Sort to retreive last combatant in list
        const sortCombatants = (a: PluginCombatantState, b: PluginCombatantState) => (a.ID ?? 0) - (b.ID ?? 0);
        const combatantJanlenoux = combatantDataJanlenoux.combatants.sort(sortCombatants).shift();
        if (!combatantJanlenoux)
          throw new UnreachableCode();

        // West (95, 100) or East (105, 100).
        if (combatantJanlenoux.PosX < 100)
          data.sanctityWardDir = output.clockwise!();
        if (combatantJanlenoux.PosX > 100)
          data.sanctityWardDir = output.counterclock!();
      },
      infoText: (data, _matches, output) => {
        return data.sanctityWardDir ?? output.unknown!();
      },
      run: (data) => delete data.sanctityWardDir,
      outputStrings: {
        clockwise: {
          en: 'Clockwise',
          de: 'Im Uhrzeigersinn',
          ja: '時計回り',
          ko: '시계방향',
        },
        counterclock: {
          en: 'Counterclockwise',
          de: 'Gegen den Uhrzeigersinn',
          ja: '反時計回り',
          ko: '반시계방향',
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
          de: '1',
          ja: '1',
          ko: '1',
        },
        sword2: {
          en: '2',
          de: '2',
          ja: '2',
          ko: '2',
        },
      },
    },
    {
      id: 'DSR Dragon\'s Gaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0', source: 'King Thordan', capture: false }),
      durationSeconds: 5,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'DSR Sanctity of the Ward Meteor Role',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data) => data.phase === 'thordan',
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id !== headmarkers.meteor)
          return;
        data.thordanMeteorMarkers.push(matches.target);
        const [p1, p2] = data.thordanMeteorMarkers.sort();
        if (data.thordanMeteorMarkers.length !== 2 || p1 === undefined || p2 === undefined)
          return;

        const p1dps = data.party.isDPS(p1);
        const p2dps = data.party.isDPS(p2);

        if (p1dps && p2dps)
          return output.dpsMeteors!({ player1: data.ShortName(p1), player2: data.ShortName(p2) });
        if (!p1dps && !p2dps)
          return output.tankHealerMeteors!({ player1: data.ShortName(p1), player2: data.ShortName(p2) });
        return output.unknownMeteors!({ player1: data.ShortName(p1), player2: data.ShortName(p2) });
      },
      outputStrings: {
        tankHealerMeteors: {
          en: 'Tank/Healer Meteors (${player1}, ${player2})',
          de: 'Tank/Heiler Meteore (${player1}, ${player2})',
          fr: 'Météores Tank/Healer (${player1}, ${player2})', // FIXME
          ja: 'タンヒラ 隕石 (${player1}, ${player2})',
          ko: '탱/힐 메테오 (${player1}, ${player2})',
        },
        dpsMeteors: {
          en: 'DPS Meteors (${player1}, ${player2})',
          de: 'DDs Meteore (${player1}, ${player2})',
          fr: 'Météores DPS (${player1}, ${player2})', // FIXME
          ja: 'DPS 隕石 (${player1}, ${player2})',
          ko: '딜러 메테오 (${player1}, ${player2})',
        },
        unknownMeteors: {
          en: '??? Meteors (${player1}, ${player2})',
          de: '??? Meteore (${player1}, ${player2})',
          ja: '??? 隕石 (${player1}, ${player2})',
          ko: '??? 메테오 (${player1}, ${player2})',
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
    {
      id: 'DSR Broad Swing Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C0', source: 'King Thordan', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Behind => Right',
          de: 'Hinter ihn => Rechts',
          ja: '後ろ => 右',
          ko: '뒤 => 오른쪽',
        },
      },
    },
    {
      id: 'DSR Broad Swing Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C1', source: 'King Thordan', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Behind => Left',
          de: 'Hinter ihn => Links',
          ja: '後ろ => 左',
          ko: '뒤 => 왼쪽',
        },
      },
    },
    {
      id: 'DSR Gnash and Lash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6712', source: 'Nidhogg', capture: false }),
      durationSeconds: 8,
      response: Responses.getOutThenIn(),
    },
    {
      id: 'DSR Lash and Gnash',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6713', source: 'Nidhogg', capture: false }),
      durationSeconds: 8,
      response: Responses.getInThenOut(),
    },
    {
      id: 'DSR Lash Gnash Followup',
      type: 'Ability',
      // 6715 = Gnashing Wheel
      // 6716 = Lashing Wheel
      netRegex: NetRegexes.ability({ id: ['6715', '6716'], source: 'Nidhogg' }),
      // These are ~3s apart.  Only call after the first (and ignore multiple people getting hit).
      suppressSeconds: 6,
      infoText: (_data, matches, output) => matches.id === '6715' ? output.in!() : output.out!(),
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Darkdragon Dive Single Tower',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6711', source: 'Nidhogg' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait',
          de: 'Ködern',
          ja: '誘導',
          ko: '공격 유도',
        },
      },
    },
    {
      id: 'DSR Dive From Grace Number',
      // This comes out ~5s before symbols.
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.dot1) {
          data.diveFromGraceNum[matches.target] = 1;
          if (matches.target === data.me)
            return output.num1!();
        } else if (id === headmarkers.dot2) {
          data.diveFromGraceNum[matches.target] = 2;
          if (matches.target === data.me)
            return output.num2!();
        } else if (id === headmarkers.dot3) {
          data.diveFromGraceNum[matches.target] = 3;
          if (matches.target === data.me)
            return output.num3!();
        }
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
      },
    },
    {
      id: 'DSR Dive From Grace Dir Collect',
      type: 'GainsEffect',
      // AC3 = High Jump Target
      // AC4 = Spineshatter Dive Target
      // AC5 = Elusive Jump Target
      // This only matches on non-circles.
      netRegex: NetRegexes.gainsEffect({ effectId: ['AC4', 'AC5'] }),
      run: (data, matches) => {
        const duration = parseFloat(matches.duration);
        // These come out in 9, 19, 30 seconds.
        if (duration < 15)
          data.diveFromGraceHasArrow[1] = true;
        else if (duration < 25)
          data.diveFromGraceHasArrow[2] = true;
        else
          data.diveFromGraceHasArrow[3] = true;
      },
    },
    {
      id: 'DSR Dive From Grace Dir You',
      type: 'GainsEffect',
      // AC3 = High Jump Target
      // AC4 = Spineshatter Dive Target
      // AC5 = Elusive Jump Target
      netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'] }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      alertText: (data, matches, output) => {
        const num = data.diveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFGYou: missing number: ${JSON.stringify(data.diveFromGraceNum)}`);
          return;
        }

        if (matches.effectId === 'AC4')
          return output.upArrow!({ num: num });
        else if (matches.effectId === 'AC5')
          return output.downArrow!({ num: num });

        if (data.diveFromGraceHasArrow[num])
          return output.circleWithArrows!({ num: num });
        return output.circleAllCircles!({ num: num });
      },
      outputStrings: {
        circleAllCircles: {
          en: '#${num} All Circles',
          de: '#${num} Alle Kreise',
          ja: '#${num} みんなハイジャンプ',
          ko: '#${num} 모두 하이점프',
        },
        circleWithArrows: {
          en: '#${num} Circle (with arrows)',
          de: '#${num} Kreise (mit Pfeilen)',
          ja: '#${num} 自分のみハイジャンプ',
          ko: '#${num} 나만 하이점프',
        },
        upArrow: {
          en: '#${num} Up Arrow',
          de: '#${num} Pfeil nach Vorne',
          ja: '#${num} 上矢印 / スパインダイブ',
          ko: '#${num} 위 화살표 / 척추 강타',
        },
        downArrow: {
          en: '#${num} Down Arrow',
          de: '#${num} Pfeil nach Hinten',
          ja: '#${num} 下矢印 / イルーシヴジャンプ',
          ko: '#${num} 아래 화살표 / 교묘한 점프',
        },
      },
    },
    {
      id: 'DSR Twisting Dive',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8B', source: 'Vedrfolnir', capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Twisters',
          de: 'Wirbelstürme',
          fr: 'Tornades',
          ja: '大竜巻',
          cn: '旋风',
          ko: '회오리',
        },
      },
    },
    {
      id: 'DSR Akh Afah',
      // 6D41 Akh Afah from Hraesvelgr, and 64D2 is immediately after
      // 6D43 Akh Afah from Nidhogg, and 6D44 is immediately after
      // Hits highest emnity target
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D41', '6D43'], source: ['Hraesvelgr', 'Nidhogg'], capture: false }),
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Tank Groups',
          de: 'Tank Gruppen',
          ja: 'タンクと頭割り',
          ko: '탱커와 그룹 쉐어',
        },
      },
    },
    {
      id: 'DSR Hallowed Wings and Plume',
      // 6D23 Head Down, Left Wing
      // 6D24 Head Up, Left Wing
      // 6D26 Head Down, Right Wing
      // 6D27 Head Up, Right Wing
      // Head Up = Tanks Far
      // Head Down = Tanks Near
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D23', '6D24', '6D26', '6D27'], source: 'Hraesvelgr' }),
      alertText: (data, matches, output) => {
        let head;
        let wings;
        switch (matches.id) {
          case '6D23':
            wings = output.right!();
            head = data.role === 'tank' ? output.near!() : output.far!();
            break;
          case '6D24':
            wings = output.right!();
            head = data.role === 'tank' ? output.far!() : output.near!();
            break;
          case '6D26':
            wings = output.left!();
            head = data.role === 'tank' ? output.near!() : output.far!();
            break;
          case '6D27':
            wings = output.left!();
            head = data.role === 'tank' ? output.far!() : output.near!();
            break;
        }
        return output.text!({ wings: wings, head: head });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        near: {
          en: 'Near Hraesvelgr (Tankbusters)',
          de: 'Nahe Hraesvelgr (Tankbuster)',
          ja: 'フレースヴェルグに近づく (タンクバスター)',
          ko: '흐레스벨그 부근으로 (탱버)',
        },
        far: {
          en: 'Far from Hraesvelgr (Tankbusters)',
          de: 'Weit weg von Hraesvelgr (Tankbusters)',
          ja: 'フレースヴェルグから離れる (タンクバスター)',
          ko: '흐레스벨그와 멀어지기 (탱버)',
        },
        text: {
          en: '${wings}, ${head}',
          de: '${wings}, ${head}',
          ja: '${wings}, ${head}',
          ko: '${wings}, ${head}',
        },
      },
    },
    {
      id: 'DSR Wyrmsbreath 2 Boiling and Freezing',
      type: 'GainsEffect',
      // B52 = Boiling
      // B53 = Freezing
      // TODO: Get cardinal of the dragon to stand in
      // TODO: Adjust delay to when the bosses jump to cardinal
      netRegex: NetRegexes.gainsEffect({ effectId: ['B52', 'B53'] }),
      condition: Conditions.targetIsYou(),
      // Lasts 10.96s, but bosses do not cast Cauterize until 7.5s after debuff
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 6,
      infoText: (_data, matches, output) => {
        if (matches.id === 'B52')
          return output.hraesvelgr!();
        return output.nidhogg!();
      },
      outputStrings: {
        nidhogg: {
          en: 'Get hit by Nidhogg',
          de: 'Werde von Nidhogg getroffen',
          ja: 'ニーズヘッグに当たる',
          ko: '니드호그에게 맞기',
        },
        hraesvelgr: {
          en: 'Get hit by Hraesvelgr',
          de: 'Werde von Hraesvelgr getroffen',
          ja: 'フレースヴェルグに当たる',
          ko: '흐레스벨그에게 맞기',
        },
      },
    },
    {
      id: 'DSR Wyrmsbreath 2 Pyretic',
      type: 'GainsEffect',
      // B52 = Boiling
      // When Boiling expires, Pyretic (3C0) will apply
      // Pyretic will cause damage on movement
      netRegex: NetRegexes.gainsEffect({ effectId: ['B52'] }),
      condition: Conditions.targetIsYou(),
      // Boiling lasts 10.96s, after which Pyretic is applied provide warning
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
      // Player will have Pyretic for about 3s before hit by Cauterize
      durationSeconds: 4,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stop',
          de: 'Stopp',
          fr: 'Stop',
          ja: '動かない',
          cn: '停停停',
          ko: '멈추기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Empty Dimension/Full Dimension': 'Empty/Full Dimension',
        'Lash and Gnash/Gnash and Lash': 'Lash and Gnash',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Darkscale': 'Dunkelschuppe',
        'Dragon-king Thordan': 'König Thordan',
        'Estinien': 'Estinien',
        'Haurchefant': 'Haurchefant',
        'Hraesvelgr': 'Hraesvelgr',
        '(?<!Dragon-)King Thordan': 'Thordan',
        'Left Eye': 'Linkes Drachenauge',
        'Nidhogg': 'Nidhogg',
        'Right Eye': 'Rechtes Drachenauge',
        'Ser Adelphel': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux': 'Grinnaux',
        'Ser Guerrique': 'Guerrique',
        'Ser Haumeric': 'Haumeric',
        'Ser Hermenost': 'Hermenost',
        'Ser Ignasse': 'Ignasse',
        'Ser Janlenoux': 'Janlenoux',
        'Ser Noudenet': 'Noudenet',
        'Ser Zephirin': 'Zephirin',
        'Vedrfolnir': 'Vedrfölnir',
        'Ysayle': 'Ysayle',
      },
      'replaceText': {
        'Aetheric Burst': 'Ätherschub',
        'Akh Afah': 'Akh Afah',
        'Akh Morn(?!\'s Edge)': 'Akh Morn',
        'Akh Morn\'s Edge': 'Akh Morns Klinge',
        'Ancient Quaga': 'Seisga Antiqua',
        'Alternative End': 'Ein neues Ende',
        'Altar Flare': 'Altar-Flare',
        'Ascalon\'s Mercy Concealed': 'Askalons geheime Gnade',
        'Ascalon\'s Mercy Revealed': 'Askalons enthüllte Gnade',
        'Ascalon\'s Might': 'Macht von Askalon',
        'Brightblade\'s Steel': 'Schimmernder Stahl',
        'Brightwing(?!ed)': 'Lichtschwinge',
        'Brightwinged Flight': 'Flug der Lichtschwingen',
        'Broad Swing': 'Ausladender Schwung',
        'Cauterize': 'Kauterisieren',
        'Chain Lightning': 'Kettenblitz',
        'Conviction': 'Konviktion',
        'Dark Orb': 'Dunkler Orbis',
        'Darkdragon Dive': 'Dunkeldrachensturz',
        'Death of the Heavens': 'Himmel des Todes',
        'Deathstorm': 'Todessturm',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Dive from Grace': 'Gefallener Drache ',
        'Drachenlance': 'Drachenlanze',
        'Dread Wyrmsbreath': 'Dunkler Drachenodem',
        'Empty Dimension': 'Dimension der Leere',
        'Entangled Flames': 'Verwobene Flammen',
        'Exaflare\'s Edge': 'Exaflare-Klinge',
        'Execution': 'Exekution',
        'Eye of the Tyrant': 'Auge des Tyrannen',
        'Faith Unmoving': 'Fester Glaube',
        'Final Chorus': 'Endchoral',
        'Flame Breath': 'Flammenatem',
        'Flames of Ascalon': 'Flamme von Askalon',
        'Flare Nova': 'Flare Nova',
        'Flare Star': 'Flare-Stern',
        'Full Dimension': 'Dimension der Weite',
        'Geirskogul': 'Geirskogul',
        'Gigaflare\'s Edge': 'Gigaflare-Klinge',
        'Gnash and Lash': 'Reißen und Beißen',
        'Great Wyrmsbreath': 'Heller Drachenodem',
        'Hallowed Plume': 'Geweihte Feder',
        'Hallowed Wings': 'Heilige Schwingen',
        'Hatebound': 'Nidhoggs Hass',
        'Heavenly Heel': 'Himmelsschritt',
        'Heavens\' Stake': 'Himmelslanze',
        'Heavensblaze': 'Himmlisches Lodern',
        'Heavensflame': 'Himmlische Flamme',
        'Heavy Impact': 'Heftiger Einschlag',
        'Hiemal Storm': 'Hiemaler Sturm',
        'Holiest of Holy': 'Quell der Heiligkeit',
        'Holy Bladedance': 'Geweihter Schwerttanz',
        'Holy Breath': 'Heiliger Atem',
        'Holy Comet': 'Heiliger Komet',
        'Holy Orb': 'Heiliger Orbis',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Hot Tail': 'Schwelender Schweif',
        'Hot Wing': 'Flirrender Flügel',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Ice Breath': 'Eisatem',
        'Ice of Ascalon': 'Eis von Askalon',
        'Incarnation': 'Inkarnation',
        'Knights of the Round': 'Ritter der Runde',
        'Lash and Gnash': 'Beißen und Reißen',
        'Lightning Storm': 'Blitzsturm',
        'Liquid Heaven': 'Himmlisches Fluid',
        'Mirage Dive': 'Illusionssprung',
        'Mortal Vow': 'Schwur der Vergeltung',
        'Morn Afah\'s Edge': 'Morn Afahs Klinge',
        'Planar Prison': 'Dimensionsfalle',
        'Pure of Heart': 'Reines Herz',
        'Resentment': 'Bitterer Groll',
        'Revenge of the Horde': 'Rache der Horde',
        'Sacred Sever': 'Sakralschnitt',
        'Sanctity of the Ward': 'Erhabenheit der Königsschar',
        'Shockwave': 'Schockwelle',
        'Skyblind': 'Lichtblind',
        'Skyward Leap': 'Luftsprung',
        'Soul Tether': 'Seelenstrick',
        'Soul of Devotion': 'Essenz der Tugend',
        'Soul of Friendship': 'Essenz der Freundschaft',
        'Spear of the Fury': 'Speer der Furie',
        'Spiral Pierce': 'Spiralstich',
        'Spiral Thrust': 'Spiralstoß',
        'Spreading Flames': 'Flammende Rache',
        'Staggering Breath': 'Stoßender Atem',
        'Steep in Rage': 'Welle des Zorns',
        'Strength of the Ward': 'Übermacht der Königsschar',
        'Swirling Blizzard': 'Blizzardwirbel',
        'The Bull\'s Steel': 'Unbändiger Stahl',
        'The Dragon\'s Eye': 'Auge des Drachen',
        'The Dragon\'s Gaze': 'Blick des Drachen',
        'The Dragon\'s Glory': 'Ruhm des Drachen',
        'The Dragon\'s Rage': 'Zorn des Drachen',
        'Tower': 'Turm',
        'Touchdown': 'Himmelssturz',
        'Trinity': 'Trinität',
        'Twisting Dive': 'Spiralschwinge',
        'Ultimate End': 'Ultimatives Ende',
        'Wrath of the Heavens': 'Himmel des Zorns',
        'Wroth Flames': 'Flammender Zorn',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Darkscale': 'Sombrécaille',
        'Dragon-king Thordan': 'Thordan le Dieu Dragon',
        'Estinien': 'Estinien',
        'Haurchefant': 'Haurchefant',
        'Hraesvelgr': 'Hraesvelgr',
        '(?<!Dragon-)King Thordan': 'roi Thordan',
        'Left Eye': 'Œil gauche',
        'Nidhogg': 'Nidhogg',
        'Right Eye': 'Œil droit',
        'Ser Adelphel': 'sire Adelphel',
        'Ser Charibert': 'sire Charibert',
        'Ser Grinnaux': 'sire Grinnaux',
        'Ser Guerrique': 'sire Guerrique',
        'Ser Haumeric': 'sire Haumeric',
        'Ser Hermenost': 'sire Hermenoist',
        'Ser Ignasse': 'sire Ignassel',
        'Ser Janlenoux': 'sire Janlenoux',
        'Ser Noudenet': 'sire Noudenet',
        'Ser Zephirin': 'sire Zéphirin',
        'Vedrfolnir': 'Vedrfolnir',
        'Ysayle': 'Ysayle',
      },
      'replaceText': {
        'Aetheric Burst': 'Explosion éthérée',
        'Akh Afah': 'Akh Afah',
        'Akh Morn(?!\'s Edge)': 'Akh Morn',
        'Akh Morn\'s Edge': 'Lame d\'Akh Morn',
        'Ancient Quaga': 'Méga Séisme ancien',
        'Alternative End': 'Fin alternative',
        'Altar Flare': 'Brasier de l\'autel',
        'Ascalon\'s Mercy Concealed': 'Grâce d\'Ascalon dissimulée',
        'Ascalon\'s Mercy Revealed': 'Grâce d\'Ascalon révélée',
        'Ascalon\'s Might': 'Puissance d\'Ascalon',
        'Brightblade\'s Steel': 'Résolution radiante',
        'Brightwing(?!ed)': 'Aile lumineuse',
        'Brightwinged Flight': 'Vol céleste',
        'Broad Swing': 'Grand balayage',
        'Cauterize': 'Cautérisation',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Conviction': 'Conviction',
        'Dark Orb': 'Orbe ténébreux',
        'Darkdragon Dive': 'Piqué du dragon sombre',
        'Death of the Heavens': 'Condamnation d\'azur',
        'Deathstorm': 'Tempête de la mort',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Dive from Grace': 'Dragon déchu',
        'Drachenlance': 'Drachenlance',
        'Dread Wyrmsbreath': 'Souffle de Nidhogg',
        'Empty Dimension': 'Vide dimensionnel',
        'Entangled Flames': 'Flammes enchevêtrées',
        'Exaflare\'s Edge': 'Lame d\'ExaBrasier',
        'Execution': 'Exécution',
        'Eye of the Tyrant': 'Œil du tyran',
        'Faith Unmoving': 'Foi immuable',
        'Final Chorus': 'Chant ultime',
        'Flame Breath': 'Pyrosouffle',
        'Flames of Ascalon': 'Feu d\'Ascalon',
        'Flare Nova': 'Désastre flamboyant',
        'Flare Star': 'Astre flamboyant',
        'Full Dimension': 'Plénitude dimensionnelle',
        'Geirskogul': 'Geirskögul',
        'Gigaflare\'s Edge': 'Lame de GigaBrasier',
        'Gnash and Lash': 'Grincement tordu',
        'Great Wyrmsbreath': 'Souffle de Hraesvelgr',
        'Hallowed Plume': 'Écaille sacrée',
        'Hallowed Wings': 'Aile sacrée',
        'Hatebound': 'Lacération de Nidhogg',
        'Heavenly Heel': 'Estoc céleste',
        'Heavens\' Stake': 'Pal d\'azur',
        'Heavensblaze': 'Embrasement céleste',
        'Heavensflame': 'Flamme céleste',
        'Heavy Impact': 'Impact violent',
        'Hiemal Storm': 'Tempête hiémale',
        'Holiest of Holy': 'Saint des saints',
        'Holy Bladedance': 'Danse de la lame céleste',
        'Holy Breath': 'Souffle miraculeux',
        'Holy Comet': 'Comète miraculeuse',
        'Holy Orb': 'Orbe miraculeux',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Hot Tail': 'Queue calorifique',
        'Hot Wing': 'Aile calorifique',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Ice Breath': 'Givrosouffle',
        'Ice of Ascalon': 'Glace d\'Ascalon',
        'Incarnation': 'Incarnation sacrée',
        'Knights of the Round': 'Chevaliers de la Table ronde',
        'Lash and Gnash': 'Torsion grinçante',
        'Lightning Storm': 'Pluie d\'éclairs',
        'Liquid Heaven': 'Paradis liquide',
        'Mirage Dive': 'Piqué mirage',
        'Mortal Vow': 'Vœu d\'anéantissement',
        'Morn Afah\'s Edge': 'Lame de Morn Afah',
        'Planar Prison': 'Prison dimensionnelle',
        'Pure of Heart': 'Pureté du cœur',
        'Resentment': 'Râle d\'agonie',
        'Revenge of the Horde': 'Chant pour l\'avenir',
        'Sacred Sever': 'Scission sacrée',
        'Sanctity of the Ward': 'Béatitude du Saint-Siège',
        'Shockwave': 'Onde de choc',
        'Skyblind': 'Sceau céleste',
        'Skyward Leap': 'Bond céleste',
        'Soul Tether': 'Bride de l\'âme',
        'Soul of Devotion': 'Dévotion éternelle',
        'Soul of Friendship': 'Amitié éternelle',
        'Spear of the Fury': 'Lance de la Conquérante',
        'Spiral Pierce': 'Empalement tournoyant',
        'Spiral Thrust': 'Transpercement tournoyant',
        'Spreading Flames': 'Vengeance consumante',
        'Staggering Breath': 'Souffle ébranlant',
        'Steep in Rage': 'Onde de fureur',
        'Strength of the Ward': 'Force du Saint-Siège',
        'Swirling Blizzard': 'Blizzard tourbillonnant',
        'The Bull\'s Steel': 'Résolution rueuse',
        'The Dragon\'s Eye': 'Œil du dragon',
        'The Dragon\'s Gaze': 'Regard du dragon',
        'The Dragon\'s Glory': 'Gloire du dragon',
        'The Dragon\'s Rage': 'Colère du dragon',
        'Touchdown': 'Atterrissage',
        'Trinity': 'Trinité',
        'Twisting Dive': 'Plongeon-trombe',
        'Ultimate End': 'Fin ultime',
        'Wrath of the Heavens': 'Colère d\'azur',
        'Wroth Flames': 'Haine enflammée',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Darkscale': 'ダークスケール',
        'Dragon-king Thordan': '騎竜神トールダン',
        'Estinien': 'エスティニアン',
        'Haurchefant': 'オルシュファン',
        'Hraesvelgr': 'フレースヴェルグ',
        '(?<!Dragon-)King Thordan': '騎神トールダン',
        'Left Eye': '竜の左眼',
        'Nidhogg': 'ニーズヘッグ',
        'Right Eye': '竜の右眼',
        'Ser Adelphel': '聖騎士アデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux': '聖騎士グリノー',
        'Ser Guerrique': '聖騎士ゲリック',
        'Ser Haumeric': '聖騎士オムリク',
        'Ser Hermenost': '聖騎士エルムノスト',
        'Ser Ignasse': '聖騎士イニアセル',
        'Ser Janlenoux': '聖騎士ジャンルヌ',
        'Ser Noudenet': '聖騎士ヌドゥネー',
        'Ser Zephirin': '聖騎士ゼフィラン',
        'Vedrfolnir': 'ヴェズルフェルニル',
        'Ysayle': 'イゼル',
      },
      'replaceText': {
        'Aetheric Burst': 'エーテルバースト',
        'Akh Afah': 'アク・アファー',
        'Akh Morn(?!\'s Edge)': 'アク・モーン',
        'Akh Morn\'s Edge': '騎竜剣アク・モーン',
        'Ancient Quaga': 'エンシェントクエイガ',
        'Alternative End': 'アルティメットエンド・オルタナ',
        'Altar Flare': 'アルターフレア',
        'Ascalon\'s Mercy Concealed': 'インビジブル・アスカロンメルシー',
        'Ascalon\'s Mercy Revealed': 'レベレーション・アスカロンメルシー',
        'Ascalon\'s Might': 'アスカロンマイト',
        'Brightblade\'s Steel': '美剣の覚悟',
        'Brightwing(?!ed)': '光翼閃',
        'Brightwinged Flight': '蒼天の光翼',
        'Broad Swing': '大振り',
        'Cauterize': 'カータライズ',
        'Chain Lightning': 'チェインライトニング',
        'Conviction': 'コンヴィクション',
        'Dark Orb': 'ダークオーブ',
        'Darkdragon Dive': 'ダークドラゴンダイブ',
        'Death of the Heavens': '至天の陣：死刻',
        'Deathstorm': 'デスストーム',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Dive from Grace': '堕天のドラゴンダイブ',
        'Drachenlance': 'ドラッケンランス',
        'Dread Wyrmsbreath': '邪竜の息吹',
        'Empty Dimension': 'エンプティディメンション',
        'Entangled Flames': '道連れの炎',
        'Exaflare\'s Edge': '騎竜剣エクサフレア',
        'Execution': 'エクスキューション',
        'Eye of the Tyrant': 'アイ・オブ・タイラント',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Final Chorus': '終焉の竜詩',
        'Flame Breath': 'フレイムブレス',
        'Flames of Ascalon': 'フレイム・オブ・アスカロン',
        'Flare Nova': 'フレアディザスター',
        'Flare Star': 'フレアスター',
        'Full Dimension': 'フルディメンション',
        'Geirskogul': 'ゲイルスコグル',
        'Gigaflare\'s Edge': '騎竜剣ギガフレア',
        'Gnash and Lash': '牙尾の連旋',
        'Great Wyrmsbreath': '聖竜の息吹',
        'Hallowed Plume': 'ホーリーフェザー',
        'Hallowed Wings': 'ホーリーウィング',
        'Hatebound': '邪竜爪牙',
        'Heavenly Heel': 'ヘヴンリーヒール',
        'Heavens\' Stake': 'ヘヴンステイク',
        'Heavensblaze': 'ヘヴンブレイズ',
        'Heavensflame': 'ヘヴンフレイム',
        'Heavy Impact': 'ヘヴィインパクト',
        'Hiemal Storm': 'ハイマルストーム',
        'Holiest of Holy': 'ホリエストホーリー',
        'Holy Bladedance': 'ホーリーブレードダンス',
        'Holy Breath': 'ホーリーブレス',
        'Holy Comet': 'ホーリーコメット',
        'Holy Orb': 'ホーリーオーブ',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Hot Tail': 'ヒートテイル',
        'Hot Wing': 'ヒートウィング',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Ice Breath': 'コールドブレス',
        'Ice of Ascalon': 'アイス・オブ・アスカロン',
        'Incarnation': '聖徒化',
        'Knights of the Round': 'ナイツ・オブ・ラウンド',
        'Lash and Gnash': '尾牙の連旋',
        'Lightning Storm': '百雷',
        'Liquid Heaven': 'ヘブンリキッド',
        'Mirage Dive': 'ミラージュダイブ',
        'Mortal Vow': '滅殺の誓い',
        'Morn Afah\'s Edge': '騎竜剣モーン・アファー',
        'Planar Prison': 'ディメンションジェイル',
        'Pure of Heart': 'ピュア・オブ・ハート',
        'Resentment': '苦悶の咆哮',
        'Revenge of the Horde': '最期の咆哮',
        'Sacred Sever': 'セイクリッドカット',
        'Sanctity of the Ward': '蒼天の陣：聖杖',
        'Shockwave': '衝撃波',
        'Skyblind': '蒼天の刻印',
        'Skyward Leap': 'スカイワードリープ',
        'Soul Tether': 'ソウルテザー',
        'Soul of Devotion': '巫女の想い',
        'Soul of Friendship': '盟友の想い',
        'Spear of the Fury': 'スピア・オブ・ハルオーネ',
        'Spiral Pierce': 'スパイラルピアス',
        'Spiral Thrust': 'スパイラルスラスト',
        'Spreading Flames': '復讐の炎',
        'Staggering Breath': 'スタッガーブレス',
        'Steep in Rage': '憤怒の波動',
        'Strength of the Ward': '蒼天の陣：雷槍',
        'Swirling Blizzard': 'ブリザードサークル',
        'The Bull\'s Steel': '戦狂の覚悟',
        'The Dragon\'s Eye': '竜の眼',
        'The Dragon\'s Gaze': '竜の邪眼',
        'The Dragon\'s Glory': '邪竜の眼光',
        'The Dragon\'s Rage': '邪竜の魔炎',
        'Touchdown': 'タッチダウン',
        'Trinity': 'トリニティ',
        'Twisting Dive': 'ツイスターダイブ',
        'Ultimate End': 'アルティメットエンド',
        'Wrath of the Heavens': '至天の陣：風槍',
        'Wroth Flames': '邪念の炎',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Darkscale': '暗鳞黑龙',
        'Estinien': '埃斯蒂尼安',
        'Haurchefant': '奥尔什方',
        'Hraesvelgr': '赫拉斯瓦尔格',
        '(?<!Dragon-)King Thordan': '骑神托尔丹',
        'Left Eye': '巨龙左眼',
        'Nidhogg': '尼德霍格',
        'Right Eye': '巨龙右眼',
        'Ser Adelphel': '圣骑士阿代尔斐尔',
        'Ser Charibert': '圣骑士沙里贝尔',
        'Ser Grinnaux': '圣骑士格里诺',
        'Ser Guerrique': '圣骑士盖里克',
        'Ser Haumeric': '圣骑士奥默里克',
        'Ser Hermenost': '圣骑士埃尔姆诺斯特',
        'Ser Ignasse': '圣骑士伊尼亚斯',
        'Ser Janlenoux': '圣骑士让勒努',
        'Ser Noudenet': '圣骑士努德内',
        'Ser Zephirin': '圣骑士泽菲兰',
        'Vedrfolnir': '维德佛尔尼尔',
      },
      'replaceText': {
        'Aetheric Burst': '以太爆发',
        'Hallowed Wings': '神圣之翼',
        'Hot Tail': '燃烧之尾',
        'The Dragon\'s Gaze': '龙眼之邪',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Darkscale': '검은미늘',
        'Estinien': '에스티니앙',
        'Haurchefant': '오르슈팡',
        'Hraesvelgr': '흐레스벨그',
        '(?<!Dragon-)King Thordan': '기사신 토르당',
        'Left Eye': '용의 왼눈',
        'Nidhogg': '니드호그',
        'Right Eye': '용의 오른눈',
        'Ser Adelphel': '성기사 아델펠',
        'Ser Charibert': '성기사 샤리베르',
        'Ser Grinnaux': '성기사 그리노',
        'Ser Guerrique': '성기사 게리크',
        'Ser Haumeric': '성기사 오메리크',
        'Ser Hermenost': '성기사 에르메노',
        'Ser Ignasse': '성기사 이냐스',
        'Ser Janlenoux': '성기사 장르누',
        'Ser Noudenet': '성기사 누데네',
        'Ser Zephirin': '성기사 제피랭',
        'Vedrfolnir': '베드르폴니르',
      },
      'replaceText': {
        'Aetheric Burst': '에테르 분출',
        'Hallowed Wings': '신성한 날개',
        'Hot Tail': '뜨거운 꼬리',
        'The Dragon\'s Gaze': '용의 마안',
      },
    },
  ],
};

export default triggerSet;
