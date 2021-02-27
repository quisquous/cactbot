import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import Outputs from '../../../../../resources/outputs.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// EDEN'S PROMISE: ETERNITY
// E12 NORMAL

// TODO: Handle the EarthShaker bait --> beam intercept mechanic during the intermission.
// TODO: Math the spawn position of the Titanic Bomb Boulders to call the safe direction like E4s.

// Each tether ID corresponds to a primal:
// 008E -- Leviathan
// 008F -- Ifrit
// 0090 -- Ramuh
// 0091 -- Garuda
// We can collect + store these for later use on Stock/Release.

const tetherIds = ['008E', '008F', '0090', '0091'];

// Keys here indicate SAFE directions!
const bombOutputStrings = {
  'north': {
    en: 'Between north bombs',
    de: 'Zwichen den Bomben im Norden',
    fr: 'Entre les bombes au Nord',
    ja: '北の岩へ',
    cn: '去北边岩石中间',
    ko: '북쪽 폭탄 사이',
  },
  'south': {
    en: 'Between south bombs',
    de: 'Zwichen den Bomben im Süden',
    fr: 'Entre les bombes au Sud',
    ja: '南の岩へ',
    cn: '去南边岩石中间',
    ko: '남쪽 폭탄 사이',
  },
  'east': {
    en: 'Between east bombs',
    de: 'Zwichen den Bomben im Osten',
    fr: 'Entre les bombes à l\'Est',
    ja: '東の岩へ',
    cn: '去东边岩石中间',
    ko: '동쪽 폭탄 사이',
  },
  'west': {
    en: 'Between west bombs',
    de: 'Zwichen den Bomben im Westen',
    fr: 'Entre les bombes à l\'Ouest',
    ja: '西の岩へ',
    cn: '去西边岩石中间',
    ko: '서쪽 폭탄 사이',
  },
};

const primalOutputStrings = {
  'combined': {
    en: '${safespot1} + ${safespot2}',
    de: '${safespot1} + ${safespot2}',
    fr: '${safespot1} + ${safespot2}',
    ja: '${safespot1} + ${safespot2}',
    cn: '${safespot1} + ${safespot2}',
    ko: '${safespot1} + ${safespot2}',
  },
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
  '008E008F': {
    en: 'Under + Sides',
    de: 'Unter Ihm + Seiten',
    fr: 'En dessous + Côtés',
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
    de: 'Unter Ihm + Interkardinale Himmelsrichtungen',
    fr: 'En dessous + Intercardinal',
    ja: '真ん中 + 斜め',
    cn: '正中间四角',
    ko: '보스 아래 + 대각',
  },
};


