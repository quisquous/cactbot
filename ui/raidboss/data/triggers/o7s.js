// O7S - Sigmascape 3.0 Savage
[{
  zoneRegex: /Sigmascape V3\.0 \(Savage\)/,
  timelineFile: 'o7s.txt',
  triggers: [
    // State
    {
      regex: / 1A:(\y{Name}) gains the effect of Aether Rot/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.rot = true;
      },
    },
    {
      regex: / 1A:(\y{Name}) loses the effect of Aether Rot/,
      condition: function(data, matches) { return data.me == matches[1]; },
      run: function(data) {
        data.rot = false;
      },
    },
    {
      id: 'O7S Magitek Ray',
      regex: / 14:2788:Guardian starts using Magitek Ray/,
      alertText: 'Magitek Ray',
      tts: 'beam',
    },
    {
      id: 'O7S Arm And Hammer',
      regex: / 14:2789:Guardian starts using Arm And Hammer on (\y{Name})/,
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
      id: 'O7S Orb Marker',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      alertText: 'Orb Marker',
      tts: 'orb',
    },
    {
      id: 'O7S Blue Marker',
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      alarmText: function(data, matches) {
        if (data.me == matches[1])
          return 'Blue Marker on YOU';
      },
      infoText: function(data, matches) {
        if (data.me != matches[1])
          return 'Blue Marker on ' + data.ShortName(matches[1]);
      },
      tts: function (data, matches) {
        if (data.me == matches[1])
          return 'blue marker';
      },
    },
    {
      id: 'O7S Prey',
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
    {
      id: 'O7S Searing Wind',
      regex: / 1A:(\y{Name}) gains the effect of Searing Wind/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: 'Searing Wind: go outside',
      tts: 'searing wind',
    },
    {
      id: 'O7S Abandonment',
      regex: / 1A:(\y{Name}) gains the effect of Abandonment/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: 'Abandonment: stay middle',
      tts: 'abandonment',
    },
    {
      id: 'O7S Rot',
      regex: / 1A:(\y{Name}) gains the effect of Aether Rot/,
      condition: function(data, matches) { return data.me == matches[1]; },
      infoText: 'Rot on you',
      tts: 'rot',
    },
    {
      id: 'O7S Rot Pass',
      regex: / 1A:(\y{Name}) gains the effect of Aether Rot for (\y{Float}) Seconds/,
      condition: function(data, matches) { return data.me == matches[1]; },
      delaySeconds: function(data, matches) {
        return data.ParseLocaleFloat(matches[2]) - 5;
      },
      alarmText: function(data) {
        if (data.rot)
          return 'Pass Rot';
      },
      tts: function(data) {
        if (data.rot)
          return 'pass rot';
      },
    },
    {
      id: 'O7S Stoneskin',
      regex: / 14:2AB5:Ultros starts using Stoneskin/,
      alarmText: function(data) {
        if (data.job == 'NIN' || data.role == 'dps-ranged')
          return 'SILENCE!';
      },
      infoText: function(data) {
        if (data.job != 'NIN' && data.role != 'dps-ranged')
          return 'Silence';
      },
      tts: 'silence',
    },
  ]
}]
