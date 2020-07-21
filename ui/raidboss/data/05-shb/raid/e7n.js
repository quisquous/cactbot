'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm$/,
    cn: /^伊甸希望乐园 \(共鸣之章3\)$/,
    ko: /^희망의 낙원 에덴: 공명편 \(3\)$/,
  },
  zoneId: ZoneId.EdensVerseIconoclasm,
  timelineFile: 'e7n.txt',
  triggers: [
    {
      id: 'E7N Empty Wave',
      netRegex: NetRegexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C52', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Götzenbild Der Dunkelheit', id: '4C52', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C52', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダークアイドル', id: '4C52', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '暗黑心象', id: '4C52', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'E7N Unshadowed Stake',
      netRegex: NetRegexes.tether({ source: 'The Idol Of Darkness', id: '0025' }),
      netRegexDe: NetRegexes.tether({ source: 'Götzenbild Der Dunkelheit', id: '0025' }),
      netRegexFr: NetRegexes.tether({ source: 'Idole Des Ténèbres', id: '0025' }),
      netRegexJa: NetRegexes.tether({ source: 'ダークアイドル', id: '0025' }),
      netRegexCn: NetRegexes.tether({ source: '暗黑心象', id: '0025' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E7N Left With Thee',
      netRegex: NetRegexes.gainsEffect({ effectId: '8C2' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Left',
        de: 'Nach Links teleportieren',
        fr: 'Téléportation à gauche',
        cn: '向左传送',
        ko: '왼쪽으로 순간이동',
      },
    },
    {
      id: 'E7N Right With Thee',
      netRegex: NetRegexes.gainsEffect({ effectId: '8C3' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Right',
        de: 'Nach Rechts teleportieren',
        fr: 'Téléportation à droite',
        cn: '向右传送',
        ko: '오른쪽으로 순간이동',
      },
    },
    {
      id: 'E7N Forward With Thee',
      netRegex: NetRegexes.gainsEffect({ effectId: '8C0' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Forward',
        de: 'Teleportation Vorwärts',
        fr: 'Téléportation devant',
        cn: '向前传送',
        ko: '앞으로 순간이동',
      },
    },
    {
      id: 'E7N Back With Thee',
      netRegex: NetRegexes.gainsEffect({ effectId: '8C1' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Back',
        de: 'Teleportation Rückwärts',
        fr: 'Téléportation derrière',
        cn: '向后传送',
        ko: '뒤로 순간이동',
      },
    },
    {
      id: 'E7N Strength In Numbers Donut',
      netRegex: NetRegexes.startsUsing({ source: 'Idolatry', id: '4C4C', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Idolatrie', id: '4C4C', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Vol D\'Idolâtries Impardonnables', id: '4C4C', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アイドラトリー', id: '4C4C', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '盲崇', id: '4C4C', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Teleport into donut',
        de: 'In den Donut teleportieren',
        fr: 'Téléportez vous dans le donut',
        cn: '传送进月环',
        ko: '도넛 장판 안으로 순간이동하기',
      },
    },
    {
      // Ordinarily we might not warn on ground AoE markers. However, there are player-dropped
      // markers just before this, so it might be difficult to see.
      id: 'E7N Strength In Numbers Circle',
      netRegex: NetRegexes.startsUsing({ source: 'Idolatry', id: '4C4D', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Idolatrie', id: '4C4D', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Vol D\'Idolâtries Impardonnables', id: '4C4D', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'アイドラトリー', id: '4C4D', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '盲崇', id: '4C4D', capture: false }),
      suppressSeconds: 1,
      response: Responses.getOut(),
    },
    {
      // For this and the following trigger, we warn the user only if they
      // will be struck by a color before their debuff expires.
      id: 'E7N Astral Effect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BE' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 3,
      infoText: function(data) {
        data.colorCount = data.colorCount + 1 || 0;
        if (data.colorCount == 3) {
          delete data.colorCount;
          return;
        }
        return {
          en: 'Get hit by dark',
          de: 'Vom Dunklen treffen lassen',
          fr: 'Encaissez le noir',
          cn: '被黑色打',
          ko: '어둠 맞기',
        };
      },
    },
    {
      id: 'E7N Umbral Effect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BF' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 3,
      infoText: function(data) {
        data.colorCount = data.colorCount + 1 || 0;
        if (data.colorCount == 3) {
          delete data.colorCount;
          return;
        }
        return {
          en: 'Get hit by light',
          de: 'Vom Hellen treffen lassen',
          fr: 'Encaissez le blanc',
          cn: '被白色打',
          ko: '빛 맞기',
        };
      },
    },
    {
      // Safety in case the user dies during Dark/Light Course.
      id: 'E7N Away With Thee Color Cleanup',
      netRegex: NetRegexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C39', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Götzenbild Der Dunkelheit', id: '4C39', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C39', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダークアイドル', id: '4C39', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '暗黑心象', id: '4C39', capture: false }),
      run: function(data) {
        delete data.colorCount;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Unforgiven Idolatry': 'ungeläuterte Götzenverehrung',
        'The Idol Of Darkness': 'Götzenbild der Dunkelheit',
        '(?<! )Idolatry': 'Idolatrie',
      },
      'replaceText': {
        'Words of Night': 'Kommando: Nächtlicher Angriff',
        'Words of Motion': 'Kommando: Wellen',
        'Unshadowed Stake': 'Dunkler Nagel',
        'Unjoined Aspect': 'Attributswechsel',
        'Stygian Sword': 'Schwarzes Schwert',
        'Strength in Numbers': 'Angriffsmanöver',
        'Silver Sledge': 'Weißer Lichthammer',
        'Silver Shot': 'Weißer Lichtpfeil',
        'Light\'s Course': 'Weißer Strom des Lichts',
        'False Twilight': 'Dämmerungsmanöver',
        'Explosion': 'Explosion',
        'Empty Wave': 'Welle der Leere',
        'Empty Flood': 'Flut der Leere',
        'Dark\'s Course': 'Weißer Strom des Lichts',
        'Black Smoke': 'Schwarzes Feuer',
        'Betwixt Worlds': 'Dimensionsloch',
        'Away with Thee': 'Zwangsumwandlung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'unforgiven idolatry': 'Nuée D\'idolâtries Impardonnables',
        'the Idol of Darkness': 'Idole des Ténèbres',
        '(?<! )idolatry': 'Vol D\'idolâtries Impardonnables',
      },
      'replaceText': {
        'Words of Night': 'Ordre d\'attaque-surprise',
        'Words of Motion': 'Ordre de déferlement',
        'Unshadowed Stake': 'Poinçon clair-obscur',
        'Unjoined Aspect': 'Transition élémentaire',
        'Stygian Sword': 'Épée ténébreuse',
        'Strength in Numbers': 'Murmuration offensive',
        'Silver Sledge': 'Pilon immaculé',
        'Silver Shot': 'Trait immaculé',
        'Light\'s Course': 'Déferlement immaculé',
        'False Twilight': 'Murmuration du crépuscule',
        'Explosion': 'Explosion',
        'Empty Wave': 'Onde de néant',
        'Empty Flood': 'Déluge de néant',
        'Dark\'s Course': 'Déferlement ténébreux',
        'Black Smoke': 'Brûlure ténébreuse',
        'Betwixt Worlds': 'Brèche dimensionnelle',
        'Away with Thee': 'Translation forcée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'unforgiven idolatry': 'アンフォーギヴン・アイドラトリー',
        'the Idol of Darkness': 'ダークアイドル',
        '(?<! )idolatry': 'アイドラトリー',
      },
      'replaceText': {
        'Words of Night': '夜襲の号令',
        'Words of Motion': '波状の号令',
        'Unshadowed Stake': '闇光の釘',
        'Unjoined Aspect': '属性変動',
        'Stygian Sword': '黒闇の剣',
        'Strength in Numbers': '攻撃機動',
        'Silver Sledge': '白光の槌',
        'Silver Shot': '白光の矢',
        'Light\'s Course': '白光の奔流',
        'False Twilight': '薄暮の機動',
        'Explosion': '爆散',
        'Empty Wave': '虚無の波動',
        'Empty Flood': '虚無の氾濫',
        'Dark\'s Course': '白光の奔流',
        'Black Smoke': '黒闇の火',
        'Betwixt Worlds': '次元孔',
        'Away with Thee': '強制転移',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Idol Of Darkness': '暗黑心象',
        'Unforgiven Idolatry': '未被宽恕的盲崇',
        '(?<! )Idolatry': '盲崇',
      },
      'replaceText': {
        'Empty Wave': '虚无波动',
        'Unshadowed Stake': '暗光钉',
        'Words of Motion': '波状号令',
        'Light\'s Course': '白光奔流',
        'Dark\'s Course': '黑暗奔流',
        'Betwixt Worlds': '次元孔',
        'Away with Thee': '强制传送',
        'False Twilight': '薄暮机动',
        'Stygian Sword': '黑暗之剑',
        'Silver Sledge': '白光之锤',
        'Unjoined Aspect': '属性变动',
        'Words of Night': '夜袭号令',
        'Strength in Numbers': '攻击机动',
        'Silver Shot': '白光之矢',
        'Explosion': '爆炸',
        'Empty Flood': '虚无泛滥',
        'Black Smoke': '黑暗之火',
      },
    },
  ],
}];