export default {
  zoneId: ZoneId.EdensPromiseEternity,
  timelineFile: 'e12n.txt',
  triggers: [
    {
      id: 'E12N Intermission Completion',
      netRegex: NetRegexes.ability({ id: '4B48', source: 'Eden\'s Promise', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '4B48', source: 'Edens Verheißung', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '4B48', source: 'Promesse D\'Éden', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '4B48', source: 'プロミス・オブ・エデン', capture: false }),
      run: (data) => data.seenIntermission = true,
    },
    {
      id: 'E12N Maleficium',
      netRegex: NetRegexes.startsUsing({ id: '5872', source: 'Eden\'s Promise', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5872', source: 'Edens Verheißung', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5872', source: 'Promesse D\'Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5872', source: 'プロミス・オブ・エデン', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12N Formless Judgment',
      netRegex: NetRegexes.startsUsing({ id: '5873', source: 'Eden\'s Promise' }),
      netRegexDe: NetRegexes.startsUsing({ id: '5873', source: 'Edens Verheißung' }),
      netRegexFr: NetRegexes.startsUsing({ id: '5873', source: 'Promesse D\'Éden' }),
      netRegexJa: NetRegexes.startsUsing({ id: '5873', source: 'プロミス・オブ・エデン' }),
      response: Responses.tankCleave(),
    },
    {
      // Titanic Bombs spawn at two of four points:
      // SW X: -11.31371 Y: -63.68629
      // NW X: -11.31371 Y: -86.3137
      // SE X: 11.31371 Y: -63.68629
      // NE X: 11.31371 Y: -86.3137
      id: 'E12N Bomb Collect',
      netRegex: NetRegexes.addedCombatantFull({ npcNameId: '9816' }),
      run: (data, matches) => {
        const bomb = {};
        bomb.north = parseFloat(matches.y) + 70 < 0;
        bomb.east = parseFloat(matches.x) > 0;
        data.bombs = data.bombs || [];
        data.bombs.push(bomb);
      },
    },
    {
      id: 'E12N Boulders Impact',
      netRegex: NetRegexes.ability({ id: '586E', source: 'Titanic Bomb Boulder', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '586E', source: 'Mega-Bomber-Brocken', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '586E', source: 'Méga Bombo Rocher', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '586E', source: 'メガ・ボムボルダー', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => {
        // Whichever direction has two  Titanic Bombs, the safe spot is opposite.
        let safe;
        if (data.bombs[0].north === data.bombs[1].north)
          safe = data.bombs[0].north ? 'south' : 'north';
        else
          safe = data.bombs[0].east ? 'west' : 'east';
        return output[safe]();
      },
      outputStrings: bombOutputStrings,
      run: (data) => delete data.bombs,
    },
    {
      id: 'E12N Boulders Explosion',
      netRegex: NetRegexes.ability({ id: '586F', source: 'Titanic Bomb Boulder', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '586F', source: 'Mega-Bomber-Brocken', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '586F', source: 'Méga Bombo Rocher', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '586F', source: 'メガ・ボムボルダー', capture: false }),
      suppressSeconds: 5,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move to last explosions',
          de: 'Zur letzten Explosion bewegen',
          fr: 'Allez sur la dernière explosion',
          ja: '最後に爆発した岩へ',
          cn: '去最后爆炸的岩石旁',
          ko: '마지막 폭발 위치로',
        },
      },
    },
    {
      id: 'E12N Rapturous Reach Double',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data) => !data.seenIntermission,
      preRun: (data, matches) => {
        data.stacks = data.stacks || [];
        data.stacks.push(matches.target);
      },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.stackOnYou();
      },
      infoText: (data, _, output) => {
        if (data.stacks.length === 1)
          return;
        const names = data.stacks.map((x) => data.ShortName(x)).sort();
        return output.stacks({ players: names.join(', ') });
      },
      outputStrings: {
        stacks: {
          en: 'Stack (${players})',
          de: 'Sammeln (${players})',
          fr: 'Package (${players})',
          ja: '頭割り (${players})',
          cn: '分摊 (${players})',
          ko: '모이기 (${players})',
        },
        stackOnYou: Outputs.stackOnYou,
      },
    },
    {
      id: 'E12N Rapturous Reach Cleanup',
      netRegex: NetRegexes.headMarker({ id: '003E', capture: false }),
      delaySeconds: 10,
      run: (data) => delete data.stacks,
    },
    {
      id: 'E12N Rapturous Reach Single',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      condition: (data) => data.seenIntermission,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E12N Diamond Dust Mitigate',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5864', source: 'Edens Verheißung', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5864', source: 'Promesse D\'Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5864', source: 'プロミス・オブ・エデン', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E12N Diamond Dust Stop',
      netRegex: NetRegexes.startsUsing({ id: '5864', source: 'Eden\'s Promise', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5864', source: 'Edens Verheißung', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5864', source: 'Promesse D\'Éden', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5864', source: 'プロミス・オブ・エデン', capture: false }),
      delaySeconds: 1, // Avoiding collision with the spread call
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'E12N Frigid Stone',
      netRegex: NetRegexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'E12N Tether Collect',
      netRegex: NetRegexes.tether({ id: tetherIds }),
      run: (data, matches) => {
        data.tethers = data.tethers || [];
        data.tethers.push(matches.id);
      },
    },
    {
      id: 'E12N Cast Release',
      netRegex: NetRegexes.startsUsing({ id: ['4E2C', '585B', '5861'], capture: false }),
      preRun: (data) => data.tethers = data.tethers.sort(),
      delaySeconds: 0.5, // Tethers should be first in the log, but let's be SURE
      alertText: (data, _, output) => {
        if (data.tethers.length !== 2)
          return;
        // Leviathan's mechanics aren't easily described in a single word,
        // so we special-case them.
        const comboStr = data.tethers[0] + data.tethers[1];
        if (comboStr in primalOutputStrings)
          return output[comboStr]();
        return output.combined({
          safespot1: output[data.tethers[0]](),
          safespot2: output[data.tethers[1]](),
        });
      },
      infoText: (data, _, output) => {
        if (data.tethers.length === 2)
          return;
        return output[data.tethers[0]]();
      },
      outputStrings: primalOutputStrings,
    },
    {
      id: 'E12N Tether Cleanup',
      netRegex: NetRegexes.startsUsing({ id: ['4E2C', '585B', '5861'], capture: false }),
      delaySeconds: 5,
      run: (data) => delete data.tethers,
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '(?<!Titanic )Bomb Boulder': 'Bomber-Brocken',
        'Chiseled Sculpture': 'Abbild eines Mannes',
        'Eden\'s Promise': 'Edens Verheißung',
        'Titanic Bomb Boulder': 'Mega-Bomber-Brocken',
      },
      'replaceText': {
        'Cast': 'Auswerfen',
        'Classical Sculpture': 'Klassische Skulptur',
        'Conflag Strike': 'Feuersbrunst',
        'Diamond Dust': 'Diamantenstaub',
        'Earth Shaker': 'Erdstoß',
        'Earthen Fury': 'Gaias Zorn',
        'Eternal Oblivion': 'Ewiges Vergessen',
        'Explosion': 'Explosion',
        'Ferostorm': 'Angststurm',
        'Formless Judgment': 'Formloses Urteil',
        'Frigid Stone': 'Eisstein',
        'Ice Floe': 'Eisfluss',
        'Impact': 'Impakt',
        'Initialize Recall': 'Rückholung initialisieren',
        'Judgment Jolt': 'Blitz des Urteils',
        'Junction Shiva': 'Verbindung: Shiva',
        'Junction Titan': 'Verbindung: Titan',
        'Laser Eye': 'Laserauge',
        'Maleficium': 'Maleficium',
        'Obliteration': 'Auslöschung',
        'Palm Of Temperance': 'Hand der Mäßigung',
        'Paradise Lost': 'Verlorenes Paradies',
        'Rapturous Reach': 'Stürmischer Griff',
        'Release': 'Freilassen',
        'Stock': 'Sammeln',
        'Temporary Current': 'Unstete Gezeiten',
        'Under The Weight': 'Wucht der Erde',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<!Titanic )Bomb Boulder': 'bombo rocher',
        'Chiseled Sculpture': 'création masculine',
        'Eden\'s Promise': 'Promesse d\'Éden',
        'Titanic Bomb Boulder': 'méga bombo rocher',
      },
      'replaceText': {
        '\\?': ' ?',
        'Cast': 'Lancer',
        'Classical Sculpture': 'Serviteur colossal',
        'Conflag Strike': 'Ekpurosis',
        'Diamond Dust': 'Poussière de diamant',
        'Earth Shaker': 'Secousse',
        'Earthen Fury': 'Fureur tellurique',
        'Eternal Oblivion': 'Oubli éternel',
        'Explosion': 'Explosion',
        'Ferostorm': 'Tempête déchaînée',
        'Formless Judgment': 'Onde du châtiment',
        'Frigid Stone': 'Rocher de glace',
        'Ice Floe': 'Flux glacé',
        'Impact': 'Impact',
        'Initialize Recall': 'Remembrances',
        'Judgment Jolt': 'Front orageux du jugement',
        'Junction Shiva': 'Associer : Shiva',
        'Junction Titan': 'Associer : Titan',
        'Laser Eye': 'Faisceau maser',
        'Maleficium': 'Maleficium',
        'Obliteration': 'Oblitération',
        'Palm Of Temperance': 'Paume de tempérance',
        'Paradise Lost': 'Paradis perdu',
        'Rapturous Reach': 'Main voluptueuse',
        'Release': 'Relâcher',
        'Stock': 'Stocker',
        'Temporary Current': 'Courant évanescent',
        'Under The Weight': 'Pression tellurique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '(?<!Titanic )Bomb Boulder': 'ボムボルダー',
        'Chiseled Sculpture': '創られた男',
        'Eden\'s Promise': 'プロミス・オブ・エデン',
        'Titanic Bomb Boulder': 'メガ・ボムボルダー',
      },
      'replaceText': {
        'Cast': 'はなつ',
        'Classical Sculpture': '巨兵創出',
        'Conflag Strike': 'コンフラグレーションストライク',
        'Diamond Dust': 'ダイアモンドダスト',
        'Earth Shaker': 'アースシェイカー',
        'Earthen Fury': '大地の怒り',
        'Eternal Oblivion': '永遠の忘却',
        'Explosion': '爆発',
        'Ferostorm': 'フィアスストーム',
        'Formless Judgment': '天罰の波動',
        'Frigid Stone': 'アイスストーン',
        'Ice Floe': 'アイスフロー',
        'Impact': 'インパクト',
        'Initialize Recall': '記憶想起',
        'Judgment Jolt': '裁きの界雷',
        'Junction Shiva': 'ジャンクション：シヴァ',
        'Junction Titan': 'ジャンクション：タイタン',
        'Laser Eye': 'メーザーアイ',
        'Maleficium': 'マレフィキウム',
        'Obliteration': 'オブリタレーション',
        'Palm Of Temperance': '拒絶の手',
        'Paradise Lost': 'パラダイスロスト',
        'Rapturous Reach': '悦楽の手',
        'Release': 'リリース',
        'Stock': 'ストック',
        'Temporary Current': 'テンポラリーカレント',
        'Under The Weight': '大地の重圧',
      },
    },
  ],
};
