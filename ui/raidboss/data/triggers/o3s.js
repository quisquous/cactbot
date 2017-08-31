// O3S - Deltascape 3.0 Savage
[{
  zoneRegex: /(Deltascape V4.0 \(Savage\)|Unknown Zone \(2B9\))/,
  triggers: [
    {
      regex: /(\y{Name}) gains the effect of (?:Unknown_510|Right Face) from/,
      infoText: 'Mindjack: Right',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      regex: /(\y{Name}) gains the effect of (?:Unknown_50D|Forward March) from/,
      infoText: 'Mindjack: Forward',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      regex: /(\y{Name}) gains the effect of (?:Unknown_50F|Left Face) from/,
      infoText: 'Mindjack: Left',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      regex: /(\y{Name}) gains the effect of (?:Unknown_50E|About Face) from/,
      infoText: 'Mindjack: Back',
      condition: function(data, matches) { return matches[1] == data.me; },
    },
    {
      regex: /:22F7:Halicarnassus starts using/,
      alertText: 'Ribbit: Get behind',
    },
    {
      regex: /:22F9:Halicarnassus starts using/,
      infoText: 'Oink: Stack',
    },
    {
      regex: /:22F8:Halicarnassus starts using/,
      alarmText: 'Squelch: Look away',
    },
    {
      regex: /:230E:Halicarnassus starts using/,
      alertText: 'The Queen\'s Waltz: Books',
    },
    {
      regex: /:2306:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Clock',
    },
    {
      regex: /:230A:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Crystal Square',
    },
    {
      regex: /:2308:Halicarnassus starts using/,
      infoText: 'The Queen\'s Waltz: Tethers',
    },
  ]
}]