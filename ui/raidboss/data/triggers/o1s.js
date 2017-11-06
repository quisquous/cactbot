// O1S - Deltascape 1.0 Savage
[{
  zoneRegex: /(Deltascape V1.0 \(Savage\)|Unknown Zone \(2B7\))/,
  triggers: [
    {
      id: 'O1S Blaze',
      regex: /:1EDD:Alte Roite starts using/,
      infoText: 'Blaze: Stack up',
      tts: 'stack',
    },
    {
      id: 'O1S Breath Wing',
      regex: /:1ED6:Alte Roite starts using/,
      infoText: 'Breath Wing: Be beside boss',
      tts: 'breath wing',
    },
    {
      id: 'O1S Clamp',
      regex: /:1EDE:Alte Roite starts using/,
      infoText: 'Clamp: Get out of front',
      tts: 'clamp',
    },
    {
      id: 'O1S Downburst',
      regex: /:1ED8:Alte Roite starts using/,
      infoText: 'Downburst: Knockback',
      tts: 'knockback',
    },
    {
      id: 'O1S Roar',
      regex: /:1ED4:Alte Roite starts using/,
      infoText: 'Roar: AOE damage',
      condition: function(data) { return data.role == 'healer' },
      tts: 'roar',
    },
    {
      id: 'O1S Charybdis',
      regex: /:1ED3:Alte Roite starts using/,
      infoText: 'Charybdis: AOE damage',
      condition: function(data) { return data.role == 'healer' },
      tts: 'roar',
    },
  ]
}]
