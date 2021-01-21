import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Outputs from '../../../../../resources/outputs.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// TODO: knockback direction from big hand after giant lasers (Palm Of Temperance 58B4/58B6/?/?)
// TODO: for left/right reach during Blade Of Flame, call out Left + #1 alarm for #1.

// TODO: somber dance triggers
// TODO: apocalypse "get away from facing" or some such triggers
// TODO: double apoc clockwise vs counterclockwise call would be nice
// TODO: maybe call something for advanced, including double aero partners?

// Each tether ID corresponds to a primal:
// 008C -- Shiva
// 008D -- Titan
// 008E -- Leviathan
// 008F -- Ifrit
// 0090 -- Ramuh
// 0091 -- Garuda
// We can collect + store these for later use on Stock/Release.
const shivaTetherId = '008C';
const titanTetherId = '008D';
const tetherIds = ['008E', '008F', '0090', '0091'];

const getTetherString = (tethers, output) => {
  // All tethers in E12S are double tethers, plus an optional junction (not in the tether list).
  if (!tethers || tethers.length !== 2)
    return;

  const sorted = tethers.sort();

  const comboStr = sorted[0] + sorted[1];
  if (comboStr in primalOutputStrings)
    return output[comboStr]();

  return output.combined({
    safespot1: output[sorted[0]](),
    safespot2: output[sorted[1]](),
  });
};

// TODO: also on the pre-statue cast, call south for any levi mechanics, west for any ifrit.
const primalOutputStrings = {
  // Tethers.
  '008E': Outputs.middle,
  '008F': Outputs.sides,
  '0090': Outputs.out,
  '0091': {
    en: 'Intercards',
    de: 'Interkardinale Himmelsrichtungen',
    fr: 'Intercardinal',
    ja: '斜め',
    cn: '四角',
    ko: '대각',
  },
  // Tether combos.
  '008E008F': {
    en: 'Under + Sides',
    de: 'Runter + Seiten',
    fr: 'En dessous + côtés',
    ja: '真ん中 + 横へ',
    cn: '正中间两侧',
    ko: '보스 아래 + 양옆',
  },
  '008E0090': {
    en: 'North/South + Out',
    de: 'Norden/Süden + Raus',
    fr: 'Nord/Sud + Extérieur',
    ja: '北/南 + 外へ',
    cn: '南北远离',
    ko: '북/남 + 바깥',
  },
  '008E0091': {
    en: 'Under + Intercards',
    de: 'Runter + Interkardinale Himmerlsrichtungen',
    fr: 'En dessous + Intercardinal',
    ja: '真ん中 + 斜め',
    cn: '正中间四角',
    ko: '보스 아래 + 대각',
  },
  // Text output.
  'combined': {
    en: '${safespot1} + ${safespot2}',
    de: '${safespot1} + ${safespot2}',
    fr: '${safespot1} + ${safespot2}',
    ja: '${safespot1} + ${safespot2}',
    cn: '${safespot1} + ${safespot2}',
    ko: '${safespot1} + ${safespot2}',
  },
  'stock': {
    en: 'Stock: ${text}',
    de: 'Sammeln: ${text}',
    fr: 'Stocker : ${text}',
    ja: 'ストック: ${text}',
    cn: '暂存: ${text}',
    ko: '저장: ${text}',
  },
  'junctionSuffix': {
    en: '${text} (${junction})',
    de: '${text} (${junction})',
    fr: '${text} (${junction})',
    ja: '${text} (${junction})',
    cn: '${text} (${junction})',
    ko: '${text} (${junction})',
  },
  // Junctions.
  'spread': {
    // Shiva spread.
    en: 'spread',
    de: 'verteilen',
    fr: 'dispersion',
    ja: '散開',
    cn: '散开',
    ko: '산개',
  },
  'stacks': {
    // Titan healer stacks.
    en: 'stacks',
    de: 'sammeln',
    fr: 'packages',
    ja: 'ヒラ頭割り',
    cn: '治疗分摊',
    ko: '쉐어',
  },
  'stack': {
    // Obliterate whole group laser stack.
    // This is deliberately "stack" singular (vs Titan "stacks").
    en: 'group stack',
    de: 'In Gruppen sammeln',
    fr: 'package en groupe',
    ja: '頭割り',
    cn: '集合',
    ko: '그룹 쉐어',
  },
};

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B marker in the encounter is the formless tankbuster, ID 004F.
const firstHeadmarker = parseInt('00DA', 16);
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

// For giant lasers.
const numberOutputStrings = [0, 1, 2, 3, 4].map((n) => {
  const str = n.toString();
  return {
    en: str,
    de: str,
    fr: str,
    ja: str,
    cn: str,
    ko: str,
  };
});

// These keys map effect ids to `intermediateRelativityOutputStrings` keys.
const effectIdToOutputStringKey = {
  '690': 'flare',
  '996': 'stack',
  '998': 'shadoweye',
  '99C': 'eruption',
  '99E': 'blizzard',
  '99F': 'aero',
};

