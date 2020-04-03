'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm$/,
    ko: /^희망의 낙원 에덴: 공명편 \(3\)$/,
  },
  timelineFile: 'e7n.txt',
  triggers: [
    {
      id: 'E7N Empty Wave',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C52', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Götzenbild Der Dunkelheit', id: '4C52', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C52', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ダークアイドル', id: '4C52', capture: false }),
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank' || data.CanAddle();
      },
      response: Responses.aoe(),
    },
    {
      id: 'E7N Unshadowed Stake',
      regex: Regexes.tether({ source: 'The Idol Of Darkness', id: '0025' }),
      regexDe: Regexes.tether({ source: 'Götzenbild Der Dunkelheit', id: '0025' }),
      regexFr: Regexes.tether({ source: 'Idole Des Ténèbres', id: '0025' }),
      regexJa: Regexes.tether({ source: 'ダークアイドル', id: '0025' }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E7N Left With Thee',
      regex: Regexes.gainsEffect({ effect: 'Left With Thee' }),
      regexDe: Regexes.gainsEffect({ effect: 'Deportation: Links' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Gauche' }),
      regexJa: Regexes.gainsEffect({ effect: '強制転移：左' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Left',
        de: 'Nach Links teleportieren',
        fr: 'Téléportation à gauche',
        ko: '왼쪽으로 순간이동',
      },
    },
    {
      id: 'E7N Right With Thee',
      regex: Regexes.gainsEffect({ effect: 'Right With Thee' }),
      regexDe: Regexes.gainsEffect({ effect: 'Deportation: Rechts' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Droite' }),
      regexJa: Regexes.gainsEffect({ effect: '強制転移：右' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Right',
        de: 'Nach Rechts teleportieren',
        fr: 'Téléportation à droite',
        ko: '오른쪽으로 순간이동',
      },
    },
    {
      id: 'E7N Forward With Thee',
      regex: Regexes.gainsEffect({ effect: 'Forward With Thee' }),
      regexDe: Regexes.gainsEffect({ effect: 'Deportation: Vorne' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Avant' }),
      regexJa: Regexes.gainsEffect({ effect: '強制転移：前' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Forward',
        de: 'Teleportation Vorwärts',
        fr: 'Téléportation devant',
        ko: '앞으로 순간이동',
        cn: '向前传送',
      },
    },
    {
      id: 'E7N Back With Thee',
      regex: Regexes.gainsEffect({ effect: 'Back With Thee' }),
      regexDe: Regexes.gainsEffect({ effect: 'Deportation: Hinten' }),
      regexFr: Regexes.gainsEffect({ effect: 'Translation Arrière' }),
      regexJa: Regexes.gainsEffect({ effect: '強制転移：後' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Teleporting Back',
        de: 'Teleportation Rückwärts',
        fr: 'Téléportation derrière',
        ko: '뒤로 순간이동',
        cn: '向后传送',
      },
    },
    {
      id: 'E7N Strength In Numbers Donut',
      regex: Regexes.startsUsing({ source: 'Idolatry', id: '4C4C', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Idolatrie', id: '4C4C', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Vol D\'Idolâtries Impardonnables', id: '4C4C', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アイドラトリー', id: '4C4C', capture: false }),
      suppressSeconds: 1,
      infoText: {
        en: 'Teleport into donut',
        de: 'In den Donut teleportieren',
        fr: 'Téléportez vous dans le donut',
        ko: '도넛 장판 안으로 순간이동하기',
      },
    },
    {
      // Ordinarily we might not warn on ground AoE markers. However, there are player-dropped
      // markers just before this, so it might be difficult to see.
      id: 'E7N Strength In Numbers Circle',
      regex: Regexes.startsUsing({ source: 'Idolatry', id: '4C4D', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Idolatrie', id: '4C4D', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Vol D\'Idolâtries Impardonnables', id: '4C4D', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'アイドラトリー', id: '4C4D', capture: false }),
      suppressSeconds: 1,
      response: Responses.getOut(),
    },
    {
      // For this and the following trigger, we warn the user only if they
      // will be struck by a color before their debuff expires.
      id: 'E7N Astral Effect',
      regex: Regexes.gainsEffect({ effect: 'Astral Effect' }),
      regexDe: Regexes.gainsEffect({ effect: 'Denaturation Licht' }),
      regexFr: Regexes.gainsEffect({ effect: 'Corruption De Lumière' }),
      regexJa: Regexes.gainsEffect({ effect: '偏属性：光' }),
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
          ko: '어둠 맞기',
        };
      },
    },
    {
      id: 'E7N Umbral Effect',
      regex: Regexes.gainsEffect({ effect: 'Umbral Effect' }),
      regexDe: Regexes.gainsEffect({ effect: 'Denaturation Dunkelheit' }),
      regexFr: Regexes.gainsEffect({ effect: 'Corruption De Ténèbres' }),
      regexJa: Regexes.gainsEffect({ effect: '偏属性：闇' }),
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
          ko: '빛 맞기',
        };
      },
    },
    {
      // Safety in case the user dies during Dark/Light Course.
      id: 'E7N Color Cleanup',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C39', ability: 'Away With Thee', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Götzenbild Der Dunkelheit', id: '4C39', ability: 'Zwangsumwandlung', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Idole Des Ténèbres', id: '4C39', ability: 'Translation Forcée', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ダークアイドル', id: '4C39', ability: '強制転移', capture: false }),
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
        'scuro': 'verdichtetes Licht',
        '(?<! )Idolatry': 'Idolatrie',
        'chiaro': 'verdichtetes Dunkel',
        'blasphemy': 'Blasphemie',
      },
      'replaceText': {
        'Words of Night': 'Kommando: Nächtlicher Angriff',
        'Words of Motion': 'Kommando: Wellen',
        'Unshadowed Stake': 'Dunkler Nagel',
        'Unjoined Aspect': 'Attributswechsel',
        'Stygian Sword': 'Schwarzes Schwert',
        'Stygian Stake': 'Schwarzer Nagel',
        'Strength in Numbers': 'Angriffsmanöver',
        'Silver Sledge': 'Weißer Lichthammer',
        'Silver Shot': 'Weißer Lichtpfeil',
        'Light\'s Course': 'Weißer Strom des Lichts',
        'False Twilight': 'Dämmerungsmanöver',
        'Explosion': 'Explosion',
        'Empty Wave': 'Welle der Leere',
        'Empty Flood': 'Flut der Leere',
        'Dark\'s Course': 'Weißer Strom des Lichts',
        'Boundless Light': 'Weißer Lichtstrom',
        'Boundless Dark': 'Schwarzer Finsterstrom',
        'Black Smoke': 'Schwarzes Feuer',
        'Betwixt Worlds': 'Dimensionsloch',
        'Away with Thee': 'Zwangsumwandlung',
      },
      '~effectNames': {
        'Waymark': 'Ziel des Ansturms',
        'Umbral Effect': 'Denaturation Dunkelheit',
        'Stun': 'Betäubung',
        'Right with Thee': 'Deportation: rechts',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Left with Thee': 'Deportation: links',
        'Astral Effect': 'Denaturation Licht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'unforgiven idolatry': 'Nuée d\'idolâtries impardonnables',
        'the Idol of Darkness': 'Idole des Ténèbres',
        '(?<! )idolatry': 'Vol d\'idolâtries impardonnables',
      },
      'replaceText': {
        'Words of Night': 'Ordre d\'attaque-surprise',
        'Words of Motion': 'Ordre de déferlement',
        'Unshadowed Stake': 'Poinçon clair-obscur',
        'Unjoined Aspect': 'Transition élémentaire',
        'Stygian Stake': 'Poinçon ténébreux',
        'Stygian Sword': 'Épée ténébreuse',
        'Strength in Numbers': 'Murmuration offensive',
        'Silver Sledge': 'Pilon immaculé',
        'Silver Shot': 'Trait immaculé',
        'Light\'s Course': 'Déferlement immaculé',
        'False Twilight': 'Murmuration du crépuscule',
        'Explosion': 'Explosion',
        'Empty Wave': 'Onde de néant',
        'Empty Flood': 'Déluge de néant',
        'Dark\'s Course': 'Déferlement immaculé',
        'Boundless Light': 'Flot immaculé',
        'Boundless Dark': 'Flot ténébreux',
        'Black Smoke': 'Brûlure ténébreuse',
        'Betwixt Worlds': 'Brèche dimensionnelle',
        'Away with Thee': 'Translation forcée',
      },
      '~effectNames': {
        'Waymark': 'Cible d\'une ruée',
        'Umbral Effect': 'Corruption de Ténèbres',
        'Stun': 'Étourdissement',
        'Right with Thee': 'Translation droite',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Left with Thee': 'Translation gauche',
        'Astral Effect': 'Corruption de Lumière',
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
        'Unknown Ability': 'Unknown Ability',
        'Unjoined Aspect': '属性変動',
        'Stygian Sword': '黒闇の剣',
        'Stygian Stake': '黒闇の釘',
        'Strength in Numbers': '攻撃機動',
        'Silver Sledge': '白光の槌',
        'Silver Shot': '白光の矢',
        'Light\'s Course': '白光の奔流',
        'False Twilight': '薄暮の機動',
        'Explosion': '爆散',
        'Empty Wave': '虚無の波動',
        'Empty Flood': '虚無の氾濫',
        'Dark\'s Course': '白光の奔流',
        'Boundless Light': '白光の激流',
        'Boundless Dark': '黒闇の激流',
        'Black Smoke': '黒闇の火',
        'Betwixt Worlds': '次元孔',
        'Away with Thee': '強制転移',
      },
      '~effectNames': {
        'Waymark': '突進標的',
        'Umbral Effect': '偏属性：闇',
        'Stun': 'スタン',
        'Right with Thee': '強制転移：右',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Left with Thee': '強制転移：左',
        'Astral Effect': '偏属性：光',
      },
    },
  ],
}];
