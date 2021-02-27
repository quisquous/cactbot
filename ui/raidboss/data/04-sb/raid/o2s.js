import Conditions from '../../../../../resources/conditions.ts';
import NetRegexes from '../../../../../resources/netregexes.ts';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// O2S - Deltascape 2.0 Savage
export default {
  zoneId: ZoneId.DeltascapeV20Savage,
  timelineFile: 'o2s.txt',
  timelineTriggers: [
    {
      id: 'O2S Double Stack',
      regex: /Gravitational Manipulation/,
      beforeSeconds: 6,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'DPS: Levitate',
          de: 'DDs hoch',
          fr: 'DPS : Lévitation',
          ja: 'DPS: 浮上',
          cn: 'DPS浮空',
          ko: '딜러: 공중부양',
        },
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
        data.dpsProbe = data.probeCount === 2 || data.probeCount === 4;
        data.myProbe = data.dpsProbe === data.role.startsWith('dps');
      },
    },
    {
      id: 'O2S Levitation Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '556' }),
      condition: Conditions.targetIsYou(),
      run: function(data) {
        data.levitating = true;
      },
    },
    {
      id: 'O2S Levitation Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '556' }),
      condition: Conditions.targetIsYou(),
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
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: '-100 Gs: Go north/south and look away',
          de: '-100G: Nach Norden/Süden und wegschauen',
          fr: 'Gravité -100 : Allez au nord/sud et détournez le regard',
          ja: '-100 G: 北/南へ、ボスを見ないで',
          cn: '前往南边/北边并背对boss',
          ko: '중력 마이너스 100: 남/북쪽에서 바깥쪽 보기',
        },
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
      alertText: function(data, _, output) {
        if (!data.levitating)
          return output.earthquakeLevitate();
      },
      infoText: function(data, _, output) {
        if (data.levitating)
          return output.earthquake();
      },
      tts: function(data, _, output) {
        if (!data.levitating)
          return output.levitate();
      },
      outputStrings: {
        earthquake: {
          en: 'Earthquake',
          de: 'Erdbeben',
          fr: 'Grand séisme',
          ja: '地震',
          cn: '地震',
          ko: '대지진',
        },
        earthquakeLevitate: {
          en: 'Earthquake: Levitate',
          de: 'Erdbeben: Schweben',
          fr: 'Grand séisme : Lévitation',
          ja: '地震: 浮上',
          cn: '地震：漂浮',
          ko: '대지진: 공중부양',
        },
        levitate: {
          en: 'levitate',
          de: 'schweben',
          fr: 'Lévitation',
          ja: '浮上',
          cn: '漂浮',
          ko: '공중부양',
        },
      },
    },
    {
      id: 'O2S Elevated',
      netRegex: NetRegexes.gainsEffect({ effectId: '54E', capture: false }),
      alarmText: function(data, _, output) {
        if (data.role.startsWith('dps') && !data.levitating)
          return output.dpsLevitate();
      },
      infoText: function(data, _, output) {
        if (!data.role.startsWith('dps'))
          return output.dpsUpTanksHealersDown();
      },
      tts: (data, _, output) => output.dpsUp(),
      outputStrings: {
        dpsUpTanksHealersDown: {
          en: 'DPS up, T/H down',
          de: 'DDs hoch, T/H runter',
          fr: 'DPS en haut, T/H en bas',
          ja: 'DPS浮上 タンクヒラ降下',
          cn: 'DPS升起，T奶下降',
          ko: '딜러 공중부양, 탱힐 강하',
        },
        dpsLevitate: {
          en: 'DPS: Levitate',
          de: 'DDs: Schweben',
          fr: 'DPS : Lévitation',
          ja: 'DPS: 浮上',
          cn: 'DPS浮空',
          ko: '딜러: 공중부양',
        },
        dpsUp: {
          en: 'dps up',
          de: 'dee dees hoch',
          fr: 'DPS en haut',
          ja: 'DPS浮上',
          cn: 'DPS升起',
          ko: '딜러 공중부양',
        },
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
      condition: Conditions.caresAboutAOE(),
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
      alertText: function(data, _, output) {
        if (data.myProbe) {
          if (!data.dpsProbe)
            return output.maniacalProbeTanksHealers();

          return output.maniacalProbeDps();
        }
      },
      infoText: function(data, _, output) {
        if (!data.myProbe) {
          if (!data.dpsProbe)
            return output.maniacalProbeTanksHealers();

          return output.maniacalProbeDps();
        }
      },
      tts: function(data, _, output) {
        if (data.dpsProbe)
          return output.dpsProbe();

        return output.tankHealProbe();
      },
      outputStrings: {
        maniacalProbeTanksHealers: {
          en: 'Maniacal Probe: Tanks & Healers',
          de: 'Tentakeltanz: Tanks & Heiler',
          fr: 'Farandole de tentacules : Tank et Heals',
          ja: '触手乱舞: タンク/ヒーラー',
          cn: 'T奶触手',
          ko: '촉수 난무: 탱/힐',
        },
        maniacalProbeDps: {
          en: 'Maniacal Probe: DPS',
          de: 'Tentakeltanz: DDs',
          fr: 'Farandole de tentacules : DPS',
          ja: '触手乱舞: DPS',
          cn: 'DPS触手',
          ko: '촉수 난무: 딜러',
        },
        dpsProbe: {
          en: 'dps probe',
          de: 'dee dees tentakel',
          fr: 'DPS tentacules',
          ja: 'dpsに触手乱舞',
          cn: 'dps触手',
          ko: '딜러 촉수 난무',
        },
        tankHealProbe: {
          en: 'tank heal probe',
          de: 'tenks heiler tentakel',
          fr: 'Tank/Heal tentacules',
          ja: 'タンクヒラに触手乱舞',
          cn: 'T奶触手',
          ko: '탱힐 촉수난무',
        },
      },
    },
    {
      id: 'O2S Unstable Gravity',
      netRegex: NetRegexes.gainsEffect({ effectId: '550' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 9,
      alarmText: (data, _, output) => output.elevateOutsideStack(),
      tts: (data, _, output) => output.floatForBomb(),
      outputStrings: {
        elevateOutsideStack: {
          en: 'Unstable Gravity: Elevate and outside stack',
          de: 'Schwerkraftschwankung: Schweben und außen stacken',
          fr: 'Gravité instable : Lévitez et packez-vous à l\'extérieur',
          ja: 'グラビティバースト: 浮上集合',
          cn: '升起并分摊',
          ko: '중력 폭탄: 공중부양 및 쉐어',
        },
        floatForBomb: {
          en: 'float for bomb',
          de: 'schweben für bombe',
          fr: 'Flottez pour la bombe',
          ja: '浮上集合',
          cn: '升起并分摊',
          ko: '중력 폭탄',
        },
      },
    },
    {
      id: 'O2S 6 Fulms Under Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '237' }),
      condition: function(data, matches) {
        return !data.under && matches.target === data.me;
      },
      delaySeconds: 5,
      alertText: function(data, _, output) {
        if (!data.levitating)
          return output.sixFulmsUnderLevitate();
      },
      infoText: function(data, _, output) {
        if (data.levitating)
          return output.sixFulmsUnder();
      },
      tts: (data, _, output) => output.float(),
      run: function(data) {
        data.under = true;
      },
      outputStrings: {
        sixFulmsUnder: {
          en: '6 Fulms Under',
          de: 'Versinkend',
          fr: 'Enfoncement',
          ja: '沈下',
          cn: '下陷',
          ko: '하강',
        },
        sixFulmsUnderLevitate: {
          en: '6 Fulms Under: Levitate',
          de: 'Versinkend: Schweben',
          fr: 'Enfoncement : Lévitation',
          ja: '沈下: 浮上',
          cn: '下陷：悬浮',
          ko: '하강: 공중부양',
        },
        float: {
          en: 'float',
          de: 'schweben',
          fr: 'Flottez',
          ja: '浮上',
          cn: '悬浮',
          ko: '공중부양',
        },
      },
    },
    {
      id: 'O2S 6 Fulms Under Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '237' }),
      condition: Conditions.targetIsYou(),
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
        'Fleshy Member': 'Tentakel',
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
        'Tremblor': 'Erschütterung',
        'Gravitational Manipulation': 'Schwerkraftmanipulation',
        'Gravitational Explosion': 'Gravitationsknall',
        'Erosion': 'Erosion',
        'Main Quake': 'Hauptbeben',
        'Maniacal Probe': 'Tentakeltanz',
        'Gravitational Collapse': 'Gravitationseinbruch',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Catastrophe': 'Catastrophe',
        'Fleshy Member': 'tentacule',
      },
      'replaceText': {
        '\\(center\\)': '(centre)',
        '\\(ground\\)': 'sol',
        '-100 Gs': 'Gravité -100',
        '(?<!-)100 Gs': 'Gravité 100',
        'Antilight': 'Lumière obscure',
        'Death\'s Gaze': 'Œil de la Mort',
        'Double Stack': 'Double package',
        'Earthquake': 'Grand séisme',
        'Epicenter': 'Épicentre',
        'Erosion': 'Érosion',
        'Evilsphere': 'Sphère démoniaque',
        'Gravitational Collapse': '',
        'Gravitational Distortion': 'Distorsion gravitationnelle',
        'Gravitational Explosion': 'Explosion gravitationnelle',
        'Gravitational Manipulation': 'Manipulation gravitationnelle',
        'Gravitational Wave': 'Onde gravitationnelle',
        'Long Drop': 'Chute ininterrompue',
        'Main Quake': 'Secousse principale',
        'Maniacal Probe': 'Farandole de tentacules',
        'Paranormal Wave': 'Onde maudite',
        'Tremblor': 'Tremblement de terre',
        'Unstable Gravity': 'Gravité instable',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Catastrophe': 'カタストロフィー',
        'Fleshy Member': '触手',
      },
      'replaceText': {
        '\\(center\\)': '(中央)',
        '\\(T/H\\)': '(タンク/ヒラ)',
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
        'Tremblor': '地震',
        'Gravitational Manipulation': '重力操作',
        'Gravitational Explosion': '重力爆発',
        'Erosion': '浸食',
        'Main Quake': '本震',
        'Maniacal Probe': '触手乱舞',
        'Gravitational Collapse': '重力崩壊',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Catastrophe': '灾变者',
        'Fleshy Member': '触手',
      },
      'replaceText': {
        '\\(center\\)': '(中央)',
        '\\(T/H\\)': '(T/奶)',
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
        'Tremblor': '地震',
        'Gravitational Manipulation': '重力操纵',
        'Gravitational Explosion': '重力爆发',
        'Erosion': '侵入',
        'Main Quake': '主震',
        'Maniacal Probe': '触手乱舞',
        'Gravitational Collapse': '重力崩坏',
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
        '(?<!Epi)center': '중앙',
        'Death\'s Gaze': '사신의 눈동자',
        'Double Stack': '이중쉐어',
        'Earthquake': '대지진',
        'Epicenter': '진원 생성',
        'Evilsphere': '악의 세력권',
        'Gravitational Distortion': '중력 왜곡',
        'Gravitational Wave': '중력파',
        'Long Drop': '자유낙하',
        'Paranormal Wave': '저주 파동',
        'Probes': '촉수 유도',
        'Unstable Gravity': '중력 폭발',
        'T/H': '탱/힐',
        'Tremblor': '지진',
        'Gravitational Manipulation': '중력 조작',
        'Gravitational Explosion': '중력 폭발',
        'Erosion': '침식',
        'Main Quake': '본진',
        'Maniacal Probe': '촉수 난무',
        'Gravitational Collapse': '중력 붕괴',
      },
    },
  ],
};
