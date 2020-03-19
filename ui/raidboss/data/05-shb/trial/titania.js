'use strict';

// Titania Normal Mode
[{
  zoneRegex: {
    en: /^The Dancing Plague$/,
    cn: /^缇坦妮雅歼灭战$/,
  },
  timelineFile: 'titania.txt',
  triggers: [
    {
      id: 'Titania Bright Sabbath',
      regex: Regexes.startsUsing({ id: '3D5C', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D5C', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D5C', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D5C', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D5C', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D5C', source: '티타니아', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Titania Phantom Out',
      regex: Regexes.startsUsing({ id: '3D5D', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D5D', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D5D', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D5D', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D5D', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D5D', source: '티타니아', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Titania Phantom In',
      regex: Regexes.startsUsing({ id: '3D5E', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D5E', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D5E', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D5E', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D5E', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D5E', source: '티타니아', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Titania Mist Failure',
      regex: Regexes.addedCombatant({ name: 'Spirit Of Dew', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Wasserfee', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Esprit Des Rosées', capture: false }),
      regexJa: Regexes.addedCombatant({ name: '水の精', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '水精', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '물의 정령', capture: false }),
      response: Responses.killExtraAdd(),
    },
    {
      id: 'Titania Mist',
      regex: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D45', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D45', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D45', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D45', source: '티타니아', capture: false }),
      infoText: {
        en: 'Water Positions',
        de: 'Wasser Positionen',
        fr: 'Position pour l\'eau',
        cn: '水毒',
      },
    },
    {
      id: 'Titania Flame',
      regex: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D47', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D47', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D47', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D47', source: '티타니아', capture: false }),
      delaySeconds: 6,
      alertText: {
        en: 'Stack In Puddles',
        de: 'In einer Fläche sammeln',
        fr: 'Packez-vous',
        cn: '水圈集合',
      },
    },
    {
      id: 'Titania Divination',
      regex: Regexes.startsUsing({ id: '3D5B', source: 'Titania' }),
      regexDe: Regexes.startsUsing({ id: '3D5B', source: 'Titania' }),
      regexFr: Regexes.startsUsing({ id: '3D5B', source: 'Titania' }),
      regexJa: Regexes.startsUsing({ id: '3D5B', source: 'ティターニア' }),
      regexCn: Regexes.startsUsing({ id: '3D5B', source: '缇坦妮雅' }),
      regexKo: Regexes.startsUsing({ id: '3D5B', source: '티타니아' }),
      response: Responses.tankCleave(),
    },
    {
      id: 'Titania Frost Rune 1',
      regex: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2A', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2A', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2A', source: '티타니아', capture: false }),
      infoText: {
        en: 'Get Middle, Shiva Circles',
        de: 'In die Mitte, Shiva Kreise',
        fr: 'Allez au milieu, comme sur Shiva',
        ja: 'シヴァの輪っか',
        cn: '中间集合, 九连环',
        ko: '시바 얼음 장판',
      },
    },
    {
      id: 'Titania Frost Rune 2',
      regex: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2A', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2A', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2A', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2A', source: '티타니아', capture: false }),
      delaySeconds: 6.5,
      response: Responses.getOut('info'),
    },
    {
      id: 'Titania Frost Rune 3',
      regex: Regexes.ability({ id: '3D4E', source: 'Titania', capture: false }),
      regexDe: Regexes.ability({ id: '3D4E', source: 'Titania', capture: false }),
      regexFr: Regexes.ability({ id: '3D4E', source: 'Titania', capture: false }),
      regexJa: Regexes.ability({ id: '3D4E', source: 'ティターニア', capture: false }),
      regexCn: Regexes.ability({ id: '3D4E', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.ability({ id: '3D4E', source: '티타니아', capture: false }),
      suppressSeconds: 60,
      response: Responses.getIn('info'),
    },
    {
      id: 'Titania Growth Rune',
      regex: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D2E', source: 'Titania', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D2E', source: 'ティターニア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D2E', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D2E', source: '티타니아', capture: false }),
      infoText: {
        en: 'Avoid Roots',
        de: 'Ranken vermeiden',
        fr: 'Racines',
        cn: '躲避树根',
      },
    },
    {
      id: 'Titania Uplift Markers',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'Titania Peasebomb Markers',
      regex: Regexes.headMarker({ id: '00BD' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      response: Responses.spread(),
    },
    {
      id: 'Titania Pucks Breath Markers',
      regex: Regexes.headMarker({ id: '00A1' }),
      response: Responses.stackOn(),
    },
    {
      id: 'Titania Knockback',
      regex: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexDe: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexFr: Regexes.ability({ id: '3D42', source: 'Puck', capture: false }),
      regexJa: Regexes.ability({ id: '3D42', source: 'パック', capture: false }),
      regexCn: Regexes.ability({ id: '3D42', source: '帕克', capture: false }),
      regexKo: Regexes.ability({ id: '3D42', source: '요정의 권속', capture: false }),
      alertText: {
        en: 'Diagonal Knockback Soon',
        de: 'diagonaler Knockback bald',
        fr: 'Poussée en diagonale bientôt',
        ja: '対角に飛ぶ',
        cn: '对角击退准备',
        ko: '곧 대각선 넉백',
      },
    },
    {
      id: 'Titania Mini Add Phase',
      regex: Regexes.ability({ id: '3D31', source: 'Titania', capture: false }),
      regexDe: Regexes.ability({ id: '3D31', source: 'Titania', capture: false }),
      regexFr: Regexes.ability({ id: '3D31', source: 'Titania', capture: false }),
      regexJa: Regexes.ability({ id: '3D31', source: 'ティターニア', capture: false }),
      regexCn: Regexes.ability({ id: '3D31', source: '缇坦妮雅', capture: false }),
      regexKo: Regexes.ability({ id: '3D31', source: '티타니아', capture: false }),
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Group Adds East (on Mustardseed)',
            de: 'Adds im Osten sammeln (bei Senfsamen)',
            cn: '东边小怪 (芥子)',
          };
        }
        return {
          en: 'Kill Mustardseed (East)',
          de: 'Senfsamen angreifen (Osten)',
          cn: '击杀芥子 (东)',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Titania': 'Titania',
        'Puck': 'Puck',
        'Spirit of Flame': 'Feuerfee',
        'Peaseblossom': 'Bohnenblüte',
        'Mustardseed': 'Senfsamen',
      },
      'replaceText': {
        'Being Mortal': 'Sterblichkeit',
        'Bright Sabbath': 'Leuchtender Sabbat',
        'Divination Rune': 'Prophezeiungsrune',
        'Flame Hammer': 'Flammenhammer',
        'Flame Rune': 'Flammenrune',
        'Frost Rune(?! )': 'Frostrune',
        'Frost Rune Middle': 'Frostrune Mitte',
        'Gentle Breeze': 'Sanfte Brise',
        'Growth Rune': 'Wachstumsrune',
        'Hard Swipe': 'Harter Hieb',
        'Leafstorm': 'Blättersturm',
        'Love-In-Idleness': 'Liebevoller Müßiggang',
        'Midsummer Night\'s Dream': 'Mittsommernachtstraum',
        'Mist Rune': 'Nebelrune',
        '(?<! )Pease(?!\\w)': 'Bohne',
        'Peasebomb': 'Bohnenbombe',
        'Phantom Rune': 'Phantomrune',
        'Puck\'s Breath': 'Pucks Atem',
        'Puck\'s Caprice': 'Pucks Laune',
        'Puck\'s Rebuke': 'Pucks Tadel',
        'Pummel': 'Deftige Dachtel',
        'Uplift': 'Feenring',
        'War And Pease': 'Böhnchen und Tönchen',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Titania': '缇坦妮雅',
        'Puck': '帕克',
        'Spirit of Flame': '炎精',
        'Peaseblossom': '豌豆花',
        'Mustardseed': '芥子',
      },
      'replaceText': {
        'Being Mortal': '终有一死',
        'Bright Sabbath': '欢快的安息日',
        'Divination Rune': '魔之符文',
        'Flame Hammer': '烈火锤',
        'Flame Rune': '火之符文',
        'Frost Rune(?! )': '冰之符文(?! )',
        'Frost Rune Middle': '冰之符文 中间',
        'Gentle Breeze': '青翠柔风',
        'Growth Rune': '根之符文',
        'Hard Swipe': '强烈重击',
        'Leafstorm': '绿叶风暴',
        'Love-In-Idleness': '爱懒花',
        'Midsummer Night\'s Dream': '仲夏夜之梦',
        'Mist Rune': '水之符文',
        '(?<! )Pease(?!\\w)': '(?<! )爆炸(?!\\w)',
        'Peasebomb': '豌豆炸弹',
        'Phantom Rune': '幻之符文',
        'Puck\'s Breath': '帕克的吐息',
        'Puck\'s Caprice': '帕克的随想',
        'Puck\'s Rebuke': '帕克的指责',
        'Pummel': '殴打',
        'Uplift': '隆起',
        'War And Pease': '豌豆大爆炸',
      },
      '~effectNames': {},
    },
  ],
}];
