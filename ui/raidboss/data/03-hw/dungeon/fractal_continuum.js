import Conditions from '../../../../../resources/conditions.js';
import NetRegexes from '../../../../../resources/netregexes.js';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

// Fractal Continuum
export default {
  zoneId: ZoneId.TheFractalContinuum,
  timelineFile: 'fractal_continuum.txt',
  timelineTriggers: [
    {
      id: 'Fractal Atmospheric Displacement',
      regex: /Atmospheric Displacement/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Fractal Sanctification',
      regex: /Sanctification/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'Fractal Unholy',
      regex: /Unholy/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
  ],
  triggers: [
    {
      id: 'Fractal Rapid Sever',
      netRegex: NetRegexes.startsUsing({ id: 'F7A', source: 'Phantom Ray' }),
      netRegexDe: NetRegexes.startsUsing({ id: 'F7A', source: 'Phantomschimmer' }),
      netRegexFr: NetRegexes.startsUsing({ id: 'F7A', source: 'Rayon Fantomatique' }),
      netRegexJa: NetRegexes.startsUsing({ id: 'F7A', source: 'ファントムレイ' }),
      netRegexCn: NetRegexes.startsUsing({ id: 'F7A', source: '幻影光' }),
      netRegexKo: NetRegexes.startsUsing({ id: 'F7A', source: '환영 광선' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Fractal Slash',
      netRegex: NetRegexes.startsUsing({ id: 'F83', source: 'Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'F83', source: 'Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'F83', source: 'Minotaure', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'F83', source: 'ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'F83', source: '弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'F83', source: '미노타우로스', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Fractal Swipe',
      netRegex: NetRegexes.startsUsing({ id: 'F81', source: 'Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'F81', source: 'Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'F81', source: 'Minotaure', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'F81', source: 'ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'F81', source: '弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'F81', source: '미노타우로스', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Fractal Small Swing',
      netRegex: NetRegexes.startsUsing({ id: 'F82', source: 'Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'F82', source: 'Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'F82', source: 'Minotaure', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'F82', source: 'ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'F82', source: '弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'F82', source: '미노타우로스', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Fractal Big Swing',
      netRegex: NetRegexes.startsUsing({ id: 'F87', source: 'Minotaur', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: 'F87', source: 'Minotaurus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: 'F87', source: 'Minotaure', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: 'F87', source: 'ミノタウロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: 'F87', source: '弥诺陶洛斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: 'F87', source: '미노타우로스', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Use a cage',
          de: 'Benutze einen Käfig',
          fr: 'Utilisez un incubateur',
          ja: 'キメラ培養器を使う',
          cn: '打开笼子',
          ko: '감옥 해제',
        },
      },
    },
    {
      id: 'Fractal Aetherochemical Bomb',
      netRegex: NetRegexes.gainsEffect({ effectId: '2D3', capture: false }),
      condition: function(data) {
        return data.CanCleanse();
      },
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Cleanse bomb',
          de: 'Reinige Bomben-Debuff',
          fr: 'Guérison => Debuff bombe',
          ja: 'エスナ：魔科学爆弾',
          cn: '康复魔炸弹',
          ko: '폭탄 디버프 해제',
        },
      },
    },
    {
      id: 'Fractal Alarums',
      netRegex: NetRegexes.addedCombatant({ name: 'Clockwork Alarum', capture: false }),
      netRegexDe: NetRegexes.addedCombatant({ name: 'Uhrwerk-Alarm', capture: false }),
      netRegexFr: NetRegexes.addedCombatant({ name: 'Alarum Mécanique', capture: false }),
      netRegexJa: NetRegexes.addedCombatant({ name: 'アラガンワーク・アラーム', capture: false }),
      netRegexCn: NetRegexes.addedCombatant({ name: '发条报警虫', capture: false }),
      netRegexKo: NetRegexes.addedCombatant({ name: '알라그 태엽경보장치', capture: false }),
      suppressSeconds: 5,
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Clockwork Alarum': 'Uhrwerk-Alarm',
        'Exhibit level III': 'Ausstellungssektor III',
        'Minotaur': 'Minotaurus',
        'Phantom Ray': 'Phantomschimmer',
        'Repository Node': 'Verwahrungsknoten',
        'The Curator': 'Kurator',
        'The high-level incubation bay': 'Inkubationskammer',
        'The reality augmentation bay': 'Dilatationskammer',
      },
      'replaceText': {
        '(?<!1)111-Tonze Swing': '111-Tonzen-Schwung',
        '10-Tonze Slash': '11-Tonzen-Schlag',
        '11-Tonze Swipe': '11-Tonzen-Hieb',
        '1111-Tonze Swing': '1111-Tonzen-Schwung',
        'Aetherochemical Explosive': 'Ätherochemisches Explosivum',
        'Aetherochemical Mine': 'Ätherochemische Mine',
        'Atmospheric Compression': 'Schnittdruck',
        'Atmospheric Displacement': 'Schnitttest',
        'Damage Up': 'Schaden +',
        'Disorienting Groan': 'Kampfgebrüll',
        'Double Sever': 'Zweifachabtrennung',
        'Feast': 'Festmahl',
        'Rapid Sever': 'Radikale Abtrennung',
        'Sanctification': 'Sanktifikation',
        'The Educator': 'Zuchtmeister',
        'Unholy': 'Unheilig',
        'Zoom In': 'Heranholen',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Clockwork Alarum': 'Alarum mécanique',
        'Exhibit level III': 'secteur d\'exposition III',
        'Minotaur': 'Minotaure',
        'Phantom Ray': 'Rayon fantomatique',
        'Repository Node': 'Sphère de dépôt',
        'The Curator': 'Conservateur',
        'The high-level incubation bay': 'la Chambre d\'incubation chimérique',
        'The reality augmentation bay': 'la Salle de distorsion de la réalité',
      },
      'replaceText': {
        '\\?': ' ?',
        '(?<!1)111-Tonze Swing': 'Swing de 111 tonz',
        '10-Tonze Slash': 'Taillade de 10 tonz',
        '11-Tonze Swipe': 'Fauche de 11 tonz',
        '1111-Tonze Swing': 'Swing de 1111 tonz',
        'Aetherochemical Explosive': 'Bombe magismologique',
        'Aetherochemical Mine': 'Mine magismologique',
        'Atmospheric Compression': 'Écrasement',
        'Atmospheric Displacement': 'Moulinet infernal',
        'Damage Up': 'Bonus de dégats',
        'Disorienting Groan': 'Cri désorientant',
        'Double Sever': 'Double tranchage',
        'Feast': 'Festin',
        'Rapid Sever': 'Tranchage rapide',
        'Sanctification': 'Sanctification',
        'The Educator': 'Disciplinaire',
        'Unholy': 'Sombre miracle',
        'Zoom In': 'Charge',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Clockwork Alarum': 'アラガンワーク・アラーム',
        'Exhibit level III': '第III展示区',
        'Minotaur': 'ミノタウロス',
        'Phantom Ray': 'ファントムレイ',
        'Repository Node': '収蔵システム',
        'The Curator': 'キュレーター',
        'The high-level incubation bay': '特級キメラ培養室',
        'The reality augmentation bay': '現実拡張室',
      },
      'replaceText': {
        '(?<!1)111-Tonze Swing': '111トンズ・スイング',
        '10-Tonze Slash': '10トンズ・スラッシュ',
        '11-Tonze Swipe': '11トンズ・スワイプ',
        '1111-Tonze Swing': '1111トンズ・スイング',
        'Aetherochemical Explosive': '魔科学爆弾',
        'Aetherochemical Mine': '魔科学地雷',
        'Atmospheric Compression': '剣圧',
        'Atmospheric Displacement': '剣風',
        'Damage Up': 'ダメージ上昇',
        'Disorienting Groan': '雄叫び',
        'Double Sever': '多重斬り',
        'Feast': 'フィースト',
        'Rapid Sever': '滅多斬り',
        'Sanctification': '聖別の光',
        'The Educator': 'エデュケーター',
        'Unholy': 'アンホーリー',
        'Zoom In': 'ズームイン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Clockwork Alarum': '发条报警虫',
        'Exhibit level III': '第三展示区',
        'Minotaur': '弥诺陶洛斯',
        'Phantom Ray': '幻影光',
        'Repository Node': '收藏系统',
        'The Curator': '博物总管',
        'The high-level incubation bay': '特级合成兽培养室',
        'The reality augmentation bay': '现实增强室',
      },
      'replaceText': {
        '(?<!1)111-Tonze Swing': '百十一吨回转',
        '10-Tonze Slash': '十吨挥打',
        '11-Tonze Swipe': '十一吨横扫',
        '1111-Tonze Swing': '千百十一吨回转',
        'Aetherochemical Explosive': '魔科学炸弹',
        'Aetherochemical Mine': '魔科学地雷',
        'Atmospheric Compression': '剑压',
        'Atmospheric Displacement': '剑风',
        'Damage Up': '伤害提高',
        'Disorienting Groan': '吼叫',
        'Double Sever': '多重斩击',
        'Feast': '飨宴',
        'Rapid Sever': '急促斩击',
        'Sanctification': '祝圣之光',
        'The Educator': '管教',
        'Unholy': '邪圣',
        'Zoom In': '放大',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Clockwork Alarum': '알라그 태엽경보장치',
        'Exhibit level III': '제III전시구역',
        'Minotaur': '미노타우로스',
        'Phantom Ray': '환영 광선',
        'Repository Node': '소장 시스템',
        'The Curator': '전시 책임자',
        'The high-level incubation bay': '특급 키메라 배양실',
        'The reality augmentation bay': '현실확장실',
      },
      'replaceText': {
        '(?<!1)111-Tonze Swing': '111톤즈 휘두르기',
        '10-Tonze Slash': '10톤즈 베기',
        '11-Tonze Swipe': '11톤즈 후려치기',
        '1111-Tonze Swing': '1111톤즈 휘두르기',
        'Aetherochemical Explosive': '마과학 폭탄',
        'Aetherochemical Mine': '마과학 지뢰',
        'Atmospheric Compression': '검압',
        'Atmospheric Displacement': '칼바람',
        'Damage Up': '주는 피해량 증가',
        'Disorienting Groan': '우렁찬 외침',
        'Double Sever': '다중 베기',
        'Feast': '사육제',
        'Rapid Sever': '마구 베기',
        'Sanctification': '축성의 빛',
        'The Educator': '교육자',
        'Unholy': '부정함',
        'Zoom In': '확대',
      },
    },
  ],
};
