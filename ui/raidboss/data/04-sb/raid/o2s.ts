import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  probeCount?: number;
  levitating?: boolean;
  blueCircle?: string[];
  dpsProbe?: boolean;
  myProbe?: boolean;
  under?: boolean;
}

// O2S - Deltascape 2.0 Savage
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV20Savage,
  timelineFile: 'o2s.txt',
  timelineTriggers: [
    {
      id: 'O2S Double Stack',
      regex: /Gravitational Manipulation/,
      beforeSeconds: 6,
      alertText: (_data, _matches, output) => output.text!(),
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
    {
      id: 'O2S Paranormal Wave',
      regex: /Paranormal Wave/,
      beforeSeconds: 5,
      suppressSeconds: 10,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'O2S Phase Probe Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '235A', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '235A', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '235A', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '235A', source: '카타스트로피', capture: false }),
      run: (data) => {
        data.probeCount = (data.probeCount ?? 0) + 1;
        data.dpsProbe = data.probeCount === 2 || data.probeCount === 4;
        data.myProbe = data.dpsProbe === data.role.startsWith('dps');
      },
    },
    {
      id: 'O2S Levitation Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '556' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.levitating = true,
    },
    {
      id: 'O2S Levitation Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '556' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.levitating = false,
    },
    {
      id: 'O2S Evilsphere',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2371', source: 'Catastrophe' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2371', source: 'Katastroph' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2371', source: 'Catastrophe' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2371', source: 'カタストロフィー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2371', source: '灾变者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2371', source: '카타스트로피' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'O2S 100Gs',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0069' }),
      preRun: (data, matches) => {
        data.blueCircle ??= [];
        data.blueCircle.push(matches.target);
      },
      delaySeconds: 0.3,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          onYou: {
            en: '100Gs on YOU',
            de: '100Gs auf DIR',
            ko: '중력 100 대상자',
          },
          beIn: {
            en: 'Be in 100Gs Circle',
            de: 'Sei in einem 100Gs Kreis',
            ko: '중력 100 원 안에 있기',
          },
        };

        if (!data.blueCircle)
          return;

        if (data.blueCircle.includes(data.me))
          return { alertText: output.onYou!() };
        return { infoText: output.beIn!() };
      },
      run: (data) => delete data.blueCircle,
    },
    {
      id: 'O2S -100Gs',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '235E', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '235E', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '235E', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '235E', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '235E', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '235E', source: '카타스트로피', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
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
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '236F', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '236F', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '236F', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '236F', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '236F', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '236F', source: '카타스트로피', capture: false }),
      response: Responses.lookAway('alert'),
    },
    {
      id: 'O2S Earthquake',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2374', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2374', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2374', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2374', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2374', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2374', source: '카타스트로피', capture: false }),
      alertText: (data, _matches, output) => {
        if (!data.levitating)
          return output.earthquakeLevitate!();
      },
      infoText: (data, _matches, output) => {
        if (data.levitating)
          return output.earthquake!();
      },
      tts: (data, _matches, output) => {
        if (!data.levitating)
          return output.levitate!();
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
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '54E', capture: false }),
      condition: (data) => data.job !== 'BLU',
      alarmText: (data, _matches, output) => {
        if (data.role.startsWith('dps') && !data.levitating)
          return output.dpsLevitate!();
      },
      infoText: (data, _matches, output) => {
        if (!data.role.startsWith('dps'))
          return output.dpsUpTanksHealersDown!();
      },
      tts: (_data, _matches, output) => output.dpsUp!(),
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
      type: 'StartsUsing',
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
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '235A', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '235A', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '235A', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '235A', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '235A', source: '카타스트로피', capture: false }),
      condition: (data) => data.job !== 'BLU',
      alertText: (data, _matches, output) => {
        if (data.myProbe) {
          if (!data.dpsProbe)
            return output.maniacalProbeTanksHealers!();

          return output.maniacalProbeDps!();
        }
      },
      infoText: (data, _matches, output) => {
        if (!data.myProbe) {
          if (!data.dpsProbe)
            return output.maniacalProbeTanksHealers!();

          return output.maniacalProbeDps!();
        }
      },
      tts: (data, _matches, output) => {
        if (data.dpsProbe)
          return output.dpsProbe!();

        return output.tankHealProbe!();
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
      id: 'O2S Maniacal Probe You',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0005 ' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Probe on YOU',
          de: 'Sonde auf DIR',
          ko: '촉수 대상자',
        },
      },
    },
    {
      id: 'O2S Unstable Gravity',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '550' }),
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Elevate (Unstable Gravity)',
          de: 'Sei erhöht (Schwerkraftschwankung)',
          ko: '공중부양하기 (중력 폭발)',
        },
      },
    },
    {
      id: 'O2S Unstable Gravity Delayed',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '550' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 9,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Knocked to Edge',
          de: 'Zur Kante zurückstoßen lassen',
        },
      },
    },
    {
      id: 'O2S 6 Fulms Under Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '237' }),
      condition: (data, matches) => !data.under && matches.target === data.me,
      delaySeconds: 5,
      alertText: (data, _matches, output) => {
        if (!data.levitating)
          return output.sixFulmsUnderLevitate!();
      },
      infoText: (data, _matches, output) => {
        if (data.levitating)
          return output.sixFulmsUnder!();
      },
      tts: (_data, _matches, output) => output.float!(),
      run: (data) => data.under = true,
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
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '237' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.under = false,
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
        '\\(ground\\)': '(Boden)',
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

export default triggerSet;
