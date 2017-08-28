// O1S - Deltascape 1.0 Savage
[{
  zoneRegex: /(Deltascape V4.0 \(Savage\)|Unknown Zone \(2B7\))/,
  triggers: [
    {
      regex: /:1EDD:Alte Roite starts using/,
      infoText: 'Blaze: Stack up',
    },
    {
      regex: /:1ED6:Alte Roite starts using/,
      infoText: 'Breath Wing: Be beside boss',
    },
    {
      regex: /:1EDE:Alte Roite starts using/,
      infoText: 'Clamp: Get out of front',
    },
    {
      regex: /:1ED8:Alte Roite starts using/,
      infoText: 'Downburst: Knockback',
    },
    {
      regex: /:1ED4:Alte Roite starts using/,
      infoText: 'Roar: AOE damage',
      condition: function(data) { return data.role == 'healer' },
    },
    {
      regex: /:1ED3:Alte Roite starts using/,
      infoText: 'Charybdis: AOE damage',
      condition: function(data) { return data.role == 'healer' },
    },
  ]
}]