'use strict';

[{
  zoneRegex: {
    en: /^Malikah's Well$/,
    cn: /^避暑离宫马利卡大井$/,
    ko: /^말리카 큰우물$/,
  },
  zoneId: ZoneId.MalikahsWell,
  timelineFile: 'malikahs_well.txt',
  triggers: [
    {
      id: 'Malikah Stone Flail',
      netRegex: NetRegexes.startsUsing({ id: '3CE5', source: 'Greater Armadillo' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3CE5', source: 'Riesengürteltier' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3CE5', source: 'Grand Tatou' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3CE5', source: 'グレーター・アルマジロ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3CE5', source: '大犰狳' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3CE5', source: '거대 아르마딜로' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Malikah Head Toss Stack',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    {
      id: 'Malikah Right Round',
      netRegex: NetRegexes.startsUsing({ id: '3CE7', source: 'Greater Armadillo', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3CE7', source: 'Riesengürteltier', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3CE7', source: 'Grand Tatou', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3CE7', source: 'グレーター・アルマジロ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3CE7', source: '大犰狳', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3CE7', source: '거대 아르마딜로', capture: false }),
      infoText: {
        en: 'Melee Knockback',
        de: 'Nahkämpfer Rückstoß',
        fr: 'Poussée au CaC',
        cn: '近战击退',
        ko: '근거리 넉백',
      },
    },
    {
      id: 'Malikah Deep Draught',
      netRegex: NetRegexes.startsUsing({ id: '4188', source: 'Pack Armadillo' }),
      netRegexDe: NetRegexes.startsUsing({ id: '4188', source: 'Rudel-Gürteltier' }),
      netRegexFr: NetRegexes.startsUsing({ id: '4188', source: 'Tatou Grégaire' }),
      netRegexJa: NetRegexes.startsUsing({ id: '4188', source: 'パック・アルマジロ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '4188', source: '群落犰狳' }),
      netRegexKo: NetRegexes.startsUsing({ id: '4188', source: '무리 아르마딜로' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt('info'),
    },
    {
      id: 'Malikah Efface',
      netRegex: NetRegexes.startsUsing({ id: '3CEB', source: 'Amphibious Talos' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3CEB', source: 'Wasserträger-Talos' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3CEB', source: 'Talos Amphibie' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3CEB', source: 'ハイドロタロース' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3CEB', source: '水陆两用塔罗斯' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3CEB', source: '수력 탈로스' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Malikah High Pressure',
      netRegex: NetRegexes.startsUsing({ id: '3CEC', source: 'Amphibious Talos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3CEC', source: 'Wasserträger-Talos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3CEC', source: 'Talos Amphibie', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3CEC', source: 'ハイドロタロース', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3CEC', source: '水陆两用塔罗斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3CEC', source: '수력 탈로스', capture: false }),
      response: Responses.knockback('info'),
    },
    {
      id: 'Malikah Swift Spill',
      netRegex: NetRegexes.startsUsing({ id: '3CEF', source: 'Amphibious Talos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3CEF', source: 'Wasserträger-Talos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3CEF', source: 'Talos Amphibie', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3CEF', source: 'ハイドロタロース', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3CEF', source: '水陆两用塔罗斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3CEF', source: '수력 탈로스', capture: false }),
      response: Responses.getBehind('info'),
    },
    {
      id: 'Malikah Intestinal Crank',
      netRegex: NetRegexes.startsUsing({ id: '3CF1', source: 'Storge', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3CF1', source: 'Storge', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3CF1', source: 'Storgê', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3CF1', source: 'ストルゲー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3CF1', source: '斯托尔戈', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3CF1', source: '스토르게', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Terminus': 'Drehscheibe',
        'Malikah\'s Gift': 'Malikahs Quelle',
        'Unquestioned Acceptance': 'Residenz der Großherzigkeit',
        'Greater Armadillo': 'Riesengürteltier',
        'Amphibious Talos': 'Wasserträger-Talos',
        'Storge': 'Storge',
        'Rhapsodic Nail': 'Keil der Liebe',
      },
      'replaceText': {
        'Stone Flail': 'Steindresche',
        'Head Toss': 'Kopfwurf',
        'Right Round': 'Rotation',
        'Flail Smash': 'Dresche',
        'Earthshake': 'Bodenbeber',
        'Efface': 'Zerstören',
        'Wellbore': 'Brunnenbohrer',
        'Geyser Eruption': 'Geysir',
        'High Pressure': 'Überdruck',
        'Swift Spill': 'Schneller Abfluss',
        'Intestinal Crank': 'Geweiderupfer',
        'Heretic\'s Fork': 'Ketzerspieß',
        'Breaking Wheel': 'Radbruch',
        'Crystal Nail': 'Kristallnagel',
        'Censure': 'Tadel',
        'Armadillo': 'Armadillo',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Amphibious Talos': 'Talos Amphibie',
        'Greater Armadillo': 'Grand Tatou',
        'Malikah\'s Gift': 'le Source de Malikah',
        'Rhapsodic Nail': 'Pieu Rhapsodique',
        'Storge': 'Storgê',
        'Terminus': 'cimetière de chariots',
        'Unquestioned Acceptance': 'l\'aven oublié',
      },
      'replaceText': {
        '\\?': ' ?',
        'Breaking Wheel': 'Roue de la torture',
        'Censure': 'Blâme',
        'Crystal Nail': 'Clou de cristal',
        'Earthshake': 'Vacillation',
        'Efface': 'Désintégration',
        'Flail Smash': 'Fléau fracassant',
        'Geyser Eruption': 'Geyser aqueux',
        'Head Toss': 'Tournis',
        'Heretic\'s Fork': 'Fourche de l\'hérétique',
        'High Pressure': 'Haute pression',
        'Intestinal Crank': 'Manivelle intestinale',
        'Pack Armadillo': 'Tatou grégaire',
        'Right Round': 'Grande culbute',
        'Stone Flail': 'Fléau rocheux',
        'Swift Spill': 'Déversement',
        'Wellbore': 'Forage profond',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Terminus': '광차 종점',
        'Malikah\'s Gift': '말리카의 수원',
        'Unquestioned Acceptance': '시민 별장',
        'Greater Armadillo': '거대 아르마딜로',
        'Amphibious Talos': '수력 탈로스',
        'Storge': '스토르게',
        'Rhapsodic Nail': '사랑의 말뚝',
      },
      'replaceText': {
        'Stone Flail': '바위 타작',
        'Head Toss': '머리 겨냥',
        'Right Round': '대회전',
        'Flail Smash': '타작 충돌',
        'Earthshake': '지반 진동',
        'Efface': '파괴',
        'Wellbore': '우물 파기',
        'Geyser Eruption': '간헐천',
        'High Pressure': '고압',
        'Swift Spill': '강제 급수',
        'Intestinal Crank': '창자 비틀기',
        'Heretic\'s Fork': '이단자의 창',
        'Breaking Wheel': '파괴의 바퀴',
        'Crystal Nail': '말뚝박기',
        'Censure': '집행',
        '2x Pack Armadillo': '쫄 2마리 소환',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Terminus': '轨道车站',
        'Malikah\'s Gift': '马利卡水源',
        'Unquestioned Acceptance': '无偿离宫',
        'Greater Armadillo': '大犰狳',
        'Amphibious Talos': '水陆两用塔罗斯',
        'Storge': '斯托尔戈',
        'Rhapsodic Nail': '爱之桩柱',
      },
      'replaceText': {
        'Stone Flail': '落石重锤',
        'Head Toss': '甩尾锤',
        'Right Round': '大回旋',
        'Flail Smash': '重锤碎击',
        'Earthshake': '地盘震动',
        'Efface': '抹灭',
        'Wellbore': '钻井',
        'Geyser Eruption': '井水喷出',
        'High Pressure': '高压',
        'Swift Spill': '强制放水',
        'Intestinal Crank': '绞肠',
        'Heretic\'s Fork': '异端十字叉',
        'Breaking Wheel': '碎轮',
        'Crystal Nail': '打桩',
        'Censure': '执行',
        'Armadillo': '犰狳',
        'Pack': '',
      },
    },
  ],
}];
