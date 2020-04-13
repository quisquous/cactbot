'use strict';

// Frontlines: Shatter
[{
  zoneRegex: {
    en: /^The Fields Of Glory \(Shatter\)$/,
    cn: /^荣誉野（碎冰战）$/,
  },
  triggers: [
    {
      id: 'Shatter Big Ice Center',
      regex: Regexes.gameLog({ line: 'The icebound tomelith A1 activates and begins to emit heat', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Vereister Echolith A1 activates and begins to emit heat', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Mémolithe Congelé A1 activates and begins to emit heat', capture: false }),
      alertText: {
        en: 'Big Ice: Center',
        de: 'Grosses Eis: Mitte',
        fr: 'Grosse Glace : Milieu',
        cn: '大冰: 中央',
      },
    },
    {
      id: 'Shatter Big Ice North',
      regex: Regexes.gameLog({ line: 'The icebound tomelith A2 activates and begins to emit heat', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Vereister Echolith A2 activates and begins to emit heat', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Mémolithe Congelé A2 activates and begins to emit heat', capture: false }),
      alertText: {
        en: 'Big Ice: North',
        de: 'Grosses Eis: Norden',
        fr: 'Grosse Glace : Nord',
        cn: '大冰: 北方',
      },
    },
    {
      id: 'Shatter Big Ice Southeast',
      regex: Regexes.gameLog({ line: 'The icebound tomelith A3 activates and begins to emit heat', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Vereister Echolith A3 activates and begins to emit heat', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Mémolithe Congelé A3 activates and begins to emit heat', capture: false }),
      alertText: {
        en: 'Big Ice: Southeast',
        de: 'Grosses Eis: Süden',
        fr: 'Grosse Glace : Sud-Est',
        cn: '大冰: 东南',
      },
    },
    {
      id: 'Shatter Big Ice Southwest',
      regex: Regexes.gameLog({ line: 'The icebound tomelith A4 activates and begins to emit heat', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Vereister Echolith A4 activates and begins to emit heat', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Mémolithe Congelé A4 activates and begins to emit heat', capture: false }),
      alertText: {
        en: 'Big Ice: Southwest',
        de: 'Grosses Eis: Südwesten',
        fr: 'Grosse Glace : Sud-Ouest',
        cn: '大冰: 西南',
      },
    },
  ],
}];