// These are currently used for both the informative x > y > z callout,
// but also the individual alerts.  These are kept short and snappy.
const intermediateRelativityOutputStrings = {
  flare: {
    en: 'Flare',
    de: 'Flare',
    fr: 'Brasier',
    ja: 'フレア',
    cn: '核爆',
    ko: '플레어',
  },
  stack: {
    en: 'Stack',
    de: 'Sammeln',
    fr: 'Packez-vous',
    ja: '頭割り',
    cn: '分摊',
    ko: '쉐어',
  },
  shadoweye: {
    en: 'Gaze',
    de: 'Blick',
    fr: 'Regard',
    ja: 'シャドウアイ',
    cn: '暗黑眼',
    ko: '마안',
  },
  eruption: {
    en: 'Spread',
    de: 'Verteilen',
    fr: 'Dispersez-vous',
    ja: '散開',
    cn: '散开',
    ko: '산개',
  },
  blizzard: {
    en: 'Ice',
    de: 'Eis',
    fr: 'Glace',
    ja: 'ブリザガ',
    cn: '冰三',
    ko: '블리자가',
  },
  aero: {
    en: 'Aero',
    de: 'Wind',
    fr: 'Vent',
    ja: 'エアロガ',
    cn: '风三',
    ko: '에어로가',
  },
};

// Returns integer value of x, y in matches based on cardinal or intercardinal
const matchedPositionToDir = (matches) => {
  // Positions are moved downward 75
  const y = parseFloat(matches.y) + 75;
  const x = parseFloat(matches.x);

  // In Basic Relativity, hourglass positions are the 8 cardinals + numerical
  // slop on a radius=20 circle.
  // N = (0, -95), E = (20, -75), S = (0, -55), W = (-20, -75)
  // NE = (14, -89), SE = (14, -61), SW = (-14, -61), NW = (-14, -89)
  //
  // In Advanced Relativity, hourglass positions are the 3 northern positions and
  // three southern positions, plus numerical slop on a radius=10 circle
  // NW = (-10, -80), N = (0, -86), NE = (10, -80)
  // SW = (-10, -69), S = (0, -64), SE = (10, -69)
  //
  // Starting with northwest to favor sorting between north and south for
  // Advanced Relativity party splits.
  // Map NW = 0, N = 1, ..., W = 7

  return (Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8);
};

// Convert dir to Output
const dirToOutput = (dir, output) => {
  const dirs = {
    0: output.northwest(),
    1: output.north(),
    2: output.northeast(),
    3: output.east(),
    4: output.southeast(),
    5: output.south(),
    6: output.southwest(),
    7: output.west(),
  };
  return (dirs[dir]);
};

