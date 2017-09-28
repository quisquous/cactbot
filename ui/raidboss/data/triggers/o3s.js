// O3S - Deltascape 3.0 Savage
[{
  //zoneRegex: /(Deltascape V3.0 \(Savage\)|Unknown Zone \(2B9\))/,
  zoneRegex: /./,
  triggers: [
    {
      id: 'O3S Spellblade Holy',
      regex: /1B:........:(\y{Name}):....:....:006[45]:0000:0000:0000:/,
      alarmText: function(data) {
        if (data.holyTargets[1] != data.me)
          return "";
        return "Stack on YOU";
      },
      alertText: function(data) {
        if (data.holyTargets[1] == data.me)
          return;
        for (var i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me)
            return "Get out";
        }
        return "Stack on " + data.holyTargets[1];
      },
      condition: function(data, matches) {
        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches[1]);
        return data.holyTargets.length == 4;
      },
      run: function(data) {
        delete data.holyTargets;
      }
    },
    {
      id: 'O3S Right Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_510|Right Face) from/,
      infoText: 'Mindjack: Right',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S Forward March',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50D|Forward March) from/,
      infoText: 'Mindjack: Forward',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S Left Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50F|Left Face) from/,
      infoText: 'Mindjack: Left',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S About Face',
      regex: /(\y{Name}) gains the effect of (?:Unknown_50E|About Face) from/,
      infoText: 'Mindjack: Back',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      id: 'O3S Ribbit',
      regex: /:22F7:Halicarnassus starts using/,
      alertText: 'Ribbit: Get behind',
    },
    {
      id: 'O3S Oink',
      regex: /:22F9:Halicarnassus starts using/,
      infoText: 'Oink: Stack',
    },
    {
      id: 'O3S Squelch',
      regex: /:22F8:Halicarnassus starts using/,
      alarmText: 'Squelch: Look away',
    },
    {
      id: 'O3S The Queen\'s Waltz: Books',
      regex: /:230E:Halicarnassus starts using/,
      alertText: 'The Queen\'s Waltz: Books',
    },
    {
      id: 'O3S The Queen\'s Waltz: Clock',
      regex: /:2306:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Clock',
    },
    {
      id: 'O3S The Queen\'s Waltz: Crystal Square',
      regex: /:230A:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Crystal Square',
    },
    {
      id: 'O3S The Queen\'s Waltz: Tethers',
      regex: /:2308:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Tethers',
    },
  ]
}]