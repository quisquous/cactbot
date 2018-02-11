// O5S - Sigmascape 1.0 Savage
[{
  zoneRegex: /Sigmascape V1\.0 \(Savage\)/,
  timelineFile: 'o5s.txt',
  resetWhenOutOfCombat: false,
  triggers: [
    {
      regex: /04:Removing combatant Phantom Train/,
      run: function(data) {
        data.StopCombat();
      },
    },

    {
      id: 'O5S Doom Strike',
      regex: /14:28B1:Phantom Train starts using Doom Strike on (\y{Name})/,
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
      id: 'O5S Head On',
      regex: /14:28A4:Phantom Train starts using Head On/,
      alertText: 'Go To Back',
      tts: 'run away',
    },
    {
      id: 'O5S Diabolic Headlamp',
      regex: /14:28B2:Phantom Train starts using Diabolic Headlamp/,
      alertText: 'Stack Middle',
      tts: 'stack middle',
    },
    {
      id: 'O5S Diabolic Light',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: 'Light',
      tts: 'light',
    },
    {
      id: 'O5S Diabolic Wind',
      regex: /1B:........:(\y{Name}):....:....:0046:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: 'Wind',
      tts: 'wind',
    },
    {
      id: 'O5S Remorse',
      regex: /Added new combatant Remorse/,
      infoText: 'Knockback Ghost',
      tts: 'knockback ghost',
    },
  ]
}]
