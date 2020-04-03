'use strict';

// Frontlines: Shatter
[{
  zoneRegex: {
    en: /^The Fields Of Glory \(Shatter\)$/,
    cn: /^荣誉野（碎冰战）$/,
  },
  triggers: [
    {
      id: 'Shatter Big Ice',
      regex: /The icebound tomelith A([1-4]) activates and begins to emit heat/,
      regexDe: /Vereister Echolith A([1-4]) activates and begins to emit heat/,
      regexFr: /Mémolithe Congelé A([1-4]) activates and begins to emit heat/,
      preRun: function(data, matches) {
        data.iceDir = undefined;
        let ice_lang = {
          en: {
            '1': 'Center',
            '2': 'North',
            '3': 'Southeast',
            '4': 'Southwest',
          },
          de: {
            '1': 'Mitte',
            '2': 'Norden',
            '3': 'Süden',
            '4': 'Südwesten',
          },
          fr: {
            '1': 'Milieu',
            '2': 'Nord',
            '3': 'Sud-Est',
            '4': 'Sud-Ouest',
          },
          cn: {
            '1': '中央大冰',
            '2': '北方大冰',
            '3': '东南大冰',
            '4': '西南大冰',
            },
        };

        let big_ice_dir = ice_lang['en'];
        if (data.lang in ice_lang)
          big_ice_dir = ice_lang[data.lang];

        if (!(matches[1] in big_ice_dir))
          return;

        data.iceDir = {
          en: 'Big Ice: ' + big_ice_dir[matches[1]],
          de: 'Grosses Eis: ' + big_ice_dir[matches[1]],
          fr: 'Grosse Glace :' + big_ice_dir[matches[1]],
        };
      },
      alertText: function(data) {
        return data.iceDir;
      },
    },
  ],
}];
