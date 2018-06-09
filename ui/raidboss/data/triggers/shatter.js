'use strict';

// Frontlines: Shatter
[{
  zoneRegex: /^The Fields Of Glory \(Shatter\)$/,
  triggers: [
    {
      id: 'Shatter Big Ice',
      regex: /The icebound tomelith A([1-4]) activates and begins to emit heat/,
      regexDe: /Vereister Echolith A([1-4]) activates and begins to emit heat/,
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
        };

        let big_ice_dir = ice_lang['en'];
        if (data.lang in ice_lang)
          big_ice_dir = ice_lang[data.lang];

        if (!(matches[1] in big_ice_dir))
          return;

        data.iceDir = {
          en: 'Big Ice: ' + big_ice_dir[matches[1]],
          de: 'Grosses Eis: ' + big_ice_dir[matches[1]],
        };
      },
      alertText: function(data) {
        return data.iceDir;
      },
      tts: function(data, matches) {
        return data.iceDir;
      },
    },
  ],
}];
