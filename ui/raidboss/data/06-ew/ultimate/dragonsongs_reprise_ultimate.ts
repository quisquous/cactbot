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
import { LocaleObject, LocaleText, TriggerSet } from '../../../../../types/trigger';

// TODO: Ser Adelphel left/right movement after initial charge
// TODO: Meteor "run" call?
// TODO: Wyrmsbreath 2 cardinal positions for Cauterize and adjust delay
// TODO: Trigger for Hallowed Wings with Hot Tail/Hot Wings
// TODO: Phase 6 Resentment callout?

type Phase = 'doorboss' | 'thordan' | 'nidhogg' | 'haurchefant' | 'thordan2' | 'nidhogg2' | 'dragon-king';

const playstationMarkers = ['circle', 'cross', 'triangle', 'square'] as const;
type PlaystationMarker = typeof playstationMarkers[number];

export interface Data extends RaidbossData {
  combatantData: PluginCombatantState[];
  phase: Phase;
  decOffset?: number;
  seenEmptyDimension?: boolean;
  adelphelId?: string;
  firstAdelphelJump: boolean;
  adelphelDir?: number;
  brightwingCounter: number;
  spiralThrustSafeZones?: number[];
  sanctityWardDir?: string;
  sanctitySword1?: string;
  sanctitySword2?: string;
  thordanMeteorMarkers: string[];
  // mapping of player name to 1, 2, 3 dot.
  diveFromGraceNum: { [name: string]: number };
  // mapping of 1, 2, 3 to whether that group has seen an arrow.
  diveFromGraceHasArrow: { [num: number]: boolean };
  diveFromGraceDir: { [name: string]: 'circle' | 'up' | 'down' };
  diveFromGraceLashGnashKey: 'in' | 'out' | 'unknown';
  // mapping of player name to x coordinate
  diveFromGracePositions: { [name: string]: number };
  diveFromGraceTowerCounter?: number;
  eyeOfTheTyrantCounter: number;
  diveFromGracePreviousPosition: { [num: string]: 'middle' | 'west' | 'east' };
  waitingForGeirskogul?: boolean;
  stackAfterGeirskogul?: boolean;
  diveCounter: number;
  // names of players with chain lightning during wrath.
  thunderstruck: string[];
  hasDoom: { [name: string]: boolean };
  deathMarker: { [name: string]: PlaystationMarker };
  addsPhaseNidhoggId?: string;
  hraesvelgrGlowing?: boolean;
  nidhoggGlowing?: boolean;
  hallowedWingsCount: number;
  spreadingFlame: string[];
  entangledFlame: string[];
  mortalVowPlayer?: string;
  firstGigaflare?: number[];
  secondGigaflare?: number[];
  centerGigaflare?: number[];
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
  'skywardTriple': '014A',
  // vfx/lockon/eff/m0244trg_a1t.avfx and a2t
  'sword1': '0032',
  'sword2': '0033',
  // vfx/lockon/eff/r1fz_holymeteo_s12x.avfx
  'meteor': '011D',
  // vfx/lockon/eff/r1fz_lockon_num01_s5x.avfx through num03
  'dot1': '013F',
  'dot2': '0140',
  'dot3': '0141',
  // vfx/lockon/eff/m0005sp_19o0t.avfx
  'skywardSingle': '000E',
  // vfx/lockon/eff/bahamut_wyvn_glider_target_02tm.avfx
  'cauterize': '0014',
} as const;

const playstationHeadmarkerIds: readonly string[] = [
  headmarkers.firechainCircle,
  headmarkers.firechainTriangle,
  headmarkers.firechainSquare,
  headmarkers.firechainX,
] as const;

const playstationMarkerMap: { [id: string]: PlaystationMarker } = {
  [headmarkers.firechainCircle]: 'circle',
  [headmarkers.firechainTriangle]: 'triangle',
  [headmarkers.firechainSquare]: 'square',
  [headmarkers.firechainX]: 'cross',
} as const;

