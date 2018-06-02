// Frontlines: Shatter
[{
  zoneRegex: /^The Fields Of Glory \(Shatter\)$/,
  triggers: [
    {
      id: 'Big Ice',
      regex: /The icebound tomelith A([1-4]) activates and begins to emit heat/,
      regexDe: /Vereister Echolith A([1-4]) activates and begins to emit heat/,
      alertText: function(data, matches) {
        var big_ice_dir = {
          '1': 'Center',
          '2': 'North',
          '3': 'Southeast',
          '4': 'Southwest',
        };

        if (!(matches[1] in big_ice_dir)) {
          return '';
        }
        return {
          en: 'Big Ice: ' + big_ice_dir[matches[1]],
          de: 'Grosses Eis: ' + big_ice_dir[matches[1]],
        };
      },
      tts: function(data, matches) {
        // TODO: figure out how to not duplicate this? or store func in data?
        var big_ice_dir = {
          '1': 'Center',
          '2': 'North',
          '3': 'Southeast',
          '4': 'Southwest',
        };

        if (!(matches[1] in big_ice_dir)) {
          return '';
        }
        return {
          en: big_ice_dir[matches[1]] + ' big ice',
          de: big_ice_dir[matches[1]] + ' großes Eis',
        };
      },
    },
  ],
}]
