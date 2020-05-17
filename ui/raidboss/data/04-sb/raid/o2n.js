'use strict';

// O2N - Deltascape 2.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V2\.0\)$/,
  },
  timelineFile: 'o2n.txt',
  timelineTriggers: [
    {
      id: 'O2N Paranormal Wave',
      regex: /Paranormal Wave/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
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
      id: 'O2N Gravitational Manipulation Stack',
      regex: Regexes.headMarker({ id: '0071' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Stack marker on YOU',
            de: 'Sammeln Marker auf DIR',
          };
        }
        return {
          en: 'Stack on ' + data.shortName(matches.target),
          de: 'Sammeln auf ' + data.shortName(matches.target),
        };
      },
    },
    {
      id: 'O2N Gravitational Manipulation Float',
      regex: Regexes.headMarker({ id: '0071' }),
      condition: function(data, matches) {
        return !data.levitating && Conditions.targetIsNotYou();
      },
      infoText: {
        en: 'Levitate',
        de: 'Schweben',
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
            en: 'Levitate',
            de: 'Schweben',
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
            en: 'Levitate',
            de: 'Schweben',
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
      id: 'O2N Antilight',
      regex: Regexes.startsUsing({ id: '2502', source: 'Catastrophe', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2502', source: 'Katastroph', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2502', source: 'Catastrophe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2502', source: 'カタストロフィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2502', source: '灾变者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2502', source: '카타스트로피', capture: false }),
      preRun: function(data) {
        data.antiCounter = data.antiCounter || 0;
      },
      durationSeconds: function(data) {
        if (data.antiCounter == 0 && data.levitating)
          return 3;
        return 8;
      },
      alertText: function(data) {
        // The first Antilight is always blue.
        if (data.antiCounter == 0) {
          // Players who are already floating should just get an info about Petrospheres.
          if (data.levitating)
            return;
          return {
            en: 'Levitate',
            de: 'Levitation',
          };
        }
        // It's always safe not to levitate after the first Antilight.
        // The second, fifth, eighth, etc Antilights require moving to the center as well.
        if (data.antiCounter % 3 == 1) {
          return {
            en: 'Go center and don\'t levitate',
            de: 'Geh in die Mitte und nicht schweben',
          };
        }
        return {
          en: 'Don\'t levitate',
          de: 'Nicht schweben',
        };
      },
      infoText: function(data) {
        if (data.antiCounter == 0 && data.levitating) {
          return {
            en: 'Antilight',
            de: 'Dunkellicht',
            fr: 'Lumière obscure',
            ja: '暗黒光',
            cn: '暗黑光',
            ko: '암흑광',
          };
        }
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
        '(?<! )Petrosphere': 'Petrosphäre[p] II',
        'Catastrophe': 'Katastroph',
        'Fleshy Member': 'Tentakel',
        'Potent Petrosphere': 'Petrosphäre[p] I',
      },
      'replaceText': {
        '(?<! )Explosion': 'Explosion',
        '(?<!-)100 Gs': '100 G',
        '-100 Gs': 'Minus 100 G',
        'Antilight': 'Dunkellicht',
        'Demon Eye': 'Dämonenauge',
        'Earthquake': 'Erdbeben',
        'Epicenter': 'Epizentrum',
        'Erosion': 'Erosion',
        'Evilsphere': 'Sphäre des Bösen',
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
        'Six Fulms Under': 'Versinkend',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<! )Petrosphere': 'pétrosphère',
        'Catastrophe': 'Catastrophe',
        'Fleshy Member': 'tentacule',
        'Potent Petrosphere': 'super pétrosphère',
      },
      'replaceText': {
        '(?<! )Explosion': 'Explosion',
        '(?<!-)100 Gs': 'Gravité 100',
        '-100 Gs': 'Gravité -100',
        'Antilight': 'Lumière obscure',
        'Demon Eye': 'Œil diabolique',
        'Earthquake': 'Grand séisme',
        'Epicenter': 'Épicentre',
        'Erosion': 'Érosion',
        'Evilsphere': 'Sphère démoniaque',
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
        'Six Fulms Under': 'Enfoncement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '(?<! )Petrosphere': 'ペトロスフィアI',
        'Catastrophe': 'カタストロフィー',
        'Fleshy Member': '触手',
        'Potent Petrosphere': 'ペトロスフィアII',
      },
      'replaceText': {
        '(?<! )Explosion': '爆散',
        '(?<!-)100 Gs': '重力100',
        '-100 Gs': '重力マイナス100',
        'Antilight': '暗黒光',
        'Demon Eye': '悪魔の瞳',
        'Earthquake': '大地震',
        'Epicenter': '震源生成',
        'Erosion': '浸食',
        'Evilsphere': 'イビルスフィア',
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
        'Six Fulms Under': '沈下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '(?<! )Petrosphere': '石化球I',
        'Catastrophe': '灾变者',
        'Fleshy Member': '触手',
        'Potent Petrosphere': '石化球II',
      },
      'replaceText': {
        '(?<! )Explosion': '爆炸',
        '(?<!-)100 Gs': '重力100',
        '-100 Gs': '重力-100',
        'Antilight': '暗黑光',
        'Demon Eye': '恶魔之瞳',
        'Earthquake': '大地震',
        'Epicenter': '震源制造',
        'Erosion': '侵入',
        'Evilsphere': '邪球',
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
        'Six Fulms Under': '下陷',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '(?<! )Petrosphere': '석화 구체 I',
        'Catastrophe': '카타스트로피',
        'Fleshy Member': '촉수',
        'Potent Petrosphere': '석화 구체 II',
      },
      'replaceText': {
        '(?<! )Explosion': '폭발',
        '(?<!-)100 Gs': '중력 100',
        '-100 Gs': '중력 -100',
        'Antilight': '암흑광',
        'Demon Eye': '악마의 눈동자',
        'Earthquake': '대지진',
        'Epicenter': '진원 생성',
        'Erosion': '침식',
        'Evilsphere': '악의 세력권',
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
        'Six Fulms Under': '침하',
      },
    },
  ],
}];
