// O7N - Sigmascape 3.0 Normal
[{
  zoneRegex: /^(Sigmascape \(V3\.0\)|Sigmascape V3\.0)$/,
  timelineFile: 'o7n.txt',
  triggers: [
    {
      id: 'O7N Magitek Ray',
      regex: / 14:276B:Guardian starts using Magitek Ray/,
      alertText: 'Magitek Ray',
      tts: 'beam',
    },
    {
      id: 'O7N Arm And Hammer',
      regex: / 14:276C:Guardian starts using Arm And Hammer on (\y{Name})/,
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
      id: 'O7N Shockwave',
      regex: / 14:2766:Guardian starts using Shockwave/,
      alertText: 'Knockback',
      tts: 'knockback',
    },
    {
      id: 'O7N Diffractive Laser',
      regex: / 14:2761:Guardian starts using Diffractive Laser/,
      alertText: 'Get Out',
      tts: 'out',
    },
    {
      id: 'O7N Prey',
      regex: /1B:........:(\y{Name}):....:....:001E:0000:0000:0000:/,
      infoText: function(data, matches) {
        if (data.me == matches[1])
          return 'Prey on YOU';
        return 'Prey on ' + data.ShortName(matches[1]);
      },
      tts: function (data, matches) {
        if (data.me == matches[1])
          return 'prey';
      },
    },
  ]
}]
