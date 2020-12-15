import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// Handle randomized headmarkers:
// TODO: tankbuster markers
// TODO: do the formless markers come out in hate order? if so, be smart about swap vs buster call.
// TODO: electric slide markers
// TODO: titan headmarkers

// TODO: knockback direction from big hand after giant lasers (Palm Of Temperance 58B4/58B6/?/?)
// TODO: for left/right reach during Blade Of Flame, call out Left + #1 alarm for #1.
// TODO: classical sculpture healer stacks are id 0106 headmarkers, but happen earlier too :C
// TODO: knockback from lion

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
  '008E': {
    en: 'Middle',
    de: 'Mitte',
    ko: '중앙',
  },
  '008F': {
    en: 'Sides',
    de: 'Seiten',
    ko: '양옆',
  },
  '0090': {
    en: 'Out',
    de: 'Raus',
    ko: '바깥',
  },
  '0091': {
    en: 'Intercards',
    de: 'Interkardinale Himmelsrichtungen',
    ko: '대각',
  },
  // Tether combos.
  '008E008F': {
    en: 'Under + Sides',
    de: 'Runter + Seiten',
    ko: '보스 아래 + 양옆',
  },
  '008E0090': {
    en: 'North/South + Out',
    de: 'Norden/Süden + Raus',
    ko: '북/남 + 바깥',
  },
  '008E0091': {
    en: 'Under + Intercards',
    de: 'Runter + Interkardinale Himmerlsrichtungen',
    ko: '보스 아래 + 대각',
  },
  // Text output.
  'combined': {
    en: '${safespot1} + ${safespot2}',
    de: '${safespot1} + ${safespot2}',
    ko: '${safespot1} + ${safespot2}',
  },
  'stock': {
    en: 'Stock: ${text}',
    de: 'Sammeln: ${text}',
    ko: '저장: ${text}',
  },
  'junctionSuffix': {
    en: '${text} (${junction})',
    de: '${text} (${junction})',
    ko: '${text} (${junction})',
  },
  // Junctions.
  'spread': {
    // Shiva spread.
    en: 'spread',
    de: 'verteilen',
    ko: '산개',
  },
  'stacks': {
    // Titan healer stacks.
    en: 'stacks',
    de: 'sammeln',
    ko: '쉐어',
  },
  'stack': {
    // Obliterate whole group laser stack.
    // This is deliberately "stack" singular (vs Titan "stacks").
    en: 'group stack',
    de: 'In Gruppen sammeln',
    ko: '그룹 쉐어',
  },
};

