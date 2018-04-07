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
      id: 'O8S Single Wing of Destruction',
      regex: / 14:28F[EF]:Kefka starts using Wings Of Destruction/,
      infoText: 'Single Wing',
      tts: 'single wing',
    },
    {
      id: 'O8S Ultimate Embrace',
      regex: / 14:2910:Kefka starts using Ultimate Embrace on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Embrace on YOU';
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        if (data.role == 'healer' || data.role == 'tank')
          return 'Embrace on ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        if (matches[1] == data.me || data.role == 'healer' || data.role == 'tank')
          return 'embrace';
      },
    },
    {
      // 28E8: clown hyperdrive, 2912: god hyperdrive
      id: 'O8S Hyperdrive',
      regex: / 14:(?:28E8|2912):Kefka starts using Hyperdrive on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me)
          return 'Hyperdrive on YOU';
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        if (data.role == 'healer' || data.role == 'tank')
          return 'Hyperdrive on ' + data.ShortName(matches[1]);
      },
      tts: function(data, matches) {
        if (matches[1] == data.me || data.role == 'healer' || data.role == 'tank')
          return 'hyperdrive';
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
      id: 'O8S Mana Charge',
      regex: / 14:28D1:Kefka starts using Mana Charge/,
      run: function(data) {
        delete data.lastFire;
        delete data.lastThunder;
        delete data.lastIce;
        delete data.lastIceDir;
        delete data.manaReleaseText;
      },
    },
    {
      id: 'O8S Mana Release',
      regex: / 14:28D2:Kefka starts using Mana Release/,
      preRun: function(data) {
        if (data.lastFire) {
          data.manaReleaseText = data.lastFire;
          return;
        }
        if (!data.lastIceDir)
          return;
        data.manaReleaseText = data.lastThunder + ', ' + data.lastIceDir;
      },
      infoText: function(data) { return data.manaReleaseText; },
      tts: function(data) { return data.manaReleaseText; },
    },
    {
      // From ACT log lines, there's not any way to know the fire type as it's used.
      // The ability id is always 14:28CE:Kefka starts using Flagrant Fire on Kefka.
      // However, you can remind forgetful people during mana release and figure out
      // the type based on the damage it does.
      //
      // 28CE: ability id on use
      // 28CF: damage from mana charge
      // 2B32: damage from mana release
      id: 'O8S Fire Spread',
      regex: /1[56]:\y{ObjectId}:Kefka:28CF:Flagrant Fire:/,
      suppressSeconds: 40,
      run: function(data) {
        data.lastFire = {
          en: 'Spread',
        }[data.lang];
      },
    },
    {
      // 28CE: ability id on use
      // 28D0: damage from mana charge
      // 2B33: damage from mana release
      id: 'O8S Fire Stack',
      regex: /1[56]:\y{ObjectId}:Kefka:28D0:Flagrant Fire:/,
      suppressSeconds: 40,
      run: function(data) {
        data.lastFire = {
          en: 'Stack',
        }[data.lang];
      },
    },
    {
      // 28CA: mana charge (both types)
      // 28CD: mana charge
      // 2B31: mana release
      id: 'O8S Thrumming Thunder Real',
      regex: /14:(?:28CD|2B31):Kefka starts using Thrumming Thunder/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastThunder = {
          en: 'True Thunder',
          fr: 'Vraie foudre',
        }[data.lang];
      },
      infoText: function(data) { return data.lastThunder; },
      tts: function(data) { return data.lastThunder; },
    },
    {
      // 28CA: mana charge (both types)
      // 28CB, 28CC: mana charge
      // 2B2F, 2B30: mana release
      id: 'O8S Thrumming Thunder Fake',
      regex: /14:(?:28CC|2B30):Kefka starts using Thrumming Thunder/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastThunder = {
          en: 'Fake Thunder',
          fr: 'Fausse foudre',
        }[data.lang];
      },
      infoText: function(data) { return data.lastThunder; },
      tts: function(data) { return data.lastThunder; },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C5, 28C6: mana charge
      // 2B2B, 2B2E: mana release
      id: 'O8S Blizzard Fake Donut',
      regex: /14:(?:28C5|2B2B):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'Fake Ice',
          fr: 'Fausse glace',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get Out',
          fr: 'sortir',
        }[data.lang];
      },
      infoText: function(data) { return data.lastIce + ': ' + data.lastIceDir; },
      tts: function(data) { return data.lastIce; },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C9: mana charge
      // 2B2E: mana release
      id: 'O8S Blizzard True Donut',
      regex: /14:(?:28C9|2B2E):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'True Ice',
          fr: 'Vraie glace',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get In',
          fr: 'rentrer dedans',
        }[data.lang];
      },
      infoText: function(data) { return data.lastIce + ': ' + data.lastIceDir; },
      tts: function(data) { return data.lastIce; },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C3, 28C4: mana charge
      // 2B29, 2B2A: mana release
      id: 'O8S Blizzard Fake Near',
      regex: /14:(?:28C4|2B2A):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'Fake Ice',
          fr: 'Fausse glace',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get In',
          fr: 'rentrer dedans',
        }[data.lang];
      },
      infoText: function(data) { return data.lastIce + ': ' + data.lastIceDir; },
      tts: function(data) { return data.lastIce; },
    },
    {
      // 28C7: mana charge (all ice types)
      // 28C8: mana charge
      // 2B2D: mana release
      id: 'O8S Blizzard True Near',
      regex: /14:(?:28C8|2B2D):Kefka starts using Blizzard Blitz/,
      suppressSeconds: 40,
      preRun: function(data) {
        data.lastIce = {
          en: 'True Ice',
          fr: 'Vraie glace',
        }[data.lang];
        data.lastIceDir = {
          en: 'Get Out',
          fr: 'sortir',
        }[data.lang];
      },
      infoText: function(data) { return data.lastIce + ': ' + data.lastIceDir; },
      tts: function(data) { return data.lastIce; },
    },
  ]
}]
