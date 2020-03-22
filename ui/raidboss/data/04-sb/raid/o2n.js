'use strict';

// O2N - Deltascape 2.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V2\.0\)$/,
  },
  timelineFile: 'o2n.txt',
  timelineTriggers: [
    {
      // Unfortunately we can't separate out the main tank without additional
      id: 'O2N Paranormal Wave',
      regex: /Paranormal Wave/,
      beforeSeconds: 5,
      infoText: function(data) {
        if (data.activeTank == data.me) {
          return {
            en: 'Tank cleave on YOU',
          };
        }
        return {
          en: 'Avoid tank cleave',
        };
      },
    },
  ],
  triggers: [
    {
      // Used for avoiding Paranormal Wave.
      id: 'O2N Tank Tracking',
      regex: Regexes.ability({ id: '24E8', source: 'Catastrophe' }),
      regexDe: Regexes.ability({ id: '24E8', source: 'Katastroph' }),
      regexFr: Regexes.ability({ id: '24E8', source: 'Catastrophe' }),
      regexJa: Regexes.ability({ id: '24E8', source: 'カタストロフィー' }),
      regexCn: Regexes.ability({ id: '24E8', source: '灾变者' }),
      regexKo: Regexes.ability({ id: '24E8', source: '카타스트로피' }),
      run: function(data, matches) {
        data.activeTank = matches.target;
      },
    },
    {
      id: 'O2N Levitation Gain',
      regex: Regexes.gainsEffect({ effect: 'Levitation' }),
      regexDe: Regexes.gainsEffect({ effect: 'Levitation' }),
      regexFr: Regexes.gainsEffect({ effect: 'Lévitation' }),
      regexJa: Regexes.gainsEffect({ effect: 'レビテト' }),
      regexCn: Regexes.gainsEffect({ effect: '浮空' }),
      regexKo: Regexes.gainsEffect({ effect: '레비테트' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.levitating = true;
      },
    },
    {
      id: 'O2N Levitation Lose',
      regex: Regexes.losesEffect({ effect: 'Levitation' }),
      regexDe: Regexes.losesEffect({ effect: 'Levitation' }),
      regexFr: Regexes.losesEffect({ effect: 'Lévitation' }),
      regexJa: Regexes.losesEffect({ effect: 'レビテト' }),
      regexCn: Regexes.losesEffect({ effect: '浮空' }),
      regexKo: Regexes.losesEffect({ effect: '레비테트' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.levitating = false;
      },
    },
    {
      id: 'O2N Evilsphere',
      regex: Regexes.startsUsing({ id: '250F', source: 'Catastrophe' }),
      regexDe: Regexes.startsUsing({ id: '250F', source: 'Katastroph' }),
      regexFr: Regexes.startsUsing({ id: '250F', source: 'Catastrophe' }),
      regexJa: Regexes.startsUsing({ id: '250F', source: 'カタストロフィー' }),
      regexCn: Regexes.startsUsing({ id: '250F', source: '灾变者' }),
      regexKo: Regexes.startsUsing({ id: '250F', source: '카타스트로피' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'O2N -100Gs',
      regex: Regexes.startsUsing({ id: '24FF', source: 'Catastrophe', capture: false }),
      regexDe: Regexes.startsUsing({ id: '24FF', source: 'Katastroph', capture: false }),
      regexFr: Regexes.startsUsing({ id: '24FF', source: 'Catastrophe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '24FF', source: 'カタストロフィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '24FF', source: '灾变者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '24FF', source: '카타스트로피', capture: false }),
      infoText: {
        en: '-100 Gs: Go north/south',
        de: '-100G: Nach Norden/Süden',
      },
      tts: {
        en: '100 gs',
        de: '-100 G',
      },
    },
    {
      id: 'O2N Demon Eye',
      regex: Regexes.startsUsing({ id: '250D', source: 'Catastrophe', capture: false }),
      regexDe: Regexes.startsUsing({ id: '250D', source: 'Katastroph', capture: false }),
      regexFr: Regexes.startsUsing({ id: '250D', source: 'Catastrophe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '250D', source: 'カタストロフィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '250D', source: '灾变者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '250D', source: '카타스트로피', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'O2N Earthquake',
      regex: Regexes.startsUsing({ id: '2512', source: 'Catastrophe', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2512', source: 'Katastroph', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2512', source: 'Catastrophe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2512', source: 'カタストロフィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2512', source: '灾变者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2512', source: '카타스트로피', capture: false }),
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: 'Earthquake: Levitate',
            de: 'Erdbeben: Schweben',
          };
        }
      },
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: 'Earthquake',
            de: 'Erdbeben',
          };
        }
      },
      tts: function(data) {
        if (!data.levitating) {
          return {
            en: 'levitate',
            de: 'schweben',
          };
        }
      },
    },
    {
      id: 'O2N Gravitational Wave',
      regex: Regexes.startsUsing({ id: '2510', source: 'Catastrophe', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2510', source: 'Katastroph', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2510', source: 'Catastrophe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2510', source: 'カタストロフィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2510', source: '灾变者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2510', source: '카타스트로피', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'O2N Six Fulms Under',
      regex: Regexes.gainsEffect({ effect: 'Six Fulms Under' }),
      regexDe: Regexes.gainsEffect({ effect: 'Versinkend' }),
      regexFr: Regexes.gainsEffect({ effect: 'Enfoncement' }),
      regexJa: Regexes.gainsEffect({ effect: '沈下' }),
      regexCn: Regexes.gainsEffect({ effect: '下陷' }),
      regexKo: Regexes.gainsEffect({ effect: '침하' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 5,
      suppressSeconds: 10,
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: '6 Fulms Under: Levitate',
            de: 'Versinkend: Schweben',
          };
        }
      },
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: '6 Fulms Under',
            de: 'Versinkend',
          };
        }
      },
      tts: {
        en: 'float',
        de: 'schweben',
      },
    },
    {
      id: 'O2N Petrosphere Handling',
      regex: Regexes.startsUsing({ id: '2502', source: 'Catastrophe', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2502', source: 'Katastroph', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2502', source: 'Catastrophe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2502', source: 'カタストロフィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2502', source: '灾变者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2502', source: '카타스트로피', capture: false }),
      displaySeconds: 8,
      preRun: function(data) {
        data.antiCounter = data.antiCounter || 0;
      },
      infoText: function(data) {
        // The first Antilight is always blue.
        if (data.antiCounter == 0) {
          return {
            en: 'Levitate',
          };
        }
        // It's always safe not to levitate after the first Antilight.
        // The second, fifth, eighth, etc Antilights require moving to the center as well.
        if (data.antiCounter % 3 == 1) {
          return {
            en: 'Don\'t levitate--Go center',
          };
        }
        return {
          en: 'Don\'t levitate',
        };
      },
      run: function(data) {
        data.antiCounter += 1;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Catastrophe': 'Katastroph',
        'Fleshy Member': 'Tentakel',
      },
      'replaceText': {
        '-100 Gs': 'Minus 100 G',
        '(?<!-)100 Gs': '100 G',
        'Antilight': 'Dunkellicht',
        'Earthquake': 'Erdbeben',
        'Epicenter': 'Epizentrum',
        'Erosion': 'Erosion',
        'Evilsphere': 'Sphäre des Bösen',
        'Explosion': 'Explosion',
        'Gravitational Distortion': 'Massenverzerrung',
        'Gravitational Explosion': 'Gravitationsknall',
        'Gravitational Manipulation': 'Schwerkraftmanipulation',
        'Gravitational Wave': 'Gravitationswelle',
        'Main Quake': 'Hauptbeben',
        'Maniacal Probe': 'Tentakeltanz',
        'Paranormal Wave': 'Paranormale Welle',
        'Tremblor': 'Erschütterung',
      },
      '~effectNames': {
        '6 Fulms Under': 'Versinkend',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Catastrophe': 'Catastrophe',
        'Fleshy Member': 'tentacule',
      },
      'replaceText': {
        '-100 Gs': 'Gravité -100',
        '(?<!-)100 Gs': 'Gravité 100',
        'Antilight': 'Lumière obscure',
        'Earthquake': 'Grand séisme',
        'Epicenter': 'Épicentre',
        'Erosion': 'Érosion',
        'Evilsphere': 'Sphère démoniaque',
        'Explosion': 'Explosion',
        'Gravitational Distortion': 'Distorsion gravitationnelle',
        'Gravitational Explosion': 'Explosion gravitationnelle',
        'Gravitational Manipulation': 'Manipulation gravitationnelle',
        'Gravitational Wave': 'Onde gravitationnelle',
        'Main Quake': 'Secousse principale',
        'Maniacal Probe': 'Farandole de tentacules',
        'Paranormal Wave': 'Onde maudite',
        'Tremblor': 'Tremblement de terre',
      },
      '~effectNames': {
        '6 Fulms Under': 'Enfoncement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Catastrophe': 'カタストロフィー',
        'Fleshy Member': '触手',
      },
      'replaceText': {
        '-100 Gs': '重力マイナス100',
        '(?<!-)100 Gs': '重力100',
        'Antilight': '暗黒光',
        'Earthquake': '大地震',
        'Epicenter': '震源生成',
        'Erosion': '浸食',
        'Evilsphere': 'イビルスフィア',
        'Explosion': '爆散',
        'Gravitational Distortion': '重力歪曲',
        'Gravitational Explosion': '重力爆発',
        'Gravitational Manipulation': '重力操作',
        'Gravitational Wave': '重力波',
        'Main Quake': '本震',
        'Maniacal Probe': '触手乱舞',
        'Paranormal Wave': '呪詛波',
        'Tremblor': '地震',
      },
      '~effectNames': {
        '6 Fulms Under': '沈下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Catastrophe': '灾变者',
        'Fleshy Member': '触手',
      },
      'replaceText': {
        '-100 Gs': '重力-100',
        '(?<!-)100 Gs': '重力100',
        'Antilight': '暗黑光',
        'Earthquake': '大地震',
        'Epicenter': '震源制造',
        'Erosion': '侵入',
        'Evilsphere': '邪球',
        'Explosion': '爆炸',
        'Gravitational Distortion': '重力扭曲',
        'Gravitational Explosion': '重力爆发',
        'Gravitational Manipulation': '重力操纵',
        'Gravitational Wave': '重力波',
        'Main Quake': '主震',
        'Maniacal Probe': '触手乱舞',
        'Paranormal Wave': '诅咒波',
        'Tremblor': '地震',
      },
      '~effectNames': {
        '6 Fulms Under': '下陷',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Catastrophe': '카타스트로피',
        'Fleshy Member': '촉수',
      },
      'replaceText': {
        '-100 Gs': '중력 -100',
        '(?<!-)100 Gs': '중력 100',
        'Antilight': '암흑광',
        'Earthquake': '대지진',
        'Epicenter': '진원 생성',
        'Erosion': '침식',
        'Evilsphere': '악의 세력권',
        'Explosion': '폭발',
        'Gravitational Distortion': '중력 왜곡',
        'Gravitational Explosion': '중력 폭발',
        'Gravitational Manipulation': '중력 조작',
        'Gravitational Wave': '중력파',
        'Main Quake': '본진',
        'Maniacal Probe': '촉수 난무',
        'Paranormal Wave': '저주 파동',
        'Tremblor': '지진',
      },
      '~effectNames': {
        '6 Fulms Under': '침하',
      },
    },
  ],
}];
