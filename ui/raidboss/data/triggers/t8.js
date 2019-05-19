'use strict';

[{
  zoneRegex: /The Second Coil Of Bahamut - Turn \(3\)/,
  triggers: [
    {
      id: 'T8 Stack',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0011:/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Laser on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T8 Landmine Start',
      regex: / 00:0839:Landmines have been scattered/,
      alertText: {
        en: 'Explode Landmines',
      },
      run: function(data) {
        data.landmines = {};
      },
    },
    {
      id: 'T8 Landmine Explosion',
      regex: / 1[56]:(\y{ObjectId}):Allagan Mine:7D1:Triggered Landmine:/,
      infoText: function(data, matches) {
        if (matches[1] in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1) + ' / 3';
      },
      tts: function(data, matches) {
        if (matches[1] in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1);
      },
      run: function(data, matches) {
        data.landmines[matches[1]] = true;
      },
    },
  ],
}];
