// O8N - Sigmascape 4.0 Normal
[{
  zoneRegex: /^(Sigmascape \(V4\.0\)|Sigmascape V4\.0)$/,
  timelineFile: 'o8n.txt',
  triggers: [
    {
      id: 'O8N Hyper Drive',
      regex: /14:292E:Kefka starts using Hyper Drive on (\y{Name})/,
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
      id: 'O8N Shockwave',
      regex: /14:2927:Graven Image starts using Shockwave/,
      delaySeconds: 5,
      alertText: 'Look for Knockback',
      tts: 'knockback',
    },
    {
      id: 'O8N Gravitational Wave',
      regex: /14:2929:Graven Image starts using Gravitational Wave/,
      alertText: 'Get Right/East =>',
      tts: 'right',
    },
    {
      id: 'O8N Intemperate Will',
      regex: /14:292A:Graven Image starts using Intemperate Will/,
      alertText: '<= Get Left/West',
      tts: 'left',
    },
    {
      id: 'O8N Ave Maria',
      regex: /14:292B:Graven Image starts using Ave Maria/,
      alertText: 'Look At Statue',
      tts: 'look towards',
    },
    {
      id: 'O8N Indolent Will',
      regex: /14:292C:Graven Image starts using Indolent Will/,
      alertText: 'Look Away From Statue',
      tts: 'look away',
    },
    {
      id: 'O8N Aero Assault',
      regex: /14:2924:Kefka starts using Aero Assault/,
      infoText: 'Knockback',
      tts: 'knockback',
    },
    {
      id: 'O8N Flagrant Fire Single',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) { return matches[1] == data.me; },
      infoText: 'Fire On You',
      tts: 'fire',
    },
    {
      id: 'O8N Flagrant Fire Stack',
      regex: /1B:........:(\y{Name}):....:....:003E:0000:0000:0000:/,
      alertText: function(data, matches) {
        return 'Stack on ' + data.ShortName(matches[1]);
      },
      tts: 'stack',
    },
    {
      // Most thunders are blizzards are used multiple times, so suppress
      // any duplicates.
      // TODO: raidboss really needs a suppressSeconds that doesn't let
      // the same trigger fire for X time.
      regex: /14:291[BD4689]:Kefka starts using/,
      delaySeconds: 1,
      run: function(data) {
        delete data.suppressThunderBlizzard;
      },
    },
    {
      id: 'O8N Thrumming Thunder Real',
      regex: /14:291D:Kefka starts using Thrumming Thunder/,
      infoText: function(data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'True Thunder';
      },
      tts: function (data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'true';
      },
      run: function(data) {
        data.suppressThunderBlizzard = true;
      },
    },
    {
      id: 'O8N Thrumming Thunder Fake',
      regex: /14:291B:Kefka starts using Thrumming Thunder/,
      infoText: function(data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'Fake Thunder';
      },
      tts: function (data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'fake';
      },
      run: function(data) {
        data.suppressThunderBlizzard = true;
      },
    },
    {
      id: 'O8N Blizzard Fake Donut',
      regex: /14:2916:Kefka starts using Blizzard Blitz/,
      infoText: function(data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'Fake: Get Out';
      },
      tts: function (data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'fake';
      },
      run: function(data) {
        data.suppressThunderBlizzard = true;
      },
    },
    {
      id: 'O8N Blizzard True Donut',
      regex: /14:2919:Kefka starts using Blizzard Blitz/,
      infoText: function(data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'True: Get In';
      },
      tts: function (data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'true';
      },
      run: function(data) {
        data.suppressThunderBlizzard = true;
      },
    },
    {
      id: 'O8N Blizzard Fake Near',
      regex: /14:2914:Kefka starts using Blizzard Blitz/,
      infoText: function(data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'Fake: Get In';
      },
      tts: function (data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'fake';
      },
      run: function(data) {
        data.suppressThunderBlizzard = true;
      },
    },
    {
      id: 'O8N Blizzard True Near',
      regex: /14:2918:Kefka starts using Blizzard Blitz/,
      infoText: function(data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'True: Get Out';
      },
      tts: function (data) {
        if (data.suppressThunderBlizzard)
          return;
        return 'true';
      },
      run: function(data) {
        data.suppressThunderBlizzard = true;
      },
    },
  ]
}]
