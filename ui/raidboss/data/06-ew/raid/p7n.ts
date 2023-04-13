import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  busterTargets: string[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'AbyssosTheSeventhCircle',
  zoneId: ZoneId.AbyssosTheSeventhCircle,
  timelineFile: 'p7n.txt',
  initData: () => {
    return {
      busterTargets: [],
    };
  },
  timelineTriggers: [
    {
      id: 'P7N Burst',
      regex: /Burst/,
      beforeSeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔へ',
          cn: '踩塔',
          ko: '기둥 들어가기',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P7N Bough Of Attis Out',
      type: 'StartsUsing',
      netRegex: { id: '77F9', source: 'Agdistis', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'P7N Bough Of Attis In',
      type: 'StartsUsing',
      netRegex: { id: '77FE', source: 'Agdistis', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'P7N Bough Of Attis Left',
      type: 'StartsUsing',
      netRegex: { id: '77FC', source: 'Agdistis', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'P7N Bough Of Attis Right',
      type: 'StartsUsing',
      netRegex: { id: '77FB', source: 'Agdistis', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'P7N Hemitheos Holy Spread',
      type: 'HeadMarker',
      netRegex: { id: '0137' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P7N Hemitheos Glare',
      type: 'StartsUsing',
      netRegex: { id: '79FA', source: 'Agdistis', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move center when safe',
          de: 'Geh in die Mitte, wenn es sicher ist',
          fr: 'Allez au centre quand il est sûr',
          ja: '安置に入る',
          cn: '安全时去中间',
          ko: '중앙 바닥이 생기면 들어가기',
        },
      },
    },
    {
      id: 'P7N Immortals Obol',
      type: 'StartsUsing',
      netRegex: { id: '77F5', source: 'Agdistis', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to edge (in circle)',
          de: 'Geh zum Rand (in den Kreisen)',
          fr: 'Allez sur le bord (dans le cercle)',
          ja: '外側の隅へ (円の中)',
          cn: '去边缘 (圆圈中)',
          ko: '구석으로 (원 안으로)',
        },
      },
    },
    {
      id: 'P7N Hemitheos Aero II Collect',
      type: 'HeadMarker',
      netRegex: { id: '016C' },
      run: (data, matches) => data.busterTargets.push(matches.target),
    },
    {
      id: 'P7N Hemitheos Aero II Call',
      type: 'HeadMarker',
      netRegex: { id: '016C', capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.busterTargets.includes(data.me))
          return output.markerYou!();
        return output.avoid!();
      },
      outputStrings: {
        markerYou: Outputs.tankCleave,
        avoid: Outputs.avoidTankCleave,
      },
    },
    {
      id: 'P7N Hemitheos Aero II Cleanup',
      type: 'HeadMarker',
      netRegex: { id: '016C', capture: false },
      delaySeconds: 5,
      run: (data) => data.busterTargets = [],
    },
    {
      id: 'P7N Spark Of Life',
      type: 'StartsUsing',
      netRegex: { id: '780B', source: 'Agdistis', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P7N Static Moon',
      type: 'StartsUsing',
      netRegex: { id: '7802', source: 'Immature Io', capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Behemoths',
          de: 'Behemoths ausweichen',
          fr: 'Évitez les Behemoths',
          ja: 'ベヒーモスから離れる',
          cn: '躲避贝爷',
          ko: '베히모스 피하기',
        },
      },
    },
    {
      id: 'P7N Stymphalian Strike',
      type: 'StartsUsing',
      netRegex: { id: '7803', source: 'Immature Stymphalide', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid line dashes',
          de: 'Linien Anstürme ausweichen',
          fr: 'Évitez les ruées en ligne',
          ja: '突進回避',
          cn: '躲避直线冲锋',
          ko: '직선 돌진 피하기',
        },
      },
    },
    {
      id: 'P7N Blades Of Attis',
      type: 'StartsUsing',
      netRegex: { id: '7805', source: 'Agdistis', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Exaflares',
          de: 'Exaflares ausweichen',
          fr: 'Évitez les brasiers',
          ja: 'エクサプレア',
          cn: '躲避地火',
          ko: '엑사플레어 피하기',
        },
      },
    },
    {
      id: 'P7N Hemitheos Aero IV',
      type: 'StartsUsing',
      netRegex: { id: '7840', source: 'Agdistis' },
      // The cast time is slightly longer than Arm's Length/Surecast's duration.
      // Don't risk someone being too fast.
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      response: Responses.knockback('info'), // avoid collisions with Forbidden Fruit triggers.
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'unreif(?:e|er|es|en) Io',
        'Immature Stymphalide': 'unreif(?:e|er|es|en) Stymphalides',
      },
      'replaceText': {
        'left': 'Links',
        'right': 'Rechts',
        'lines': 'Linien',
        'triangle': 'Dreieck',
        'Blades of Attis': 'Schwertblatt des Attis',
        'Bough of Attis': 'Ast des Attis',
        'Burst': 'Explosion',
        'Forbidden Fruit': 'Frucht des Lebens',
        'Hemitheos\'s Aero II': 'Hemitheisches Windra',
        'Hemitheos\'s Aero IV': 'Hemitheisches Windka',
        'Hemitheos\'s Glare III': 'Hemitheisches Blendga',
        'Hemitheos\'s Holy': 'Hemitheisches Sanctus',
        'Immortal\'s Obol': 'Leitstab des Lebens',
        'Shadow of Attis': 'Lichttropfen des Attis',
        'Spark of Life': 'Schein des Lebens',
        'Static Moon': 'Statischer Mond',
        'Stymphalian Strike': 'Vogelschlag',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'io immature',
        'Immature Stymphalide': 'stymphalide immature',
      },
      'replaceText': {
        'left': 'Gauche',
        'right': 'Droite',
        'lines': 'Ligne',
        'Blades of Attis': 'Lames d\'Attis',
        'Bough of Attis': 'Grandes branches d\'Attis',
        'Burst': 'Explosion',
        'Forbidden Fruit': 'Fruits de la vie',
        'Hemitheos\'s Aero II': 'Extra Vent d\'hémithéos',
        'Hemitheos\'s Aero IV': 'Giga Vent d\'hémithéos',
        'Hemitheos\'s Glare III': 'Méga Chatoiement d\'hémithéos',
        'Hemitheos\'s Holy': 'Miracle d\'hémithéos',
        'Immortal\'s Obol': 'Branche de vie et de mort',
        'Shadow of Attis': 'Rai d\'Attis',
        'Spark of Life': 'Étincelle de vie',
        'Static Moon': 'Lune statique',
        'Stymphalian Strike': 'Assaut stymphalide',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'アグディスティス',
        'Immature Io': 'イマチュア・イーオー',
        'Immature Stymphalide': 'イマチュア・ステュムパリデス',
      },
      'replaceText': {
        'Blades of Attis': 'アッティスの刃葉',
        'Bough of Attis': 'アッティスの巨枝',
        'Burst': '爆発',
        'Forbidden Fruit': '生命の果実',
        'Hemitheos\'s Aero II': 'ヘーミテオス・エアロラ',
        'Hemitheos\'s Aero IV': 'ヘーミテオス・エアロジャ',
        'Hemitheos\'s Glare III': 'ヘーミテオス・グレアガ',
        'Hemitheos\'s Holy': 'ヘーミテオス・ホーリー',
        'Immortal\'s Obol': '生滅の導枝',
        'Shadow of Attis': 'アッティスの光雫',
        'Spark of Life': '生命の光芒',
        'Static Moon': 'スタティックムーン',
        'Stymphalian Strike': 'バードストライク',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Agdistis': '阿格狄斯提斯',
        'Immature Io': '未成熟的伊娥',
        'Immature Stymphalide': '未成熟的铁爪怪鸟',
      },
      'replaceText': {
        'left': '左',
        'right': '右',
        'lines': '直线',
        'triangle': '三角',
        'Blades of Attis': '阿提斯的叶刃',
        'Bough of Attis': '阿提斯的巨枝',
        'Burst': '爆炸',
        'Forbidden Fruit': '生命之果',
        'Hemitheos\'s Aero II': '半神烈风',
        'Hemitheos\'s Aero IV': '半神飙风',
        'Hemitheos\'s Glare III': '半神闪灼',
        'Hemitheos\'s Holy': '半神神圣',
        'Immortal\'s Obol': '不灭者的导枝',
        'Shadow of Attis': '阿提斯的光露',
        'Spark of Life': '生命的光芒',
        'Static Moon': '静电之月',
        'Stymphalian Strike': '怪鸟强袭',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Agdistis': '아그디스티스',
        'Immature Io': '덜 자란 이오',
        'Immature Stymphalide': '덜 자란 스팀팔로스 괴조',
      },
      'replaceText': {
        'left': '왼',
        'right': '오른',
        'lines': '직선',
        'triangle': '삼각',
        'Blades of Attis': '아티스의 칼날잎',
        'Bough of Attis': '아티스의 큰가지',
        'Burst': '폭발',
        'Forbidden Fruit': '생명의 열매',
        'Hemitheos\'s Aero II': '헤미테오스 에어로라',
        'Hemitheos\'s Aero IV': '헤미테오스 에어로쟈',
        'Hemitheos\'s Glare III': '헤미테오스 글레어가',
        'Hemitheos\'s Holy': '헤미테오스 홀리',
        'Immortal\'s Obol': '생멸의 가지',
        'Shadow of Attis': '아티스의 빛방울',
        'Spark of Life': '생명의 광망',
        'Static Moon': '정전기 달',
        'Stymphalian Strike': '괴조 충돌',
      },
    },
  ],
};

export default triggerSet;
