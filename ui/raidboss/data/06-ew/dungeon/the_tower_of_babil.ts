import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  barnabasNegative?: boolean;
  playerNegative?: boolean;
}

// TODO: Figure out a clean way to call the Charnel Claw dashes?
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheTowerOfBabil,
  timelineFile: 'the_tower_of_babil.txt',
  triggers: [
    {
      id: 'Tower Of Babil Ground And Pound',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6247', '62EA'], source: 'Barnabas', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6247', '62EA'], source: 'Barnabas', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6247', '62EA'], source: 'Barnabas', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6247', '62EA'], source: 'バルナバ', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // 00A3 is negative, 00A2 is positive
      // Used for both Dynamic Scrapline and Dynamic Pound
      // Because of this, we have to collect the player every time,
      // rather than using the player head marker as a trigger log line.
      id: 'Tower Of Babil Dynamic Player Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['00A2', '00A3'] }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => data.playerNegative = matches.id === '00A3',
    },
    {
      // 0122 is negative, 0123 is positive.
      id: 'Tower Of Babil Dynamic Scrapline Barnabas Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['0122', '0123'], target: 'Barnabas' }),
      netRegexDe: NetRegexes.headMarker({ id: ['0122', '0123'], target: 'Barnabas' }),
      netRegexFr: NetRegexes.headMarker({ id: ['0122', '0123'], target: 'Barnabas' }),
      netRegexJa: NetRegexes.headMarker({ id: ['0122', '0123'], target: 'バルナバ' }),
      run: (data, matches) => data.barnabasNegative = matches.id === '0122',
    },
    {
      id: 'Tower Of Babil Dynamic Scrapline',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6246', '62F0'], source: 'Barnabas', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6246', '62F0'], source: 'Barnabas', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6246', '62F0'], source: 'Barnabas', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6246', '62F0'], source: 'バルナバ', capture: false }),
      delaySeconds: 0.5, // Ensure we have markers stored.
      infoText: (data, _matches, output) => {
        if ([data.barnabasNegative, data.playerNegative].includes(undefined))
          return; // Somehow we don't have data? Don't risk calling it wrongly.
        if (data.playerNegative === data.barnabasNegative)
          return output.close!();
        return output.far!();
      },
      run: (data) => {
        data.barnabasNegative = undefined;
        data.playerNegative = undefined;
      },
      outputStrings: {
        close: {
          en: 'Close to boss',
          de: 'Nahe am Boss',
          fr: 'Allez près du boss',
          ko: '보스 가까이 붙기',
        },
        far: {
          en: 'Away from boss',
          de: 'Weg am Boss',
          fr: 'Éloignez-vous du boss',
          ko: '보스에게서 멀어지기',
        },
      },
    },
    {
      // 6245 is negative, 62EE is positive.
      id: 'Tower Of Babil Dynamic Pound Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'Barnabas' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'Barnabas' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'Barnabas' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'バルナバ' }),
      run: (data, matches) => data.barnabasNegative = matches.id === '6245',
    },
    {
      id: 'Tower Of Babil Dynamic Pound',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'Barnabas', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'Barnabas', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'Barnabas', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'バルナバ', capture: false }),
      delaySeconds: 0.5, // Ensure we have markers stored.
      infoText: (data, _matches, output) => {
        if ([data.barnabasNegative, data.playerNegative].includes(undefined))
          return; // Somehow we don't have data? Don't risk calling it wrongly.
        if (data.playerNegative === data.barnabasNegative)
          return output.close!();
        return output.far!();
      },
      run: (data) => {
        data.barnabasNegative = undefined;
        data.playerNegative = undefined;
      },
      outputStrings: {
        close: {
          en: 'Go center next to Scrapline',
          de: 'Geh zur mitte, nahe der Rollschlinge',
          fr: 'Allez au centre, près de la zone de frappe',
          ko: '장판 중앙부분 옆으로',
        },
        far: {
          en: 'Go sides away from Scrapline',
          de: 'Geh seidlich der Rollschlinge',
          fr: 'Allez sur les côtes, loin de la zone de frappe',
          ko: '장판과 멀리 떨어지기',
        },
      },
    },
    {
      id: 'Tower Of Babil Rolling Scrapline',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62EB', source: 'Barnabas', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62EB', source: 'Barnabas', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62EB', source: 'Barnabas', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62EB', source: 'バルナバ', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Tower Of Babil Shocking Force',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Tower Of Babil Magitek Chakram',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62F3', source: 'Lugae', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '62F3', source: 'Lugae', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '62F3', source: 'Lugae', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '62F3', source: 'ルゲイエ', capture: false }),
      suppressSeconds: 10,
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Purple pad to shrink',
          de: 'Lilane Fläche zum schrumpfen',
          fr: 'Zone violette pour rétrécir',
          ko: '보라색 바닥 밟고 작아지기',
        },
      },
    },
    {
      id: 'Tower Of Babil Downpour',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62F5', source: 'Lugae', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '62F5', source: 'Lugae', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '62F5', source: 'Lugae', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '62F5', source: 'ルゲイエ', capture: false }),
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Green pad for frog',
          de: 'Grüne Fläsche für Frosch',
          fr: 'Zone verte pour transormation en grenouille',
          ko: '초록색 바닥 밟고 개구리 되기',
        },
      },
    },
    {
      id: 'Tower Of Babil Thermal Suppression',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62FA', source: 'Lugae', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '62FA', source: 'Lugae', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '62FA', source: 'Lugae', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '62FA', source: 'ルゲイエ', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Tower Of Babil Magitek Explosive',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62F8', source: 'Lugae', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '62F8', source: 'Lugae', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '62F8', source: 'Lugae', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '62F8', source: 'ルゲイエ', capture: false }),
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Avoid bomb lines',
          de: 'Weiche den Bombenlinien aus',
          fr: 'Évitez la ligne de bombes',
          ko: '폭탄의 직선범위 피하기',
        },
      },
    },
    {
      // TODO: Math the positions of the corner nails and give an exact call.
      // Locations are (-19.50, -160), (-19.50, -199), (19.50, -160), (19.50, -199)
      id: 'Tower Of Babil Lunar Nail Warning',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62FE', source: 'Anima', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '62FE', source: 'Anima', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '62FE', source: 'Anima', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '62FE', source: 'アニマ', capture: false }),
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Go to safe quadrant',
          de: 'Geh in das sichere Feld',
          fr: 'Allez dans le quart safe',
          ko: '안전한 사분면으로',
        },
      },
    },
    {
      id: 'Tower Of Babil Mega Graviton',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6300', source: 'Anima', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6300', source: 'Anima', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6300', source: 'Anima', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6300', source: 'アニマ', capture: false }),
      response: Responses.aoe(),
    },
    {
      // TODO: Math the Graviton locations so we can call a safe direction.
      id: 'Tower Of Babil Aetherial Pull',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6301', source: 'Mega-graviton' }),
      netRegexDe: NetRegexes.startsUsing({ id: '6301', source: 'Mega-Graviton' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6301', source: 'Méga Graviton' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6301', source: 'メガグラビトン' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Away from your tether add',
          de: 'Weg von dem mit dir verbundenem Add',
          fr: 'Éloignez-vous de votre add lié',
          ko: '선이 연결된 곳과 멀리 떨어지기',
        },
      },
    },
    {
      id: 'Tower Of Babil Boundless Pain',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6303', source: 'Anima', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6303', source: 'Anima', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6303', source: 'Anima', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6303', source: 'アニマ', capture: false }),
      alertText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Get to a corner!',
          de: 'Geh in eine Ecke!',
          fr: 'Allez dans un coin !',
          ko: '구석으로!',
        },
      },
    },
    {
      id: 'Tower Of Babil Coffin Scratch',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '00C5' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: '5x chasing puddles on you!',
          de: '5x verfolgende Flächen auf dir!',
          fr: '5x zones au sol chainées sur vous !'
          ko: '따라오는 5연속 장판 피하기!',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Anima': 'Anima',
        'Barnabas': 'Barnabas',
        'Iron Nail': 'Animas Bosheit',
        'Iron Womb': 'Eiserner Wanst',
        'Lugae': 'Lugae',
        'Magitek Chakram': 'Magitek-Chakram',
        'Magitek Explosive': 'Magiebombe',
        'Magitek Servicing': 'Magitek-Wartungsdepot',
        'Martial Conditioning': 'Kampfhalle',
        'Mega-graviton': 'Mega-Graviton',
        'Thunderball': 'Donnerkugel',
      },
      'replaceText': {
        'Aetherial Pull': 'Seidige Finger',
        'Boundless Pain': 'Grenzenloser Schmerz',
        'Charnel Claw': 'Laserklaue',
        'Coffin Scratch': 'Flüchtiges Scharren',
        'Downpour': 'Flutschwall',
        'Dynamic Pound': 'Elektromagnetische Erderschütterung',
        'Dynamic Scrapline': 'Elektromagnetische Rollschlinge',
        'Electromagnetic Release': 'Elektromagnetische Entladung',
        'Erupting Pain': 'Schmerzeruption',
        'Explosion': 'Explosion',
        'Graviton Spark': 'Gravitonfunke',
        'Ground and Pound': 'Erderschütterung',
        'Imperatum': 'Imperator',
        'Lunar Nail': 'Dunkle Fessel',
        'Magitek Chakram': 'Magitek-Chakram',
        'Magitek Explosive': 'Magiebombe',
        'Magitek Missile': 'Magitek-Rakete',
        'Magitek Ray': 'Magitek-Laser',
        'Mega Graviton': 'Mega-Graviton',
        'Mighty Blow': 'Säulendurchschlag',
        'Obliviating Claw': 'Klaue des Vergessens',
        'Oblivion': 'Chaosdimension',
        'Pater Patriae': 'Pater patriae',
        'Phantom Pain': 'Phantomschmerz',
        'Rolling Scrapline': 'Rollschlinge',
        'Shock(?!ing)': 'Entladung',
        'Shocking Force': 'Starkstromentladung',
        'Surface Missile': 'Raketenschlag',
        'Thermal Suppression': 'Massiver Beschuss',
        'Thundercall': 'Donnerruf',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Anima': 'Anima',
        'Barnabas': 'Barnabas',
        'Iron Nail': 'griffe d\'Anima',
        'Iron Womb': 'Cœur de Fer',
        'Lugae': 'Lugae',
        'Magitek Chakram': 'Chakram magitek',
        'Magitek Explosive': 'Bombe magitek',
        'Magitek Servicing': 'Entrepôt de maintenance magitek',
        'Martial Conditioning': 'Hall d\'entraînement',
        'Mega-graviton': 'méga graviton',
        'Thunderball': 'sphère de foudre',
      },
      'replaceText': {
        'Aetherial Pull': 'Aspiration',
        'Boundless Pain': 'Lamento',
        'Charnel Claw': 'Griffes nécrosantes',
        'Coffin Scratch': 'Griffes sépulcrales',
        'Downpour': 'Déluge',
        'Dynamic Pound': 'Frappe terrestre électromagnétique',
        'Dynamic Scrapline': 'Lariat tournoyant électromagnétique',
        'Electromagnetic Release': 'Décharge électromagnétique',
        'Erupting Pain': 'Éruption torturante',
        'Explosion': 'Explosion',
        'Graviton Spark': 'Étincelle graviton',
        'Ground and Pound': 'Frappe terrestre',
        'Imperatum': 'Imperator',
        'Lunar Nail': 'Pals grotesques',
        'Magitek Chakram': 'Chakram magitek',
        'Magitek Explosive': 'Bombe magitek',
        'Magitek Missile': 'Missiles magitek',
        'Magitek Ray': 'Rayon magitek',
        'Mega Graviton': 'Méga graviton',
        'Mighty Blow': 'Empalement',
        'Obliviating Claw': 'Griffes du néant',
        'Oblivion': 'Ruée chaotique',
        'Pater Patriae': 'Pater Patriae',
        'Phantom Pain': 'Supplice fantôme',
        'Rolling Scrapline': 'Lariat tournoyant',
        'Shock(?!ing)': 'Décharge électrostatique',
        'Shocking Force': 'Décharge à haute tension',
        'Surface Missile': 'Missiles sol-sol',
        'Thermal Suppression': 'Surcharge incendiaire',
        'Thundercall': 'Drain fulminant',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Anima': 'アニマ',
        'Barnabas': 'バルナバ',
        'Iron Nail': 'アニマの爪',
        'Iron Womb': '鉄の肚',
        'Lugae': 'ルゲイエ',
        'Magitek Chakram': '魔導チャクラム',
        'Magitek Explosive': '魔導爆弾',
        'Magitek Servicing': '魔導整備庫',
        'Martial Conditioning': '武術訓練ホール',
        'Mega-graviton': 'メガグラビトン',
        'Thunderball': 'サンダースフィア',
      },
      'replaceText': {
        'Aetherial Pull': '吸引',
        'Boundless Pain': 'バウンドレスペイン',
        'Charnel Claw': 'チャーネルクロウ',
        'Coffin Scratch': 'コフィンスクラッチ',
        'Downpour': '水責め',
        'Dynamic Pound': '超電磁グラウンドパンチ',
        'Dynamic Scrapline': '超電磁ローリングラリアット',
        'Electromagnetic Release': '電磁放射',
        'Erupting Pain': 'ペインエラプション',
        'Explosion': '爆発',
        'Graviton Spark': 'グラビトンスパーク',
        'Ground and Pound': 'グラウンドパンチ',
        'Imperatum': 'インペラトル',
        'Lunar Nail': '異形の楔',
        'Magitek Chakram': '魔導チャクラム',
        'Magitek Explosive': '魔導爆弾',
        'Magitek Missile': '魔導ミサイル',
        'Magitek Ray': '魔導レーザー',
        'Mega Graviton': 'メガグラビトン',
        'Mighty Blow': '激突',
        'Obliviating Claw': 'オブリビオンクロウ',
        'Oblivion': 'カオティック・ディメンション',
        'Pater Patriae': 'パテル・パトリアエ',
        'Phantom Pain': 'ファントムペイン',
        'Rolling Scrapline': 'ローリングラリアット',
        'Shock(?!ing)': '放電',
        'Shocking Force': '高電圧放電',
        'Surface Missile': '対地ミサイル',
        'Thermal Suppression': '火力制圧',
        'Thundercall': '招雷',
      },
    },
  ],
};

export default triggerSet;