export default {
  zoneId: ZoneId.EdensPromiseEternitySavage,
  timelineFile: 'e12s.txt',
  triggers: [
    {
      // Headmarkers are randomized, so handle them all with a single trigger.
      id: 'E12S Promise Headmarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.isDoorBoss,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          formlessBusterAndSwap: {
            en: 'Tank Buster + Swap',
            de: 'Tankbuster + Wechsel',
            fr: 'Tank buster + Swap',
            ja: 'タンクバスター + スイッチ',
            cn: '死刑 + 换T',
            ko: '탱버 + 교대',
          },
          formlessBusterOnYOU: {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tank buster sur VOUS',
            ja: '自分にタンクバスター',
            cn: '死刑点名',
            ko: '탱버 대상자',
          },
          // The first round has only one blue.
          titanBlueSingular: {
            en: 'Blue Weight',
            de: 'Blau - Gewicht',
            fr: 'Poids bleu',
            ja: '青、重圧',
            cn: '蓝色重压',
            ko: '파랑',
          },
          // The second and two rounds of bombs have a partner.
          // The third is technically fixed by role with a standard party (one dps, one !dps),
          // but call out your partner anyway in case you've got 8 blus or something.
          titanBlueWithPartner: {
            en: 'Blue (with ${player})',
            de: 'Blau (mit ${player})',
            fr: 'Bleu (avec ${player})',
            ja: '青、重圧 (${player}と)',
            cn: '蓝色重压 (与${player})',
            ko: '파랑 (다른 대상자: ${player})',
          },
          titanOrangeStack: {
            en: 'Orange Stack',
            de: 'Orange - versammeln',
            fr: 'Orange, package',
            ja: '橙、頭割り',
            cn: '橙色分摊',
            ko: '주황: 집합',
          },
          titanYellowSpread: {
            en: 'Yellow Spread',
            de: 'Gelb - Verteilen',
            fr: 'Jaune, dispersion',
            ja: '黄、散開',
            cn: '黄色散开',
            ko: '노랑: 산개',
          },
          // This is sort of redundant, but if folks want to put "square" or something in the text,
          // having these be separate would allow them to configure them separately.
          square1: numberOutputStrings[1],
          square2: numberOutputStrings[2],
          square3: numberOutputStrings[3],
          square4: numberOutputStrings[4],
          triangle1: numberOutputStrings[1],
          triangle2: numberOutputStrings[2],
          triangle3: numberOutputStrings[3],
          triangle4: numberOutputStrings[4],
        };

        const id = getHeadmarkerId(data, matches);

        // Track tankbuster targets, regardless if this is on you or not.
        // Use this to make more intelligent calls when the cast starts.
        if (id === '00DA') {
          data.formlessTargets = data.formlessTargets || [];
          data.formlessTargets.push(matches.target);
        } else if (id === '00BB') {
          data.weightTargets = data.weightTargets || [];
          data.weightTargets.push(matches.target);

          // Handle double blue titan on 2nd and 3rd iterations.
          if (data.seenFirstBombs && data.weightTargets.length === 2) {
            if (data.weightTargets.includes(data.me)) {
              const partner = data.weightTargets[data.weightTargets[0] === data.me ? 1 : 0];
              return {
                alarmText: output.titanBlueWithPartner({ player: data.ShortName(partner) }),
              };
            }
          }
        }

        // From here on out, any response is for the current player.
        if (matches.target !== data.me)
          return;

        // Formless double tankbuster mechanic.
        if (id === '00DA') {
          if (data.role === 'tank')
            return { alertText: output.formlessBusterAndSwap() };
          // Not that you personally can do anything about it, but maybe this
          // is your cue to yell on voice comms for cover.
          return { alarmText: output.formlessBusterOnYOU() };
        }

        // Titan Mechanics (double blue handled above)
        if (id === '00BB' && !data.seenFirstBombs)
          return { alarmText: output.titanBlueSingular() };
        if (id === '00B9')
          return { alertText: output.titanYellowSpread() };
        if (id === '00BA')
          return { infoText: output.titanOrangeStack() };

        // Statue laser mechanic.
        const firstLaserMarker = '0091';
        const lastLaserMarker = '0098';
        if (id >= firstLaserMarker && id <= lastLaserMarker) {
          // We could arguably tell you which giant you're tethered to by finding their position?
          // And then saying something like "North" but that's probably more confusing than helpful.
          // ids are sequential: #1 square, #2 square, #3 square, #4 square, #1 triangle etc
          const decOffset = parseInt(id, 16) - parseInt(firstLaserMarker, 16);
          return {
            alertText: [
              output.square1(),
              output.square2(),
              output.square3(),
              output.square4(),
              output.triangle1(),
              output.triangle2(),
              output.triangle3(),
              output.triangle4(),
            ][decOffset],
          };
        }
      },
    },
    {
      id: 'E12S Promise Weight Cleanup',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58A5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '58A5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '58A5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '58A5', capture: false }),
      run: (data) => {
        delete data.weightTargets;
        data.seenFirstBombs = true;
      },
    },
    {
      id: 'E12S Promise Formless Judgment',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58A9', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '58A9', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '58A9', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '58A9', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          formlessBusterAndSwap: {
            en: 'Tank Buster + Swap',
            de: 'Tankbuster + Wechsel',
            fr: 'Tank buster + Swap',
            ja: 'タンクバスター + スイッチ',
            cn: '坦克死刑 + 换T',
            ko: '탱버 + 교대',
          },
          tankBusters: {
            en: 'Tank Busters',
            de: 'Tankbuster',
            fr: 'Tank busters',
            ja: 'タンクバスター',
            cn: '坦克死刑',
            ko: '탱버',
          },
        };

        // Already called out in the headmarker trigger.
        if (data.formlessTargets && data.formlessTargets.includes(data.me))
          return;

        // TODO: should this call out who to cover if you are a paladin?
        if (data.role === 'tank')
          return { alertText: output.formlessBusterAndSwap() };

        if (data.role === 'healer')
          return { alertText: output.tankBusters() };

        // Be less noisy if this is just for feint.
        return { infoText: output.tankBusters() };
      },
      run: (data) => delete data.formlessTargets,
    },
    {
      id: 'E12S Promise Rapturous Reach Left',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58AD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '58AD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '58AD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '58AD', capture: false }),
      response: Responses.goLeft('info'),
      run: (data) => data.isDoorBoss = true,
    },
    {
      id: 'E12S Promise Rapturous Reach Right',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58AE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '58AE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '58AE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '58AE', capture: false }),
      response: Responses.goRight('info'),
      run: (data) => data.isDoorBoss = true,
    },
    {
      id: 'E12S Promise Obliteration',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58A8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '58A8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '58A8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '58A8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12S Promise Junction Shiva',
      netRegex: NetRegexes.tether({ id: shivaTetherId, capture: false }),
      // Call out what the mechanic will be so that folks have time to move.
      preRun: (data) => {
        data.junctionSuffix = 'spread';
        data.junctionCount = data.junctionCount || 0;
        data.junctionCount++;
      },
      // Add in a slight delay for this big aoe so that trigger is < 10 seconds ahead.
      // Any further than 10 seconds and it's easy to miss reprisal or addle.
      delaySeconds: (data) => data.junctionCount === 2 ? 4 : 0,
      // For the junction with cast, keep the spread up for longer as a reminder.
      durationSeconds: (data) => data.junctionCount === 2 ? 4 : 13,
      alertText: (data, _, output) => {
        // The 2nd and 3rd junctions are different mechanics.
        if (data.junctionCount === 2)
          return output.diamondDust();
        return output.junctionWithCast();
      },
      outputStrings: {
        junctionWithCast: Outputs.spread,
        diamondDust: {
          en: 'Big AOE, Get Middle',
          de: 'Große AoE, geh in die Mitte',
          fr: 'Grosse AoE, allez au milieu',
          ja: '大ダメージ、中へ',
          cn: '超大伤害，去中间',
          ko: '대형 장판, 중앙으로',
        },
      },
    },
    {
      id: 'E12S Promise Junction Titan',
      netRegex: NetRegexes.tether({ id: titanTetherId, capture: false }),
      preRun: (data) => {
        data.junctionSuffix = 'stacks';
        data.junctionCount = data.junctionCount || 0;
        data.junctionCount++;
      },
      // Add in a slight delay for this big aoe so that trigger is < 10 seconds ahead.
      // Any further than 10 seconds and it's easy to miss reprisal or addle.
      // Note: Junction Titan is not the same distance away from the aoe as Junction Shiva.
      delaySeconds: (data) => data.junctionCount === 3 ? 5 : 0,
      // For the junction with cast, keep the stack up for longer as a reminder.
      durationSeconds: (data) => data.junctionCount === 3 ? 4 : 13,
      alertText: (data, _, output) => {
        // The 2nd and 3rd junctions are different mechanics.
        if (data.junctionCount === 3)
          return output.earthenFury();
        return output.junctionWithCast();
      },
      outputStrings: {
        junctionWithCast: {
          en: 'Healer Stacks',
          de: 'Heiler-Gruppen',
          fr: 'Packages Heals',
          ja: 'ヒラ頭割り',
          cn: '治疗分摊',
          ko: '힐러 쉐어',
        },
        earthenFury: {
          en: 'Big AOE, Bombs Soon',
          de: 'Große AoE, bald Bomben',
          fr: 'Grosse AoE, Bombes bientôt',
          ja: '大ダメージ、まもなく岩落とし',
          cn: '超大伤害，即将落石',
          ko: '대형 장판, 곧 폭탄',
        },
      },
    },
    {
      id: 'E12S Promise Tether Collect',
      netRegex: NetRegexes.tether({ id: tetherIds }),
      run: (data, matches) => {
        data.tethers = data.tethers || [];
        data.tethers.push(matches.id);
      },
    },
    {
      id: 'E12S Promise Stock',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '5892', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '5892', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '5892', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '5892', capture: false }),
      infoText: (data, _, output) => {
        data.stockedTethers = data.tethers;
        delete data.tethers;

        const text = getTetherString(data.stockedTethers, output);
        if (!text)
          return;
        return output.stock({ text: text });
      },
      outputStrings: primalOutputStrings,
    },
    {
      id: 'E12S Promise Cast Release',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: ['4E43', '5893'] }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: ['4E43', '5893'] }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: ['4E43', '5893'] }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: ['4E43', '5893'] }),
      preRun: (data) => {
        data.castCount = data.castCount || 0;
        data.castCount++;
      },
      // The pattern is cast - cast - release - release - cast - release.
      // #4 (the 2nd release) starts casting just before the second lion fire breath.
      // Delay just a smidgen so that hypothetically you don't jump off your bait spot early.
      // This is a 7 second long cast bar, so you still have 5 seconds to make it in.
      delaySeconds: (data) => data.castCount === 4 ? 1.8 : 0,
      alertText: (data, matches, output) => {
        // The second cast comes with an obliteration group laser (and no junction).
        // The entire party should stack this one.
        if (data.castCount === 2)
          data.junctionSuffix = 'stack';

        // At the end of the fight, there is a stock -> cast -> release,
        // which means that we need to grab the original tethers during the first stock.
        const isRelease = matches.id === '5893';
        const text = getTetherString(isRelease ? data.stockedTethers : data.tethers, output);
        if (!text)
          return;
        if (!data.junctionSuffix)
          return text;
        return output.junctionSuffix({
          text: text,
          junction: output[data.junctionSuffix](),
        });
      },
      run: (data) => {
        delete data.tethers;
        delete data.junctionSuffix;
      },
      outputStrings: primalOutputStrings,
    },
    {
      id: 'E12S Promise Tether Cleanup',
      netRegex: NetRegexes.startsUsing({ id: ['4E43', '5892', '5893'], capture: false }),
      delaySeconds: 10,
      run: (data) => delete data.tethers,
    },
    {
      id: 'E12S Promise Plunging Ice',
      // This has a 9 second cast. :eyes:
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '589D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '589D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '589D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '589D', capture: false }),
      delaySeconds: 4,
      response: Responses.knockback('alert'),
    },
    {
      // We could arguably tell people where their lion is, but this is probably plenty.
      id: 'E12S Promise Small Lion Tether',
      netRegex: NetRegexes.tether({ source: 'Beastly Sculpture', id: '0011' }),
      netRegexDe: NetRegexes.tether({ source: 'Abbild Eines Löwen', id: '0011' }),
      netRegexFr: NetRegexes.tether({ source: 'Création Léonine', id: '0011' }),
      netRegexJa: NetRegexes.tether({ source: '創られた獅子', id: '0011' }),
      condition: Conditions.targetIsYou(),
      // Don't collide with reach left/right call.
      delaySeconds: 0.5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Lion Tether on YOU',
          de: 'Löwen-Verbindung auf DIR',
          fr: 'Lien lion sur VOUS',
          ja: '自分にライオン線',
          cn: '狮子连线点名',
          ko: '사자 선 대상자',
        },
      },
    },
    {
      id: 'E12S Oracle Shockwave Pulsar',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58F0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58F0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58F0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58F0', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12S Relativity Phase',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E[0-3]' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58E[0-3]' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58E[0-3]' }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58E[0-3]' }),
      run: (data, matches) => {
        data.phase = {
          '58E0': 'basic',
          '58E1': 'intermediate',
          '58E2': 'advanced',
          '58E3': 'terminal',
        }[matches.id];
      },
    },
    {
      id: 'E12S Oracle Basic Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E0', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58E0', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58E0', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58E0', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'E12S Oracle Intermediate Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58E1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58E1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58E1', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'E12S Oracle Advanced Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58E2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58E2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58E2', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'E12S Oracle Terminal Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58E3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58E3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58E3', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
    },
    {
      id: 'E12S Oracle Darkest Dance',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58BE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58BE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58BE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58BE', capture: false }),
      infoText: (data, _, output) => {
        if (data.role === 'tank')
          return output.tankBait();
        return output.partyUnder();
      },
      outputStrings: {
        tankBait: {
          en: 'Bait Far',
          de: 'Ködern - Weit weg',
          fr: 'Attirez au loin',
          ja: '遠くに誘導',
          cn: '向外诱导',
          ko: '멀리 유도하기',
        },
        partyUnder: {
          en: 'Get Under',
          de: 'Unter ihn',
          fr: 'En dessous',
          ja: 'ボスと貼り付く',
          cn: '去脚下',
          ko: '보스 아래로',
        },
      },
    },
    {
      id: 'E12S Shell Crusher',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58C3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58C3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58C3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58C3', capture: false }),
      response: Responses.getTogether('alert'),
    },
    {
      id: 'E12S Spirit Taker',
      // Spirit Taker always comes after Shell Crusher, so trigger on Shell Crusher damage
      // to warn people a second or two earlier than `starts using Spirit Taker` would occur.
      netRegex: NetRegexes.ability({ source: 'Oracle Of Darkness', id: '58C3', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Orakel Der Dunkelheit', id: '58C3', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Prêtresse Des Ténèbres', id: '58C3', capture: false }),
      netRegexJa: NetRegexes.ability({ source: '闇の巫女', id: '58C3', capture: false }),
      suppressSeconds: 1,
      response: Responses.spread('info'),
    },
    {
      id: 'E12S Black Halo',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58C7' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Orakel Der Dunkelheit', id: '58C7' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Prêtresse Des Ténèbres', id: '58C7' }),
      netRegexJa: NetRegexes.startsUsing({ source: '闇の巫女', id: '58C7' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster('alert'),
    },
    {
      id: 'E12S Relativity Debuff Collector',
      // 690 Spell-In-Waiting: Flare
      // 996 Spell-In-Waiting: Unholy Darkness
      // 998 Spell-In-Waiting: Shadoweye
      // 99C Spell-In-Waiting: Dark Eruption
      // 99E Spell-In-Waiting: Dark Blizzard III
      // 99F Spell-In-Waiting: Dark Aero III
      netRegex: NetRegexes.gainsEffect({ effectId: ['690', '99[68CEF]'] }),
      condition: (data, matches) => data.phase === 'intermediate' && matches.target === data.me,
      preRun: (data, matches) => {
        data.debuffs = data.debuffs || {};
        data.debuffs[matches.effectId.toUpperCase()] = parseFloat(matches.duration);
      },
      durationSeconds: 20,
      infoText: (data, _, output) => {
        const unsortedIds = Object.keys(data.debuffs);
        if (unsortedIds.length !== 3)
          return;

        // Sort effect ids descending by duration.
        const sortedIds = unsortedIds.sort((a, b) => data.debuffs[b] - data.debuffs[a]);
        const keys = sortedIds.map((effectId) => effectIdToOutputStringKey[effectId]);

        // Stash outputstring keys to use later.
        data.intermediateDebuffs = [keys[1], keys[2]];

        return output.comboText({
          effect1: output[keys[0]](),
          effect2: output[keys[1]](),
          effect3: output[keys[2]](),
        });
      },
      outputStrings: Object.assign({
        comboText: {
          en: '${effect1} > ${effect2} > ${effect3}',
          de: '${effect1} > ${effect2} > ${effect3}',
          fr: '${effect1} > ${effect2} > ${effect3}',
          ja: '${effect1} > ${effect2} > ${effect3}',
          cn: '${effect1} > ${effect2} > ${effect3}',
          ko: '${effect1} > ${effect2} > ${effect3}',
        },
      }, intermediateRelativityOutputStrings),
    },
    {
      id: 'E12S Relativity Debuffs',
      // Players originally get `Spell-in-Waiting: Return` or `Spell-in-Waiting: Return IV`.
      // When Spell-in-Waiting Return IV wears off, players get Return IV effect.
      // When Return IV effect wears off, players get Return effect.
      // When Return effect wears off, players go back to previous locations
      //
      // Return = 994
      // Return IV = 995
      netRegex: NetRegexes.gainsEffect({ effectId: '99[45]' }),
      condition: Conditions.targetIsYou(),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = Object.assign({
          moveAway: {
            en: 'Move!',
            de: 'Bewegen!',
            fr: 'Bougez !',
            ja: '避けて！',
            cn: '快躲开！',
            ko: '이동하기!',
          },
        }, intermediateRelativityOutputStrings);

        if (data.phase !== 'intermediate')
          return { infoText: output.moveAway() };

        const key = data.intermediateDebuffs && data.intermediateDebuffs.shift();
        if (!key)
          return { infoText: output.moveAway() };
        return { alertText: output[key]() };
      },
    },
    {
      id: 'E12S Oracle Basic Relativity Shadow Eye Me',
      netRegex: NetRegexes.gainsEffect({ effectId: '998' }),
      condition: (data, matches) => data.phase === 'basic',
      preRun: (data, matches) => {
        data.eyes = data.eyes || [];
        data.eyes.push(matches.target);
      },
      // Delay so that we don't overwrite Hourglass callout
      delaySeconds: 4,
      infoText: (data, matches, output) => {
        // The trigger repeats for collection; only call out first match
        if (data.eyes.includes(data.me) && !data.eyecalled) {
          data.eyecalled = true;
          return output.text();
        }
        return;
      },
      outputStrings: {
        text: {
          en: 'Eye on YOU',
          de: 'Auge auf DIR',
          fr: 'Œil sur VOUS',
          ja: '自分に目',
          cn: '石化眼点名',
          ko: '시선징 대상자',
        },
      },
    },
    {
      id: 'E12S Oracle Basic Relativity Shadow Eye Other',
      netRegex: NetRegexes.gainsEffect({ effectId: '998' }),
      condition: (data, matches) => data.phase === 'basic',
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 3,
      alertText: (data, matches, output) => {
        const player1 = data.eyes[0];
        const player2 = data.eyes.length === 2 ? data.eyes[1] : false;

        if (player1 !== data.me && player2 !== data.me) {
          // Call out both player names if you don't have eye
          return output.lookAwayFromPlayers({
            player1: data.ShortName(player1),
            player2: data.ShortName(player2),
          });
        } else if (player1 === data.me && player2) {
          // Call out second player name if exists and you have eye
          return output.lookAwayFromPlayer({ player: data.ShortName(player2) });
        } else if (player2 === data.me) {
          // Call out first player name if you have eye
          return output.lookAwayFromPlayer({ player: data.ShortName(player1) });
        }

        // Return empty when only you have eye
        return;
      },
      outputStrings: {
        lookAwayFromPlayers: {
          en: 'Look Away from ${player1} and ${player2}',
          // TODO: Verify these localizations:
          // de: 'Schau weg von ${player1} und ${player2}',
          // fr: 'Ne regardez pas ${player1} et ${player2}',
          ja: '${player1}と${player2}を見ない',
          cn: '背对${player1}和${player2}',
          // ko: '${player1}와 ${player2}에게서 뒤돌기',
        },
        lookAwayFromPlayer: Outputs.lookAwayFromPlayer,
      },
    },
    {
      // For intermediate and advanced, players should look outside during the final return effect.
      // For basic relativity, the shadoweye happens when the return puddle is dropped.
      id: 'E12S Relativity Look Outside',
      netRegex: NetRegexes.gainsEffect({ effectId: '994' }),
      condition: (data, matches) => data.phase !== 'basic' && matches.target === data.me,
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 2.5,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look Outside',
          de: 'Nach draußen schauen',
          fr: 'Regardez vers l\'extérieur',
          ja: '外に向け',
          cn: '背对',
          ko: '바깥 보기',
        },
      },
    },
    {
      id: 'E12S Basic Relativity Yellow Hourglass',
      // Orient where "Yellow" Anger's Hourglass spawns
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9824' }),
      durationSeconds: 15,
      infoText: (data, matches, output) => {
        return output.hourglass({
          dir: dirToOutput(matchedPositionToDir(matches), output),
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
        hourglass: {
          en: 'Yellow: ${dir}',
          de: 'Gelb: ${dir}',
          fr: 'Jaune : ${dir}',
          ja: '黄色: ${dir}',
          cn: '黄色: ${dir}',
          ko: '노랑: ${dir}',
        },
      },
    },
    {
      id: 'E12S Adv Relativity Hourglass Collect',
      // Collect Sorrow's Hourglass locations
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9823' }),
      run: (data, matches) => {
        const id = matches.id.toUpperCase();

        data.sorrows = data.sorrows || {};
        data.sorrows[id] = matchedPositionToDir(matches);
      },
    },
    {
      id: 'E12S Adv Relativity Hourglass Collect Yellow Tethers',
      // '0086' is the Yellow tether that buffs "Quicken"
      // '0085' is the Red tether that buffs "Slow"
      netRegex: NetRegexes.tether({ id: '0086' }),
      condition: (data, matches) => data.phase === 'advanced',
      durationSeconds: 8,
      suppressSeconds: 3,
      infoText: (data, matches, output) => {
        const sorrow1 = data.sorrows[matches.sourceId.toUpperCase()];

        // Calculate opposite side
        const sorrow2 = (sorrow1 + 4) % 8;

        return output.hourglass({
          dir1: sorrow1 < sorrow2 ? dirToOutput(sorrow1, output) : dirToOutput(sorrow2, output),
          dir2: sorrow1 > sorrow2 ? dirToOutput(sorrow1, output) : dirToOutput(sorrow2, output),
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
        hourglass: {
          en: 'Yellow: ${dir1} / ${dir2}',
          de: 'Gelb: ${dir1} / ${dir2}',
          fr: 'Jaune : ${dir1} / ${dir2}',
          ja: '黄色: ${dir1} / ${dir2}',
          cn: '黄色: ${dir1} / ${dir2}',
          ko: '노랑: ${dir1} / ${dir2}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Beastly Sculpture': 'Abbild eines Löwen',
        'Bomb Boulder': 'Bomber-Brocken',
        'Chiseled Sculpture': 'Abbild eines Mannes',
        'Eden\'s Promise': 'Edens Verheißung',
        'Guardian Of Eden': 'Wächter von Eden',
        'Ice Pillar': 'Eissäule',
        'Oracle Of Darkness': 'Orakel der Dunkelheit',
        'Sorrow\'s Hourglass': 'Sanduhr der Sorge',
      },
      'replaceText': {
        'Advanced Relativity': 'Fortgeschrittene Relativität',
        '(?<!(Singular|Dual|Triple) )Apocalypse': 'Apokalypse',
        'Basic Relativity': 'Grundlegende Relativität',
        'Black Halo': 'Geschwärzter Schein',
        'Blade Of Flame': 'Flammenschwert',
        'Cast': 'Auswerfen',
        'Cataclysm': 'Kataklysmus',
        'Classical Sculpture': 'Klassische Skulptur',
        'Dark Aero III': 'Dunkel-Windga',
        'Dark Current': 'Dunkel-Strom',
        'Dark Eruption': 'Dunkle Eruption',
        'Dark Fire III': 'Dunkel-Feuga',
        'Dark Water III': 'Dunkel-Aquaga',
        'Darkest Dance': 'Finsterer Tanz',
        'Diamond Dust': 'Diamantenstaub',
        'Dual Apocalypse': 'Doppelte Apokalypse',
        'Earthen Fury': 'Gaias Zorn',
        'Empty Hate': 'Gähnender Abgrund',
        'Empty Rage': 'Lockende Leere',
        'Force Of The Land': 'Gaias Tosen',
        'Formless Judgment': 'Formloses Urteil',
        'Frigid Stone': 'Eisstein',
        'Hell\'s Judgment': 'Höllenurteil',
        'Ice Floe': 'Eisfluss',
        'Ice Pillar': 'Eissäule',
        'Impact': 'Impakt',
        'Initialize Recall': 'Rückholung initialisieren',
        'Intermediate Relativity': 'Intermediäre Relativität',
        'Junction Shiva': 'Verbindung: Shiva',
        'Junction Titan': 'Verbindung: Titan',
        'Laser Eye': 'Laserauge',
        'Lionsblaze': 'Löwenfeuer',
        'Maelstrom': 'Mahlstrom',
        'Memory\'s End': 'Ende der Erinnerungen',
        'Obliteration': 'Auslöschung',
        'Palm Of Temperance': 'Hand der Mäßigung',
        'Paradise Lost': 'Verlorenes Paradies',
        'Pillar Pierce': 'Säulendurchschlag',
        'Plunging Ice': 'Fallendes Eis',
        'Pulse Of The Land': 'Gaias Beben',
        'Quicken': 'Schnell',
        'Rapturous Reach': 'Stürmischer Griff',
        'Release': 'Freilassen',
        'Return(?! IV)': 'Rückführung',
        'Return IV': 'Giga-Rückführung',
        'Shadoweye': 'Schattenauge',
        'Shell Crusher': 'Hüllenbrecher',
        'Shockwave Pulsar': 'Schockwellenpulsar',
        'Singular Apocalypse': 'Einfache Apokalypse',
        'Slow': 'Langsam',
        'Somber Dance': 'Düsterer Tanz',
        'Speed': 'Geschwindigkeit',
        'Spell-In-Waiting': 'Verzögerung',
        'Spirit Taker': 'Geistesdieb',
        'Stock': 'Sammeln',
        'Terminal Relativity': 'Terminale Relativität',
        '(?<!Junction )Titan': 'Titan',
        'Triple Apocalypse': 'Dreifache Apokalypse',
        'Under The Weight': 'Wucht der Erde',
        'Weight Of The World': 'Schwere der Erde',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Beastly Sculpture': 'création léonine',
        'Bomb Boulder': 'bombo rocher',
        'Chiseled Sculpture': 'création masculine',
        'Eden\'s Promise': 'Promesse d\'Éden',
        'Guardian Of Eden': 'Gardien d\'Éden',
        'Ice Pillar': 'Pilier de glace',
        'Oracle Of Darkness': 'prêtresse des Ténèbres',
        'Sorrow\'s Hourglass': 'sablier de chagrin',
      },
      'replaceText': {
        'Advanced Relativity': 'Relativité avancée',
        '(?<!(Singular|Dual|Triple) )Apocalypse': 'Apocalypse',
        'Basic Relativity': 'Relativité basique',
        'Black Halo': 'Halo de noirceur',
        'Blade Of Flame': 'Flammes de Lumière colossales',
        'Cast': 'Lancer',
        'Cataclysm': 'Cataclysme',
        'Classical Sculpture': 'Serviteur colossal',
        'Dark Aero III': 'Méga Vent ténébreux',
        'Dark Current': 'Flux sombre',
        'Dark Eruption': 'Éruption ténébreuse',
        'Dark Fire III': 'Méga Feu ténébreux',
        'Dark Water III': 'Méga Eau ténébreuse',
        'Darkest Dance': 'Danse de la nuit profonde',
        'Diamond Dust': 'Poussière de diamant',
        'Dual Apocalypse': 'Apocalypse double',
        'Earthen Fury': 'Fureur tellurique',
        'Empty Hate': 'Vaine malice',
        'Empty Rage': 'Vaine cruauté',
        'Force Of The Land': 'Grondement tellurique',
        'Formless Judgment': 'Onde du châtiment',
        'Frigid Stone': 'Rocher de glace',
        'Hell\'s Judgment': 'Jugement dernier',
        'Ice Floe': 'Flux glacé',
        'Ice Pillar': 'Pilier de glace',
        'Impact': 'Impact',
        'Initialize Recall': 'Remembrances',
        'Intermediate Relativity': 'Relativité intermédiaire',
        'Junction Shiva': 'Associer : Shiva',
        'Junction Titan': 'Associer : Titan',
        'Laser Eye': 'Faisceau maser',
        'Lionsblaze': 'Feu léonin',
        'Maelstrom': 'Maelström',
        'Memory\'s End': 'Mort des souvenirs',
        'Obliteration': 'Maleficium',
        'Palm Of Temperance': 'Paume de tempérance',
        'Paradise Lost': 'Paradis perdu',
        'Pillar Pierce': 'Frappe puissante',
        'Plunging Ice': 'Chute de glace',
        'Pulse Of The Land': 'Vibration tellurique',
        'Quicken': 'Accélération',
        'Rapturous Reach': 'Main voluptueuse',
        'Release': 'Relâcher',
        'Return(?! IV)': 'Retour',
        'Return IV': 'Giga Retour',
        'Shadoweye': 'Œil de l\'ombre',
        'Shell Crusher': 'Broyeur de carapace',
        'Shockwave Pulsar': 'Pulsar à onde de choc',
        'Singular Apocalypse': 'Apocalypse simple',
        'Slow': 'Lenteur',
        'Somber Dance': 'Danse du crépuscule',
        'Speed': 'Vitesse',
        'Spell-In-Waiting': 'Déphasage incantatoire',
        'Spirit Taker': 'Arracheur d\'esprit',
        'Stock': 'Stocker',
        'Terminal Relativity': 'Relativité terminale',
        '(?<!Junction )Titan': 'Titan',
        'Triple Apocalypse': 'Apocalypse triple',
        'Under The Weight': 'Pression tellurique',
        'Weight Of The World': 'Poids du monde',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Beastly Sculpture': '創られた獅子',
        'Bomb Boulder': 'ボムボルダー',
        'Chiseled Sculpture': '創られた男',
        'Eden\'s Promise': 'プロミス・オブ・エデン',
        'Guardian Of Eden': 'ガーディアン・オブ・エデン',
        'Ice Pillar': '氷柱',
        'Oracle Of Darkness': '闇の巫女',
        'Sorrow\'s Hourglass': '悲しみの砂時計',
      },
      'replaceText': {
        'Advanced Relativity': '時間圧縮・急',
        '(?<!(Singular|Dual|Triple) )Apocalypse': 'アポカリプス',
        'Basic Relativity': '時間圧縮・序',
        'Black Halo': 'ブラックヘイロー',
        'Blade Of Flame': '巨兵の光炎',
        'Cast': 'はなつ',
        'Cataclysm': 'カタクリスム',
        'Classical Sculpture': '巨兵創出',
        'Dark Aero III': 'ダークエアロガ',
        'Dark Current': 'ダークストリーム',
        '(?<! )Dark Eruption(?! )': 'ダークエラプション',
        'Dark Eruption / Dark Water III': 'ダークエラプション/ダークウォタガ',
        'Dark Fire III': 'ダークファイガ',
        'Dark Water III / Dark Eruption': 'ダークウォタガ/ダークエラプション',
        '(?<! )Dark Water III(?! )': 'ダークウォタガ',
        'Darkest Dance': '暗夜の舞踏技',
        'Diamond Dust': 'ダイアモンドダスト',
        'Dual Apocalypse': 'アポカリプス・ダブル',
        'Earthen Fury': '大地の怒り',
        'Empty Hate': '虚ろなる悪意',
        'Empty Rage': '虚ろなる害意',
        'Force Of The Land': '大地の轟き',
        'Formless Judgment': '天罰の波動',
        'Frigid Stone': 'アイスストーン',
        'Hell\'s Judgment': 'ヘル・ジャッジメント',
        'Ice Floe': 'アイスフロー',
        'Ice Pillar': '氷柱',
        'Impact': '衝撃',
        'Initialize Recall': '記憶想起',
        'Intermediate Relativity': '時間圧縮・破',
        'Junction Shiva': 'ジャンクション：シヴァ',
        'Junction Titan': 'ジャンクション：タイタン',
        'Laser Eye': 'メーザーアイ',
        'Lionsblaze': '獅子の業火',
        'Maelstrom': 'メイルシュトローム',
        'Memory\'s End': 'エンド・オブ・メモリーズ',
        'Obliteration(?! Laser)': 'マレフィキウム',
        'Obliteration Laser': 'マレフィキウム レーザー',
        'Palm Of Temperance': '拒絶の手',
        'Paradise Lost': 'パラダイスロスト',
        'Pillar Pierce': '激突',
        'Plunging Ice': '落氷衝撃',
        'Pulse Of The Land': '大地の響き',
        'Quicken': 'クイック',
        'Rapturous Reach': '悦楽の手',
        'Release': 'リリース',
        'Return(?! IV)': 'リターン',
        'Return IV': 'リタンジャ',
        'Shadoweye': 'シャドウアイ',
        'Shell Crusher': 'シェルクラッシャー',
        'Shockwave Pulsar': 'ショックウェーブ・パルサー',
        'Singular Apocalypse': 'アポカリプス・シングル',
        'Slow': 'スロウ',
        'Somber Dance': '宵闇の舞踏技',
        'Speed': 'スピード',
        'Spell-In-Waiting': 'ディレイスペル',
        'Spirit Taker': 'スピリットテイカー',
        'Stock': 'ストック',
        'Terminal Relativity': '時間圧縮・終',
        '(?<!Junction )Titan': 'タイタン',
        'Triple Apocalypse': 'アポカリプス・トリプル',
        'Under The Weight': '大地の重圧',
        'Weight Of The World': '大陸の重み',
      },
    },
  ],
};
