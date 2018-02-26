// O8S - Sigmascape 4.0 Savage
[{
  zoneRegex: /Sigmascape V4\.0 \(Savage\)/,
  timelineFile: 'o8s.txt',
  triggers: [
    {
      id: 'O8S Shockwave',
      regex: / 14:28DB:Graven Image starts using Shockwave/,
      delaySeconds: 5,
      alertText: 'Look for Knockback',
      tts: 'knockback',
    },
    {
      id: 'O8S Indolent Will',
      regex: /Graven Image starts using Indolent Will/,
      alertText: 'Look Away From Statue',
      tts: 'look away',
    },
    {
      id: 'O8S Intemperate Will',
      regex: /14:28DF:Graven Image starts using Intemperate Will/,
      alertText: '<= Get Left/West',
      tts: 'left',
    },
    {
      id: 'O8S Gravitational Wave',
      regex: /14:28DE:Graven Image starts using Gravitational Wave/,
      alertText: 'Get Right/East =>',
      tts: 'right',
    },
    {
      id: 'O8S Ave Maria',
      regex: / 14:28E3:Graven Image starts using Ave Maria/,
      alertText: 'Look At Statue',
      tts: 'look towards',
    },
    {
      id: 'O8S Pasts Forgotten',
      regex: /Kefka starts using Pasts Forgotten/,
      alertText: 'Past: Stack and Stay',
      tts: 'stack and stay',
    },
    {
      id: 'O8S Futures Numbered',
      regex: /Kefka starts using Futures Numbered/,
      alertText: 'Future: Stack and Through',
      tts: 'stack and through',
    },
    {
      id: "O8S Past's End",
      regex: /Kefka starts using Past's End/,
      condition: function(data) { return data.role == 'tank' || data.role == 'healer'; },
      alertText: 'Past: Bait, then through',
      tts: 'run run run',
    },
    {
      id: "O8S Future's End",
      regex: /Kefka starts using Future's End/,
      condition: function(data) { return data.role == 'tank' || data.role == 'healer'; },
      alertText: 'Future: Bait, then stay',
      tts: 'stay stay stay',
    },
    {
      id: 'O8S Pulse Wave You',
      regex: /Graven Image starts using Pulse Wave on (\y{Name})/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alertText: 'Knockback on YOU',
      tts: 'knockback',
    },
    {
      id: 'O8S Wings of Destruction',
      regex: / 14:2900:Kefka starts using Wings Of Destruction/,
      alarmText: function(data) {
        if (data.role == 'tank')
          return 'Wings: Be Near/Far';
      },
      infoText: function(data) {
        if (data.role != 'tank')
          return 'Max Melee: Avoid Tanks';
      },
      tts: function(data) {
        if (data.role == 'tank')
          return 'wings';
        else
          return 'max melee';
      },
    },
    {
      id: 'O8S Indulgent Will',
      regex: / 14:28E5:Graven Image starts using Indulgent Will on (\y{Name})/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: 'Confusion: Go Outside',
      tts: 'confusion',
    },
    {
      id: 'O8S Idyllic Will',
      regex: / 14:28E6:Graven Image starts using Idyllic Will on (\y{Name})/,
      condition: function(data, matches) { return data.me == matches[1]; },
      alarmText: 'Sleep: Go Inside',
      tts: 'sleep',
    },
    {
      id: 'O8S Thrumming Thunder Real',
      regex: /14:(?:28CD|2B31):Kefka starts using Thrumming Thunder/,
      suppressSeconds: 1,
      infoText: 'True Thunder',
      tts: 'true',
    },
    {
      id: 'O8S Thrumming Thunder Fake',
      regex: /14:(?:28CC|2B30):Kefka starts using Thrumming Thunder/,
      suppressSeconds: 1,
      infoText: 'Fake Thunder',
      tts: 'fake',
    },
    {
      id: 'O8S Blizzard Fake Donut',
      regex: /14:(?:28C5|2B2B):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 1,
      infoText: 'Fake Ice: Get Out',
      tts: 'fake',
    },
    {
      id: 'O8S Blizzard True Donut',
      regex: /14:(?:28C9|2B2E):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 1,
      infoText: 'True Ice: Get In',
      tts: 'true',
    },
    {
      id: 'O8S Blizzard Fake Near',
      regex: /14:(?:28C4|2B2A):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 1,
      infoText: 'Fake Ice: Get In',
      tts: 'fake',
    },
    {
      id: 'O8S Blizzard True Near',
      regex: /14:(?:28C8|2B2D):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 1,
      infoText: 'True Ice: Get Out',
      tts: 'true',
    },
  ]
}]
