// O5N - Sigmascape 1.0 Normal
[{
  zoneRegex: /^(Sigmascape \(V1\.0\)|Sigmascape V1\.0)$/,
  timelineFile: 'o5n.txt',
  resetWhenOutOfCombat: false,
  triggers: [
    {
      regex: /04:Removing combatant Phantom Train/,
      run: function(data) {
        data.StopCombat();
      },
    },

    {
      id: 'O5N Doom Strike',
      regex: /14:28A3:Phantom Train starts using Doom Strike on (\y{Name})/,
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
      id: 'O5N Head On',
      regex: /14:28A4:Phantom Train starts using Head On/,
      alertText: 'Go To Back',
      tts: 'run away',
    },
    {
      id: 'O5N Diabolic Headlamp',
      regex: /14:28A6:Phantom Train starts using Diabolic Headlamp/,
      alertText: 'Stack Middle',
      tts: 'stack middle',
    },
    {
      id: 'O5N Diabolic Light',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: 'Light',
      tts: 'light',
    },
    {
      id: 'O5N Diabolic Wind',
      regex: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: 'Wind',
      tts: 'wind',
    },
  ]
}]
