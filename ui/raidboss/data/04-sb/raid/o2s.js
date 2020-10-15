'use strict';

// O2S - Deltascape 2.0 Savage
[{
  zoneId: ZoneId.DeltascapeV20Savage,
  timelineNeedsFixing: true,
  timelineFile: 'o2s.txt',
  timelineTriggers: [
    {
      id: 'O2S Double Stack',
      regex: /Double Stack/,
      beforeSeconds: 6,
      alertText: {
        en: 'DPS: Levitate',
        de: 'DDs hoch',
        ja: 'DPS: 浮上',
        cn: 'DPS浮空',
        ko: '딜러: 공중부양',
      },
    },
  ],
  triggers: [
    {
      id: 'O2S Phase Probe Tracker',
      netRegex: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '235A', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '235A', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '235A', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '235A', source: '카타스트로피', capture: false }),
      run: function(data) {
        data.probeCount = (data.probeCount || 0) + 1;
        data.dpsProbe = data.probeCount == 2 || data.probeCount == 4;
        data.myProbe = data.dpsProbe == data.role.startsWith('dps');
      },
    },
    {
      id: 'O2S Levitation Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '556' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data) {
        data.levitating = true;
      },
    },
    {
      id: 'O2S Levitation Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '556' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data) {
        data.levitating = false;
      },
    },
    {
      id: 'O2S -100Gs',
      netRegex: NetRegexes.startsUsing({ id: '235E', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '235E', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '235E', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '235E', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '235E', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '235E', source: '카타스트로피', capture: false }),
      infoText: {
        en: '-100 Gs: Go north/south and look away',
        de: '-100G: Nach Norden/Süden und wegschauen',
        ja: '-100 G: 北/南へ、ボスを見ないで',
        cn: '前往南边/北边并背对boss',
        ko: '중력 마이너스 100: 남/북쪽에서 바깥쪽 보기',
      },
      tts: {
        en: '100 gs',
        de: '-100 G',
        ja: 'マイナス100 G',
        cn: '重力负100',
        ko: '중력 마이너스 100',
      },
    },
    {
      id: 'O2S Death\'s Gaze',
      netRegex: NetRegexes.startsUsing({ id: '236F', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '236F', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '236F', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '236F', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '236F', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '236F', source: '카타스트로피', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'O2S Earthquake',
      netRegex: NetRegexes.startsUsing({ id: '2374', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2374', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2374', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2374', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2374', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2374', source: '카타스트로피', capture: false }),
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: 'Earthquake: Levitate',
            de: 'Erdbeben: Schweben',
            ja: '地震: 浮上',
            cn: '地震：漂浮',
            ko: '대지진: 공중부양',
          };
        }
      },
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: 'Earthquake',
            de: 'Erdbeben',
            ja: '地震',
            cn: '地震',
            ko: '대지진',
          };
        }
      },
      tts: function(data) {
        if (!data.levitating) {
          return {
            en: 'levitate',
            de: 'schweben',
            ja: '浮上',
            cn: '漂浮',
            ko: '공중부양',
          };
        }
      },
    },
    {
      id: 'O2S Elevated',
      netRegex: NetRegexes.gainsEffect({ effectId: '54E', capture: false }),
      alarmText: function(data) {
        if (data.role.startsWith('dps') && !data.levitating) {
          return {
            en: 'DPS: Levitate',
            de: 'DDs: Schweben',
            ja: 'DPS: 浮上',
            cn: 'DPS浮空',
            ko: '딜러: 공중부양',
          };
        }
      },
      infoText: function(data) {
        if (!data.role.startsWith('dps')) {
          return {
            en: 'DPS up, T/H down',
            de: 'DDs hoch, T/H runter',
            ja: 'DPS浮上 タンクヒラ降下',
            cn: 'DPS升起，T奶下降',
            ko: '딜러 공중부양, 탱힐 강하',
          };
        }
      },
      tts: {
        en: 'dps up',
        de: 'dee dees hoch',
        ja: 'DPS浮上',
        cn: 'DPS升起',
        ko: '딜러 공중부양',
      },
    },
    {
      id: 'O2S Gravitational Wave',
      netRegex: NetRegexes.startsUsing({ id: '2372', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2372', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2372', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2372', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2372', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2372', source: '카타스트로피', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'O2S Maniacal Probe',
      netRegex: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '235A', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '235A', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '235A', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '235A', source: '카타스트로피', capture: false }),
      alertText: function(data) {
        if (data.myProbe) {
          if (!data.dpsProbe) {
            return {
              en: 'Maniacal Probe: Tanks & Healers',
              de: 'Tentakeltanz: Tanks & Heiler',
              ja: '触手乱舞: タンク/ヒーラー',
              cn: 'T奶触手',
              ko: '촉수 난무: 탱/힐',
            };
          }
          return {
            en: 'Maniacal Probe: DPS',
            de: 'Tentakeltanz: DDs',
            ja: '触手乱舞: DPS',
            cn: 'DPS触手',
            ko: '촉수 난무: 딜러',
          };
        }
      },
      infoText: function(data) {
        if (!data.myProbe) {
          if (!data.dpsProbe) {
            return {
              en: 'Maniacal Probe: Tanks & Healers',
              de: 'Tentakeltanz: Tanks & Heiler',
              ja: '触手乱舞: タンク/ヒーラー',
              cn: 'T奶触手',
              ko: '촉수 난무: 탱/힐',
            };
          }
          return {
            en: 'Maniacal Probe: DPS',
            de: 'Tentakeltanz: DDs',
            ja: '触手乱舞: DPS',
            cn: 'DPS触手',
            ko: '촉수 난무: 딜러',
          };
        }
      },
      tts: function(data) {
        if (data.dpsProbe) {
          return {
            en: 'dps probe',
            de: 'dee dees tentakel',
            ja: 'dpsに触手乱舞',
            cn: 'dps触手',
            ko: '딜러 촉수 난무',
          };
        }
        return {
          en: 'tank heal probe',
          de: 'tenks heiler tentakel',
          ja: 'タンクヒラに触手乱舞',
          cn: 'T奶触手',
          ko: '탱힐 촉수난무',
        };
      },
    },
    {
      id: 'O2S Unstable Gravity',
      netRegex: NetRegexes.gainsEffect({ effectId: '550' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      delaySeconds: 9,
      alarmText: {
        en: 'Unstable Gravity: Elevate and outside stack',
        de: 'Schwerkraftschwankung: Schweben und außen stacken',
        ja: 'グラビティバースト: 浮上集合',
        cn: '升起并分摊',
        ko: '중력 폭탄: 공중부양 및 쉐어',
      },
      tts: {
        en: 'float for bomb',
        de: 'schweben für bombe',
        ja: '浮上集合',
        cn: '升起并分摊',
        ko: '중력 폭탄',
      },
    },
    {
      id: 'O2S 6 Fulms Under Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '237' }),
      condition: function(data, matches) {
        return !data.under && matches.target == data.me;
      },
      delaySeconds: 5,
      alertText: function(data) {
        if (!data.levitating) {
          return {
            en: '6 Fulms Under: Levitate',
            de: 'Versinkend: Schweben',
            ja: '沈下: 浮上',
            cn: '下陷：悬浮',
            ko: '하강: 공중부양',
          };
        }
      },
      infoText: function(data) {
        if (data.levitating) {
          return {
            en: '6 Fulms Under',
            de: 'Versinkend',
            ja: '沈下',
            cn: '下陷',
            ko: '하강',
          };
        }
      },
      tts: {
        en: 'float',
        de: 'schweben',
        ja: '浮上',
        cn: '悬浮',
        ko: '공중부양',
      },
      run: function(data) {
        data.under = true;
      },
    },
    {
      id: 'O2S 6 Fulms Under Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '237' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      run: function(data) {
        data.under = false;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Catastrophe': 'Katastroph',
      },
      'replaceText': {
        '-100 Gs': 'Minus 100 G',
        '(?<!-)100 Gs': '100 G',
        'Antilight': 'Dunkellicht',
        'Death\'s Gaze': 'Todesblick',
        'Double Stack': 'Doppelt Sammeln',
        'Earthquake': 'Erdbeben',
        'Epicenter': 'Epizentrum',
        'Evilsphere': 'Sphäre des Bösen',
        'Gravitational Distortion': 'Massenverzerrung',
        'Gravitational Wave': 'Gravitationswelle',
        'Long Drop': 'Tiefer Fall',
        'Paranormal Wave': 'Paranormale Welle',
        'Probes': 'Sonden',
        'Unstable Gravity': 'Schwerkraftschwankung',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Catastrophe': 'Catastrophe',
      },
      'replaceText': {
        '-100 Gs': 'Gravité -100',
        '(?<!-)100 Gs': 'Gravité 100',
        'Antilight': 'Lumière obscure',
        'Death\'s Gaze': 'Œil de la Mort',
        'Earthquake': 'Grand séisme',
        'Epicenter': 'Épicentre',
        'Evilsphere': 'Sphère démoniaque',
        'Gravitational Distortion': 'Distorsion gravitationnelle',
        'Gravitational Wave': 'Onde gravitationnelle',
        'Long Drop': 'Chute ininterrompue',
        'Paranormal Wave': 'Onde maudite',
        'Unstable Gravity': 'Gravité instable',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Catastrophe': 'カタストロフィー',
      },
      'replaceText': {
        '\\(center\\)': '(中央)',
        '\\(T/H\\)': '(タンク/ヒラ)',
        '\\(troll\\)': '(死神の瞳)',
        '-100 Gs': '重力マイナス100',
        '(?<!-)100 Gs': '重力100',
        'Antilight': '暗黒光',
        'Death\'s Gaze': '死神の瞳',
        'Double Stack': '二重頭割り',
        'Earthquake': '大地震',
        'Epicenter': '震源生成',
        'Evilsphere': 'イビルスフィア',
        'Gravitational Distortion': '重力歪曲',
        'Gravitational Wave': '重力波',
        'Long Drop': '自由落下',
        'Paranormal Wave': '呪詛波',
        'Probes': '触手乱舞',
        'Unstable Gravity': 'グラビティバースト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Catastrophe': '灾变者',
      },
      'replaceText': {
        '-100 Gs': '重力-100',
        '(?<!-)100 Gs': '重力100',
        'Antilight': '暗黑光',
        'Death\'s Gaze': '死神之瞳',
        'Double Stack': '二连分摊',
        'Earthquake': '大地震',
        'Epicenter': '震源制造',
        'Evilsphere': '邪球',
        'Gravitational Distortion': '重力扭曲',
        'Gravitational Wave': '重力波',
        'Long Drop': '自由落体',
        'Paranormal Wave': '诅咒波',
        'Probes': '引导',
        'Unstable Gravity': '重力爆发',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Catastrophe': '카타스트로피',
      },
      'replaceText': {
        '-100 Gs': '중력 -100',
        '(?<!-)100 Gs': '중력 100',
        'Antilight': '암흑광',
        'Death\'s Gaze': '사신의 눈동자',
        'Earthquake': '대지진',
        'Epicenter': '진원 생성',
        'Evilsphere': '악의 세력권',
        'Gravitational Distortion': '중력 왜곡',
        'Gravitational Wave': '중력파',
        'Long Drop': '자유낙하',
        'Paranormal Wave': '저주 파동',
        'Unstable Gravity': '중력 폭발',
      },
    },
  ],
}];
