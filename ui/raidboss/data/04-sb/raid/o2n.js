'use strict';

// O2N - Deltascape 2.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V2\.0\)$/,
  },
  zoneId: ZoneId.DeltascapeV20,
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
        'Potent Petrosphere': 'Petrosphäre[p] I',
        '(?<! )Petrosphere': 'Petrosphäre[p] II',
        'Fleshy Member': 'Tentakel',
        'Catastrophe': 'Katastroph',
      },
      'replaceText': {
        'Tremblor': 'Erschütterung',
        'Paranormal Wave': 'Paranormale Welle',
        'Maniacal Probe': 'Tentakeltanz',
        'Main Quake': 'Hauptbeben',
        'Gravitational Wave': 'Gravitationswelle',
        'Gravitational Manipulation': 'Schwerkraftmanipulation',
        'Gravitational Explosion': 'Gravitationsknall',
        'Gravitational Distortion': 'Massenverzerrung',
        '(?<! )Explosion': 'Explosion',
        'Evilsphere': 'Sphäre des Bösen',
        'Erosion': 'Erosion',
        'Epicenter': 'Epizentrum',
        'Earthquake': 'Erdbeben',
        'Demon Eye': 'Dämonenauge',
        'Antilight': 'Dunkellicht',
        '(?<!-)100 Gs': '100 G',
        '-100 Gs': 'Minus 100 G',
      },
      '~effectNames': {
        'Six Fulms Under': 'Versinkend',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Potent Petrosphere': 'super pétrosphère',
        '(?<! )Petrosphere': 'pétrosphère',
        'Fleshy Member': 'tentacule',
        'Catastrophe': 'Catastrophe',
      },
      'replaceText': {
        'Tremblor': 'Tremblement de terre',
        'Paranormal Wave': 'Onde maudite',
        'Maniacal Probe': 'Farandole de tentacules',
        'Main Quake': 'Secousse principale',
        'Gravitational Wave': 'Onde gravitationnelle',
        'Gravitational Manipulation': 'Manipulation gravitationnelle',
        'Gravitational Explosion': 'Explosion gravitationnelle',
        'Gravitational Distortion': 'Distorsion gravitationnelle',
        '(?<! )Explosion': 'Explosion',
        'Evilsphere': 'Sphère démoniaque',
        'Erosion': 'Érosion',
        'Epicenter': 'Épicentre',
        'Earthquake': 'Grand séisme',
        'Demon Eye': 'Œil diabolique',
        'Antilight': 'Lumière obscure',
        '(?<!-)100 Gs': 'Gravité 100',
        '-100 Gs': 'Gravité -100',
      },
      '~effectNames': {
        'Six Fulms Under': 'Enfoncement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Potent Petrosphere': 'ペトロスフィアII',
        '(?<! )Petrosphere': 'ペトロスフィアI',
        'Fleshy Member': '触手',
        'Catastrophe': 'カタストロフィー',
      },
      'replaceText': {
        'Tremblor': '地震',
        'Paranormal Wave': '呪詛波',
        'Maniacal Probe': '触手乱舞',
        'Main Quake': '本震',
        'Gravitational Wave': '重力波',
        'Gravitational Manipulation': '重力操作',
        'Gravitational Explosion': '重力爆発',
        'Gravitational Distortion': '重力歪曲',
        '(?<! )Explosion': '爆散',
        'Evilsphere': 'イビルスフィア',
        'Erosion': '浸食',
        'Epicenter': '震源生成',
        'Earthquake': '大地震',
        'Demon Eye': '悪魔の瞳',
        'Antilight': '暗黒光',
        '(?<!-)100 Gs': '重力100',
        '-100 Gs': '重力マイナス100',
      },
      '~effectNames': {
        'Six Fulms Under': '沈下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Potent Petrosphere': '石化球II',
        '(?<! )Petrosphere': '石化球I',
        'Fleshy Member': '触手',
        'Catastrophe': '灾变者',
      },
      'replaceText': {
        'Tremblor': '地震',
        'Paranormal Wave': '诅咒波',
        'Maniacal Probe': '触手乱舞',
        'Main Quake': '主震',
        'Gravitational Wave': '重力波',
        'Gravitational Manipulation': '重力操纵',
        'Gravitational Explosion': '重力爆发',
        'Gravitational Distortion': '重力扭曲',
        '(?<! )Explosion': '爆炸',
        'Evilsphere': '邪球',
        'Erosion': '侵入',
        'Epicenter': '震源制造',
        'Earthquake': '大地震',
        'Demon Eye': '恶魔之瞳',
        'Antilight': '暗黑光',
        '(?<!-)100 Gs': '重力100',
        '-100 Gs': '重力-100',
      },
      '~effectNames': {
        'Six Fulms Under': '下陷',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Potent Petrosphere': '석화 구체 II',
        '(?<! )Petrosphere': '석화 구체 I',
        'Fleshy Member': '촉수',
        'Catastrophe': '카타스트로피',
      },
      'replaceText': {
        'Tremblor': '지진',
        'Paranormal Wave': '저주 파동',
        'Maniacal Probe': '촉수 난무',
        'Main Quake': '본진',
        'Gravitational Wave': '중력파',
        'Gravitational Manipulation': '중력 조작',
        'Gravitational Explosion': '중력 폭발',
        'Gravitational Distortion': '중력 왜곡',
        '(?<! )Explosion': '폭발',
        'Evilsphere': '악의 세력권',
        'Erosion': '침식',
        'Epicenter': '진원 생성',
        'Earthquake': '대지진',
        'Demon Eye': '악마의 눈동자',
        'Antilight': '암흑광',
        '(?<!-)100 Gs': '중력 100',
        '-100 Gs': '중력 -100',
      },
      '~effectNames': {
        'Six Fulms Under': '침하',
      },
    },
  ],
}];
