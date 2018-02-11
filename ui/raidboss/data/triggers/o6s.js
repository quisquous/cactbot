// O6S - Sigmascape 2.0 Savage
[{
  zoneRegex: /Sigmascape V2\.0 \(Savage\)/,
  timelineFile: 'o6s.txt',
  triggers: [
    {
      id: 'O6S Demonic Shear',
      regex: / 14:2829:Demon Chadarnook starts using Demonic Shear on (\y{Name})/,
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
      id: 'O6S Storms Grip',
      regex: /Added new combatant The Storm's Grip/,
      condition: function(data) { return data.role == 'tank'; },
      infoText: 'Hallowed Wind Stack',
      tts: 'hallowed wind stack',
    },
    {
      id: 'O6S Demonic Stone',
      regex: /1B:........:(\y{Name}):....:....:0001:0000:0000:0000:/,
      alarmText: function(data,matches) {
        if (data.me == matches[1]) 
          return 'Demonic Stone on YOU';
      },
    },
    {
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      run: function(data, matches) { data.lastKiss = matches[1]; },
    },
    {
      id: 'O6S Last Kiss Marker',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: 'Last Kiss on YOU',
      tts: 'last kiss',
    },
    {
      id: 'O6S Last Kiss',
      regex: /1A:(\y{Name}) gains the effect of Last Kiss/,
      condition: function(data, matches) {
        // The person who gets the marker briefly gets the effect, so
        // don't tell them twice.
        return data.me == matches[1] && data.lastKiss != data.me;
      },
      alarmText: 'Last Kiss on YOU',
      tts: 'last kiss',
    },
  ]
}]
