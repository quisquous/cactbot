'use strict';

// Frontlines: Shatter
[{
  zoneId: ZoneId.TheFieldsOfGloryShatter,
  triggers: [
    {
      id: 'Shatter Big Ice Center',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A1 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A1 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A1 e et la glace s\'est fragilisée.*?', capture: false }),
      alertText: {
        en: 'Big Ice: Center',
        de: 'Grosses Eis: Mitte',
        fr: 'Grosse Glace : Milieu',
        cn: '大冰: 中央',
      },
    },
    {
      id: 'Shatter Big Ice North',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A2 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A2 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A2 e et la glace s\'est fragilisée.*?', capture: false }),
      alertText: {
        en: 'Big Ice: North',
        de: 'Grosses Eis: Norden',
        fr: 'Grosse Glace : Nord',
        cn: '大冰: 北方',
      },
    },
    {
      id: 'Shatter Big Ice Southeast',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A3 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A3 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A3 e et la glace s\'est fragilisée.*?', capture: false }),
      alertText: {
        en: 'Big Ice: Southeast',
        de: 'Grosses Eis: Süden',
        fr: 'Grosse Glace : Sud-Est',
        cn: '大冰: 东南',
      },
    },
    {
      id: 'Shatter Big Ice Southwest',
      netRegex: NetRegexes.gameLog({ line: 'The icebound tomelith A4 activates and begins to emit heat.*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Vereister Echolith A4 setzt sich in Betrieb und das Eis beginnt zu bröckeln.*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Mémolithe Congelé A4 e et la glace s\'est fragilisée.*?', capture: false }),
      alertText: {
        en: 'Big Ice: Southwest',
        de: 'Grosses Eis: Südwesten',
        fr: 'Grosse Glace : Sud-Ouest',
        cn: '大冰: 西南',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The icebound tomelith A1 activates and begins to emit heat': 'Vereister Echolith A1 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
        'The icebound tomelith A2 activates and begins to emit heat': 'Vereister Echolith A2 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
        'The icebound tomelith A3 activates and begins to emit heat': 'Vereister Echolith A3 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
        'The icebound tomelith A4 activates and begins to emit heat': 'Vereister Echolith A4 setzt sich in Betrieb und das Eis beginnt zu bröckeln',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The icebound tomelith A1 activates and begins to emit heat': 'Mémolithe Congelé A1 e et la glace s\'est fragilisée',
        'The icebound tomelith A2 activates and begins to emit heat': 'Mémolithe Congelé A2 e et la glace s\'est fragilisée',
        'The icebound tomelith A3 activates and begins to emit heat': 'Mémolithe Congelé A3 e et la glace s\'est fragilisée',
        'The icebound tomelith A4 activates and begins to emit heat': 'Mémolithe Congelé A4 e et la glace s\'est fragilisée',
      },
    },
  ],
}];