const firstMarker = (phase: Phase) => {
  return phase === 'doorboss' ? headmarkers.hyperdimensionalSlash : headmarkers.skywardTriple;
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
      combatantData: [],
      phase: 'doorboss',
      firstAdelphelJump: true,
      brightwingCounter: 1,
      thordanMeteorMarkers: [],
      diveFromGraceNum: {},
      diveFromGraceHasArrow: { 1: false, 2: false, 3: false },
      diveFromGraceLashGnashKey: 'unknown',
      diveFromGracePositions: {},
      diveFromGraceDir: {},
      eyeOfTheTyrantCounter: 0,
      diveFromGracePreviousPosition: {},
      diveCounter: 1,
      thunderstruck: [],
      hasDoom: {},
      deathMarker: {},
      hallowedWingsCount: 0,
      spreadingFlame: [],
      entangledFlame: [],
    };
  },
  timelineTriggers: [
    {
      id: 'DSR Eye of the Tyrant Counter',
      regex: /Eye of the Tyrant/,
      beforeSeconds: 1,
      run: (data) => data.eyeOfTheTyrantCounter++,
    },
    {
      id: 'DSR Resentment',
      regex: /Resentment/,
      beforeSeconds: 5,
      condition: (data) => data.phase === 'nidhogg',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'aoe + dot',
          de: 'AoE + DoT',
          fr: 'AoE + dot',
          ja: 'AoE + DoT',
          cn: 'AOE + dot',
          ko: '전체공격 + 도트뎀',
        },
      },
    },
    {
      id: 'DSR Mortal Vow',
      regex: /Mortal Vow/,
      // 3.7s to avoid early movement at Touchdown and last Mortal Vow
      beforeSeconds: 3.7,
      durationSeconds: 3.7,
      infoText: (data, _matches, output) => {
        if (data.me === data.mortalVowPlayer)
          return output.vowOnYou!();
        if (data.mortalVowPlayer)
          return output.vowOn!({ player: data.mortalVowPlayer });
        return output.vowSoon!();
      },
      outputStrings: {
        vowOnYou: {
          en: 'Vow on you',
          ko: '멸살의 맹세 대상자',
        },
        vowOn: {
          en: 'Vow on ${player}',
          ko: '${player} 멸살의 맹세',
        },
        vowSoon: {
          en: 'Vow soon (Spread)',
          ko: '곧 멸살의 맹세 (산개)',
        },
      },
    },
  ],
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
        // On the unlikely chance that somebody proceeds directly from the checkpoint into the next phase.
        data.brightwingCounter = 1;

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
            // This ability is used in both doorboss and haurchefant.
            if (data.phase !== 'doorboss')
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
      condition: (data) => {
        // Drop the knockback call during Playstation2 as there is too much going on.
        if (data.phase === 'thordan2')
          return false;
        return data.phase !== 'doorboss' || data.adelphelDir === undefined;
      },
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
          return output.cross!();
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
        cross: {
          en: 'Blue X',
          de: 'Blaues X',
          fr: 'Croix bleue',
          ja: '青バツ',
          ko: '파랑 X',
        },
      },
    },
    {
      id: 'DSR Brightwing Counter',
      type: 'Ability',
      // Visually, this comes from Ser Charibert.  However, ~30% of the time
      // the first set of Brightwing cleaves come from King Thordan/Ser Hermonst
      // entities.  This is likely just stale combatant data from the ffxiv plugin.
      netRegex: NetRegexes.ability({ id: '6319', capture: false }),
      // One ability for each player hit (hopefully only two??)
      suppressSeconds: 1,
      infoText: (data, _matches, output) => output[`dive${data.brightwingCounter}`]!(),
      run: (data) => data.brightwingCounter++,
      outputStrings: {
        // Ideally folks can customize this with who needs to run in.
        dive1: Outputs.num1,
        dive2: Outputs.num2,
        dive3: Outputs.num3,
        dive4: Outputs.num4,
      },
    },
    {
      id: 'DSR Brightwing Move',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6319', source: 'Ser Charibert' }),
      condition: Conditions.targetIsYou(),
      // Once hit, drop your Skyblind puddle somewhere else.
      response: Responses.moveAway('alert'),
    },
    {
      id: 'DSR Skyblind',
      // 631A Skyblind (2.2s cast) is a targeted ground aoe where A65 Skyblind
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
        const combatantNameKnights: string[] = [];
        combatantNameKnights.push(vellguineLocaleNames[data.parserLang] ?? vellguineLocaleNames['en']);
        combatantNameKnights.push(paulecrainLocaleNames[data.parserLang] ?? paulecrainLocaleNames['en']);
        combatantNameKnights.push(ignasseLocaleNames[data.parserLang] ?? ignasseLocaleNames['en']);

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
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63D7', source: 'Ser Guerrique', capture: false }),
      durationSeconds: 7,
      promise: async (data) => {
        // These are the first actions these actors take, so can't easily get their ids earlier.
        // Therefore, use names.  There should be exactly one of each.
        // TODO: maybe we need data function to do this sort of translating so it's
        // not duplicating the timelineReplace section below.
        const names: LocaleObject<string[]> = {
          en: ['Ser Adelphel', 'Ser Janlenoux'],
          de: ['Adelphel', 'Janlenoux'],
          fr: ['sire Adelphel', 'sire Janlenoux'],
          ja: ['聖騎士アデルフェル', '聖騎士ジャンルヌ'],
          cn: ['圣骑士阿代尔斐尔', '圣骑士让勒努'],
          ko: ['성기사 아델펠', '성기사 장르누'],
        };

        const combatantNames = names[data.parserLang] ?? names['en'];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          names: combatantNames,
        })).combatants;
      },
      // Deliberately don't play a sound here, because there's also a sound for the
      // Ascalon's Mercy Concealed and you don't want people to be jumpy.
      sound: '',
      infoText: (data, _matches, output) => {
        const [c1, c2] = data.combatantData;
        if (data.combatantData.length !== 2 || c1 === undefined || c2 === undefined) {
          console.error(`DragonsRage: wrong length: ${JSON.stringify(data.combatantData)}`);
          return;
        }

        // Ser Adelphel and Ser Janlenoux appear on the field in two spots.  It is random which
        // side they are on.  Thordan appears opposite of them.  If they are SW and SE, then
        // Thordan is N.  They will always be two spaces apart.
        let d1 = matchedPositionTo8Dir(c1);
        let d2 = matchedPositionTo8Dir(c2);

        // Adjust for wrapping around n=0/8 so that we can average the two points below.
        if (d2 === 6 && d1 === 0 || d2 === 7 && d1 === 1)
          d1 += 8;
        if (d1 === 6 && d2 === 0 || d1 === 7 && d2 === 1)
          d2 += 8;

        // After the above adjustment to handle modular math wrapping,
        // d1 and d2 should be exactly two spaces apart.
        if (d2 - d1 !== 2 && d1 - d2 !== 2) {
          console.error(`DragonsRage: bad dirs: ${d1}, ${d2}, ${JSON.stringify(data.combatantData)}`);
          return;
        }

        // Average to find the point between d1 and d2, then add 4 to find its opposite.
        const thordanDir = (Math.floor((d1 + d2) / 2) + 4) % 8;
        const dirs: { [dir: number]: string } = {
          0: output.northwest!(),
          1: output.north!(),
          2: output.northeast!(),
          3: output.east!(),
          4: output.southeast!(),
          5: output.south!(),
          6: output.southwest!(),
          7: output.west!(),
        };
        return output.thordanLocation!({
          dir: dirs[thordanDir] ?? output.unknown!(),
        });
      },
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
        if (id === headmarkers.skywardTriple)
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
      id: 'DSR Heavenly Heel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C7', source: 'King Thordan' }),
      response: Responses.tankBusterSwap('alert', 'alert'),
    },
    {
      id: 'DSR Sanctity of the Ward Direction',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '63E1', source: 'King Thordan', capture: false }),
      condition: (data) => data.phase === 'thordan',
      delaySeconds: 4.7,
      // Keep message up until knights are done dashing
      durationSeconds: 13,
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
      id: 'DSR Sanctity of the Ward Sword Names',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data) => data.phase === 'thordan',
      sound: '',
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.sword1)
          data.sanctitySword1 = matches.target;
        else if (id === headmarkers.sword2)
          data.sanctitySword2 = matches.target;
        else
          return;

        if (data.sanctitySword1 === undefined || data.sanctitySword2 === undefined)
          return;

        const name1 = data.ShortName(data.sanctitySword1);
        const name2 = data.ShortName(data.sanctitySword2);
        return output.text!({ name1: name1, name2: name2 });
      },
      // Don't collide with the more important 1/2 call.
      tts: '',
      outputStrings: {
        text: {
          en: 'Swords: ${name1}, ${name2}',
          de: 'Schwerter: ${name1}, ${name2}',
          ko: '돌진 대상자: ${name1}, ${name2}',
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
      // Keep this up through the first tower.
      durationSeconds: 10,
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
            return output.stackNorthNum!({ num: output.num2!() });
        } else if (id === headmarkers.dot3) {
          data.diveFromGraceNum[matches.target] = 3;
          if (matches.target === data.me)
            return output.stackNorthNum!({ num: output.num3!() });
        }
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        stackNorthNum: {
          en: '${num} (stack North)',
          de: '${num} (Im Norden sammeln)',
          ko: '${num} (북쪽에서 쉐어)',
        },
      },
    },
    {
      id: 'DSR Dive From Grace Dir Collect',
      type: 'GainsEffect',
      // AC3 = High Jump Target
      // AC4 = Spineshatter Dive Target
      // AC5 = Elusive Jump Target
      netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'] }),
      run: (data, matches) => {
        if (matches.effectId === 'AC4' || matches.effectId === 'AC5') {
          const duration = parseFloat(matches.duration);
          // These come out in 9, 19, 30 seconds.
          if (duration < 15)
            data.diveFromGraceHasArrow[1] = true;
          else if (duration < 25)
            data.diveFromGraceHasArrow[2] = true;
          else
            data.diveFromGraceHasArrow[3] = true;
        }
        // Store result for position callout
        switch (matches.effectId) {
          case 'AC3':
            data.diveFromGraceDir[matches.target] = 'circle';
            break;
          case 'AC4':
            data.diveFromGraceDir[matches.target] = 'up';
            break;
          case 'AC5':
            data.diveFromGraceDir[matches.target] = 'down';
            break;
        }
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
      durationSeconds: 5,
      alertText: (data, _matches, output) => {
        const num = data.diveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFGYou: missing number: ${JSON.stringify(data.diveFromGraceNum)}`);
          return;
        }

        if (data.diveFromGraceDir[data.me] === 'up')
          return output.upArrow!({ num: num });
        else if (data.diveFromGraceDir[data.me] === 'down')
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
      id: 'DSR Gnash and Lash',
      type: 'StartsUsing',
      // 6712 = Gnash and Lash (out then in)
      // 6713 = Lash and Gnash (in then out)
      netRegex: NetRegexes.startsUsing({ id: ['6712', '6713'], source: 'Nidhogg' }),
      durationSeconds: 5,
      alertText: (data, matches, output) => {
        const key = matches.id === '6712' ? 'out' : 'in';
        const inout = output[key]!();
        data.diveFromGraceLashGnashKey = key;

        const num = data.diveFromGraceNum[data.me];
        if (num !== 1 && num !== 2 && num !== 3) {
          console.error(`DSR Gnash and Lash: missing number: ${JSON.stringify(data.diveFromGraceNum)}`);
          return inout;
        }

        // Special case for side ones baiting the two towers.
        if (data.eyeOfTheTyrantCounter === 1 && num === 1 && data.diveFromGracePreviousPosition[data.me] !== 'middle')
          return output.baitStackInOut!({ inout: inout });

        // Filter out anybody who needs to be stacking.
        const firstStack = data.eyeOfTheTyrantCounter === 0 && num !== 1;
        const secondStack = data.eyeOfTheTyrantCounter === 1 && num !== 3;
        if (firstStack || secondStack)
          return output.stackInOut!({ inout: inout });

        // Call out all circles.
        if (!data.diveFromGraceHasArrow[num]) {
          return {
            1: output.circlesDive1!({ inout: inout }),
            2: inout, // this shouldn't happen, but TypeScript wants this key
            3: output.circlesDive3!({ inout: inout }),
          }[num];
        }

        // Remaining people are arrow dives.
        if (num === 1) {
          if (data.diveFromGraceDir[data.me] === 'circle')
            return output.southDive1!({ inout: inout });
          if (data.diveFromGraceDir[data.me] === 'up')
            return output.upArrowDive1!({ inout: inout });
          if (data.diveFromGraceDir[data.me] === 'down')
            return output.downArrowDive1!({ inout: inout });
        } else if (num === 3) {
          if (data.diveFromGraceDir[data.me] === 'circle')
            return output.southDive3!({ inout: inout });
          if (data.diveFromGraceDir[data.me] === 'up')
            return output.upArrowDive3!({ inout: inout });
          if (data.diveFromGraceDir[data.me] === 'down')
            return output.downArrowDive3!({ inout: inout });
        }

        // If things have gone awry, at least output something.
        return inout;
      },
      // The 2 dives are called after the in/out occurs.
      // The 1+3 dives get separate output strings here in case somebody has a weird strat
      // that does different things for them and want better output strings.
      // The idea here is that folks can rename "Up Arrow Dive" to "East Dive" depending on
      // which way their strat wants them to look.
      // TODO: should we warn the south tower here? e.g. Stack => Out => South Tower?
      outputStrings: {
        in: Outputs.in,
        out: Outputs.out,
        stackInOut: {
          en: 'Stack => ${inout}',
          de: 'Sammeln => ${inout}',
          ko: '쉐어 => ${inout}',
        },
        baitStackInOut: {
          en: 'Bait => Stack => ${inout}',
          de: 'Ködern => Sammeln => ${inout}',
          ko: '공격 유도 => 쉐어 => ${inout}',
        },
        circlesDive1: {
          en: 'Dive (all circles) => ${inout}',
          de: 'Sturz (alle Kreise) => ${inout}',
          ko: '다이브 (모두 하이점프) => ${inout}',
        },
        circlesDive3: {
          en: 'Dive (all circles) => ${inout}',
          de: 'Sturz (alle Kreise) => ${inout}',
          ko: '다이브 (모두 하이점프) => ${inout}',
        },
        southDive1: {
          en: 'South Dive => ${inout}',
          de: 'Südlicher Sturz => ${inout}',
          ko: '남쪽 다이브 => ${inout}',
        },
        southDive3: {
          en: 'South Dive => ${inout}',
          de: 'Südlicher Sturz => ${inout}',
          ko: '남쪽 다이브 => ${inout}',
        },
        upArrowDive1: {
          en: 'Up Arrow Dive => ${inout}',
          de: 'Vorne-Pfeil-Sturz => ${inout}',
          ko: '위 화살표 => ${inout}',
        },
        upArrowDive3: {
          en: 'Up Arrow Dive => ${inout}',
          de: 'Vorne-Pfeil-Sturz => ${inout}',
          ko: '위 화살표 => ${inout}',
        },
        downArrowDive1: {
          en: 'Down Arrow Dive => ${inout}',
          de: 'Hinten-Pfeil-Sturz => ${inout}',
          ko: '아래 화살표 => ${inout}',
        },
        downArrowDive3: {
          en: 'Down Arrow Dive => ${inout}',
          de: 'Hinten-Pfeil-Sturz => ${inout}',
          ko: '아래 화살표 => ${inout}',
        },
      },
    },
    {
      id: 'DSR Lash Gnash Followup',
      type: 'Ability',
      // 6715 = Gnashing Wheel
      // 6716 = Lashing Wheel
      netRegex: NetRegexes.ability({ id: ['6715', '6716'], source: 'Nidhogg' }),
      // These are ~3s apart.  Only call after the first (and ignore multiple people getting hit).
      suppressSeconds: 6,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          out: Outputs.out,
          in: Outputs.in,
          inOutAndBait: {
            en: '${inout} + Bait',
            de: '${inout} + Ködern',
            ko: '${inout} + 공격 유도',
          },
          circlesDive2: {
            en: '${inout} => Dive (all circles)',
            de: '${inout} => Sturz (alle Kreise)',
            ko: '${inout} => 다이브 (모두 하이점프)',
          },
          upArrowDive2: {
            en: '${inout} => Up Arrow Dive',
            de: '${inout} => Vorne-Pfeil-Sturz',
            ko: '${inout} => 위 화살표',
          },
          downArrowDive2: {
            en: '${inout} => Down Arrow Dive',
            de: '${inout} => Hinten-Pfeil-Sturz',
            ko: '${inout} => 아래 화살표',
          },
        };

        const key = matches.id === '6715' ? 'in' : 'out';
        const inout = output[key]!();
        data.diveFromGraceLashGnashKey = key;

        const num = data.diveFromGraceNum[data.me];
        if (num === undefined) {
          // Don't print a console error here because this response gets eval'd as part
          // of the config ui and testing.  We'll get errors elsewhere if needed.
          // TODO: maybe have a better way to know if we're in the middle of testing?
          return { infoText: inout };
        }

        if (data.eyeOfTheTyrantCounter === 1) {
          if (num === 2) {
            if (!data.diveFromGraceHasArrow[num])
              return { alertText: output.circlesDive2!({ inout: inout }) };
            if (data.diveFromGraceDir[data.me] === 'up')
              return { alertText: output.upArrowDive2!({ inout: inout }) };
            if (data.diveFromGraceDir[data.me] === 'down')
              return { alertText: output.downArrowDive2!({ inout: inout }) };
          } else if (num === 3) {
            return { alertText: output.inOutAndBait!({ inout: inout }) };
          }
        } else if (data.eyeOfTheTyrantCounter === 2) {
          if (num === 2 || (num === 1 && data.diveFromGracePreviousPosition[data.me] === 'middle'))
            return { alertText: output.inOutAndBait!({ inout: inout }) };
        }

        // Otherwise, just tell the remaining people the dodge.
        return { infoText: inout };
      },
    },
    {
      id: 'DSR Dive From Grace Dive Collect',
      // 670E Dark High Jump
      // 670F Dark Spineshatter Dive
      // 6710 Dark Elusive Jump
      // Collect players hit by dive
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['670E', '670F', '6710'], source: 'Nidhogg' }),
      run: (data, matches) => {
        const posX = parseFloat(matches.targetX);
        data.diveFromGracePositions[matches.target] = posX;
      },
    },
    {
      id: 'DSR Dive From Grace Post Stack',
      // Triggered on first instance of Eye of the Tyrant (6714)
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6714', source: 'Nidhogg', capture: false }),
      // Ignore targetIsYou() incase player misses stack
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const num = data.diveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFG Tower 1 Reminder: missing number: ${JSON.stringify(data.diveFromGraceNum)}`);
          return;
        }

        const inout = output[data.diveFromGraceLashGnashKey]!();

        if (data.eyeOfTheTyrantCounter === 1) {
          // Tower 1 soaks only based on debuffs.
          if (num === 3) {
            if (data.diveFromGraceDir[data.me] === 'circle') {
              if (data.diveFromGraceHasArrow[3])
                return output.southTower1!({ inout: inout });
              return output.circleTowers1!({ inout: inout });
            } else if (data.diveFromGraceDir[data.me] === 'up') {
              return output.upArrowTower1!({ inout: inout });
            } else if (data.diveFromGraceDir[data.me] === 'down') {
              return output.downArrowTower1!({ inout: inout });
            }
            return output.unknownTower!({ inout: inout });
          }
          // Folks who could be placing a two tower here just get
          // the normal "in" or "out" below, and the Lash Gnash Followup
          // will say "In => Up Arrow Tower" as a reminder.
        } else if (data.eyeOfTheTyrantCounter === 2) {
          // Tower 3 soaks based on debuffs and previous positions.
          const pos = data.diveFromGracePreviousPosition[data.me];
          if (num === 1) {
            if (pos === 'middle')
              return output.southTower3!({ inout: inout });
            // Already soaked the number two towers.
            if (pos === 'east' || pos === 'west')
              return;
          } else if (num === 2) {
            if (pos === 'west')
              return output.westTower3!({ inout: inout });
            if (pos === 'east')
              return output.eastTower3!({ inout: inout });
          } else if (num === 3) {
            return;
          }
          return output.unknownTower!({ inout: inout });
        }

        // Anybody who isn't placing or taking a tower here just gets a "in/out" reminder.
        return inout;
      },
      outputStrings: {
        unknown: Outputs.unknown,
        in: Outputs.in,
        out: Outputs.out,
        unknownTower: {
          en: 'Tower (${inout})',
          de: 'Turm (${inout})',
          ko: '기둥 (${inout})',
        },
        southTower1: {
          en: 'South Tower (${inout})',
          de: 'Südlicher Turm (${inout})',
          ko: '남쪽 기둥 (${inout})',
        },
        southTower3: {
          en: 'South Tower (${inout})',
          de: 'Südlicher Turm (${inout})',
          ko: '남쪽 기둥 (${inout})',
        },
        circleTowers1: {
          en: 'Tower (all circles, ${inout})',
          de: 'Türme (alle Kreise, ${inout})',
          ko: '기둥 (모두 하이점프, ${inout})',
        },
        circleTowers3: {
          en: 'Tower (all circles, ${inout})',
          de: 'Türme (alle Kreise, ${inout})',
          ko: '기둥 (모두 하이점프, ${inout})',
        },
        upArrowTower1: {
          en: 'Up Arrow Tower (${inout})',
          de: 'Vorne-Pfeil-Turm (${inout})',
          ko: '위 화살표 기둥 (${inout})',
        },
        downArrowTower1: {
          en: 'Down Arrow Tower (${inout})',
          de: 'Hinten-Pfeil-Turm (${inout})',
          ko: '아래 화살표 기둥 (${inout})',
        },
        upArrowTower3: {
          en: 'Up Arrow Tower (${inout})',
          de: 'Vorne-Pfeil-Turm (${inout})',
          ko: '위 화살표 기둥 (${inout})',
        },
        downArrowTower3: {
          en: 'Down Arrow Tower (${inout})',
          de: 'Hinten-Pfeil-Turm (${inout})',
          ko: '아래 화살표 기둥 (${inout})',
        },
        westTower3: {
          en: 'West Tower (${inout})',
          de: 'Westlicher Turm (${inout})',
          ko: '서쪽 기둥 (${inout})',
        },
        eastTower3: {
          en: 'East Tower (${inout})',
          de: 'Östlicher Turm (${inout})',
          ko: '동쪽 기둥 (${inout})',
        },
      },
    },
    {
      id: 'DSR Dive From Grace Post Dive',
      // 670E Dark High Jump
      // 670F Dark Spineshatter Dive
      // 6710 Dark Elusive Jump
      // Defaults:
      //   High Jump South if solo, no assignment if all circle
      //   Assumes North Party Stack
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['670E', '670F', '6710'], source: 'Nidhogg', capture: false }),
      preRun: (data) => data.diveFromGraceTowerCounter = (data.diveFromGraceTowerCounter ?? 0) + 1,
      delaySeconds: 0.2,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const num = data.diveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFG Tower 1 and 2: missing number: ${JSON.stringify(data.diveFromGraceNum)}`);
          return;
        }

        // Sorted from west to east, and filled in with unknown if missing.
        const [nameA, nameB, nameC] = [
          ...Object.keys(data.diveFromGracePositions).sort((keyA, keyB) => {
            const posA = data.diveFromGracePositions[keyA];
            const posB = data.diveFromGracePositions[keyB];
            if (posA === undefined || posB === undefined)
              return 0;
            return posA - posB;
          }),
          output.unknown!(),
          output.unknown!(),
          output.unknown!(),
        ];

        // Dive 1 and Dive 3 have 3 players
        if (data.diveFromGraceTowerCounter !== 2) {
          data.diveFromGracePreviousPosition[nameA] = 'west';
          data.diveFromGracePreviousPosition[nameB] = 'middle';
          data.diveFromGracePreviousPosition[nameC] = 'east';
        } else {
          data.diveFromGracePreviousPosition[nameA] = 'west';
          data.diveFromGracePreviousPosition[nameB] = 'east';
        }

        if (num === 1 && data.diveFromGraceTowerCounter === 2) {
          if (data.diveFromGracePreviousPosition[data.me] === 'west')
            return output.northwestTower2!();
          if (data.diveFromGracePreviousPosition[data.me] === 'east')
            return output.northeastTower2!();
          if (data.diveFromGracePreviousPosition[data.me] === 'middle')
            return;
          return output.unknownTower!();
        }
      },
      run: (data) => data.diveFromGracePositions = {},
      outputStrings: {
        unknown: Outputs.unknown,
        unknownTower: {
          en: 'Tower',
          de: 'Turm',
          ko: '기둥',
        },
        northwestTower2: {
          en: 'Northwest Tower',
          de: 'Nordwestlicher Turm',
          ko: '북서쪽 기둥',
        },
        northeastTower2: {
          en: 'Northeast Tower',
          de: 'Nordöstlicher Turm',
          ko: '북동쪽 기둥',
        },
      },
    },
    {
      id: 'DSR Darkdragon Dive Single Tower',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6711', source: 'Nidhogg' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const num = data.diveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFG Dive Single Tower: missing number: ${JSON.stringify(data.diveFromGraceNum)}`);
          return output.text!();
        }
        // To condense messages, two tower baiters get this call during the gnash and lash.
        if (data.diveFromGraceTowerCounter === 2) {
          data.stackAfterGeirskogul = true;
          return;
        }
        return output.text!();
      },
      run: (data) => data.waitingForGeirskogul = true,
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
      id: 'DSR Geirskogul',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '670A', source: 'Nidhogg', capture: false }),
      condition: (data) => data.waitingForGeirskogul,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.waitingForGeirskogul)
          return;
        // Two tower baiters need to quickly get to the stack here.
        if (data.stackAfterGeirskogul) {
          const inout = output[data.diveFromGraceLashGnashKey]!();
          return output.stackInOut!({ inout: inout });
        }
        return output.move!();
      },
      run: (data) => {
        delete data.waitingForGeirskogul;
        delete data.stackAfterGeirskogul;
      },
      outputStrings: {
        in: Outputs.in,
        out: Outputs.out,
        unknown: Outputs.unknown,
        stackInOut: {
          en: 'Stack => ${inout}',
          de: 'Sammeln => ${inout}',
          ko: '쉐어 => ${inout}',
        },
        move: Outputs.moveAway,
      },
    },
    {
      id: 'DSR Drachenlance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '670C', source: 'Nidhogg', capture: false }),
      // This could be "out of front" as sides are safe but this is urgent, so be more clear.
      response: Responses.getBehind(),
    },
    {
      id: 'DSR Right Eye Blue Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0033' }),
      condition: (data, matches) => matches.source === data.me,
      // Have blue/red be different alert/info to differentiate.
      // Since dives are usually blue people dropping off their blue tether
      // to a red person (who needs to run in), make the blue tether
      // the higher severity one.
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Blue',
          de: 'Blau',
          ko: '파랑',
        },
      },
    },
    {
      id: 'DSR Left Eye Red tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0034' }),
      condition: (data, matches) => matches.source === data.me,
      // See note above on Right Eye Blue Tether.
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Red',
          de: 'Rot',
          ko: '빨강',
        },
      },
    },
    {
      id: 'DSR Eyes Dive Cast',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '68C3', source: ['Right Eye', 'Left Eye'], capture: false }),
      // One cast for each dive.  68C3 is the initial cast/self-targeted ability.
      // 68C4 is the damage on players.
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Dives Soon',
          de: 'Stürze bald',
          ko: '곧 다이브',
        },
      },
    },
    {
      id: 'DSR Eyes Dive Counter',
      type: 'Ability',
      // TODO: should this call out who it was on? some strats involve the
      // first dive targets swapping with the third dive targets.
      netRegex: NetRegexes.ability({ id: '68C4', source: 'Nidhogg', capture: false }),
      // One ability for each player hit.
      suppressSeconds: 1,
      infoText: (data, _matches, output) => output[`dive${data.diveCounter}`]!(),
      run: (data) => data.diveCounter++,
      outputStrings: {
        dive1: Outputs.num1,
        dive2: Outputs.num2,
        dive3: Outputs.num3,
        dive4: Outputs.num4,
      },
    },
    {
      id: 'DSR Eyes Steep in Rage',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '68BD', source: ['Right Eye', 'Left Eye'], capture: false }),
      // Each of the eyes (if alive) will start this aoe.  It has the same id from each eye.
      suppressSeconds: 1,
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'DSR Right Eye Reminder',
      type: 'StartsUsing',
      // If the Right Eye is dead and the Left Eye gets the aoe off, then the Right Eye
      // will be revived and you shouldn't forget about it.
      netRegex: NetRegexes.startsUsing({ id: '68BD', source: 'Left Eye' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Right Eye',
          de: 'Besiege Rechtes Auge',
          ko: '오른눈 잡기',
        },
      },
    },
    {
      id: 'DSR Spear of the Fury Limit Break',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62E2', source: 'Ser Zephirin', capture: false }),
      // This ability also happens in doorboss phase.
      condition: (data) => data.role === 'tank' && data.phase === 'haurchefant',
      // This is a 10 second cast, and (from video) my understanding is to
      // hit tank LB when the cast bar gets to the "F" in "Fury", which is
      // roughly 2.8 seconds before it ends.
      delaySeconds: 10 - 2.8,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'TANK LB!!',
          de: 'TANK LB!!',
          fr: 'LB TANK !!',
          ja: 'タンクLB!!',
          cn: '坦克LB！！',
          ko: '탱리밋!!',
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
      id: 'DSR Wrath Spiral Pierce',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0005' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tether on YOU',
          de: 'Verbindung auf DIR',
          ko: '선 대상자',
        },
      },
    },
    {
      id: 'DSR Wrath Skyward Leap',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: Conditions.targetIsYou(),
      alarmText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        // The Wrath of the Heavens skyward leap is a different headmarker.
        if (id === headmarkers.skywardSingle)
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
      id: 'DSR Wrath Thunderstruck',
      // This is effectId B11, but the timing is somewhat inconsistent based on statuses rolling out.
      // Use the Chain Lightning ability instead.
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8F', source: 'Darkscale' }),
      // Call this after, which is ~2.3s after this ability.
      // This avoids people with itchy feet running when they hear something.
      delaySeconds: 2.5,
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      run: (data, matches) => data.thunderstruck.push(matches.target),
      outputStrings: {
        text: {
          en: 'Thunder on YOU',
          de: 'Blitz auf DIR',
          ko: '번개 대상자',
        },
      },
    },
    {
      id: 'DSR Wrath Thunderstruck Targets',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B8F', source: 'Darkscale', capture: false }),
      delaySeconds: 2.8,
      suppressSeconds: 1,
      // This is just pure extra info, no need to make noise for people.
      sound: '',
      infoText: (data, _matches, output) => {
        // In case somebody wants to do some "go in the order cactbot tells you" sort of strat.
        const [fullName1, fullName2] = data.thunderstruck.sort();
        const name1 = fullName1 ? data.ShortName(fullName1) : output.unknown!();
        const name2 = fullName2 ? data.ShortName(fullName2) : output.unknown!();
        return output.text!({ name1: name1, name2: name2 });
      },
      // Sorry tts players, but "Thunder on YOU" and "Thunder: names" are too similar.
      tts: null,
      outputStrings: {
        text: {
          en: 'Thunder: ${name1}, ${name2}',
          de: 'Blitz: ${name1}, ${name2}',
          ko: '번개: ${name1}, ${name2}',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'DSR Wrath Cauterize Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: Conditions.targetIsYou(),
      alarmText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.cauterize)
          return output.diveOnYou!();
      },
      outputStrings: {
        diveOnYou: {
          en: 'Divebomb (opposite warrior)',
          de: 'Sturz (gegenüber des Kriegers)',
          ko: '카탈 대상자 (도끼 든 성기사 반대편)',
        },
      },
    },
    {
      id: 'DSR Doom Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      preRun: (data, matches) => data.hasDoom[matches.target] = true,
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.doomOnYou!();
      },
      infoText: (data, _matches, output) => {
        const dooms = Object.keys(data.hasDoom).filter((x) => data.hasDoom[x]);
        if (dooms.length !== 4 || dooms.includes(data.me))
          return;
        return output.noDoom!();
      },
      outputStrings: {
        doomOnYou: {
          en: 'Doom on YOU',
          de: 'Verhängnis auf DIR',
          ko: '선고 대상자',
        },
        noDoom: {
          en: 'No Doom',
          de: 'Kein Verhängnis',
          ko: '선고 없음',
        },
      },
    },
    {
      id: 'DSR Playstation2 Fire Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data) => data.phase === 'thordan2',
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        const marker = playstationMarkerMap[id];
        if (marker === undefined)
          return;

        data.deathMarker[matches.target] = marker;

        if (data.me !== matches.target)
          return;

        // Note: in general, both circles should always have Doom and both crosses
        // should not have Doom.  If one doom dies, it seems that crosses are
        // removed and there's a double triangle non-doom.  If enough people die,
        // anything can happen.  For example, in P1 tanks can get circles if enough people are dead.

        if (data.hasDoom[data.me]) {
          if (marker === 'circle')
            return output.circleWithDoom!();
          else if (marker === 'triangle')
            return output.triangleWithDoom!();
          else if (marker === 'square')
            return output.squareWithDoom!();
          else if (marker === 'cross')
            return output.crossWithDoom!();
        } else {
          if (marker === 'circle')
            return output.circle!();
          else if (marker === 'triangle')
            return output.triangle!();
          else if (marker === 'square')
            return output.square!();
          else if (marker === 'cross')
            return output.cross!();
        }
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
        cross: {
          en: 'Blue X',
          de: 'Blaues X',
          fr: 'Croix bleue',
          ja: '青バツ',
          ko: '파랑 X',
        },
        circleWithDoom: {
          en: 'Red Circle (Doom)',
          de: 'Roter Kreis (Verhängnis)',
          ko: '빨강 동그라미 (선고)',
        },
        triangleWithDoom: {
          en: 'Green Triangle (Doom)',
          de: 'Grünes Dreieck (Verhängnis)',
          ko: '초록 삼각 (선고)',
        },
        squareWithDoom: {
          en: 'Purple Square (Doom)',
          de: 'Lilanes Viereck (Verhängnis)',
          ko: '보라 사각 (선고)',
        },
        crossWithDoom: {
          en: 'Blue X (Doom)',
          de: 'Blaues X (Verhängnis)',
          ko: '파랑 X (선고)',
        },
      },
    },
    {
      // If one doom person dies, then there will be an unmarked non-doom player (cross)
      // and two non-doom players who will get the same symbol (triangle OR square).
      // If there's more than two symbols missing this is probably a wipe,
      // so don't bother trying to call out "unmarked circle or square".
      // TODO: should we run this on Playstation1 as well (and consolidate triggers?)
      id: 'DSR Playstation2 Fire Chains No Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'thordan2' && playstationHeadmarkerIds.includes(getHeadmarkerId(data, matches)),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alarmText: (data, _matches, output) => {
        if (data.deathMarker[data.me] !== undefined)
          return;

        const seenMarkers = Object.values(data.deathMarker);
        const markers = [...playstationMarkers].filter((x) => !seenMarkers.includes(x));

        const [marker] = markers;
        if (marker === undefined || markers.length !== 1)
          return;

        // Note: this will still call out for the dead doom person, but it seems better
        // in case they somehow got insta-raised.
        if (data.hasDoom[data.me]) {
          if (marker === 'circle')
            return output.circleWithDoom!();
          else if (marker === 'triangle')
            return output.triangleWithDoom!();
          else if (marker === 'square')
            return output.squareWithDoom!();
          else if (marker === 'cross')
            return output.crossWithDoom!();
        } else {
          if (marker === 'circle')
            return output.circle!();
          else if (marker === 'triangle')
            return output.triangle!();
          else if (marker === 'square')
            return output.square!();
          else if (marker === 'cross')
            return output.cross!();
        }
      },
      outputStrings: {
        circle: {
          en: 'Unmarked Red Circle',
          de: 'Unmarkierter roter Kreis',
          ko: '무징 빨강 동그라미',
        },
        triangle: {
          en: 'Unmarked Green Triangle',
          de: 'Unmarkiertes grünes Dreieck',
          ko: '무징 초록 삼각',
        },
        square: {
          en: 'Unmarked Purple Square',
          de: 'Unmarkiertes lilanes Viereck',
          ko: '무징 보라 사각',
        },
        cross: {
          en: 'Unmarked Blue X',
          de: 'Unmarkiertes blaues X ',
          ko: '무징 파랑 X',
        },
        circleWithDoom: {
          en: 'Unmarked Red Circle (Doom)',
          de: 'Unmarkierter roter Kreis (Verhängnis)',
          ko: '무징 빨강 동그라미 (선고)',
        },
        triangleWithDoom: {
          en: 'Unmarked Green Triangle (Doom)',
          de: 'Unmarkiertes grünes Dreieck (Verhängnis)',
          ko: '무징 초록 삼각 (선고)',
        },
        squareWithDoom: {
          en: 'Unmarked Purple Square (Doom)',
          de: 'Unmarkiertes lilanes Viereck (Verhängnis)',
          ko: '무징 보라 사각 (선고)',
        },
        crossWithDoom: {
          en: 'Unmarked Blue X (Doom)',
          de: 'Unmarkiertes blaues X (Verhängnis)',
          ko: '무징 파랑 X (선고)',
        },
      },
    },
    {
      // This will only fire if you got a marker, so that it's mutually exclusive
      // with the "No Marker" trigger above.
      id: 'DSR Playstation2 Fire Chains Unexpected Pair',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => {
        if (data.phase !== 'thordan2')
          return false;
        if (data.me !== matches.target)
          return false;
        return playstationHeadmarkerIds.includes(getHeadmarkerId(data, matches));
      },
      delaySeconds: 0.5,
      alarmText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        const myMarker = playstationMarkerMap[id];
        if (myMarker === undefined)
          return;

        // Find person with the same mark.
        let partner: string | undefined = undefined;
        for (const [player, marker] of Object.entries(data.deathMarker)) {
          if (player !== data.me && marker === myMarker) {
            partner = player;
            break;
          }
        }
        if (partner === undefined)
          return;

        // If a circle ends up with a non-doom or a cross ends up with a doom,
        // I think you're in serious unrecoverable trouble.  These people also
        // already need to look and adjust to the other person, vs the triangle
        // and square which can have a fixed position based on doom vs non-doom.
        if (myMarker === 'circle' || myMarker === 'cross')
          return;

        // I think circles fill out with doom first, so it should be impossible
        // to have two doom triangles or two doom squares as well.
        if (data.hasDoom[data.me] || data.hasDoom[partner])
          return;

        if (myMarker === 'triangle')
          return output.doubleTriangle!({ player: data.ShortName(partner) });
        if (myMarker === 'square')
          return output.doubleSquare!({ player: data.ShortName(partner) });
      },
      outputStrings: {
        // In case users want to have triangle vs square say something different.
        doubleTriangle: {
          en: 'Double Non-Doom (${player})',
          de: 'Doppeltes Nicht-Verhängnis (${player})',
          ko: '둘 다 선고 없음 (${player})',
        },
        doubleSquare: {
          en: 'Double Non-Doom (${player})',
          de: 'Doppeltes Nicht-Verhängnis (${player})',
          ko: '둘 다 선고 없음 (${player})',
        },
      },
    },
    {
      id: 'DSR Great Wyrmsbreath Hraesvelgr Not Glowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D34', source: 'Hraesvelgr', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tanksApart: {
            en: 'Apart (Hrae buster)',
            de: 'Auseinander (Hrae-buster)',
            ko: '떨어지기 (흐레스벨그 탱버)',
          },
          hraesvelgrTankbuster: {
            en: 'Hrae Tankbuster',
            de: 'Hrae Tankbuster',
            ko: '흐레스벨그 탱버',
          },
        };

        if (data.role === 'tank')
          return { alertText: output.tanksApart!() };
        return { infoText: output.hraesvelgrTankbuster!() };
      },
    },
    {
      id: 'DSR Great Wyrmsbreath Hraesvelgr Glowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D35', source: 'Hraesvelgr', capture: false }),
      condition: (data) => data.role === 'tank',
      run: (data) => data.hraesvelgrGlowing = true,
    },
    {
      id: 'DSR Great Wyrmsbreath Nidhogg Not Glowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D32', source: 'Nidhogg', capture: false }),
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tanksApart: {
            en: 'Apart (Nid buster)',
            de: 'Auseinander (Nid-buster)',
            ko: '떨어지기 (니드호그 탱버)',
          },
          nidTankbuster: {
            en: 'Nid Tankbuster',
            de: 'Nid Tankbuster',
            ko: '니드호그 탱버',
          },
        };

        if (data.role === 'tank')
          return { alertText: output.tanksApart!() };
        return { infoText: output.nidTankbuster!() };
      },
    },
    {
      id: 'DSR Great Wyrmsbreath Nidhogg Glowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D33', source: 'Nidhogg', capture: false }),
      condition: (data) => data.role === 'tank',
      run: (data) => data.nidhoggGlowing = true,
    },
    {
      // Great Wyrmsbreath ids
      //   6D32 Nidhogg not glowing
      //   6D33 Nidhogg glowing
      //   6D34 Hraesvelgr not glowing
      //   6D35 Hraesvelgr glowing
      // Hraesvelger and Nidhogg are different actors so can go in either order.
      id: 'DSR Great Wyrmsbreath Both Glowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D33', '6D35'], source: ['Hraesvelgr', 'Nidhogg'], capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          sharedBuster: {
            en: 'Shared Buster',
            de: 'geteilter Tankbuster',
            ko: '쉐어 탱버',
          },
        };

        if (!data.hraesvelgrGlowing || !data.nidhoggGlowing)
          return;
        if (data.role === 'tank')
          return { alertText: output.sharedBuster!() };
        return { infoText: output.sharedBuster!() };
      },
      run: (data) => {
        delete data.hraesvelgrGlowing;
        delete data.nidhoggGlowing;
      },
    },
    {
      id: 'DSR Mortal Vow Collect',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B50' }),
      suppressSeconds: 1,
      run: (data, matches) => data.mortalVowPlayer = data.ShortName(matches.target),
    },
    {
      id: 'DSR Akh Afah',
      // 6D41 Akh Afah from Hraesvelgr, and 64D2 is immediately after
      // 6D43 Akh Afah from Nidhogg, and 6D44 is immediately after
      // Hits the two healers.  If a healer is dead, then the target is random.
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D41', '6D43'], source: ['Hraesvelgr', 'Nidhogg'], capture: false }),
      suppressSeconds: 2,
      alertText: (_data, _matches, output) => output.groups!(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '与治疗分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'DSR Adds Phase Nidhogg',
      type: 'AddedCombatant',
      // There are many Nidhoggs, but the real one (and the one that moves for cauterize) is npcBaseId=12612.
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '3458', npcBaseId: '12612' }),
      run: (data, matches) => data.addsPhaseNidhoggId = matches.id,
    },
    {
      id: 'DSR Hallowed Wings and Plume',
      // Calls left and right while looking at Hraesvelgr.
      // 6D23 Head Down, Left Wing
      // 6D24 Head Up, Left Wing
      // 6D26 Head Down, Right Wing
      // 6D27 Head Up, Right Wing
      // Head Up = Tanks Far
      // Head Down = Tanks Near
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D23', '6D24', '6D26', '6D27'], source: 'Hraesvelgr' }),
      preRun: (data) => data.hallowedWingsCount++,
      durationSeconds: 6,
      promise: async (data) => {
        data.combatantData = [];

        // TODO: implement Hot Tail/Hot Wing combination here
        if (data.hallowedWingsCount !== 1)
          return;

        // If we have missed the Nidhogg id (somehow?), we'll handle it later.
        const id = data.addsPhaseNidhoggId;
        if (id === undefined)
          return;

        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(id, 16)],
        })).combatants;

        if (data.combatantData.length === 0)
          console.error(`Hallowed: no Nidhoggs found`);
        else if (data.combatantData.length > 1)
          console.error(`Hallowed: unexpected number of Nidhoggs: ${JSON.stringify(data.combatantData)}`);
      },
      alertText: (data, matches, output) => {
        const wings = (matches.id === '6D23' || matches.id === '6D24') ? output.left!() : output.right!();
        let head;
        const isHeadDown = matches.id === '6D23' || matches.id === '6D26';
        if (isHeadDown)
          head = data.role === 'tank' ? output.tanksNear!() : output.partyFar!();
        else
          head = data.role === 'tank' ? output.tanksFar!() : output.partyNear!();

        const [nidhogg] = data.combatantData;
        if (nidhogg !== undefined && data.combatantData.length === 1) {
          // Nidhogg is at x = 100 +/- 11, y = 100 +/- 34
          const dive = nidhogg.PosX < 100 ? output.forward!() : output.backward!();
          return output.wingsDiveHead!({ wings: wings, dive: dive, head: head });
        }

        // If something has gone awry (or this is the second hallowed), call out what we can.
        return output.wingsHead!({ wings: wings, head: head });
      },
      outputStrings: {
        // The calls here assume that all players are looking at Hraesvelgr, and thus
        // "Forward" means east and "Backward" means west, and "Left" means
        // north and "Right" means south.  The cactbot UI could rename them if this
        // wording is awkward to some people.
        //
        // Also, in case somebody is raid calling, differentiate "Party Near" vs "Tanks Near".
        // This will also help in a rare edge case bug where sometimes people don't have the
        // right job, see: https://github.com/quisquous/cactbot/issues/4237.
        //
        // Yes, these are also tank busters, but there's too many things to call out here,
        // and this is a case of "tanks and healers need to know what's going on ahead of time".
        left: Outputs.left,
        right: Outputs.right,
        forward: {
          en: 'Forward',
          de: 'Vorwärts',
          ko: '앞쪽으로',
        },
        backward: {
          en: 'Backward',
          de: 'Rückwärts',
          ko: '뒤쪽으로',
        },
        partyNear: {
          en: 'Party Near',
          de: 'Party nahe',
          ko: '본대가 가까이',
        },
        tanksNear: {
          en: 'Tanks Near',
          de: 'Tanks nahe',
          ko: '탱커가 가까이',
        },
        partyFar: {
          en: 'Party Far',
          de: 'Party weit weg',
          ko: '본대가 멀리',
        },
        tanksFar: {
          en: 'Tanks Far',
          de: 'Tanks weit weg',
          ko: '탱커가 멀리',
        },
        wingsHead: {
          en: '${wings}, ${head}',
          de: '${wings}, ${head}',
          ja: '${wings}, ${head}',
          ko: '${wings}, ${head}',
        },
        wingsDiveHead: {
          en: '${wings} + ${dive}, ${head}',
          de: '${wings} + ${dive}, ${head}',
          ja: '${wings} + ${dive}, ${head}',
          ko: '${wings} + ${dive}, ${head}',
        },
      },
    },
    {
      id: 'DSR Nidhogg Hot Wing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D2B', source: 'Nidhogg', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          // Often cactbot uses "in" and "out", but that's usually hitbox relative vs
          // anything else.  Because this is more arena-relative.
          en: 'Inside',
          de: 'Rein',
          ko: '중앙쪽으로',
        },
      },
    },
    {
      id: 'DSR Nidhogg Hot Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6D2D', source: 'Nidhogg', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Outside',
          de: 'Raus',
          ko: '바깥쪽으로',
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
        if (matches.effectId === 'B52')
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
    {
      id: 'DSR Spreading/Entangled Flame',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AC6', 'AC7'] }),
      preRun: (data, matches) => {
        if (matches.effectId === 'AC6')
          data.spreadingFlame.push(matches.target);

        if (matches.effectId === 'AC7')
          data.entangledFlame.push(matches.target);
      },
      infoText: (data, _matches, output) => {
        if (data.spreadingFlame.length < 4)
          return;
        if (data.entangledFlame.length < 2)
          return;

        if (data.spreadingFlame.includes(data.me))
          return output.spread!();
        if (data.entangledFlame.includes(data.me))
          return output.stack!();
        return output.nodebuff!();
      },
      outputStrings: {
        spread: {
          en: 'Spread',
          de: 'Verteilen',
          ko: '산개징 대상자',
        },
        stack: {
          en: 'Stack',
          de: 'Sammeln',
          ko: '쉐어징 대상자',
        },
        nodebuff: {
          en: 'No debuff (Stack)',
          de: 'Kein Debuff (Sammeln)',
          ko: '무징 (쉐어)',
        },
      },
    },
    {
      id: 'DSR Flames of Ascalon',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '808', count: '12A', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Ice of Ascalon',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '808', count: '12B', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'DSR Trinity Tank Dark Resistance',
      type: 'GainsEffect',
      // C40 = Dark Resistance Down, highest enmity target
      netRegex: NetRegexes.gainsEffect({
        effectId: 'C40',
        count: '02',
      }),
      condition: (data, matches) => data.me === matches.target && data.role === 'tank',
      alertText: (_data, matches, output) => {
        if (parseFloat(matches.duration) > 10)
          return output.text!();
      },
      outputStrings: {
        text: {
          // Only showing 'swap' is really confusing, in my opinion
          en: 'Get 2nd enmity',
          de: 'Sei 2. in der Aggro',
          ko: '적개심 2순위 잡기',
        },
      },
    },
    {
      id: 'DSR Trinity Tank Light Resistance',
      type: 'GainsEffect',
      // C3F = Light Resistance Down, 2nd highest enmity target
      netRegex: NetRegexes.gainsEffect({
        effectId: 'C3F',
        count: '02',
      }),
      condition: (data, matches) => data.me === matches.target && data.role === 'tank',
      // To prevent boss rotating around before Exaflare
      delaySeconds: 2.5,
      alertText: (_data, matches, output) => {
        if (parseFloat(matches.duration) > 10)
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Provoke',
          de: 'Herausforderung',
          ko: '도발',
        },
      },
    },
    {
      id: 'DSR Gigaflare',
      // 6D9A fires first, followed by 6DD2, then 6DD3
      // 6D99 is cast by boss at the center
      // Only need to compare the rotation of 6D9A to 6DD2
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6D99', '6D9A', '6DD2'], source: 'Dragon-king Thordan' }),
      durationSeconds: 10,
      infoText: (data, matches, output) => {
        // Positions are moved up 100 and right 100
        const x = parseFloat(matches.x) - 100;
        const y = parseFloat(matches.y) - 100;

        // Collect Gigaflare position
        switch (matches.id) {
          case '6D99':
            data.centerGigaflare = [x, y, parseFloat(matches.heading)];
            break;
          case '6D9A':
            data.firstGigaflare = [x, y];
            break;
          case '6DD2':
            data.secondGigaflare = [x, y];
            break;
        }

        if (data.firstGigaflare !== undefined && data.secondGigaflare !== undefined && data.centerGigaflare !== undefined) {
          // Store temporary copies and remove data for next run
          const first = data.firstGigaflare;
          const second = data.secondGigaflare;
          const center = data.centerGigaflare;
          delete data.firstGigaflare;
          delete data.secondGigaflare;
          delete data.centerGigaflare;

          if (first[0] === undefined || first[1] === undefined ||
            second[0] === undefined || second[1] === undefined ||
            center[0] === undefined || center[1] === undefined || center[2] === undefined) {
            console.error(`Gigaflare: missing coordinates`);
            return;
          }

          // Compute atan2 of determinant and dot product to get rotational direction
          const getRotation = (x1: number, y1: number, x2: number, y2: number) => {
            return Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2);
          };

          // Get rotation of first and second gigaflares
          const rotation = getRotation(first[0], first[1], second[0], second[1]);

          // Compute initial location relative to boss
          // Calculate point on circle where boss is facing
          const radius = Math.sqrt((center[0] - first[0]) ** 2 + (center[1] - first[1]) ** 2);
          const relX = Math.round(radius * Math.sin(center[2]));
          const relY = Math.round(radius * Math.cos(center[2]));

          // Get rotation of first gigaflare relative to boss
          const startNum = getRotation(relX, relY, first[0], first[1]);
          let start;

          // Case for if Front since data for heading is not exact
          if (Math.round(center[2] / 2) === Math.round(Math.atan2(first[1], first[0])))
            start = output.front!();
          else if (startNum > 0)
            start = output.backLeft!();
          else if (startNum < 0)
            start = output.backRight!();
          else
            start = output.unknown!();

          if (rotation > 0) {
            return output.directions!({
              start: start, rotation: output.clockwise!()
            });
          }
          if (rotation < 0) {
            return output.directions!({
              start: start, rotation: output.counterclock!()
            });
          }
        }
      },
      outputStrings: {
        directions: {
          en: '${start} => ${rotation}',
        },
        backLeft: {
          en: 'Back left',
        },
        backRight: {
          en: 'Back right',
        },
        front: {
          en: 'Front',
        },
        unknown: Outputs.unknown,
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
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Empty Dimension/Full Dimension': 'Empty/Full Dimension',
        'Lash and Gnash/Gnash and Lash': 'Lash and Gnash',
        'Ice of Ascalon/Flames of Ascalon': 'Ice/Flames of Ascalon',
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
        'Meteor Circle': 'Meteorsiegel',
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
        'Spear of the Fury': 'Speer der Furie',
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
        'Holy Meteor': 'Heiliger Meteor',
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
        'Meteor Impact': 'Meteoreinschlag',
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
        'Meteor Circle': 'sceau du météore',
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
        'Spear of the Fury': 'Lance de la Conquérante',
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
        'Holy Meteor': 'Météore sacré',
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
        'Meteor Impact': 'Impact de météore',
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
        'Left Eye': '邪竜の左眼',
        'Meteor Circle': '流星の聖紋',
        'Nidhogg': 'ニーズヘッグ',
        'Right Eye': '邪竜の右眼',
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
        'Spear of the Fury': 'スピア・オブ・ハルオーネ',
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
        'Holy Meteor': 'ホーリーメテオ',
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
        'Meteor Impact': 'メテオインパクト',
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
        'Dragon-king Thordan': '騎竜神トールダン',
        'Estinien': '埃斯蒂尼安',
        'Haurchefant': '奥尔什方',
        'Hraesvelgr': '赫拉斯瓦尔格',
        '(?<!Dragon-)King Thordan': '骑神托尔丹',
        'Left Eye': '邪龙的左眼',
        'Meteor Circle': '流星圣纹',
        'Nidhogg': '尼德霍格',
        'Right Eye': '邪龙的右眼',
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
        'Spear of the Fury': '战女神之枪',
        'Vedrfolnir': '维德佛尔尼尔',
        'Ysayle': '伊塞勒',
      },
      'replaceText': {
        'Aetheric Burst': '以太爆发',
        'Akh Afah': '无尽轮回',
        'Akh Morn(?!\'s Edge)': '死亡轮回',
        'Akh Morn\'s Edge': '死亡轮回剑',
        'Ancient Quaga': '古代爆震',
        'Alternative End': '异史终结',
        'Altar Flare': '圣坛核爆',
        'Ascalon\'s Mercy Concealed': '阿斯卡隆之仁·隐秘',
        'Ascalon\'s Mercy Revealed': '阿斯卡隆之仁·揭示',
        'Ascalon\'s Might': '阿斯卡隆之威',
        'Brightblade\'s Steel': '光辉剑的决意',
        'Brightwing(?!ed)': '光翼闪',
        'Brightwinged Flight': '苍穹光翼',
        'Broad Swing': '奋力一挥',
        'Cauterize': '洁白俯冲',
        'Chain Lightning': '雷光链',
        'Conviction': '信仰',
        'Dark Orb': '暗天球',
        'Darkdragon Dive': '黑暗龙炎冲',
        'Death of the Heavens': '至天之阵：死刻',
        'Deathstorm': '死亡风暴',
        'Dimensional Collapse': '空间破碎',
        'Dive from Grace': '堕天龙炎冲',
        'Drachenlance': '腾龙枪',
        'Dread Wyrmsbreath': '邪龙的气息',
        'Empty Dimension': '无维空间',
        'Entangled Flames': '同归于尽之炎',
        'Exaflare\'s Edge': '百京核爆剑',
        'Execution': '处刑',
        'Eye of the Tyrant': '暴君之瞳',
        'Faith Unmoving': '坚定信仰',
        'Final Chorus': '灭绝之诗',
        'Flame Breath': '火焰吐息',
        'Flames of Ascalon': '阿斯卡隆之焰',
        'Flare Nova': '核爆灾祸',
        'Flare Star': '耀星',
        'Full Dimension': '全维空间',
        'Geirskogul': '武神枪',
        'Gigaflare\'s Edge': '十亿核爆剑',
        'Gnash and Lash': '牙尾连旋',
        'Great Wyrmsbreath': '圣龙的气息',
        'Hallowed Plume': '神圣羽毛',
        'Hallowed Wings': '神圣之翼',
        'Hatebound': '邪龙爪牙',
        'Heavenly Heel': '天踵',
        'Heavens\' Stake': '苍穹火刑',
        'Heavensblaze': '苍穹炽焰',
        'Heavensflame': '天火',
        'Heavy Impact': '沉重冲击',
        'Hiemal Storm': '严冬风暴',
        'Holiest of Holy': '至圣',
        'Holy Bladedance': '圣光剑舞',
        'Holy Breath': '神圣吐息',
        'Holy Comet': '神圣彗星',
        'Holy Meteor': '陨石圣星',
        'Holy Orb': '神圣球',
        'Holy Shield Bash': '圣盾猛击',
        'Hot Tail': '燃烧之尾',
        'Hot Wing': '燃烧之翼',
        'Hyperdimensional Slash': '多维空间斩',
        'Ice Breath': '寒冰吐息',
        'Ice of Ascalon': '阿斯卡隆之冰',
        'Incarnation': '圣徒洗礼',
        'Knights of the Round': '圆桌骑士',
        'Lash and Gnash': '尾牙连旋',
        'Lightning Storm': '百雷',
        'Liquid Heaven': '苍天火液',
        'Meteor Impact': '陨石冲击',
        'Mirage Dive': '幻象冲',
        'Mortal Vow': '灭杀的誓言',
        'Morn Afah\'s Edge': '无尽顿悟剑',
        'Planar Prison': '空间牢狱',
        'Pure of Heart': '纯洁心灵',
        'Resentment': '苦闷怒嚎',
        'Revenge of the Horde': '绝命怒嚎',
        'Sacred Sever': '神圣裂斩',
        'Sanctity of the Ward': '苍穹之阵：圣杖',
        'Shockwave': '冲击波',
        'Skyblind': '苍穹刻印',
        'Skyward Leap': '穿天',
        'Soul Tether': '追魂炮',
        'Soul of Devotion': '巫女的思念',
        'Soul of Friendship': '盟友的思念',
        'Spear of the Fury': '战女神之枪',
        'Spiral Pierce': '螺旋枪',
        'Spiral Thrust': '螺旋刺',
        'Spreading Flames': '复仇之炎',
        'Staggering Breath': '交错吐息',
        'Steep in Rage': '愤怒波动',
        'Strength of the Ward': '苍穹之阵：雷枪',
        'Swirling Blizzard': '冰结环',
        'The Bull\'s Steel': '战争狂的决意',
        'The Dragon\'s Eye': '龙眼之光',
        'The Dragon\'s Gaze': '龙眼之邪',
        'The Dragon\'s Glory': '邪龙目光',
        'The Dragon\'s Rage': '邪龙魔炎',
        'Tower': '塔',
        'Touchdown': '空降',
        'Trinity': '三剑一体',
        'Twisting Dive': '旋风冲',
        'Ultimate End': '异史终结',
        'Wrath of the Heavens': '至天之阵：风枪',
        'Wroth Flames': '邪念之炎',
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
        'Meteor Impact': '운석 낙하',
        'The Dragon\'s Gaze': '용의 마안',
      },
    },
  ],
};

export default triggerSet;
