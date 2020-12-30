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
    ja: '斜め',
    cn: '四角',
    ko: '대각',
  },
  // Tether combos.
  '008E008F': {
    en: 'Under + Sides',
    de: 'Runter + Seiten',
    ja: '真ん中 + 横へ',
    cn: '正中间两侧',
    ko: '보스 아래 + 양옆',
  },
  '008E0090': {
    en: 'North/South + Out',
    de: 'Norden/Süden + Raus',
    ja: '北/南 + 外へ',
    cn: '南北远离',
    ko: '북/남 + 바깥',
  },
  '008E0091': {
    en: 'Under + Intercards',
    de: 'Runter + Interkardinale Himmerlsrichtungen',
    ja: '真ん中 + 斜め',
    cn: '正中间四角',
    ko: '보스 아래 + 대각',
  },
  // Text output.
  'combined': {
    en: '${safespot1} + ${safespot2}',
    de: '${safespot1} + ${safespot2}',
    ja: '${safespot1} + ${safespot2}',
    cn: '${safespot1} + ${safespot2}',
    ko: '${safespot1} + ${safespot2}',
  },
  'stock': {
    en: 'Stock: ${text}',
    de: 'Sammeln: ${text}',
    ja: 'ストック: ${text}',
    cn: '暂存: ${text}',
    ko: '저장: ${text}',
  },
  'junctionSuffix': {
    en: '${text} (${junction})',
    de: '${text} (${junction})',
    ja: '${text} (${junction})',
    cn: '${text} (${junction})',
    ko: '${text} (${junction})',
  },
  // Junctions.
  'spread': {
    // Shiva spread.
    en: 'spread',
    de: 'verteilen',
    ja: '散開',
    cn: '散开',
    ko: '산개',
  },
  'stacks': {
    // Titan healer stacks.
    en: 'stacks',
    de: 'sammeln',
    ja: 'ヒラ頭割り',
    cn: '治疗分摊',
    ko: '쉐어',
  },
  'stack': {
    // Obliterate whole group laser stack.
    // This is deliberately "stack" singular (vs Titan "stacks").
    en: 'group stack',
    de: 'In Gruppen sammeln',
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
  },
  stack: {
    en: 'Stack',
  },
  shadoweye: {
    en: 'Gaze',
  },
  eruption: {
    en: 'Spread',
  },
  blizzard: {
    en: 'Ice',
  },
  aero: {
    en: 'Aero',
  },
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
          },
          formlessBusterOnYOU: {
            en: 'Tank Buster on YOU',
          },
          // The first round has only one blue.
          titanBlueSingular: {
            en: 'Blue Weight',
          },
          // The second and two rounds of bombs have a partner.
          // The third is technically fixed by role with a standard party (one dps, one !dps),
          // but call out your partner anyway in case you've got 8 blus or something.
          titanBlueWithPartner: {
            en: 'Blue (with ${player})',
          },
          titanOrangeStack: {
            en: 'Orange Stack',
          },
          titanYellowSpread: {
            en: 'Yellow Spread',
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
      run: (data) => {
        delete data.weightTargets;
        data.seenFirstBombs = true;
      },
    },
    {
      id: 'E12S Promise Formless Judgment',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58A9', capture: false }),
      condition: Conditions.caresAboutPhysical(),
      response: (data, _, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          formlessBusterAndSwap: {
            en: 'Tank Buster + Swap',
          },
          tankBusters: {
            en: 'Tank Busters',
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
    },
    {
      id: 'E12S Promise Rapturous Reach Right',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58AE', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '58AE', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '58AE', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '58AE', capture: false }),
      response: Responses.goRight('info'),
    },
    {
      id: 'E12S Promise Obliteration',
      netRegex: NetRegexes.startsUsing({ source: 'Eden\'s Promise', id: '58A8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Edens Verheißung', id: '58A8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Promesse D\'Éden', id: '58A8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'プロミス・オブ・エデン', id: '58A8', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
      run: (data) => data.isDoorBoss = true,
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
          ja: 'ヒラ頭割り',
          cn: '治疗分摊',
          ko: '힐러 쉐어',
        },
        earthenFury: {
          en: 'Big AOE, Bombs Soon',
          de: 'Große AoE, bald Bomben',
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
          ja: '自分にライオン線',
          cn: '狮子连线点名',
          ko: '사자 선 대상자',
        },
      },
    },
    {
      id: 'E12S Oracle Shockwave Pulsar',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58F0', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12S Oracle Basic Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E0', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
      run: (data) => data.phase = 'basic',
    },
    {
      id: 'E12S Oracle Intermediate Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E1', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
      run: (data) => data.phase = 'intermediate',
    },
    {
      id: 'E12S Oracle Advanced Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E2', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
      run: (data) => data.phase = 'advanced',
    },
    {
      id: 'E12S Oracle Terminal Relativity',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58E3', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.bigAoe(),
      run: (data) => data.phase = 'terminal',
    },
    {
      id: 'E12S Oracle Darkest Dance',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58BE', capture: false }),
      infoText: (data, _, output) => {
        if (data.role === 'tank')
          return output.tankBait();
        return output.partyUnder();
      },
      outputStrings: {
        tankBait: {
          en: 'Bait Far',
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
      response: Responses.getTogether('alert'),
    },
    {
      id: 'E12S Spirit Taker',
      // Spirit Taker always comes after Shell Crusher, so trigger on Shell Crusher damage
      // to warn people a second or two earlier than `starts using Spirit Taker` would occur.
      netRegex: NetRegexes.ability({ source: 'Oracle Of Darkness', id: '58C3', capture: false }),
      suppressSeconds: 1,
      response: Responses.spread('info'),
    },
    {
      id: 'E12S Black Halo',
      netRegex: NetRegexes.startsUsing({ source: 'Oracle Of Darkness', id: '58C7' }),
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
      id: 'E12S Basic Relativity Shadoweye',
      netRegex: NetRegexes.gainsEffect({ effectId: '998' }),
      condition: (data, matches) => data.phase === 'basic',
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 2,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          // TODO: we could say "look away from x, y" or "look away from tanks"?
          en: 'Look Away',
        },
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
        '--1--': '--1--',
        '--2--': '--2--',
        '--3--': '--3--',
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
        '(?<!Dark )Water III': 'Aquaga',
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
        '--1--': '--1--',
        '--2--': '--2--',
        '--3--': '--3--',
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
        '(?<!Dark )Water III': 'Méga Eau',
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
        '--1--': '--1--',
        '--2--': '--2--',
        '--3--': '--3--',
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
        '(?<!Dark )Water III': 'ウォタガ',
        'Weight Of The World': '大陸の重み',
      },
    },
  ],
};
