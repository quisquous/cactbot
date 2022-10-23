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
      netRegex: NetRegexes.startsUsing({
        id: ['6247', '62EA'],
        source: 'Barnabas',
        capture: false,
      }),
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
      run: (data, matches) => data.barnabasNegative = matches.id === '0122',
    },
    {
      id: 'Tower Of Babil Dynamic Scrapline',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: ['6246', '62F0'],
        source: 'Barnabas',
        capture: false,
      }),
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
          ja: 'ボスに近づく',
          cn: '靠近boss',
          ko: '보스 가까이 붙기',
        },
        far: {
          en: 'Away from boss',
          de: 'Weg am Boss',
          fr: 'Éloignez-vous du boss',
          ja: 'ボスから離れる',
          cn: '远离boss',
          ko: '보스에게서 멀어지기',
        },
      },
    },
    {
      // 6245 is negative, 62EE is positive.
      id: 'Tower Of Babil Dynamic Pound Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6245', '62EE'], source: 'Barnabas' }),
      run: (data, matches) => data.barnabasNegative = matches.id === '6245',
    },
    {
      id: 'Tower Of Babil Dynamic Pound',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        id: ['6245', '62EE'],
        source: 'Barnabas',
        capture: false,
      }),
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
          cn: '去中间，靠近AOE',
          ko: '장판 중앙부분 옆으로',
        },
        far: {
          en: 'Go sides away from Scrapline',
          de: 'Geh seidlich der Rollschlinge',
          fr: 'Allez sur les côtes, loin de la zone de frappe',
          cn: '去场边，远离AOE',
          ko: '장판과 멀리 떨어지기',
        },
      },
    },
    {
      id: 'Tower Of Babil Rolling Scrapline',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62EB', source: 'Barnabas', capture: false }),
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
      suppressSeconds: 10,
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Purple pad to shrink',
          de: 'Lilane Fläche zum schrumpfen',
          fr: 'Zone violette pour rétrécir',
          ja: '紫',
          cn: '踩紫色地板',
          ko: '보라색 바닥 밟고 작아지기',
        },
      },
    },
    {
      id: 'Tower Of Babil Downpour',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62F5', source: 'Lugae', capture: false }),
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Green pad for frog',
          de: 'Grüne Fläsche für Frosch',
          fr: 'Zone verte pour transormation en grenouille',
          ja: '緑',
          cn: '踩绿色地板',
          ko: '초록색 바닥 밟고 개구리 되기',
        },
      },
    },
    {
      id: 'Tower Of Babil Thermal Suppression',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62FA', source: 'Lugae', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Tower Of Babil Magitek Explosive',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62F8', source: 'Lugae', capture: false }),
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Avoid bomb lines',
          de: 'Weiche den Bombenlinien aus',
          fr: 'Évitez la ligne de bombes',
          cn: '躲开炸弹十字AOE',
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
      infoText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Go to safe quadrant',
          de: 'Geh in das sichere Feld',
          fr: 'Allez dans le quart safe',
          cn: '去安全角落',
          ko: '안전한 사분면으로',
        },
      },
    },
    {
      id: 'Tower Of Babil Mega Graviton',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6300', source: 'Anima', capture: false }),
      response: Responses.aoe(),
    },
    {
      // TODO: Math the Graviton locations so we can call a safe direction.
      id: 'Tower Of Babil Aetherial Pull',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6301', source: 'Mega-graviton' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Away from your tether add',
          de: 'Weg von dem mit dir verbundenem Add',
          fr: 'Éloignez-vous de votre add lié',
          cn: '远离连线黑洞',
          ko: '선이 연결된 곳과 멀리 떨어지기',
        },
      },
    },
    {
      id: 'Tower Of Babil Boundless Pain',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6303', source: 'Anima', capture: false }),
      alertText: (_data, _matches, outputs) => outputs.text!(),
      outputStrings: {
        text: {
          en: 'Get to a corner!',
          de: 'Geh in eine Ecke!',
          fr: 'Allez dans un coin !',
          cn: '快去角落!',
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
          fr: '5x zones au sol chainées sur vous !',
          cn: '5连追踪AOE点名!',
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
        '\\?': ' ?',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Anima': '阿尼玛',
        'Barnabas': '巴尔纳伯',
        'Iron Nail': '阿尼玛之爪',
        'Iron Womb': '铁腹',
        'Lugae': '卢格',
        'Magitek Chakram': '魔导轮',
        'Magitek Explosive': '魔导炸弹',
        'Magitek Servicing': '魔导整备库',
        'Martial Conditioning': '武术训练堂',
        'Mega-graviton': '百万重力',
        'Thunderball': '雷电球',
      },
      'replaceText': {
        'Aetherial Pull': '吸引',
        'Boundless Pain': '无际痛苦',
        'Charnel Claw': '阴森之爪',
        'Coffin Scratch': '棺椁抓击',
        'Downpour': '水刑',
        'Dynamic Pound': '超电磁地面重击',
        'Dynamic Scrapline': '超电磁回转碎颈臂',
        'Electromagnetic Release': '电磁放射',
        'Erupting Pain': '痛苦喷发',
        'Explosion': '爆炸',
        'Graviton Spark': '重力火花',
        'Ground and Pound': '地面重击',
        'Imperatum': '英白拉多',
        'Lunar Nail': '异形之楔',
        'Magitek Chakram': '魔导轮',
        'Magitek Explosive': '魔导炸弹',
        'Magitek Missile': '魔导飞弹',
        'Magitek Ray': '魔导激光',
        'Mega Graviton': '百万重力',
        'Mighty Blow': '激突',
        'Obliviating Claw': '忘却之爪',
        'Oblivion': '混沌次元',
        'Pater Patriae': '祖国之父',
        'Phantom Pain': '幻痛',
        'Rolling Scrapline': '回转碎颈臂',
        'Shock(?!ing)': '放电',
        'Shocking Force': '高压放电',
        'Surface Missile': '对地导弹',
        'Thermal Suppression': '火力压制',
        'Thundercall': '招雷',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Anima': '아니마',
        'Barnabas': '바르나바',
        'Iron Nail': '아니마의 발톱',
        'Iron Womb': '철의 태내',
        'Lugae': '루게이에',
        'Magitek Chakram': '마도 차크람',
        'Magitek Explosive': '마도 폭탄',
        'Magitek Servicing': '마도 정비고',
        'Martial Conditioning': '무술 훈련장',
        'Mega-graviton': '메가 그래비톤',
        'Thunderball': '번개 구체',
      },
      'replaceText': {
        'Aetherial Pull': '흡인',
        'Boundless Pain': '무한한 고통',
        'Charnel Claw': '무덤의 발톱',
        'Coffin Scratch': '관짝 할퀴기',
        'Downpour': '물고문',
        'Dynamic Pound': '초전자 그라운드 펀치',
        'Dynamic Scrapline': '초전자 롤링 래리어트',
        'Electromagnetic Release': '전자기 방사',
        'Erupting Pain': '고통의 불기둥',
        'Explosion': '폭발',
        'Graviton Spark': '그래비톤 스파크',
        'Ground and Pound': '그라운드 펀치',
        'Imperatum': '임페라토르',
        'Lunar Nail': '기괴한 말뚝',
        'Magitek Chakram': '마도 차크람',
        'Magitek Explosive': '마도 폭탄',
        'Magitek Missile': '마도 미사일',
        'Magitek Ray': '마도 레이저',
        'Mega Graviton': '메가 그래비톤',
        'Mighty Blow': '격돌',
        'Obliviating Claw': '망각의 발톱',
        'Oblivion': '혼돈의 차원',
        'Pater Patriae': '파테르 파트리아이',
        'Phantom Pain': '환상통',
        'Rolling Scrapline': '롤링 래리어트',
        'Shocking Force': '고전압 방전',
        'Surface Missile': '대지 미사일',
        'Thermal Suppression': '화력 제압',
        'Thundercall': '초뢰',
        'Shock(?!ing)': '방전',
      },
    },
  ],
};

export default triggerSet;