export default {
  zoneId: ZoneId.EdensPromiseEternitySavage,
  timelineFile: 'e12s.txt',
  triggers: [
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
      durationSeconds: (data) => data.junctionCount === 2 ? 4 : 13,
      alertText: (data, _, output) => {
        // The 2nd and 3rd junctions are different mechanics.
        if (data.junctionCount === 2)
          return output.diamondDust();
        return output.junctionWithCast();
      },
      outputStrings: {
        // Use parentheses to try to connote that this is a tell for the future, e.g. wolex.
        junctionWithCast: {
          en: 'Spread',
          de: 'Verteilen',
          ko: '산개',
        },
        // TODO: maybe this should be a timeline trigger instead, since it needs more mit.
        diamondDust: {
          en: 'Big AOE, Get Middle',
          de: 'Große AoE, geh in die Mitte',
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
          ko: '힐러 쉐어',
        },
        earthenFury: {
          en: 'Big AOE, Bombs Soon',
          de: 'Große AoE, bald Bomben',
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
      delaySeconds: 3.1, // just for safety
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
          ko: '사자 선 대상자',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Beastly Sculpture': 'Abbild eines Löwen',
        'Bomb Boulder': 'Bomber-Brocken',
        'Chiseled Sculpture': 'Abbild eines Mannes',
        'Eden\'s Promise': 'Edens Verheißung',
        'Guardian Of Eden': 'Wächter von Eden',
        'Ice Pillar': 'Eissäule',
      },
      'replaceText': {
        'Blade Of Flame': 'Flammenschwert',
        'Cast': 'Auswerfen',
        'Classical Sculpture': 'Klassische Skulptur',
        'Diamond Dust': 'Diamantenstaub',
        'Earthen Fury': 'Gaias Zorn',
        'Force Of The Land': 'Gaias Tosen',
        'Formless Judgment': 'Formloses Urteil',
        'Frigid Stone': 'Eisstein',
        'Ice Floe': 'Eisfluss',
        'Ice Pillar': 'Eissäule',
        'Impact': 'Impakt',
        'Initialize Recall': 'Rückholung initialisieren',
        'Junction Shiva': 'Verbindung: Shiva',
        'Junction Titan': 'Verbindung: Titan',
        'Laser Eye': 'Laserauge',
        'Lionsblaze': 'Löwenfeuer',
        'Obliteration': 'Auslöschung',
        'Palm Of Temperance': 'Hand der Mäßigung',
        'Pillar Pierce': 'Säulendurchschlag',
        'Plunging Ice': 'Fallendes Eis',
        'Pulse Of The Land': 'Gaias Beben',
        'Rapturous Reach': 'Stürmischer Griff',
        'Release': 'Freilassen',
        'Stock': 'Sammeln',
        '(?<!Junction )Titan': 'Titan',
        'Under The Weight': 'Wucht der Erde',
        'Weight Of The World': 'Schwere der Erde',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Beastly Sculpture': 'création léonine',
        'Bomb Boulder': 'bombo rocher',
        'Chiseled Sculpture': 'création masculine',
        'Eden\'s Promise': 'Promesse d\'Éden',
        'Guardian Of Eden': 'Gardien d\'Éden',
        'Ice Pillar': 'Pilier de glace',
      },
      'replaceText': {
        'Blade Of Flame': 'Flammes de Lumière colossales',
        'Cast': 'Lancer',
        'Classical Sculpture': 'Serviteur colossal',
        'Diamond Dust': 'Poussière de diamant',
        'Earthen Fury': 'Fureur tellurique',
        'Force Of The Land': 'Grondement tellurique',
        'Formless Judgment': 'Onde du châtiment',
        'Frigid Stone': 'Rocher de glace',
        'Ice Floe': 'Flux glacé',
        'Ice Pillar': 'Pilier de glace',
        'Impact': 'Impact',
        'Initialize Recall': 'Remembrances',
        'Junction Shiva': 'Associer : Shiva',
        'Junction Titan': 'Associer : Titan',
        'Laser Eye': 'Faisceau maser',
        'Lionsblaze': 'Feu léonin',
        'Obliteration': 'Maleficium',
        'Palm Of Temperance': 'Paume de tempérance',
        'Pillar Pierce': 'Frappe puissante',
        'Plunging Ice': 'Chute de glace',
        'Pulse Of The Land': 'Vibration tellurique',
        'Rapturous Reach': 'Main voluptueuse',
        'Release': 'Relâcher',
        'Stock': 'Stocker',
        '(?<!Junction )Titan': 'Titan',
        'Under The Weight': 'Pression tellurique',
        'Weight Of The World': 'Poids du monde',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Beastly Sculpture': '創られた獅子',
        'Bomb Boulder': 'ボムボルダー',
        'Chiseled Sculpture': '創られた男',
        'Eden\'s Promise': 'プロミス・オブ・エデン',
        'Guardian Of Eden': 'ガーディアン・オブ・エデン',
        'Ice Pillar': '氷柱',
      },
      'replaceText': {
        'Blade Of Flame': '巨兵の光炎',
        'Cast': 'はなつ',
        'Classical Sculpture': '巨兵創出',
        'Diamond Dust': 'ダイアモンドダスト',
        'Earthen Fury': '大地の怒り',
        'Force Of The Land': '大地の轟き',
        'Formless Judgment': '天罰の波動',
        'Frigid Stone': 'アイスストーン',
        'Ice Floe': 'アイスフロー',
        'Ice Pillar': '氷柱',
        'Impact': '衝撃',
        'Initialize Recall': '記憶想起',
        'Junction Shiva': 'ジャンクション：シヴァ',
        'Junction Titan': 'ジャンクション：タイタン',
        'Laser Eye': 'メーザーアイ',
        'Lionsblaze': '獅子の業火',
        'Obliteration': 'マレフィキウム',
        'Palm Of Temperance': '拒絶の手',
        'Pillar Pierce': '激突',
        'Plunging Ice': '落氷衝撃',
        'Pulse Of The Land': '大地の響き',
        'Rapturous Reach': '悦楽の手',
        'Release': 'リリース',
        'Stock': 'ストック',
        '(?<!Junction )Titan': 'タイタン',
        'Under The Weight': '大地の重圧',
        'Weight Of The World': '大陸の重み',
      },
    },
  ],
};
