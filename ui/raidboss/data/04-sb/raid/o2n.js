import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// O2N - Deltascape 2.0 Normal
export default {
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
      netRegex: NetRegexes.gainsEffect({ effectId: '556' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.levitating = true,
    },
    {
      id: 'O2N Levitation Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '556' }),
      condition: Conditions.targetIsYou(),
      run: (data) => data.levitating = false,
    },
    {
      id: 'O2N Gravitational Manipulation Stack',
      netRegex: NetRegexes.headMarker({ id: '0071' }),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.stackMarkerOnYou();

        return output.stackOn({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        stackMarkerOnYou: {
          en: 'Stack marker on YOU',
          de: 'Sammeln Marker auf DIR',
          fr: 'Package marqueur sur VOUS',
          ja: '自分に集合',
          cn: '集合点名',
          ko: '쉐어징 대상자',
        },
        stackOn: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'O2N Gravitational Manipulation Float',
      netRegex: NetRegexes.headMarker({ id: '0071' }),
      condition: (data, matches) => !data.levitating && Conditions.targetIsNotYou()(data, matches),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Levitate',
          de: 'Schweben',
          fr: 'Lévitation',
          ja: '浮上',
          cn: '浮空',
          ko: '공중부양',
        },
      },
    },
    {
      id: 'O2N Evilsphere',
      netRegex: NetRegexes.startsUsing({ id: '250F', source: 'Catastrophe' }),
      netRegexDe: NetRegexes.startsUsing({ id: '250F', source: 'Katastroph' }),
      netRegexFr: NetRegexes.startsUsing({ id: '250F', source: 'Catastrophe' }),
      netRegexJa: NetRegexes.startsUsing({ id: '250F', source: 'カタストロフィー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '250F', source: '灾变者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '250F', source: '카타스트로피' }),
      condition: (data) => data.role === 'tank' || data.role === 'healer',
      response: Responses.tankBuster(),
    },
    {
      id: 'O2N -100Gs',
      netRegex: NetRegexes.startsUsing({ id: '24FF', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '24FF', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '24FF', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '24FF', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '24FF', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '24FF', source: '카타스트로피', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '-100 Gs: Go north/south',
          de: '-100G: Nach Norden/Süden',
          fr: 'Gravité -100 : Allez au nord/sud',
          ja: '-100 G: 北/南へ',
          cn: '去北边/南边',
          ko: '중력 마이너스 100: 남/북쪽으로',
        },
      },
    },
    {
      id: 'O2N Demon Eye',
      netRegex: NetRegexes.startsUsing({ id: '250D', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '250D', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '250D', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '250D', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '250D', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '250D', source: '카타스트로피', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'O2N Earthquake',
      netRegex: NetRegexes.startsUsing({ id: '2512', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2512', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2512', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2512', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2512', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2512', source: '카타스트로피', capture: false }),
      alertText: (data, _matches, output) => {
        if (!data.levitating)
          return output.levitate();
      },
      infoText: (data, _matches, output) => {
        if (data.levitating)
          return output.earthquake();
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
        levitate: {
          en: 'Levitate',
          de: 'Schweben',
          fr: 'Lévitation',
          ja: '浮上',
          cn: '浮空',
          ko: '공중부양',
        },
      },
    },
    {
      id: 'O2N Gravitational Wave',
      netRegex: NetRegexes.startsUsing({ id: '2510', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2510', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2510', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2510', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2510', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2510', source: '카타스트로피', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'O2N Six Fulms Under',
      netRegex: NetRegexes.gainsEffect({ effectId: '237' }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 5,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (!data.levitating)
          return output.levitate();
      },
      infoText: (data, _matches, output) => {
        if (data.levitating)
          return output.sixFulmsUnder();
      },
      tts: (_data, _matches, output) => output.float(),
      outputStrings: {
        sixFulmsUnder: {
          en: '6 Fulms Under',
          de: 'Versinkend',
          fr: 'Enfoncement',
          ja: '沈下',
          cn: '下陷',
          ko: '하강',
        },
        levitate: {
          en: 'Levitate',
          de: 'Schweben',
          fr: 'Lévitation',
          ja: '浮上',
          cn: '浮空',
          ko: '공중부양',
        },
        float: {
          en: 'float',
          de: 'schweben',
          fr: 'Flottez',
          ja: '浮上',
          cn: '浮空',
          ko: '공중부양',
        },
      },
    },
    {
      id: 'O2N Antilight',
      netRegex: NetRegexes.startsUsing({ id: '2502', source: 'Catastrophe', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2502', source: 'Katastroph', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2502', source: 'Catastrophe', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2502', source: 'カタストロフィー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2502', source: '灾变者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2502', source: '카타스트로피', capture: false }),
      preRun: (data) => data.antiCounter = data.antiCounter || 0,
      durationSeconds: (data) => {
        if (data.antiCounter === 0 && data.levitating)
          return 3;
        return 8;
      },
      alertText: (data, _matches, output) => {
        // The first Antilight is always blue.
        if (data.antiCounter === 0) {
          // Players who are already floating should just get an info about Petrospheres.
          if (data.levitating)
            return;
          return output.levitate();
        }
        // It's always safe not to levitate after the first Antilight.
        // The second, fifth, eighth, etc Antilights require moving to the center as well.
        if (data.antiCounter % 3 === 1)
          return output.goCenterAndDontLevitate();

        return output.dontLevitate();
      },
      infoText: (data, _matches, output) => {
        if (data.antiCounter === 0 && data.levitating)
          return output.antilight();
      },
      run: (data) => data.antiCounter += 1,
      outputStrings: {
        antilight: {
          en: 'Antilight',
          de: 'Dunkellicht',
          fr: 'Lumière obscure',
          ja: '暗黒光',
          cn: '暗黑光',
          ko: '암흑광',
        },
        levitate: {
          en: 'Levitate',
          de: 'Levitation',
          fr: 'Lévitation',
          ja: '浮上',
          cn: '浮空',
          ko: '공중부양',
        },
        goCenterAndDontLevitate: {
          en: 'Go center and don\'t levitate',
          de: 'Geh in die Mitte und nicht schweben',
          fr: 'Allez au centre et pas de lévitation',
          ja: '中央に浮かばず集合',
          cn: '中间集合不要浮空',
          ko: '공중부양 하지않고 가운데로',
        },
        dontLevitate: {
          en: 'Don\'t levitate',
          de: 'Nicht schweben',
          fr: 'Pas de lévitation',
          ja: '浮上はしない',
          cn: '不要浮空',
          ko: '공중부양 하지않기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Potent Petrosphere': 'Petrosphäre I',
        '(?<! )Petrosphere': 'Petrosphäre II',
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
        'Antilight': 'Dunkles Licht',
        '(?<!-)100 Gs': '100 G',
        '-100 Gs': 'Minus 100 G',
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
        '(?<! )Explosion': '폭산',
        'Evilsphere': '악의 세력권',
        'Erosion': '침식',
        'Epicenter': '진원 생성',
        'Earthquake': '대지진',
        'Demon Eye': '악마의 눈동자',
        'Antilight': '암흑광',
        '(?<!-)100 Gs': '중력 100',
        '-100 Gs': '중력 -100',
      },
    },
  ],
};
