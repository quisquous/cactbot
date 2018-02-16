// O6N - Sigmascape 2.0 Normal
[{
  zoneRegex: /^(Sigmascape \(V2\.0\)|Sigmascape 2\.0)$/,
  timelineFile: 'o6n.txt',
  triggers: [
    {
      id: 'O6N Demonic Shear',
      regex: / 14:282A:Demon Chadarnook starts using Demonic Shear on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Tank Buster on YOU';
        if (data.role == 'healer')
          return 'Buster on ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        if (matches[1] == data.me)
          return 'buster';
      },
    },
    {
      id: 'O6N Meteors',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: 'Drop AOEs Away',
      tts: 'aoes',
    },
  ]
}]
